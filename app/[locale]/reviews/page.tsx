import type { Metadata } from "next"
import { ReviewsView, reviewsMetadata } from "@/components/views/reviews-view"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return reviewsMetadata(await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    return <ReviewsView locale={await resolveLocale(params)} />
}
