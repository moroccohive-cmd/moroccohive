import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./config"

/**
 * Translations for database content (circuits, blog posts, FAQs).
 *
 * The English text stays in the model's regular columns, so nothing about the
 * existing records or pages changes. Other languages are stored as overrides in
 * a `translations` JSON field:
 *
 *   { fr: { name: "…", highlights: ["…"] }, nl: { … } }
 *
 * A field missing from a translation falls back to English. A record only
 * counts as translated into a language once its required fields are filled —
 * that is what decides whether the language version is indexable (hreflang,
 * sitemap) or canonicalises to the English original.
 */

export const TRANSLATABLE_FIELDS = {
    circuit: [
        "name",
        "tagline",
        "description",
        "highlights",
        "included",
        "excluded",
        "optional",
        "itineraryGlance",
        "itineraryDetail",
        "additionalInfo",
    ],
    blog: ["title", "excerpt", "content"],
    faq: ["question", "answer", "category"],
} as const

export const REQUIRED_FIELDS = {
    circuit: ["name", "description"],
    blog: ["title", "content"],
    faq: ["question", "answer"],
} as const

export type ContentKind = keyof typeof TRANSLATABLE_FIELDS

type TranslationValue = string | string[]
type TranslationEntry = Record<string, TranslationValue>

function entryFor(translations: unknown, locale: Locale): TranslationEntry | null {
    if (!translations || typeof translations !== "object") return null
    const entry = (translations as Record<string, unknown>)[locale]
    return entry && typeof entry === "object" ? (entry as TranslationEntry) : null
}

/** Languages this record can be served in: English plus every complete translation. */
export function availableLocales(kind: ContentKind, translations: unknown): Locale[] {
    return LOCALES.filter((locale) => {
        if (locale === DEFAULT_LOCALE) return true
        const entry = entryFor(translations, locale)
        // Required fields are all text fields, so only real strings count.
        return !!entry && REQUIRED_FIELDS[kind].every((field) => cleanValue(entry[field], false) !== undefined)
    })
}

/**
 * Returns the record with its text fields swapped for `locale`, plus whether a
 * complete translation exists. English (or a missing translation) returns the
 * record unchanged.
 */
export function localizeRecord<T extends object>(
    kind: ContentKind,
    record: T & { translations?: unknown },
    locale: Locale,
): { data: T; translated: boolean; locales: Locale[] } {
    const locales = availableLocales(kind, record.translations)
    if (locale === DEFAULT_LOCALE) return { data: record, translated: true, locales }

    const entry = entryFor(record.translations, locale)
    if (!entry) return { data: record, translated: false, locales }

    const data = { ...record } as Record<string, unknown>
    for (const field of TRANSLATABLE_FIELDS[kind]) {
        const translated = cleanValue(entry[field], Array.isArray(data[field]))
        // Anything missing, empty or of the wrong shape keeps the English value.
        if (translated !== undefined) data[field] = translated
    }
    return { data: data as T, translated: locales.includes(locale), locales }
}

/**
 * A translated value in the same shape as the English field it replaces, or
 * undefined when there is nothing usable. List fields (highlights, itinerary…)
 * only accept arrays of strings, text fields only strings — so a malformed
 * translation can never break a page, it just falls back to English.
 */
function cleanValue(value: unknown, expectList: boolean): string | string[] | undefined {
    if (expectList) {
        if (!Array.isArray(value)) return undefined
        const items = value.filter((v): v is string => typeof v === "string").map((v) => v.trim()).filter(Boolean)
        return items.length ? items : undefined
    }
    if (typeof value !== "string") return undefined
    return value.trim() || undefined
}

/**
 * Cleans a `translations` payload from the admin API: known languages and
 * fields only, strings trimmed, empties dropped. Returns null when nothing is
 * left so the column stays unset.
 */
export function sanitizeTranslations(kind: ContentKind, input: unknown): Record<string, TranslationEntry> | null {
    if (!input || typeof input !== "object") return null
    const out: Record<string, TranslationEntry> = {}

    for (const [locale, raw] of Object.entries(input as Record<string, unknown>)) {
        if (!isLocale(locale) || locale === DEFAULT_LOCALE || !raw || typeof raw !== "object") continue
        const entry: TranslationEntry = {}
        for (const field of TRANSLATABLE_FIELDS[kind]) {
            const value = (raw as Record<string, unknown>)[field]
            if (typeof value === "string" && value.trim()) {
                entry[field] = value.trim()
            } else if (Array.isArray(value)) {
                const items = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0).map((v) => v.trim())
                if (items.length) entry[field] = items
            }
        }
        if (Object.keys(entry).length) out[locale] = entry
    }

    return Object.keys(out).length ? out : null
}
