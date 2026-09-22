import { ReviewsView, reviewsMetadata } from "@/components/views/reviews-view"

export const metadata = reviewsMetadata("en")

export const revalidate = 3600

export default function ReviewsPage() {
    return <ReviewsView locale="en" />
}
