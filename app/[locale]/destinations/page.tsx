import type { Metadata } from "next"
import { DestinationsView, destinationsMetadata } from "@/components/views/destinations-view"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export const revalidate = 86400

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return destinationsMetadata(await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    return <DestinationsView locale={await resolveLocale(params)} />
}
