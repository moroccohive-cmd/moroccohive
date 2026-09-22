import { CircuitsView, circuitsMetadata } from "@/components/views/circuits-view"

export const metadata = circuitsMetadata("en")

// Disable caching to ensure fresh data (updated slugs, etc.) is always served
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function CircuitsPage() {
    return <CircuitsView locale="en" />
}
