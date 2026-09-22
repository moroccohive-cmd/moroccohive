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
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { fmt } from "@/lib/i18n/format"

export function reviewsMetadata(locale: Locale): Metadata {
    const t = getMessages(locale).meta.reviews
    return buildMetadata({ title: t.title, description: t.description, path: "/reviews", locale })
}

export async function ReviewsView({ locale }: { locale: Locale }) {
    const messages = getMessages(locale)
    const t = messages.reviews
    const reviews = await getAllReviews()

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header locale={locale} />

            <main className="flex-1">
                {/* Intro */}
                <section className="border-b border-border bg-card py-16">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <span className="text-xs font-medium uppercase tracking-widest text-accent">
                            {t.eyebrow}
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t.title}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl font-light text-muted-foreground">
                            {t.intro}
                        </p>

                        {reviews.length > 0 && (
                            <div className="mt-8 flex flex-col items-center gap-3">
                                {/* The headline is the full Trustpilot profile, not an
                                    average of the excerpts below, which are a subset. */}
                                <TrustStars rating={Number(SITE_RATING.ratingValue)} size={24} label={messages.reviewCard.stars} />
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {SITE_RATING.ratingValue}
                                    </span>{" "}
                                    {fmt(t.average, { count: SITE_RATING.reviewCount })}
                                </p>
                                <div className="mt-2">
                                    <TrustpilotBadge variant="dark" label={messages.trustpilot.aria} />
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* All reviews */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Masonry columns - review lengths vary wildly, and a grid
                            would stretch every card to the tallest one in its row.
                            Reviews stay in the language they were written in. */}
                        {reviews.length > 0 ? (
                            <ul className="list-none columns-1 gap-6 md:columns-2 lg:columns-3">
                                {reviews.map((review) => (
                                    <li key={review.id} className="mb-6 break-inside-avoid">
                                        <ReviewCard review={review} locale={locale} labels={messages.reviewCard} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="py-20 text-center text-muted-foreground">
                                {t.empty}
                            </p>
                        )}
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-border bg-card py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t.ctaTitle}
                        </h2>
                        <p className="mt-3 font-light text-muted-foreground">
                            {t.ctaBody}
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href={localizePath(locale, "/plan-trip")}>{t.planTrip}</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href={localizePath(locale, "/circuits")}>{t.browseTours}</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <BreadcrumbSchema items={[{ name: messages.breadcrumb.reviews, path: "/reviews" }]} locale={locale} />
            <ReviewCollectionSchema reviews={reviews} />

            <Footer locale={locale} />
        </div>
    )
}
