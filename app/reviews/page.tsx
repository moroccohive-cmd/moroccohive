import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { TrustpilotBadge } from "@/components/trustpilot-badge"
import { ReviewCard, TrustStars } from "@/components/review-card"
import { getAllReviews } from "@/lib/site-content"

export const metadata: Metadata = {
    title: "Traveler Reviews",
    description:
        "Read what travelers say about their private Morocco tours with Morocco Hive - honest reviews from guests guided across the Sahara, Atlas Mountains and imperial cities.",
    alternates: {
        canonical: "https://www.moroccohive.com/reviews",
    },
    openGraph: {
        title: "Traveler Reviews | Morocco Hive",
        description:
            "Honest reviews from travelers who booked private Morocco tours with Morocco Hive.",
        url: "https://www.moroccohive.com/reviews",
        images: [
            {
                url: "/hero-bg.webp",
                width: 1200,
                height: 630,
                alt: "Morocco Hive traveler reviews",
            },
        ],
    },
    twitter: {
        title: "Traveler Reviews | Morocco Hive",
        description:
            "Honest reviews from travelers who booked private Morocco tours with Morocco Hive.",
    },
}

export const revalidate = 3600

export default async function ReviewsPage() {
    const reviews = await getAllReviews()

    const average =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0

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
                                <TrustStars rating={average} size={24} />
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {average.toFixed(1)}
                                    </span>{" "}
                                    average from {reviews.length}{" "}
                                    {reviews.length === 1 ? "review" : "reviews"}
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

            <Footer />
        </div>
    )
}
