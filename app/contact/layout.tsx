import type { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/structured-data"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
    title: "Contact Morocco Hive - Marrakech Travel Agency",
    description:
        "Reach Morocco Hive in Marrakech for private tours and custom itineraries. Email, phone, or WhatsApp - we reply within 24 hours.",
    path: "/contact",
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <BreadcrumbSchema items={[{ name: "Contact", path: "/contact" }]} />
        </>
    )
}
