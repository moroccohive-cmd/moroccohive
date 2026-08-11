"use client"

import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { ReviewAvatar } from "@/components/review-avatar"
import { ReviewCard, TrustStars } from "@/components/review-card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { PublicReview } from "@/lib/site-content"

interface TestimonialsSectionProps {
    reviews: PublicReview[]
    /** Attribution line under the heading. Pass an empty string to hide it. */
    note?: string
}

const DEFAULT_NOTE =
    "Excerpts from public Trustpilot reviews of tours our guides led, quoted with permission."

/** Matches the `gap-5` between cards, so one click advances by exactly one card. */
const CARD_GAP = 20

/** How long each card sits before the rail advances on its own. */
const AUTOPLAY_MS = 5000

export function TestimonialsSection({ reviews, note = DEFAULT_NOTE }: TestimonialsSectionProps) {
    const railRef = useRef<HTMLDivElement>(null)
    const [atStart, setAtStart] = useState(true)
    const [atEnd, setAtEnd] = useState(true)
    const [openReview, setOpenReview] = useState<PublicReview | null>(null)
    const [interacting, setInteracting] = useState(false)

    // Read inside the autoplay tick so pausing never restarts the timer.
    const pausedRef = useRef(false)
    useEffect(() => {
        pausedRef.current = interacting || openReview !== null
    }, [interacting, openReview])

    const syncEdges = useCallback(() => {
        const rail = railRef.current
        if (!rail) return

        const max = rail.scrollWidth - rail.clientWidth
        setAtStart(rail.scrollLeft <= 1)
        setAtEnd(rail.scrollLeft >= max - 1)
    }, [])

    useEffect(() => {
        const rail = railRef.current
        if (!rail) return

        syncEdges()
        rail.addEventListener("scroll", syncEdges, { passive: true })

        // Card widths and the bleed padding both change with the viewport, and
        // the section starts out with `content-visibility: auto` skipping layout.
        const observer = new ResizeObserver(syncEdges)
        observer.observe(rail)
        if (rail.firstElementChild) observer.observe(rail.firstElementChild)

        return () => {
            rail.removeEventListener("scroll", syncEdges)
            observer.disconnect()
        }
    }, [syncEdges])

    const scrollByCard = useCallback((direction: 1 | -1) => {
        const rail = railRef.current
        if (!rail) return

        const card = rail.querySelector("li")
        const step = card ? card.getBoundingClientRect().width + CARD_GAP : rail.clientWidth * 0.8
        rail.scrollBy({ left: direction * step, behavior: "smooth" })
    }, [])

    // Autoplay: advance a card at a time, wrapping back to the first once the
    // rail bottoms out. Idle while hovered, focused, off-screen or backgrounded.
    useEffect(() => {
        const rail = railRef.current
        if (!rail || reviews.length < 2) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        let inView = true
        const observer = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting
            },
            { threshold: 0.25 }
        )
        observer.observe(rail)

        const timer = window.setInterval(() => {
            if (pausedRef.current || !inView || document.hidden) return

            const max = rail.scrollWidth - rail.clientWidth
            if (max <= 0) return

            if (rail.scrollLeft >= max - 1) rail.scrollTo({ left: 0, behavior: "smooth" })
            else scrollByCard(1)
        }, AUTOPLAY_MS)

        return () => {
            window.clearInterval(timer)
            observer.disconnect()
        }
    }, [reviews.length, scrollByCard])

    if (reviews.length === 0) return null

    // Nothing to page through when every card already fits.
    const scrollable = !(atStart && atEnd)

    return (
        <section
            id="testimonials"
            className="bg-background py-24 cv-auto"
            onMouseEnter={() => setInteracting(true)}
            onMouseLeave={() => setInteracting(false)}
            onFocus={() => setInteracting(true)}
            onBlur={() => setInteracting(false)}
            onTouchStart={() => setInteracting(true)}
            onTouchEnd={() => setInteracting(false)}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-3">
                        <span className="text-xs font-medium uppercase tracking-widest text-accent">
                            Guest Stories
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            What Our Travelers Say
                        </h2>
                        {note ? (
                            <p className="max-w-2xl text-sm text-muted-foreground">{note}</p>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-6">
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

                        {scrollable ? (
                            <div className="hidden items-center gap-2 sm:flex">
                                <button
                                    type="button"
                                    onClick={() => scrollByCard(-1)}
                                    disabled={atStart}
                                    aria-label="Previous reviews"
                                    aria-controls="testimonials-rail"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollByCard(1)}
                                    disabled={atEnd}
                                    aria-label="Next reviews"
                                    aria-controls="testimonials-rail"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
                                >
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Rail bleeds to the right edge so the next card is visibly cut off */}
            <div
                ref={railRef}
                id="testimonials-rail"
                role="group"
                aria-label="Traveler reviews"
                tabIndex={0}
                className="overflow-x-auto pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                <ul className="mx-auto flex w-max max-w-none list-none gap-5 px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
                    {reviews.map((review) => (
                        <li key={review.id} className="w-[320px] flex-shrink-0 sm:w-[340px]">
                            <ReviewCard
                                review={review}
                                clamp
                                onReadMore={() => setOpenReview(review)}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            <Dialog open={openReview !== null} onOpenChange={(open) => !open && setOpenReview(null)}>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
                    {openReview && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                    <ReviewAvatar
                                        src={openReview.authorImage}
                                        name={openReview.authorName}
                                    />
                                    <span>{openReview.authorName}</span>
                                </DialogTitle>
                                <DialogDescription>
                                    {[
                                        openReview.country?.trim() ||
                                            openReview.authorLocation?.trim(),
                                        openReview.displayDate?.trim() ||
                                            new Date(openReview.createdAt).toLocaleDateString(
                                                "en-US",
                                                { month: "long", year: "numeric" }
                                            ),
                                        openReview.source,
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </DialogDescription>
                            </DialogHeader>

                            <TrustStars rating={openReview.rating} size={18} />

                            <blockquote className="whitespace-pre-wrap text-[15px] leading-[1.75] text-foreground">
                                {openReview.text}
                            </blockquote>

                            {openReview.circuit && (
                                <p className="text-xs text-muted-foreground">
                                    Tour:{" "}
                                    <Link
                                        href={`/circuits/${openReview.circuit.slug}`}
                                        className="font-medium text-accent hover:underline"
                                    >
                                        {openReview.circuit.name}
                                    </Link>
                                </p>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    )
}
