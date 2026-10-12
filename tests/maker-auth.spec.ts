import { expect, test } from '@playwright/test'

test.use({ baseURL: 'http://127.0.0.1:5173' })

const branding = {
  hostName: 'Microsoft',
  customerName: 'Test workshop',
  workshopStart: '2026-10-12',
  workshopEnd: '2026-10-15',
  contacts: [],
  attendees: [],
  labUsers: [],
}
const unauthorized = {
  status: 401,
  contentType: 'text/plain',
  body: 'Maker authentication is required.',
}
const authorized = { json: branding }

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('jumpstart-locale', 'en'))
  await page.route('**/api/workshops', (route) => route.fulfill({ json: [] }))
})

test('expired cached maker session opens the password prompt instead of an alert', async ({ page }) => {
  const alerts: string[] = []
  page.on('dialog', async (dialog) => {
    alerts.push(dialog.message())
    await dialog.dismiss()
  })
  await page.addInitScript(() => sessionStorage.setItem('jumpstart-maker', '1'))
  await page.route('**/api/branding', (route) => route.fulfill(unauthorized))
  await page.goto('/')
  await page.getByRole('button', { name: 'Workshop branding', exact: true }).click()

  await expect(page.getByRole('dialog', { name: 'Enter maker password', exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('jumpstart-maker'))).toBeNull()
  expect(alerts).toEqual([])
  await expect(page.locator('.settings-scrim')).toHaveCount(0)
})

test('successful reauthentication returns to engagement settings', async ({ page }) => {
  let authenticated = false
  await page.addInitScript(() => sessionStorage.setItem('jumpstart-maker', '1'))
  await page.route('**/api/branding', (route) => route.fulfill(authenticated ? authorized : unauthorized))
  await page.route('**/api/maker-auth', (route) => {
    authenticated = true
    return route.fulfill({ status: 204 })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Workshop branding', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Enter maker password', exact: true })
  await dialog.locator('input[type="password"]').fill('test-password')
  await dialog.getByRole('button', { name: 'Unlock', exact: true }).click()

  await expect(page.locator('.settings-scrim')).toBeVisible()
  await expect(page.locator('.password-scrim')).toHaveCount(0)
  await expect(page.locator('.editor-overlay')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('jumpstart-maker'))).toBe('1')
})

test('a second expired session preserves the engagement settings destination', async ({ page }) => {
  let authentications = 0
  let brandingRequests = 0
  await page.addInitScript(() => sessionStorage.setItem('jumpstart-maker', '1'))
  await page.route('**/api/branding', (route) => {
    brandingRequests += 1
    return route.fulfill(authentications >= 2 ? authorized : unauthorized)
  })
  await page.route('**/api/maker-auth', (route) => {
    authentications += 1
    return route.fulfill({ status: 204 })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Workshop branding', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Enter maker password', exact: true })
  const password = dialog.locator('input[type="password"]')
  await password.fill('test-password')
  await dialog.getByRole('button', { name: 'Unlock', exact: true }).click()
  await expect.poll(() => brandingRequests).toBe(2)
  await expect(password).toHaveValue('')
  await password.fill('test-password')
  await dialog.getByRole('button', { name: 'Unlock', exact: true }).click()

  await expect(page.locator('.settings-scrim')).toBeVisible()
  await expect(page.locator('.editor-overlay')).toHaveCount(0)
  await expect(page.locator('.password-scrim')).toHaveCount(0)
})

test('a valid cached maker session opens settings without another password prompt', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('jumpstart-maker', '1'))
  await page.route('**/api/branding', (route) => route.fulfill(authorized))
  await page.goto('/')
  await page.getByRole('button', { name: 'Workshop branding', exact: true }).click()

  await expect(page.locator('.settings-scrim')).toBeVisible()
  await expect(page.locator('.password-scrim')).toHaveCount(0)
})

test('other settings errors remain visible instead of requesting a password', async ({ page }) => {
  const alerts: string[] = []
  page.on('dialog', async (dialog) => {
    alerts.push(dialog.message())
    await dialog.dismiss()
  })
  await page.addInitScript(() => sessionStorage.setItem('jumpstart-maker', '1'))
  await page.route('**/api/branding', (route) => route.fulfill({
    status: 500,
    contentType: 'text/plain',
    body: 'Branding storage unavailable.',
  }))
  await page.goto('/')
  await page.getByRole('button', { name: 'Workshop branding', exact: true }).click()

  await expect.poll(() => alerts).toEqual(['Branding storage unavailable.'])
  await expect(page.locator('.password-scrim')).toHaveCount(0)
  expect(await page.evaluate(() => sessionStorage.getItem('jumpstart-maker'))).toBe('1')
})

test('locked users are prompted first and incorrect passwords do not open settings', async ({ page }) => {
  let brandingRequests = 0
  await page.route('**/api/branding', (route) => {
    brandingRequests += 1
    return route.fulfill(authorized)
  })
  await page.route('**/api/maker-auth', (route) => route.fulfill({ status: 401 }))
  await page.goto('/')
  await page.getByRole('button', { name: 'Workshop branding', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Enter maker password', exact: true })
  await expect(dialog).toBeVisible()
  expect(brandingRequests).toBe(0)
  await dialog.locator('input[type="password"]').fill('incorrect-test-password')
  await dialog.getByRole('button', { name: 'Unlock', exact: true }).click()

  await expect(dialog.getByText('Incorrect password', { exact: true })).toBeVisible()
  await expect(page.locator('.settings-scrim')).toHaveCount(0)
})
