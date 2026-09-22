/**
 * Locale routing rules.
 *
 * English is the default and keeps the original, unprefixed URLs (/circuits,
 * /blog/…), so nothing that is already indexed moves. Every other language
 * lives under its own path prefix (/fr/circuits, /nl/blog/…), which is the
 * setup Google recommends for multilingual sites: one crawlable URL per
 * language, tied together with hreflang.
 *
 * Adding a language = add it to LOCALES + LOCALE_META, then add its message
 * files under lib/i18n/messages (plus lib/i18n/destinations for the guides);
 * the type checker lists every missing string.
 */

export const LOCALES = ["en", "fr", "nl"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

/** Locales served under a path prefix — every locale except the default. */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE) as Exclude<
    Locale,
    typeof DEFAULT_LOCALE
>[]

export const LOCALE_META: Record<
    Locale,
    {
        /** Native name, shown in the language switcher. */
        label: string
        /** Short code shown on the switcher button. */
        short: string
        /** Open Graph locale. */
        ogLocale: string
        /** BCP 47 tag for Intl date/number formatting. */
        intl: string
    }
> = {
    en: { label: "English", short: "EN", ogLocale: "en_US", intl: "en-US" },
    fr: { label: "Français", short: "FR", ogLocale: "fr_FR", intl: "fr-FR" },
    nl: { label: "Nederlands", short: "NL", ogLocale: "nl_NL", intl: "nl-NL" },
}

export function isLocale(value: unknown): value is Locale {
    return typeof value === "string" && (LOCALES as readonly string[]).includes(value)
}

/**
 * Prefixes a site-relative path for a locale. The default locale is returned
 * untouched, so English links render exactly as they did before i18n.
 *
 *   localizePath("fr", "/")            → "/fr"
 *   localizePath("fr", "/blog?page=2") → "/fr/blog?page=2"
 *   localizePath("en", "/circuits")    → "/circuits"
 */
export function localizePath(locale: Locale, path: string): string {
    if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path
    const clean = path.startsWith("/") ? path : `/${path}`
    if (locale === DEFAULT_LOCALE) return clean
    if (clean === "/") return `/${locale}`
    if (clean.startsWith("/?") || clean.startsWith("/#")) return `/${locale}${clean.slice(1)}`
    return `/${locale}${clean}`
}

/** Splits a pathname into its locale and the locale-less path. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
    const match = pathname.match(/^\/([a-z]{2})(?=\/|$)/)
    if (match && isLocale(match[1]) && match[1] !== DEFAULT_LOCALE) {
        return { locale: match[1], path: pathname.slice(3) || "/" }
    }
    return { locale: DEFAULT_LOCALE, path: pathname || "/" }
}
