import { test, expect } from "@playwright/test"

const SITE = "https://www.moroccohive.com"

test.describe("Language versions", () => {
    test("English keeps its original URL and lang", async ({ page }) => {
        await page.goto("/about")
        await expect(page.locator("html")).toHaveAttribute("lang", "en")
        await expect(page.locator("h1")).toHaveText("About Morocco Hive")
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}/about`)
    })

    for (const [locale, heading] of [
        ["fr", "À propos de Morocco Hive"],
        ["nl", "Over Morocco Hive"],
    ] as const) {
        test(`/${locale}/about is translated with its own canonical`, async ({ page }) => {
            await page.goto(`/${locale}/about`)
            await expect(page.locator("html")).toHaveAttribute("lang", locale)
            await expect(page.locator("h1")).toHaveText(heading)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
                "href",
                `${SITE}/${locale}/about`,
            )
        })
    }

    test("every language version links to the others with hreflang", async ({ page }) => {
        await page.goto("/fr/destinations/marrakech")
        const hreflang = (lang: string) => page.locator(`link[rel="alternate"][hreflang="${lang}"]`)
        await expect(hreflang("en")).toHaveAttribute("href", `${SITE}/destinations/marrakech`)
        await expect(hreflang("fr")).toHaveAttribute("href", `${SITE}/fr/destinations/marrakech`)
        await expect(hreflang("nl")).toHaveAttribute("href", `${SITE}/nl/destinations/marrakech`)
        await expect(hreflang("x-default")).toHaveAttribute("href", `${SITE}/destinations/marrakech`)
    })

    test("internal links stay in the visitor's language", async ({ page }) => {
        await page.goto("/nl")
        // The desktop nav is hidden on small screens, so assert on presence.
        await expect(page.locator("header nav a").first()).toHaveAttribute("href", "/nl")
        await expect(page.locator('header nav a[href="/nl/circuits"]')).toHaveCount(1)
        await expect(page.locator('footer a[href="/nl/destinations"]')).toHaveCount(1)
    })

    test("/en URLs redirect to the unprefixed English page", async ({ page }) => {
        const response = await page.goto("/en/about")
        expect(response?.url()).toMatch(/\/about$/)
        await expect(page.locator("html")).toHaveAttribute("lang", "en")
    })

    test("unknown language prefixes are 404s", async ({ page }) => {
        const response = await page.goto("/de/about")
        expect(response?.status()).toBe(404)
    })

    test("language switcher links to the same page in other languages", async ({ page }) => {
        await page.goto("/faq")
        await page.getByRole("button", { name: /change language/i }).click()
        const menu = page.locator("#language-menu")
        await expect(menu.getByRole("link", { name: "Français" })).toHaveAttribute("href", "/fr/faq")
        await expect(menu.getByRole("link", { name: "Nederlands" })).toHaveAttribute("href", "/nl/faq")
    })

    test("the footer links to every language without JavaScript", async ({ browser }) => {
        const context = await browser.newContext({ javaScriptEnabled: false })
        const page = await context.newPage()
        await page.goto("/fr/circuits")
        for (const [locale, href] of [["en", "/"], ["fr", "/fr"], ["nl", "/nl"]] as const) {
            await expect(page.locator(`footer a[hreflang="${locale}"][href="${href}"]`)).toHaveCount(1)
        }
        await context.close()
    })

    test("sitemap lists translated pages with alternates", async ({ request }) => {
        const xml = await (await request.get("/sitemap.xml")).text()
        expect(xml).toContain(`<loc>${SITE}/fr/destinations/fes</loc>`)
        expect(xml).toContain(`hreflang="nl" href="${SITE}/nl/destinations/fes"`)
    })
})
