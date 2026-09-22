import type { Metadata } from "next"
import { DESTINATIONS } from "@/lib/destinations"
import { DestinationDetailView, destinationMetadata } from "@/components/views/destination-detail-view"
import { resolveLocale } from "@/lib/i18n/route"

type Props = { params: Promise<{ locale: string; slug: string }> }

export const revalidate = 3600

/** Every destination guide is translated, so all of them are prerendered. */
export function generateStaticParams() {
    return DESTINATIONS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    return destinationMetadata(slug, await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    const { slug } = await params
    return <DestinationDetailView slug={slug} locale={await resolveLocale(params)} />
}
