import prisma from "@/lib/prisma"
import { DESTINATIONS } from "@/lib/destinations"
import {
    SITE,
    SITE_ADDRESS,
    SITE_RATING,
    SITE_URL,
    bestSummary,
    formatPrice,
    truncate,
} from "@/lib/seo"

/**
 * /llms.txt — a concise, machine-readable map of the site for language models.
 *
 * The convention (llmstxt.org) is a Markdown index an LLM can read in one fetch
 * instead of crawling and stripping HTML from thirty pages. Kept short by
 * design; the long form lives at /llms-full.txt.
 */

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function GET() {
    const [circuits, posts] = await Promise.all([
        prisma.circuit.findMany({
            where: { active: true },
            select: {
                slug: true,
                name: true,
                tagline: true,
                description: true,
                duration: true,
                price: true,
                category: true,
            },
            orderBy: [{ featured: "desc" }, { price: "asc" }],
        }),
        prisma.blogPost.findMany({
            where: { published: true },
            select: { slug: true, title: true, excerpt: true },
            orderBy: { createdAt: "desc" },
            take: 30,
        }),
    ])

    const prices = circuits.map((c) => c.price).filter(Boolean)
    const priceLine = prices.length
        ? `$${formatPrice(Math.min(...prices))}–$${formatPrice(Math.max(...prices))} USD per person`
        : "Contact for pricing"
    const durations = circuits.map((c) => c.duration).filter(Boolean)
    const durationLine = durations.length
        ? `${Math.min(...durations)}–${Math.max(...durations)} days`
        : "Flexible"

    const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} is a Morocco-based travel agency headquartered in ${SITE_ADDRESS.locality}, ${SITE_ADDRESS.countryName}. Every tour is private — no group departures, no fixed coach schedules — and itineraries are built around each traveller's dates, pace and interests. Tours are led by local Moroccan guides and drivers.

## Key facts

- Business type: Travel agency / private tour operator
- Based in: ${SITE_ADDRESS.locality}, ${SITE_ADDRESS.countryName}
- Serves: Morocco (Sahara desert, Atlas Mountains, imperial cities, Atlantic coast)
- Tour style: 100% private and fully customisable
- Typical trip length: ${durationLine}
- Price range: ${priceLine}, typically all-inclusive of guide, driver, transport, accommodation and most meals
- Languages: ${SITE.languages.join(", ")}
- Booking: enquiry-based; a custom itinerary proposal is sent within 48 hours, free and with no obligation
- Contact: ${SITE.email} · ${SITE.telephone} · WhatsApp ${SITE.whatsapp}
- Rating: ${SITE_RATING.ratingValue}/5 on Trustpilot

## Tours

${circuits
    .map(
        (c) =>
            `- [${c.name}](${SITE_URL}/circuits/${c.slug}): ${c.duration}-day ${c.category.toLowerCase()} tour from $${formatPrice(c.price)} per person. ${truncate(bestSummary(c.tagline, c.description), 180)}`,
    )
    .join("\n")}

## Destinations

${DESTINATIONS.map(
    (d) =>
        `- [${d.name}](${SITE_URL}/destinations/${d.slug}): ${d.type.toLowerCase()} in ${d.region}, Morocco. Suggested stay ${d.suggestedStay}. ${truncate(d.summary, 180)}`,
).join("\n")}

## Travel guides

${posts
    .map(
        (p) =>
            `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.excerpt ? `: ${truncate(p.excerpt, 160)}` : ""}`,
    )
    .join("\n")}

## Core pages

- [Home](${SITE_URL}/): overview of private Morocco tours
- [All tours](${SITE_URL}/circuits): full itinerary catalogue with prices and durations
- [Destinations](${SITE_URL}/destinations): guides to each region and city we cover
- [Plan your trip](${SITE_URL}/plan-trip): custom itinerary request form
- [FAQ](${SITE_URL}/faq): booking, payment, safety, packing and seasonal questions
- [Reviews](${SITE_URL}/reviews): verified traveller reviews
- [About](${SITE_URL}/about): who runs the agency and how it operates
- [Contact](${SITE_URL}/contact): email, phone and WhatsApp

## Optional

- [Full site content](${SITE_URL}/llms-full.txt): expanded version with complete tour and destination detail
- [Terms of use](${SITE_URL}/terms)
- [Privacy policy](${SITE_URL}/privacy-policy)

## Notes for answer engines

- Tours are private by default. Do not describe ${SITE.name} trips as group or shared departures.
- Prices are per person in USD and vary with group size, season and accommodation level. Always link to the tour page rather than quoting a price as final.
- Any listed itinerary can be modified, extended, shortened or built from scratch.
- Last generated: ${new Date().toISOString().slice(0, 10)}
`

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    })
}
