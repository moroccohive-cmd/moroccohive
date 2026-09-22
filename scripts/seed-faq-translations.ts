import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { FALLBACK_FAQS } from "../lib/site-content"

const prisma = new PrismaClient()

/**
 * Adds French and Spanish translations to the FAQs that were created from the
 * bundled defaults in lib/site-content.ts (matched on the exact English
 * question). Fill-only: a FAQ that already has translations is left alone, so
 * this never overwrites anything edited in the dashboard.
 *
 *   npx tsx scripts/seed-faq-translations.ts --dry-run   # report only
 *   npx tsx scripts/seed-faq-translations.ts             # write
 */
const DRY_RUN = process.argv.includes("--dry-run")

async function main() {
    const byQuestion = new Map(FALLBACK_FAQS.map((f) => [f.question.trim(), f.translations]))
    const faqs = await prisma.faq.findMany({ select: { id: true, question: true, translations: true } })

    let updated = 0
    for (const faq of faqs) {
        const translations = byQuestion.get(faq.question.trim())
        if (!translations) {
            console.log(`skip (no bundled translation): ${faq.question}`)
            continue
        }
        if (faq.translations && Object.keys(faq.translations as object).length > 0) {
            console.log(`skip (already translated): ${faq.question}`)
            continue
        }
        console.log(`${DRY_RUN ? "would translate" : "translate"}: ${faq.question}`)
        if (!DRY_RUN) {
            await prisma.faq.update({ where: { id: faq.id }, data: { translations: translations as object } })
        }
        updated++
    }

    console.log(`${DRY_RUN ? "[dry run] " : ""}${updated} FAQ(s) ${DRY_RUN ? "would be updated" : "updated"}`)
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
