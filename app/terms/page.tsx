import { TermsView, termsMetadata } from "@/components/views/legal-views"

export const metadata = termsMetadata("en")

export default function TermsOfUsePage() {
    return <TermsView locale="en" />
}
