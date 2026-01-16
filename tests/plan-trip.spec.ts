import { test, expect } from "@playwright/test"

test.describe("Plan Trip Form - Step 1", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/plan-trip")
        await page.waitForLoadState("networkidle")
    })

    test("should display plan trip page", async ({ page }) => {
        await expect(page.locator("h1, h2, h3").first()).toBeVisible()
    })

    test("should select travel style and proceed", async ({ page }) => {
        await page.locator("text=Couple").first().click()
        const nextBtn = page.locator("button").filter({ hasText: /next/i })
        await nextBtn.click()
        await page.waitForTimeout(500)
    })
})

test.describe("Plan Trip Form - Travel Style", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/plan-trip")
        await page.waitForLoadState("networkidle")
    })

    test("should select solo option", async ({ page }) => {
        await page.locator("text=Solo").first().click()
    })

    test("should select couple option", async ({ page }) => {
        await page.locator("text=Couple").first().click()
    })

    test("should select family option", async ({ page }) => {
        await page.locator("text=Family").first().click()
        // Family should show adults selector - use first() to avoid strict mode violation
        await expect(page.locator("text=Adults").first()).toBeVisible({ timeout: 3000 })
    })

    test("should select group option", async ({ page }) => {
        await page.locator("text=Group").first().click()
    })
})

test.describe("Plan Trip Form - Navigation", () => {
    test("should navigate to step 2", async ({ page }) => {
        await page.goto("/plan-trip")
        await page.waitForLoadState("networkidle")
        await page.locator("text=Couple").first().click()
        await page.locator("button").filter({ hasText: /next/i }).click()
        await page.waitForTimeout(1000)
    })
})
