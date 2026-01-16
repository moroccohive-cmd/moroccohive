import { test, expect } from "@playwright/test"

test.describe("Circuits Page", () => {
    test("should display circuits page", async ({ page }) => {
        await page.goto("/circuits")
        await expect(page.locator("h1")).toBeVisible()
    })

    test("should display circuit cards", async ({ page }) => {
        await page.goto("/circuits")
        await page.waitForLoadState("networkidle")
        await expect(page.locator("a[href*='/circuits/']").first()).toBeVisible({ timeout: 10000 })
    })

    test("should navigate to circuit detail", async ({ page }) => {
        await page.goto("/circuits")
        await page.waitForLoadState("networkidle")

        const firstCircuit = page.locator("a[href*='/circuits/']").first()
        if (await firstCircuit.isVisible({ timeout: 5000 })) {
            await firstCircuit.click()
            await expect(page).toHaveURL(/circuits\/[a-z0-9-]+/)
        }
    })
})

test.describe("Blog Page", () => {
    test("should display blog page", async ({ page }) => {
        await page.goto("/blog")
        await expect(page.locator("h1")).toBeVisible()
    })
})

test.describe("About Page", () => {
    test("should display about page", async ({ page }) => {
        await page.goto("/about")
        await expect(page.locator("h1")).toContainText(/about/i)
    })

    test("should display services", async ({ page }) => {
        await page.goto("/about")
        await page.waitForLoadState("networkidle")
        // Check for any Morocco/Marrakech reference
        await expect(page.locator("text=/marrakech/i").first()).toBeVisible()
    })
})

test.describe("Legal Pages", () => {
    test("should display privacy policy", async ({ page }) => {
        await page.goto("/privacy-policy")
        await expect(page.locator("h1")).toContainText(/privacy/i)
    })

    test("should display terms page", async ({ page }) => {
        await page.goto("/terms")
        await expect(page.locator("h1")).toContainText(/terms/i)
    })
})
