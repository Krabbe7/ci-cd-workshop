const { test, expect } = require("@playwright/test")

test("User can add a name and see greeting", async ({ page }) => {
  await page.goto("http://localhost:3000")
  await page.fill('input[name="name"]', "Alice")
  await page.click('button[type="submit"]')
  await page.waitForSelector('li:has-text("Hello, Alice!")')
  const greeting = await page.textContent("li:last-child")
  expect(greeting).toContain("Hello, Alice!")
})
