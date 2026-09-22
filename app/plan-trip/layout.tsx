import { BreadcrumbSchema } from "@/components/structured-data"
import { planTripMetadata } from "@/components/views/plan-trip-view"

export const metadata = planTripMetadata("en")

export default function PlanTripLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <BreadcrumbSchema items={[{ name: "Plan Your Trip", path: "/plan-trip" }]} />
        </>
    )
}
