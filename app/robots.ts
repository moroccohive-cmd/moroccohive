import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

/**
 * Paths that must never be indexed by anything. Auth flows, the admin
 * dashboard, private API surface and post-conversion thank-you pages.
 */
const PRIVATE_PATHS = [
    "/dashboard/",
    "/admin/",
    "/api/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/profile",
    "/access-denied",
    "/uploads/",
    "/circuits/thank-you",
    "/plan-trip/thank-you",
]

/**
 * Crawlers that fetch a page to answer a user's question right now, and cite
 * the source back. These are allowed: being read by them is how the site shows
 * up in ChatGPT, Perplexity and Google's AI answers.
 */
const AI_SEARCH_AGENTS = [
    "OAI-SearchBot", // ChatGPT search index
    "ChatGPT-User", // ChatGPT browsing on a user's behalf
    "PerplexityBot", // Perplexity index
    "Perplexity-User", // Perplexity live fetch
    "Claude-User", // Claude browsing on a user's behalf
    "Claude-SearchBot", // Claude search index
    "Google-Extended", // Gemini grounding / AI Overviews
    "Applebot-Extended", // Apple Intelligence
    "Amazonbot",
    "Bingbot",
    "DuckDuckBot",
    "cohere-ai",
    "YouBot",
]

/**
 * Bulk crawlers that harvest text for model training rather than to answer a
 * live query. They are allowed too — for a small travel brand, appearing in
 * model knowledge is a net win, and none of the content here is proprietary.
 * Flip these into a `disallow` block if that calculus ever changes.
 */
const AI_TRAINING_AGENTS = ["GPTBot", "ClaudeBot", "Meta-ExternalAgent", "Bytespider"]

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: PRIVATE_PATHS,
            },
            {
                userAgent: "Googlebot",
                allow: ["/", "/blog/", "/circuits/", "/destinations/"],
                disallow: PRIVATE_PATHS,
            },
            // Image indexing for tour photography.
            {
                userAgent: "Googlebot-Image",
                allow: ["/", "/uploads/"],
                disallow: ["/dashboard/", "/admin/"],
            },
            ...AI_SEARCH_AGENTS.map((userAgent) => ({
                userAgent,
                allow: "/",
                disallow: PRIVATE_PATHS,
            })),
            ...AI_TRAINING_AGENTS.map((userAgent) => ({
                userAgent,
                allow: "/",
                disallow: PRIVATE_PATHS,
            })),
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
