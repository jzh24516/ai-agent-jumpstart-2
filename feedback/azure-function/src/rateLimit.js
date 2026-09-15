import { createHmac } from 'node:crypto'
import { TableClient } from '@azure/data-tables'
import { ManagedIdentityCredential } from '@azure/identity'

const DEFAULT_LIMIT = 120
const CLEANUP_LIMIT = 5_000

const hourKey = (date) => date.toISOString().slice(0, 13).replace(/[-T:]/g, '')

const clientHash = (clientAddress, secret) => createHmac('sha256', secret)
  .update(clientAddress || 'unknown')
  .digest('base64url')
  .slice(0, 32)

const isConflict = (error) => error?.statusCode === 409 || error?.code === 'EntityAlreadyExists'

export const createTableRateLimiter = ({
  client,
  signingSecret,
  limit = DEFAULT_LIMIT,
  now = () => new Date(),
}) => ({
  async consume({ clientAddress, submissionId }) {
    const partitionKey = `${hourKey(now())}-${clientHash(clientAddress, signingSecret)}`
    try {
      await client.createEntity({ partitionKey, rowKey: submissionId })
    } catch (error) {
      if (!isConflict(error)) throw error
    }

    let count = 0
    const entities = client.listEntities({
      queryOptions: {
        filter: `PartitionKey eq '${partitionKey}'`,
        select: ['rowKey'],
      },
    })
    for await (const _entity of entities) {
      count += 1
      if (count > limit) return false
    }
    return true
  },

  async cleanup() {
    const cutoff = new Date(now().getTime() - 48 * 60 * 60 * 1_000)
    const entities = client.listEntities({
      queryOptions: {
        filter: `PartitionKey lt '${hourKey(cutoff)}-'`,
        select: ['partitionKey', 'rowKey'],
      },
    })
    let deleted = 0
    for await (const entity of entities) {
      if (!entity.partitionKey || !entity.rowKey) continue
      await client.deleteEntity(entity.partitionKey, entity.rowKey)
      deleted += 1
      if (deleted >= CLEANUP_LIMIT) break
    }
    return deleted
  },
})

export const createAzureTableRateLimiter = (env) => {
  if (env.SURVEY_RATE_LIMIT_DISABLED === 'true') {
    return { consume: async () => true, cleanup: async () => 0 }
  }
  const endpoint = env.SURVEY_RATE_LIMIT_TABLE_ENDPOINT?.trim()
  const tableName = env.SURVEY_RATE_LIMIT_TABLE_NAME?.trim()
  const clientId = env.AZURE_CLIENT_ID?.trim()
  const signingSecret = env.SURVEY_WORKSHOP_SIGNING_SECRET?.trim()
  if (!endpoint || !tableName || !clientId || !signingSecret) {
    throw new Error('Survey rate limiter configuration is incomplete.')
  }
  const credential = new ManagedIdentityCredential(clientId)
  const client = new TableClient(endpoint, tableName, credential)
  return createTableRateLimiter({ client, signingSecret })
}