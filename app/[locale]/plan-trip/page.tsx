import type { Metadata } from "next"
import { PlanTripView, planTripMetadata } from "@/components/views/plan-trip-view"
import { BreadcrumbSchema } from "@/components/structured-data"
import { getMessages } from "@/lib/i18n/messages"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return planTripMetadata(await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    const locale = await resolveLocale(params)
    return (
        <>
            <PlanTripView locale={locale} />
            <BreadcrumbSchema
                items={[{ name: getMessages(locale).breadcrumb.planTrip, path: "/plan-trip" }]}
                locale={locale}
            />
        </>
    )
}
