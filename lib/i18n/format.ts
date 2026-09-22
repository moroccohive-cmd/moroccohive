import { LOCALE_META, type Locale } from "./config"

/** Fills {placeholders} in a message: fmt("Day {n}", { n: 2 }) → "Day 2". */
export function fmt(message: string, values: Record<string, string | number> = {}): string {
    return message.replace(/\{(\w+)\}/g, (match, key: string) =>
        key in values ? String(values[key]) : match,
    )
}

/**
 * Looks up the display label for a value stored in English in the database
 * (e.g. a circuit category), ignoring case. Unknown values are shown as-is.
 */
export function labelFor(labels: Record<string, string>, value: string): string {
    if (labels[value]) return labels[value]
    const key = value.trim().toLowerCase()
    const match = Object.keys(labels).find((k) => k.toLowerCase() === key)
    return match ? labels[match] : value
}

/** Formats a date in the reader's language ("March 3, 2025" / "3 mars 2025"). */
export function formatDate(
    date: Date | string,
    locale: Locale,
    options: Intl.DateTimeFormatOptions,
): string {
    return new Date(date).toLocaleDateString(LOCALE_META[locale].intl, options)
}
