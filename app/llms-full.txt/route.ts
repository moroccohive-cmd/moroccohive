import prisma from "@/lib/prisma"
import { DESTINATIONS } from "@/lib/destinations"
import { getAllFaqs, getAllReviews } from "@/lib/site-content"
import { SITE, SITE_ADDRESS, SITE_URL, formatPrice } from "@/lib/seo"

/**
 * /llms-full.txt — the expanded companion to /llms.txt.
 *
 * Where llms.txt is an index, this carries the actual substance: full tour
 * detail, destination guides, every FAQ answer and a sample of reviews. The
 * point is that an answer engine can ground a detailed response from one fetch
 * without scraping and de-templating the HTML.
 */

export const dynamic = "force-dynamic"
export const revalidate = 3600

/** Strips the custom [CTA] blocks and markdown noise from rich-text fields. */
function plain(text: string | null | undefined): string {
    if (!text) return ""
    return text
        .replace(/\[CTA\][\s\S]*?\[\/CTA\]/g, "")
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/[*_~`>#]/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}

export async function GET() {
    const [circuits, posts, faqs, reviews] = await Promise.all([
        prisma.circuit.findMany({
            where: { active: true },
            orderBy: [{ featured: "desc" }, { price: "asc" }],
        }),
        prisma.blogPost.findMany({
            where: { published: true },
            select: {
                slug: true,
                title: true,
                excerpt: true,
                content: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 20,
        }),
        getAllFaqs(),
        getAllReviews(),
    ])

    const sections: string[] = []

    sections.push(`# ${SITE.name} — full site content

> ${SITE.description}

${SITE.name} is a travel agency based in ${SITE_ADDRESS.locality}, ${SITE_ADDRESS.countryName}, running private, fully customisable tours across Morocco with local guides and drivers. Every itinerary below can be adjusted, combined or rebuilt from scratch. Contact: ${SITE.email}, ${SITE.telephone}, WhatsApp ${SITE.whatsapp}.

Source: ${SITE_URL} · Generated ${new Date().toISOString().slice(0, 10)}
`)

    // ---- Tours -------------------------------------------------------------
    sections.push("\n---\n\n# Tours\n")

    for (const c of circuits) {
        const highlights = (c.highlights as string[]) ?? []
        const included = (c.included as string[]) ?? []
        const excluded = (c.excluded as string[]) ?? []
        const glance = (c.itineraryGlance as string[]) ?? []

        sections.push(`## ${c.name}

URL: ${SITE_URL}/circuits/${c.slug}
Duration: ${c.duration} days
Category: ${c.category}
Price: ${c.isFrom ? "from " : ""}$${formatPrice(c.price)} USD per person
${c.tagline ? `Tagline: ${c.tagline}\n` : ""}
${plain(c.description)}

${highlights.length ? `### Highlights\n${highlights.map((h) => `- ${h}`).join("\n")}\n` : ""}
${glance.length ? `### Day by day\n${glance.map((d, i) => `- Day ${i + 1}: ${d}`).join("\n")}\n` : ""}
${included.length ? `### Included\n${included.map((i) => `- ${i}`).join("\n")}\n` : ""}
${excluded.length ? `### Not included\n${excluded.map((i) => `- ${i}`).join("\n")}\n` : ""}
${c.itineraryDetail ? `### Detailed itinerary\n${plain(c.itineraryDetail)}\n` : ""}
${c.additionalInfo ? `### Important notes\n${plain(c.additionalInfo)}\n` : ""}`)
    }

    // ---- Destinations ------------------------------------------------------
    sections.push("\n---\n\n# Destination guides\n")

    for (const d of DESTINATIONS) {
        sections.push(`## ${d.name}

URL: ${SITE_URL}/destinations/${d.slug}
Region: ${d.region}, Morocco
Coordinates: ${d.latitude}, ${d.longitude}
Type: ${d.type}
Suggested stay: ${d.suggestedStay}
Best time to visit: ${d.bestTimeToVisit}
Reference: ${d.sameAs.join(", ")}

${d.summary}

${d.body.join("\n\n")}

### Highlights
${d.highlights.map((h) => `- ${h}`).join("\n")}

### Common questions
${d.faqs.map((f) => `**${f.question}**\n${f.answer}`).join("\n\n")}
`)
    }

    // ---- FAQs --------------------------------------------------------------
    if (faqs.length) {
        sections.push("\n---\n\n# Frequently asked questions\n")
        for (const f of faqs) {
            sections.push(
                `## ${f.question}\n${f.category ? `_Category: ${f.category}_\n\n` : ""}${f.answer}\n`,
            )
        }
    }

    // ---- Reviews -----------------------------------------------------------
    if (reviews.length) {
        sections.push("\n---\n\n# Traveller reviews\n")
        sections.push(
            reviews
                .slice(0, 30)
                .map(
                    (r) =>
                        `- ${r.rating}/5 — ${r.authorName}${r.authorLocation ? ` (${r.authorLocation})` : ""}${r.displayDate ? `, ${r.displayDate}` : ""}${r.source ? ` via ${r.source}` : ""}: "${r.text.replace(/\s+/g, " ").trim()}"`,
                )
                .join("\n"),
        )
    }

    // ---- Articles ----------------------------------------------------------
    if (posts.length) {
        sections.push("\n---\n\n# Travel guides and articles\n")
        for (const p of posts) {
            sections.push(`## ${p.title}

URL: ${SITE_URL}/blog/${p.slug}
Published: ${p.createdAt.toISOString().slice(0, 10)}

${p.excerpt ? `${p.excerpt}\n\n` : ""}${plain(p.content).slice(0, 4000)}
`)
        }
    }

    return new Response(sections.join("\n"), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    })
}
