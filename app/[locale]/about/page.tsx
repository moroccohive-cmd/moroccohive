import type { Metadata } from "next"
import { AboutView, aboutMetadata } from "@/components/views/about-view"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return aboutMetadata(await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    return <AboutView locale={await resolveLocale(params)} />
}
