import assert from 'node:assert/strict'
import test from 'node:test'
import { createTableRateLimiter } from '../src/rateLimit.js'

const inMemoryClient = () => {
  const entities = new Map()
  return {
    entities,
    async createEntity(entity) {
      const key = `${entity.partitionKey}|${entity.rowKey}`
      if (entities.has(key)) throw Object.assign(new Error('exists'), { statusCode: 409 })
      entities.set(key, { ...entity })
    },
    async *listEntities({ queryOptions }) {
      const equality = /PartitionKey eq '([^']+)'/.exec(queryOptions.filter)
      const lessThan = /PartitionKey lt '([^']+)'/.exec(queryOptions.filter)
      for (const entity of entities.values()) {
        if (equality && entity.partitionKey !== equality[1]) continue
        if (lessThan && entity.partitionKey >= lessThan[1]) continue
        yield { ...entity }
      }
    },
    async deleteEntity(partitionKey, rowKey) {
      entities.delete(`${partitionKey}|${rowKey}`)
    },
  }
}

test('does not count a retry with the same submission ID twice', async () => {
  const client = inMemoryClient()
  const limiter = createTableRateLimiter({
    client,
    signingSecret: 'secret',
    limit: 1,
    now: () => new Date('2026-09-15T11:00:00Z'),
  })
  assert.equal(await limiter.consume({ clientAddress: '203.0.113.1', submissionId: 'same' }), true)
  assert.equal(await limiter.consume({ clientAddress: '203.0.113.1', submissionId: 'same' }), true)
  assert.equal(client.entities.size, 1)
})

test('limits different submissions from the same client and hour', async () => {
  const client = inMemoryClient()
  const limiter = createTableRateLimiter({
    client,
    signingSecret: 'secret',
    limit: 2,
    now: () => new Date('2026-09-15T11:00:00Z'),
  })
  assert.equal(await limiter.consume({ clientAddress: '203.0.113.1', submissionId: 'one' }), true)
  assert.equal(await limiter.consume({ clientAddress: '203.0.113.1', submissionId: 'two' }), true)
  assert.equal(await limiter.consume({ clientAddress: '203.0.113.1', submissionId: 'three' }), false)
})

test('keeps separate clients in separate HMAC partitions', async () => {
  const client = inMemoryClient()
  const limiter = createTableRateLimiter({
    client,
    signingSecret: 'secret',
    limit: 1,
    now: () => new Date('2026-09-15T11:00:00Z'),
  })
  assert.equal(await limiter.consume({ clientAddress: '203.0.113.1', submissionId: 'one' }), true)
  assert.equal(await limiter.consume({ clientAddress: '203.0.113.2', submissionId: 'two' }), true)
  assert.equal(client.entities.size, 2)
  for (const entity of client.entities.values()) assert.ok(!entity.partitionKey.includes('203.0.113'))
})

test('cleans only entries older than 48 hours', async () => {
  const client = inMemoryClient()
  client.entities.set('2026091209-old|one', { partitionKey: '2026091209-old', rowKey: 'one' })
  client.entities.set('2026091412-recent|two', { partitionKey: '2026091412-recent', rowKey: 'two' })
  const limiter = createTableRateLimiter({
    client,
    signingSecret: 'secret',
    now: () => new Date('2026-09-15T11:00:00Z'),
  })
  assert.equal(await limiter.cleanup(), 1)
  assert.equal(client.entities.has('2026091209-old|one'), false)
  assert.equal(client.entities.has('2026091412-recent|two'), true)
})