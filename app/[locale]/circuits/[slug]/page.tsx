import type { Metadata } from "next"
import { CircuitDetailView, circuitMetadata } from "@/components/views/circuit-detail-view"
import { resolveLocale } from "@/lib/i18n/route"

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    return circuitMetadata(slug, await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    const { slug } = await params
    return <CircuitDetailView slug={slug} locale={await resolveLocale(params)} />
}
