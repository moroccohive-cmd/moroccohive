import { notFound } from "next/navigation"
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config"

export type LocaleParams = Promise<{ locale: string }>

/**
 * Resolves the [locale] segment of a /fr or /nl route. Anything that is not a
 * prefixed locale 404s — including /en/…, which is redirected to the
 * unprefixed URL in next.config.ts before it ever gets here.
 */
export async function resolveLocale(params: LocaleParams): Promise<Locale> {
    const { locale } = await params
    if (!isLocale(locale) || locale === DEFAULT_LOCALE) notFound()
    return locale
}
