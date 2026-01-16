import { test, expect } from "@playwright/test"

test.describe("Contact Form", () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.goto("/contact")
        await page.waitForLoadState("networkidle")
    })

    test("should display contact page", async ({ page }) => {
        await expect(page.locator("h1")).toContainText(/contact/i)
    })

    test("should display contact form fields", async ({ page }) => {
        await expect(page.locator("input#name")).toBeVisible()
        await expect(page.locator("input#email")).toBeVisible()
        await expect(page.locator("input#phone")).toBeVisible()
        await expect(page.locator("input#subject")).toBeVisible()
        await expect(page.locator("textarea#message")).toBeVisible()
    })

    test("should fill contact form fields", async ({ page }) => {
        await page.locator("input#name").fill("Test User")
        await page.locator("input#email").fill("test@example.com")
        await page.locator("input#phone").fill("1234567890")
        await page.locator("input#subject").fill("Trip Inquiry")
        await page.locator("textarea#message").fill("I would like to book a trip to Morocco.")

        await expect(page.locator("input#name")).toHaveValue("Test User")
        await expect(page.locator("input#email")).toHaveValue("test@example.com")
    })
})

test.describe("Contact Information", () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.goto("/contact")
        await page.waitForLoadState("networkidle")
    })

    test("should display email contact", async ({ page }) => {
        await expect(page.locator("a[href*='mailto:info@moroccohive']").first()).toBeVisible()
    })

    test("should display phone number", async ({ page }) => {
        await expect(page.locator("a[href*='tel:+212']").first()).toBeVisible()
    })

    test("should display location", async ({ page }) => {
        await expect(page.locator("text=Marrakech").first()).toBeVisible()
    })
})
