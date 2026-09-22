import { LOCALE_META, isLocale } from "@/lib/i18n/config"

/**
 * Which language version of the site a lead came from, so replies go out in
 * the same language. Nothing is shown for English or for older records.
 */
export function LocaleBadge({ locale }: { locale?: string | null }) {
    if (!isLocale(locale) || locale === "en") return null
    return (
        <span
            title={`Sent from the ${LOCALE_META[locale].label} site — reply in ${LOCALE_META[locale].label}`}
            className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary"
        >
            {LOCALE_META[locale].short}
        </span>
    )
}
