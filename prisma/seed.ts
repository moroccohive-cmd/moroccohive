import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"

const prisma = new PrismaClient()

/**
 * Insert-only by design: this runs against production, where reviews are
 * entered by hand through the dashboard. An existing row is never updated or
 * deleted - if a match is found the seed entry is skipped and left alone.
 * Pass --dry-run to report what would happen without writing.
 */
const DRY_RUN = process.argv.includes("--dry-run")

/**
 * The traveler reviews that used to be hardcoded in the homepage testimonials
 * rail. Seeded with showOnHome so the homepage keeps the same content, but the
 * admin can now swap them from /dashboard/reviews.
 */
const REVIEWS = [
    {
        authorName: "Martin Schreiber",
        authorLocation: "Canada",
        authorImage: "/r7.webp",
        rating: 5,
        text: "Our driver, Abdellatif Iggui, was absolutely outstanding in every way. He was first of all an excellent, safe driver, who knew every inch of the country and of every city. He was always on time, and always knew just how long any of our journeys would take. He made sure we were comfortable throughout, he was happy to stop for pictures or a rest as needed, he was able to share a lot of information about his country, and overall made the journeys very pleasant.",
        country: "CA",
        displayDate: "December 2024",
        source: "Trustpilot",
        showOnHome: true,
        order: 1,
    },
    {
        authorName: "Brid and Brett",
        authorLocation: "United States",
        authorImage: "/r3.webp",
        rating: 5,
        text: "We are back in the USA after having a wonderful full trip in Africa. Thank you for all of your work for our Morocco portion of our trip. We had a great time in your country and thoroughly enjoyed all of our time there. Each of our tours was so well done and informative. We particularly loved Chefchaouen, the desert and camels and Marrakech. Abdellatif was a great driver and very informative, giving us wonderful insights into the country and people. Thank you again for giving us such wonderful memories.",
        country: "US",
        displayDate: "November 2024",
        source: "Trustpilot",
        showOnHome: true,
        order: 2,
    },
    {
        authorName: "Pamelia Bain",
        authorLocation: "United States",
        authorImage: "/r4.webp",
        rating: 5,
        text: "From the moment I got off the plane in Casablanca where I first met Abdellatif, I felt completely assured that I was in good hands, especially knowing he would be with me the entire trip. He is truly a professional in his skill and knowledge and he demonstrated that every step of the way. His enthusiasm, knowledge and love of his country shone through each day. He readily shared so much about the rich history and the lives of the people. I do not think I could have had a more immersive experience with anyone else.",
        country: "US",
        displayDate: "October 2024",
        source: "Trustpilot",
        showOnHome: true,
        order: 3,
    },
    {
        authorName: "Natalie Foster",
        authorLocation: "United States",
        authorImage: "/r1.webp",
        rating: 5,
        text: "I want to thank MoroccoHive and the staff that made my Moroccan vacation a beautiful experience for both me and my sister. It was our first time traveling to Morocco. Our driver and guide Abdellatif was very kind and welcoming. He made every day fun and interesting. He even went so far as to teach us some Arabic words (shukran). The Sahara Desert camp site in Merzouga was one of the best highlights of our tour. Watching the sunrise the next morning in the desert was awesome.",
        country: "US",
        displayDate: "September 2025",
        source: "Trustpilot",
        showOnHome: true,
        order: 4,
    },
    {
        authorName: "Ines Fonzalida",
        authorLocation: "Netherlands",
        authorImage: "/r2.webp",
        rating: 5,
        text: "I recently returned from leading a group tour through Morocco with your company. Throughout the tour, Abdellatif was far more than just a driver, he was an incredible support, a source of knowledge, and a true ambassador for Morocco. His warm personality, cultural insights, and exceptional people skills had a huge impact on the group's overall experience. It felt as though we had a dedicated local guide alongside us the entire time.",
        country: "NL",
        displayDate: "September 2025",
        source: "Trustpilot",
        showOnHome: true,
        order: 5,
    },
    {
        authorName: "Claramarie C.",
        authorLocation: "San Jose, CA",
        authorImage: "/r6.webp",
        rating: 5,
        text: "Our trip was spectacular! Hakim was responsive in the planning process and adjusted the items I wanted changed quickly and accurately. The Riads we stayed in were gorgeous across the board. The real star of our vacation was our driver, guide and honorary family member Abdellatif Iggui. From the moment he met us at the airport until he dropped us at the port eight days later he was a delight - knowledgeable, friendly, accommodating and fun.",
        country: "US",
        displayDate: "August 2025",
        source: "Trustpilot",
        showOnHome: true,
        order: 6,
    },
]

/** The FAQs that used to be hardcoded in the homepage FAQ section. */
const FAQS = [
    {
        question: "When is the best time to visit Morocco?",
        answer:
            "Spring (March to May) and fall (September to mid-November) are the ideal seasons to travel to Morocco. In contrast to the bitter cold and snow of winter or the intense heat of summer, the weather is pleasant but warm. If you enjoy the warmer weather, summer is also a great time to visit. You can travel to the coastal areas.",
        category: "Travel",
        showOnHome: true,
        order: 1,
    },
    {
        question: "Is Morocco a safe country?",
        answer:
            "Yes, Morocco is generally considered a safe country for tourists, with low levels of violent crime, though petty crimes like pickpocketing and scams are common in tourist areas. Millions travel there annually without issues - stick to common-sense precautions like not walking alone at night in isolated areas.",
        category: "Travel",
        showOnHome: true,
        order: 2,
    },
    {
        question: "Do I need to purchase travel insurance?",
        answer:
            "Yes, before taking part in any of our tours, all travelers using MoroccoHive must have travel insurance. On the first day of your trip, your guide will gather your travel insurance information. It is your duty to ensure that you have appropriate and sufficient travel insurance.",
        category: "Booking",
        showOnHome: true,
        order: 3,
    },
    {
        question: "Do I need to tip?",
        answer:
            "Tipping service staff is common in Morocco - typically around 15% for a restaurant meal. It is also standard to round up the fare or the bill for taxi drivers and porters (around 20 MAD). Your tour guide and crew would be especially appreciative and honored with this kind of traditional gratitude at the end of your tour.",
        category: "Travel",
        showOnHome: true,
        order: 4,
    },
]

async function seedReviews() {
    let created = 0
    let skipped = 0

    for (const review of REVIEWS) {
        // Mongo has no unique index on these, so match on the author to keep
        // re-runs idempotent. Tour-attached reviews are a separate namespace.
        const existing = await prisma.review.findFirst({
            where: { authorName: review.authorName, circuitId: null },
            select: { id: true },
        })

        if (existing) {
            console.log(`  skip   review "${review.authorName}" - already exists`)
            skipped++
            continue
        }

        if (!DRY_RUN) await prisma.review.create({ data: review })
        console.log(`  create review "${review.authorName}"`)
        created++
    }

    console.log(`Reviews: ${created} created, ${skipped} skipped`)
}

async function seedFaqs() {
    let created = 0
    let skipped = 0

    for (const faq of FAQS) {
        const existing = await prisma.faq.findFirst({
            where: { question: faq.question },
            select: { id: true },
        })

        if (existing) {
            console.log(`  skip   faq "${faq.question}" - already exists`)
            skipped++
            continue
        }

        if (!DRY_RUN) await prisma.faq.create({ data: { ...faq, active: true } })
        console.log(`  create faq "${faq.question}"`)
        created++
    }

    console.log(`FAQs: ${created} created, ${skipped} skipped`)
}

async function main() {
    const url = process.env.DATABASE_URL
    console.log(`Database: ${url ? new URL(url).hostname : "(DATABASE_URL not set)"}`)
    if (DRY_RUN) console.log("DRY RUN - no writes will be made\n")

    const before = {
        reviews: await prisma.review.count(),
        faqs: await prisma.faq.count(),
    }
    console.log(`Before: ${before.reviews} reviews, ${before.faqs} faqs\n`)

    await seedReviews()
    await seedFaqs()

    const after = {
        reviews: await prisma.review.count(),
        faqs: await prisma.faq.count(),
    }
    console.log(`\nAfter: ${after.reviews} reviews, ${after.faqs} faqs`)
}

main()
    .catch((error) => {
        console.error("Seed failed:", error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
