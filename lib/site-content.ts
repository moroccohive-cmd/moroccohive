import prisma from "@/lib/prisma"

export interface PublicReview {
    id: string
    authorName: string
    authorLocation: string | null
    authorImage: string | null
    rating: number
    text: string
    country: string | null
    displayDate: string | null
    source: string | null
    createdAt: Date
    circuit?: { name: string; slug: string } | null
}

export interface PublicFaq {
    id: string
    question: string
    answer: string
    category: string | null
}

const REVIEW_SELECT = {
    id: true,
    authorName: true,
    authorLocation: true,
    authorImage: true,
    rating: true,
    text: true,
    country: true,
    displayDate: true,
    source: true,
    createdAt: true,
    circuit: { select: { name: true, slug: true } },
}

/**
 * Reviews the admin flagged for the homepage. Falls back to the bundled
 * testimonials so the section never renders empty on a fresh database.
 */
export async function getHomeReviews(take = 9): Promise<PublicReview[]> {
    try {
        const reviews = await (prisma as any).review.findMany({
            where: { showOnHome: true },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
            take,
            select: REVIEW_SELECT,
        })
        return reviews.length > 0 ? reviews : FALLBACK_REVIEWS
    } catch {
        return FALLBACK_REVIEWS
    }
}

export async function getAllReviews(): Promise<PublicReview[]> {
    try {
        const reviews = await (prisma as any).review.findMany({
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
            select: REVIEW_SELECT,
        })
        return reviews.length > 0 ? reviews : FALLBACK_REVIEWS
    } catch {
        return FALLBACK_REVIEWS
    }
}

export async function getHomeFaqs(take = 6): Promise<PublicFaq[]> {
    try {
        const faqs = await (prisma as any).faq.findMany({
            where: { showOnHome: true, active: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            take,
            select: { id: true, question: true, answer: true, category: true },
        })
        return faqs.length > 0 ? faqs : FALLBACK_FAQS
    } catch {
        return FALLBACK_FAQS
    }
}

export async function getAllFaqs(): Promise<PublicFaq[]> {
    try {
        const faqs = await (prisma as any).faq.findMany({
            where: { active: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
            select: { id: true, question: true, answer: true, category: true },
        })
        return faqs.length > 0 ? faqs : FALLBACK_FAQS
    } catch {
        return FALLBACK_FAQS
    }
}

/** Groups FAQs by category, keeping uncategorised ones under "General". */
export function groupFaqsByCategory(faqs: PublicFaq[]): [string, PublicFaq[]][] {
    const groups = new Map<string, PublicFaq[]>()
    for (const faq of faqs) {
        const key = faq.category?.trim() || "General"
        const bucket = groups.get(key)
        if (bucket) bucket.push(faq)
        else groups.set(key, [faq])
    }
    return Array.from(groups.entries())
}

// ---------------------------------------------------------------------------
// Fallback content — used until the admin adds entries in the dashboard.
// ---------------------------------------------------------------------------

const FALLBACK_REVIEWS: PublicReview[] = [
    {
        id: "fallback-1",
        authorName: "Martin Schreiber",
        authorLocation: "Canada",
        authorImage: "/r7.webp",
        rating: 5,
        text: "Our driver, Abdellatif Iggui, was absolutely outstanding in every way. He was first of all an excellent, safe driver, who knew every inch of the country and of every city. He was always on time, and always knew just how long any of our journeys would take.",
        country: "CA",
        displayDate: "December 2024",
        source: "Trustpilot",
        createdAt: new Date("2024-12-08"),
        circuit: null,
    },
    {
        id: "fallback-2",
        authorName: "Brid and Brett",
        authorLocation: "United States",
        authorImage: "/r3.webp",
        rating: 5,
        text: "Each of our tours was so well done and informative. We particularly loved Chefchaouen, the desert and camels and Marrakech. Abdellatif was a great driver and very informative, giving us wonderful insights into the country and people.",
        country: "US",
        displayDate: "November 2024",
        source: "Trustpilot",
        createdAt: new Date("2024-11-01"),
        circuit: null,
    },
    {
        id: "fallback-3",
        authorName: "Pamelia Bain",
        authorLocation: "United States",
        authorImage: "/r4.webp",
        rating: 5,
        text: "From the moment I got off the plane in Casablanca where I first met Abdellatif, I felt completely assured that I was in good hands. His enthusiasm, knowledge and love of his country shone through each day.",
        country: "US",
        displayDate: "October 2024",
        source: "Trustpilot",
        createdAt: new Date("2024-10-22"),
        circuit: null,
    },
    {
        id: "fallback-4",
        authorName: "Natalie Foster",
        authorLocation: "United States",
        authorImage: "/r1.webp",
        rating: 5,
        text: "Our driver and guide Abdellatif was very kind and welcoming. He made every day fun and interesting. The Sahara Desert camp site in Merzouga was one of the best highlights of our tour.",
        country: "US",
        displayDate: "September 2025",
        source: "Trustpilot",
        createdAt: new Date("2025-09-03"),
        circuit: null,
    },
    {
        id: "fallback-5",
        authorName: "Ines Fonzalida",
        authorLocation: "Netherlands",
        authorImage: "/r2.webp",
        rating: 5,
        text: "Throughout the tour, Abdellatif was far more than just a driver, he was an incredible support, a source of knowledge, and a true ambassador for Morocco. His warm personality and cultural insights had a huge impact on the group.",
        country: "NL",
        displayDate: "September 2025",
        source: "Trustpilot",
        createdAt: new Date("2025-09-23"),
        circuit: null,
    },
    {
        id: "fallback-6",
        authorName: "Claramarie C.",
        authorLocation: "San Jose, CA",
        authorImage: "/r6.webp",
        rating: 5,
        text: "Our trip was spectacular! The Riads we stayed in were gorgeous across the board. The real star of our vacation was our driver, guide and honorary family member Abdellatif Iggui - knowledgeable, friendly, accommodating and fun.",
        country: "US",
        displayDate: "August 2025",
        source: "Trustpilot",
        createdAt: new Date("2025-08-14"),
        circuit: null,
    },
]

const FALLBACK_FAQS: PublicFaq[] = [
    {
        id: "fallback-faq-1",
        question: "When is the best time to visit Morocco?",
        answer:
            "Spring (March to May) and fall (September to mid-November) are the ideal seasons to travel to Morocco. In contrast to the bitter cold and snow of winter or the intense heat of summer, the weather is pleasant but warm. If you enjoy the warmer weather, summer is also a great time to visit. You can travel to the coastal areas.",
        category: "Travel",
    },
    {
        id: "fallback-faq-2",
        question: "Is Morocco a safe country?",
        answer:
            "Yes, Morocco is generally considered a safe country for tourists, with low levels of violent crime, though petty crimes like pickpocketing and scams are common in tourist areas. Millions travel there annually without issues - stick to common-sense precautions like not walking alone at night in isolated areas.",
        category: "Travel",
    },
    {
        id: "fallback-faq-3",
        question: "Do I need to purchase travel insurance?",
        answer:
            "Yes, before taking part in any of our tours, all travelers using MoroccoHive must have travel insurance. On the first day of your trip, your guide will gather your travel insurance information. It is your duty to ensure that you have appropriate and sufficient travel insurance.",
        category: "Booking",
    },
    {
        id: "fallback-faq-4",
        question: "Do I need to tip?",
        answer:
            "Tipping service staff is common in Morocco - typically around 15% for a restaurant meal. It is also standard to round up the fare or the bill for taxi drivers and porters (around 20 MAD). Your tour guide and crew would be especially appreciative and honored with this kind of traditional gratitude at the end of your tour.",
        category: "Travel",
    },
]
