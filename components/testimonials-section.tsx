import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ReviewCard } from "@/components/review-card"
import type { PublicReview } from "@/lib/site-content"

interface TestimonialsSectionProps {
    reviews: PublicReview[]
    /** Attribution line under the rail. Pass an empty string to hide it. */
    note?: string
}

const DEFAULT_NOTE =
    "Excerpts from public Trustpilot reviews of tours our guides led, quoted with permission."

export function TestimonialsSection({ reviews, note = DEFAULT_NOTE }: TestimonialsSectionProps) {
    if (reviews.length === 0) return null

    return (
        <section id="testimonials" className="bg-background py-24 cv-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-3">
                        <span className="text-xs font-medium uppercase tracking-widest text-accent">
                            Guest Stories
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            What Our Travelers Say
                        </h2>
                    </div>
                    <Link
                        href="/reviews"
                        className="group flex items-center text-sm font-medium text-accent hover:text-accent/90"
                        aria-label="Read all traveler reviews"
                    >
                        Read All Reviews
                        <ArrowRight
                            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </Link>
                </div>
            </div>

            {/* Rail bleeds to the right edge so the next card is visibly cut off */}
            <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <ul className="mx-auto flex w-max max-w-none list-none gap-5 px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
                    {reviews.map((review) => (
                        <li key={review.id} className="w-[320px] flex-shrink-0 sm:w-[340px]">
                            <ReviewCard review={review} clamp />
                        </li>
                    ))}
                </ul>
            </div>

            {note ? (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="mt-8 text-sm text-muted-foreground">{note}</p>
                </div>
            ) : null}
        </section>
    )
}
