import { FaqView, faqMetadata } from "@/components/views/faq-view"

export const metadata = faqMetadata("en")

export const revalidate = 3600

export default function FaqPage() {
    return <FaqView locale="en" />
}
