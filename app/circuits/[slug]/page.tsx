import type { Metadata } from "next"
import { CircuitDetailView, circuitMetadata } from "@/components/views/circuit-detail-view"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    return circuitMetadata(slug, "en")
}

export default async function CircuitDetailPage({ params }: Props) {
    const { slug } = await params
    return <CircuitDetailView slug={slug} locale="en" />
}
