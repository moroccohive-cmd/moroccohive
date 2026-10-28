import "dotenv/config"
import { readdirSync, readFileSync, existsSync } from "fs"
import { join } from "path"
import { PrismaClient } from "../generated/prisma/client"
import { sanitizeTranslations, availableLocales } from "../lib/i18n/content"

const prisma = new PrismaClient()

/**
 * Loads French / Dutch translations of circuits and blog posts from
 * scripts/translations/{circuits,posts}/<slug>.json into each record's
 * `translations` field.
 *
 * Fill-only and additive: English columns are never touched, a language that
 * already has a translation on the record is skipped, and `updatedAt` is kept
 * as it was so article modified dates don't change.
 *
 *   npx tsx scripts/seed-content-translations.ts --dry-run   # report only
 *   npx tsx scripts/seed-content-translations.ts             # write
 */
const DRY_RUN = process.argv.includes("--dry-run")
const DIR = join(__dirname, "translations")

function load(kind: "circuits" | "posts") {
    const dir = join(DIR, kind)
    if (!existsSync(dir)) return []
    return readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => ({ slug: f.replace(/\.json$/, ""), data: JSON.parse(readFileSync(join(dir, f), "utf8")) }))
}

async function main() {
    let written = 0
    for (const { slug, data } of load("circuits")) {
        const rec = await prisma.circuit.findUnique({ where: { slug } })
        if (!rec) { console.log(`skip (no circuit): ${slug}`); continue }
        written += await apply("circuit", slug, rec.translations, data, (t) =>
            prisma.circuit.update({ where: { slug }, data: { translations: t, updatedAt: rec.updatedAt } }))
    }
    for (const { slug, data } of load("posts")) {
        const rec = await prisma.blogPost.findUnique({ where: { slug } })
        if (!rec) { console.log(`skip (no post): ${slug}`); continue }
        written += await apply("blog", slug, rec.translations, data, (t) =>
            prisma.blogPost.update({ where: { slug }, data: { translations: t, updatedAt: rec.updatedAt } }))
    }
    console.log(`${DRY_RUN ? "[dry run] " : ""}${written} record(s) ${DRY_RUN ? "would be updated" : "updated"}`)
}

async function apply(
    kind: "circuit" | "blog",
    slug: string,
    existing: unknown,
    incoming: unknown,
    save: (t: object) => Promise<unknown>,
) {
    const clean = sanitizeTranslations(kind, incoming)
    if (!clean) { console.log(`skip (nothing valid): ${slug}`); return 0 }
    const current = (existing && typeof existing === "object" ? existing : {}) as Record<string, unknown>
    const merged: Record<string, unknown> = { ...current }
    const added: string[] = []
    for (const [locale, entry] of Object.entries(clean)) {
        if (current[locale]) continue // never overwrite an existing translation
        merged[locale] = entry
        added.push(locale)
    }
    if (!added.length) { console.log(`skip (already translated): ${slug}`); return 0 }
    const ready = availableLocales(kind, merged).filter((l) => l !== "en")
    console.log(`${DRY_RUN ? "would add" : "add"} [${added}] -> ${slug} (indexable: ${ready})`)
    if (!DRY_RUN) await save(merged)
    return 1
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
