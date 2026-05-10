import { expect, test } from '@playwright/test'

test.describe('smoke', () => {
  test('home loads React root', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#root')).toBeVisible()
  })
})
