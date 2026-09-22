import type { Metadata } from "next"
import { ThankYouView, thankYouMetadata } from "@/components/views/thank-you-view"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return thankYouMetadata("planTrip", await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    return <ThankYouView kind="planTrip" locale={await resolveLocale(params)} />
}
