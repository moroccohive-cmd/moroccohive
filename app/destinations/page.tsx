import { DestinationsView, destinationsMetadata } from "@/components/views/destinations-view"

export const metadata = destinationsMetadata("en")

export const revalidate = 86400

export default function DestinationsPage() {
    return <DestinationsView locale="en" />
}
