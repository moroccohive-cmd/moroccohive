import { PrivacyView, privacyMetadata } from "@/components/views/legal-views"

export const metadata = privacyMetadata("en")

export default function PrivacyPolicyPage() {
    return <PrivacyView locale="en" />
}
