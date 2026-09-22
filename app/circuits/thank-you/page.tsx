import { ThankYouView, thankYouMetadata } from "@/components/views/thank-you-view"

export const metadata = thankYouMetadata("circuit", "en")

export default function CircuitThankYouPage() {
    return <ThankYouView kind="circuit" locale="en" />
}
