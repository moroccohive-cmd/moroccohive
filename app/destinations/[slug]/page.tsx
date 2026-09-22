import type { Metadata } from "next"
import { DESTINATIONS } from "@/lib/destinations"
import { DestinationDetailView, destinationMetadata } from "@/components/views/destination-detail-view"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600

/** Pre-renders every destination at build time — they are a fixed set. */
export function generateStaticParams() {
    return DESTINATIONS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    return destinationMetadata(slug, "en")
}

export default async function DestinationPage({ params }: Props) {
    const { slug } = await params
    return <DestinationDetailView slug={slug} locale="en" />
}
