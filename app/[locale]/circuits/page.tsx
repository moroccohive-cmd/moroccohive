import type { Metadata } from "next"
import { CircuitsView, circuitsMetadata } from "@/components/views/circuits-view"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return circuitsMetadata(await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    return <CircuitsView locale={await resolveLocale(params)} />
}
