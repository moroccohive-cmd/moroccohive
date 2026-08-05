import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { TrustpilotBadge } from "@/components/trustpilot-badge"
import { ReviewCard, TrustStars } from "@/components/review-card"
import { getAllReviews } from "@/lib/site-content"
import {
    BreadcrumbSchema,
    ReviewCollectionSchema,
} from "@/components/structured-data"
import { buildMetadata, SITE_RATING } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
    title: "Traveler Reviews",
    description:
        "Read what travelers say about their private Morocco tours with Morocco Hive - honest reviews from guests guided across the Sahara, Atlas Mountains and imperial cities.",
    path: "/reviews",
})

export const revalidate = 3600

export default async function ReviewsPage() {
    const reviews = await getAllReviews()

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />

            <main className="flex-1">
                {/* Intro */}
                <section className="border-b border-border bg-card py-16">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <span className="text-xs font-medium uppercase tracking-widest text-accent">
                            Guest Stories
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            Traveler Reviews
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl font-light text-muted-foreground">
                            Every review below comes from a traveler who booked a private tour with us.
                            We publish them unedited apart from trimming for length.
                        </p>

                        {reviews.length > 0 && (
                            <div className="mt-8 flex flex-col items-center gap-3">
                                {/* The headline is the full Trustpilot profile, not an
                                    average of the excerpts below, which are a subset. */}
                                <TrustStars rating={Number(SITE_RATING.ratingValue)} size={24} />
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {SITE_RATING.ratingValue}
                                    </span>{" "}
                                    average from {SITE_RATING.reviewCount} Trustpilot reviews
                                </p>
                                <div className="mt-2">
                                    <TrustpilotBadge variant="dark" />
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* All reviews */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Masonry columns - review lengths vary wildly, and a grid
                            would stretch every card to the tallest one in its row */}
                        {reviews.length > 0 ? (
                            <ul className="list-none columns-1 gap-6 md:columns-2 lg:columns-3">
                                {reviews.map((review) => (
                                    <li key={review.id} className="mb-6 break-inside-avoid">
                                        <ReviewCard review={review} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="py-20 text-center text-muted-foreground">
                                No reviews published yet.
                            </p>
                        )}
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-border bg-card py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Ready for your own Morocco story?
                        </h2>
                        <p className="mt-3 font-light text-muted-foreground">
                            Tell us how you like to travel and we&apos;ll build the itinerary around it.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href="/plan-trip">Plan Your Trip</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href="/circuits">Browse Tours</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <BreadcrumbSchema items={[{ name: "Reviews", path: "/reviews" }]} />
            <ReviewCollectionSchema reviews={reviews} />

            <Footer />
        </div>
    )
}
