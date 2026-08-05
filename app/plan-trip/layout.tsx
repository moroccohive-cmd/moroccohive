import type { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/structured-data"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
    title: "Plan Your Morocco Trip - Custom Itinerary in 48h",
    description:
        "Tell us your dates, group, and interests. A Morocco-based travel expert sends you a custom private tour proposal within 48 hours. Free, no obligation.",
    path: "/plan-trip",
})

export default function PlanTripLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <BreadcrumbSchema items={[{ name: "Plan Your Trip", path: "/plan-trip" }]} />
        </>
    )
}
