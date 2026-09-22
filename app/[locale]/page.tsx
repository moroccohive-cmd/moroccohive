import type { Metadata } from "next"
import { HomeView, homeMetadata } from "@/components/views/home-view"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return homeMetadata(await resolveLocale(params))
}

export default async function LocalizedHomePage({ params }: Props) {
    return <HomeView locale={await resolveLocale(params)} />
}
