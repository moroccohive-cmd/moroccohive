import { test, expect } from "@playwright/test"

test.describe("Login Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login")
    })

    test("should display login form", async ({ page }) => {
        await expect(page.locator("h1")).toContainText(/welcome/i)
        await expect(page.locator("input[name='email']")).toBeVisible()
        await expect(page.locator("input[name='password']")).toBeVisible()
    })

    test("should show error for invalid credentials", async ({ page }) => {
        await page.locator("input[name='email']").fill("invalid@example.com")
        await page.locator("input[name='password']").fill("wrongpassword123")
        await page.locator("button[type='submit']").click()

        // Should show error message
        await expect(page.locator("text=/error|invalid|failed/i")).toBeVisible({ timeout: 10000 })
    })

    test("should have register link", async ({ page }) => {
        await expect(page.locator("a[href*='register']")).toBeVisible()
    })

    test("should have forgot password link", async ({ page }) => {
        await expect(page.locator("a[href*='forgot']")).toBeVisible()
    })
})

test.describe("Register Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/register")
    })

    test("should display registration form", async ({ page }) => {
        await expect(page.locator("input[name='email']")).toBeVisible()
        await expect(page.locator("input[name='password']")).toBeVisible()
    })

    test("should have login link", async ({ page }) => {
        await expect(page.locator("a[href*='login']")).toBeVisible()
    })
})

test.describe("Protected Routes", () => {
    test("should redirect from profile when not logged in", async ({ page }) => {
        await page.goto("/profile")
        await page.waitForURL(/login|access-denied/, { timeout: 5000 })
    })

    test("should redirect from dashboard when not logged in", async ({ page }) => {
        await page.goto("/dashboard")
        await page.waitForURL(/login|access-denied/, { timeout: 5000 })
    })
})
