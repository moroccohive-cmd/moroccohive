import type { Metadata } from "next"
import { FaqView, faqMetadata } from "@/components/views/faq-view"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return faqMetadata(await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    return <FaqView locale={await resolveLocale(params)} />
}
