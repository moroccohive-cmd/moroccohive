import Link from "next/link"
import { ReviewAvatar } from "@/components/review-avatar"
import type { PublicReview } from "@/lib/site-content"
import { DEFAULT_LOCALE, LOCALE_META, localizePath, type Locale } from "@/lib/i18n/config"
import { fmt } from "@/lib/i18n/format"

/** UI strings for review cards; English unless a translation is passed in. */
export interface ReviewCardLabels {
    readFull: string
    readFullAria: string
    tour: string
    stars: string
}

export const DEFAULT_REVIEW_LABELS: ReviewCardLabels = {
    readFull: "Read full review",
    readFullAria: "Read the full review from {name}",
    tour: "Tour:",
    stars: "{rating} out of 5 stars",
}

/**
 * Trustpilot-style rating: one filled green tile per star.
 */
export function TrustStars({
    rating,
    size = 20,
    label = DEFAULT_REVIEW_LABELS.stars,
}: {
    rating: number
    size?: number
    /** "{rating} out of 5 stars", translated. */
    label?: string
}) {
    const filled = Math.max(0, Math.min(5, Math.round(rating)))

    return (
        <div
            className="flex items-center gap-[2px]"
            role="img"
            // Tiles round to whole stars, but the label states the real rating -
            // otherwise 4.8 is announced as "5 out of 5".
            aria-label={fmt(label, { rating: Number(rating.toFixed(1)) })}
        >
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    aria-hidden="true"
                    style={{ width: size, height: size }}
                    className={`inline-flex items-center justify-center rounded-[2px] ${
                        i < filled ? "bg-[#00b67a]" : "bg-muted-foreground/25"
                    }`}
                >
                    <svg viewBox="0 0 24 24" fill="white" style={{ width: size * 0.72, height: size * 0.72 }}>
                        <path d="M12 2.5l2.9 6.06 6.6.9-4.8 4.6 1.2 6.55L12 17.5l-5.9 3.11 1.2-6.55-4.8-4.6 6.6-.9L12 2.5z" />
                    </svg>
                </span>
            ))}
        </div>
    )
}

/** Builds the "US · May 2025" meta line, skipping whichever half is missing. */
function metaLine(review: PublicReview, locale: Locale) {
    const place = review.country?.trim() || review.authorLocation?.trim()
    const date =
        review.displayDate?.trim() ||
        new Date(review.createdAt).toLocaleDateString(LOCALE_META[locale].intl, { month: "long", year: "numeric" })

    return [place, date].filter(Boolean).join(" · ")
}

interface ReviewCardProps {
    review: PublicReview
    /** Clamps the quote so cards in a rail stay the same height. */
    clamp?: boolean
    /** Renders a "Read full review" button - pair with `clamp`. */
    onReadMore?: () => void
    locale?: Locale
    labels?: ReviewCardLabels
}

export function ReviewCard({
    review,
    clamp = false,
    onReadMore,
    locale = DEFAULT_LOCALE,
    labels = DEFAULT_REVIEW_LABELS,
}: ReviewCardProps) {
    return (
        <figure className="flex h-full flex-col rounded-xl border border-border/70 bg-card p-7 shadow-[0_1px_2px_rgb(0,0,0,0.03)] transition-shadow hover:shadow-[0_4px_24px_rgb(0,0,0,0.06)]">
            <div className="mb-5">
                <TrustStars rating={review.rating} size={18} label={labels.stars} />
            </div>

            <blockquote
                className={`text-[15px] leading-[1.75] text-foreground ${clamp ? "line-clamp-6" : ""}`}
            >
                {review.text}
            </blockquote>

            {onReadMore && (
                <button
                    type="button"
                    onClick={onReadMore}
                    aria-label={fmt(labels.readFullAria, { name: review.authorName })}
                    className="mt-3 self-start text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
                >
                    {labels.readFull}
                </button>
            )}

            <figcaption className="mt-auto pt-6">
                <div className="flex items-center gap-3 border-t border-border/70 pt-5">
                    <ReviewAvatar src={review.authorImage} name={review.authorName} />

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {review.authorName}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {metaLine(review, locale)}
                            {review.source ? ` · ${review.source}` : ""}
                        </p>
                    </div>
                </div>

                {review.circuit && (
                    <p className="mt-4 text-xs text-muted-foreground">
                        {labels.tour}{" "}
                        <Link
                            href={localizePath(locale, `/circuits/${review.circuit.slug}`)}
                            className="font-medium text-accent hover:underline"
                        >
                            {review.circuit.name}
                        </Link>
                    </p>
                )}
            </figcaption>
        </figure>
    )
}
