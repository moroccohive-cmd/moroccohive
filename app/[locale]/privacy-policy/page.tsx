import type { Metadata } from "next"
import { PrivacyView, privacyMetadata } from "@/components/views/legal-views"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return privacyMetadata(await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    return <PrivacyView locale={await resolveLocale(params)} />
}
