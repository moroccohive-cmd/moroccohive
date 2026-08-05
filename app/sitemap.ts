import type { MetadataRoute } from "next"
import prisma from "@/lib/prisma"
import { DESTINATIONS } from "@/lib/destinations"
import { SITE_URL, absoluteUrl } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [circuits, blogPosts] = await Promise.all([
        prisma.circuit.findMany({
            where: { active: true },
            select: { slug: true, updatedAt: true, images: true },
        }),
        prisma.blogPost.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true, coverImage: true },
        }),
    ])

    // Static pages, freshest first by priority.
    const staticPages: MetadataRoute.Sitemap = (
        [
            { url: SITE_URL, changeFrequency: "daily", priority: 1 },
            { url: `${SITE_URL}/circuits`, changeFrequency: "daily", priority: 0.9 },
            { url: `${SITE_URL}/plan-trip`, changeFrequency: "monthly", priority: 0.9 },
            { url: `${SITE_URL}/destinations`, changeFrequency: "weekly", priority: 0.8 },
            { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
            { url: `${SITE_URL}/reviews`, changeFrequency: "weekly", priority: 0.7 },
            { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
            { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
            { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
            { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
            { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
        ] as const
    ).map((entry) => ({ ...entry, lastModified: new Date() }))

    // Destination pages are static content, so their lastModified tracks
    // deployments rather than a database timestamp.
    const destinationEntries: MetadataRoute.Sitemap = DESTINATIONS.map((d) => ({
        url: `${SITE_URL}/destinations/${d.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        images: [absoluteUrl(d.image)],
    }))

    // `images` surfaces tour photography to Google Images, which is a real
    // traffic source for travel and was previously left off entirely.
    const circuitEntries: MetadataRoute.Sitemap = circuits.map((circuit) => ({
        url: `${SITE_URL}/circuits/${circuit.slug}`,
        lastModified: circuit.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: ((circuit.images as string[]) ?? [])
            .slice(0, 5)
            .map((img) => absoluteUrl(img)),
    }))

    const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        ...(post.coverImage ? { images: [absoluteUrl(post.coverImage)] } : {}),
    }))

    return [
        ...staticPages,
        ...circuitEntries,
        ...destinationEntries,
        ...blogEntries,
    ]
}
