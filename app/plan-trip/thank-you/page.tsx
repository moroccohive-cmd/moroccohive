import { ThankYouView, thankYouMetadata } from "@/components/views/thank-you-view"

export const metadata = thankYouMetadata("planTrip", "en")

export default function PlanTripThankYouPage() {
    return <ThankYouView kind="planTrip" locale="en" />
}
