import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PlanTripForm } from "@/components/plan-trip-form"
import { buildMetadata } from "@/lib/seo"
import type { Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"

export function planTripMetadata(locale: Locale): Metadata {
    const t = getMessages(locale).meta.planTrip
    return buildMetadata({ title: t.title, description: t.description, path: "/plan-trip", locale })
}

export function PlanTripView({ locale }: { locale: Locale }) {
    const messages = getMessages(locale)
    const { paymentMethods, selectPayment, depositTitle, depositLine1, depositLine2 } = messages.booking

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header locale={locale} />
            <PlanTripForm
                messages={messages.planTrip}
                payment={{ paymentMethods, selectPayment, depositTitle, depositLine1, depositLine2 }}
            />
            <Footer locale={locale} />
        </div>
    )
}
