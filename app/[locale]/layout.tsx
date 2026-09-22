import type { Metadata } from "next"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { LOCALE_META, PREFIXED_LOCALES } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

/**
 * Layout for every translated page (/fr/…, /nl/…). English pages live at the
 * original unprefixed URLs and do not pass through here.
 */
export function generateStaticParams() {
    return PREFIXED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
    const locale = await resolveLocale(params)
    const t = getMessages(locale).meta
    // Pages override these; they only fill gaps so nothing inherits the
    // English defaults from the root layout.
    return {
        description: t.defaultDescription,
        openGraph: {
            locale: LOCALE_META[locale].ogLocale,
            images: [{ url: "/hero-bg.webp", width: 1200, height: 630, alt: t.ogImageAlt }],
        },
    }
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: LocaleParams
}) {
    const locale = await resolveLocale(params)
    return (
        <I18nProvider locale={locale} common={getMessages(locale).common}>
            {children}
        </I18nProvider>
    )
}
