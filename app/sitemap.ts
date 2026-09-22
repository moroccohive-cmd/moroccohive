import type { MetadataRoute } from "next"
import prisma from "@/lib/prisma"
import { DESTINATIONS } from "@/lib/destinations"
import { absoluteUrl } from "@/lib/seo"
import { DEFAULT_LOCALE, LOCALES, localizePath, type Locale } from "@/lib/i18n/config"
import { availableLocales } from "@/lib/i18n/content"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Entry = MetadataRoute.Sitemap[number]

/** Absolute URL of a page in a language; the homepage keeps its bare-domain form. */
const pageUrl = (locale: Locale, path: string) =>
    absoluteUrl(localizePath(locale, path)).replace(/\/$/, "")

/**
 * One sitemap entry per language version of a page, each carrying the full
 * set of hreflang alternates (Google reads them from the sitemap as well as
 * from <head>). English URLs are unchanged and listed first.
 */
function localizedEntries(
    path: string,
    entry: Omit<Entry, "url" | "alternates">,
    locales: readonly Locale[] = LOCALES,
): MetadataRoute.Sitemap {
    const languages: Record<string, string> = {}
    if (locales.length > 1) {
        for (const locale of locales) languages[locale] = pageUrl(locale, path)
        languages["x-default"] = pageUrl(DEFAULT_LOCALE, path)
    }

    return locales.map((locale) => ({
        ...entry,
        url: pageUrl(locale, path),
        ...(locales.length > 1 ? { alternates: { languages } } : {}),
    }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [circuits, blogPosts] = await Promise.all([
        prisma.circuit.findMany({
            where: { active: true },
            select: { slug: true, updatedAt: true, images: true, translations: true },
        }),
        prisma.blogPost.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true, coverImage: true, translations: true },
        }),
    ])

    // Static pages, freshest first by priority.
    const staticPages: MetadataRoute.Sitemap = (
        [
            { path: "/", changeFrequency: "daily", priority: 1 },
            { path: "/circuits", changeFrequency: "daily", priority: 0.9 },
            { path: "/plan-trip", changeFrequency: "monthly", priority: 0.9 },
            { path: "/destinations", changeFrequency: "weekly", priority: 0.8 },
            { path: "/blog", changeFrequency: "daily", priority: 0.8 },
            { path: "/reviews", changeFrequency: "weekly", priority: 0.7 },
            { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
            { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
            { path: "/about", changeFrequency: "monthly", priority: 0.6 },
            { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
            { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
        ] as const
    ).flatMap(({ path, ...entry }) =>
        localizedEntries(path, { ...entry, lastModified: new Date() }),
    )

    // Destination pages are static content, so their lastModified tracks
    // deployments rather than a database timestamp. Every guide is translated.
    const destinationEntries: MetadataRoute.Sitemap = DESTINATIONS.flatMap((d) =>
        localizedEntries(`/destinations/${d.slug}`, {
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
            images: [absoluteUrl(d.image)],
        }),
    )

    // `images` surfaces tour photography to Google Images, which is a real
    // traffic source for travel and was previously left off entirely.
    // Language versions are listed only once a tour is actually translated;
    // until then they canonicalise to English and stay out of the sitemap.
    const circuitEntries: MetadataRoute.Sitemap = circuits.flatMap((circuit) =>
        localizedEntries(
            `/circuits/${circuit.slug}`,
            {
                lastModified: circuit.updatedAt,
                changeFrequency: "weekly",
                priority: 0.8,
                images: ((circuit.images as string[]) ?? [])
                    .slice(0, 5)
                    .map((img) => absoluteUrl(img)),
            },
            availableLocales("circuit", circuit.translations),
        ),
    )

    const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap((post) =>
        localizedEntries(
            `/blog/${post.slug}`,
            {
                lastModified: post.updatedAt,
                changeFrequency: "weekly",
                priority: 0.7,
                ...(post.coverImage ? { images: [absoluteUrl(post.coverImage)] } : {}),
            },
            availableLocales("blog", post.translations),
        ),
    )

    return [
        ...staticPages,
        ...circuitEntries,
        ...destinationEntries,
        ...blogEntries,
    ]
}
