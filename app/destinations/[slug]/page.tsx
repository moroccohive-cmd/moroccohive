import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CalendarRange, Clock, MapPin } from "lucide-react"
import prisma from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FAQItem } from "@/components/faq-item"
import {
    BreadcrumbSchema,
    DestinationSchema,
    FAQSchema,
} from "@/components/structured-data"
import {
    DESTINATIONS,
    getDestination,
    scoreCircuitForDestination,
} from "@/lib/destinations"
import { bestSummary, buildMetadata, formatPrice } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600

/** Pre-renders every destination at build time — they are a fixed set. */
export function generateStaticParams() {
    return DESTINATIONS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const destination = getDestination(slug)

    if (!destination) return { title: "Destination Not Found" }

    return buildMetadata({
        title: destination.headline,
        description: destination.metaDescription,
        path: `/destinations/${destination.slug}`,
        images: [destination.image],
    })
}

export default async function DestinationPage({ params }: Props) {
    const { slug } = await params
    const destination = getDestination(slug)
    if (!destination) notFound()

    // Pull every active circuit once, then rank locally. The catalogue is small
    // enough that this beats a per-keyword query, and it lets us weight matches.
    const allCircuits = await prisma.circuit.findMany({
        where: { active: true },
        select: {
            id: true,
            slug: true,
            name: true,
            tagline: true,
            description: true,
            category: true,
            duration: true,
            price: true,
            isFrom: true,
            images: true,
            itineraryGlance: true,
        },
    })

    const relatedCircuits = allCircuits
        .map((circuit) => ({
            circuit,
            score: scoreCircuitForDestination(
                {
                    name: circuit.name,
                    category: circuit.category,
                    tagline: circuit.tagline,
                    description: circuit.description,
                    itineraryGlance: circuit.itineraryGlance as string[],
                },
                destination,
            ),
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((entry) => entry.circuit)

    const nearby = destination.nearby
        .map((s) => getDestination(s))
        .filter((d): d is NonNullable<typeof d> => Boolean(d))

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <section className="relative h-[45vh] min-h-[320px] w-full">
                    <Image
                        src={destination.image}
                        alt={`${destination.name}, Morocco`}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <div className="mx-auto max-w-5xl">
                            {/* Visible breadcrumb, mirroring BreadcrumbSchema below. */}
                            <nav aria-label="Breadcrumb" className="mb-4">
                                <ol className="flex flex-wrap items-center gap-2 text-sm text-white/80">
                                    <li>
                                        <Link href="/" className="hover:text-white">Home</Link>
                                    </li>
                                    <li aria-hidden="true">/</li>
                                    <li>
                                        <Link href="/destinations" className="hover:text-white">
                                            Destinations
                                        </Link>
                                    </li>
                                    <li aria-hidden="true">/</li>
                                    <li aria-current="page" className="text-white">{destination.name}</li>
                                </ol>
                            </nav>
                            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                                {destination.headline}
                            </h1>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Answer-first summary */}
                    <p className="page-summary text-lg font-light leading-relaxed text-foreground">
                        {destination.summary}
                    </p>

                    {/* At-a-glance facts — scannable for both readers and extractors */}
                    <dl className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Region
                                </dt>
                                <dd className="mt-1 text-sm text-foreground">{destination.region}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Suggested stay
                                </dt>
                                <dd className="mt-1 text-sm text-foreground">{destination.suggestedStay}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CalendarRange className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Best time to visit
                                </dt>
                                <dd className="mt-1 text-sm text-foreground">{destination.bestTimeToVisit}</dd>
                            </div>
                        </div>
                    </dl>

                    {/* Body copy */}
                    <div className="mt-12 space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            About {destination.name}
                        </h2>
                        {destination.body.map((paragraph, i) => (
                            <p key={i} className="font-light leading-relaxed text-muted-foreground">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Highlights */}
                    <div className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                            What to see in {destination.name}
                        </h2>
                        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {destination.highlights.map((highlight) => (
                                <li
                                    key={highlight}
                                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground"
                                >
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Related tours */}
                    {relatedCircuits.length > 0 && (
                        <div className="mt-16">
                            <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                                Tours that include {destination.name}
                            </h2>
                            <p className="mb-6 font-light text-muted-foreground">
                                All private and fully customisable — durations and routes can be
                                adjusted.
                            </p>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {relatedCircuits.map((circuit) => {
                                    const images = circuit.images as string[]
                                    return (
                                        <Link
                                            key={circuit.id}
                                            href={`/circuits/${circuit.slug}`}
                                            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-md"
                                        >
                                            {images?.[0] && (
                                                <div className="relative h-40 w-full">
                                                    <Image
                                                        src={images[0]}
                                                        alt={circuit.name}
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-1 flex-col p-5">
                                                <h3 className="mb-2 font-bold text-foreground transition-colors group-hover:text-primary">
                                                    {circuit.name}
                                                </h3>
                                                <p className="mb-4 flex-1 text-sm font-light text-muted-foreground line-clamp-2">
                                                    {bestSummary(circuit.tagline, circuit.description)}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-sm">
                                                    <span className="text-muted-foreground">
                                                        {circuit.duration} days
                                                    </span>
                                                    <span className="font-semibold text-foreground">
                                                        {circuit.isFrom ? "from " : ""}$
                                                        {formatPrice(circuit.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* FAQs */}
                    <div className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                            {destination.name}: common questions
                        </h2>
                        <div className="space-y-4">
                            {destination.faqs.map((faq) => (
                                <FAQItem
                                    key={faq.question}
                                    question={faq.question}
                                    answer={faq.answer}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Nearby — internal linking between geographic pages */}
                    {nearby.length > 0 && (
                        <div className="mt-16">
                            <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                                Often combined with
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {nearby.map((place) => (
                                    <Link
                                        key={place.slug}
                                        href={`/destinations/${place.slug}`}
                                        className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                                    >
                                        {place.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-16 rounded-xl border border-border bg-card p-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Want {destination.name} in your itinerary?
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl font-light text-muted-foreground">
                            Tell us your dates and we&apos;ll build a private route around it — free
                            proposal within 48 hours, no obligation.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href="/plan-trip">
                                    Plan Your Trip <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href="/destinations">All Destinations</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <BreadcrumbSchema
                items={[
                    { name: "Destinations", path: "/destinations" },
                    { name: destination.name, path: `/destinations/${destination.slug}` },
                ]}
            />
            <DestinationSchema
                destination={destination}
                circuitCount={relatedCircuits.length}
            />
            <FAQSchema
                items={destination.faqs.map((f) => ({ q: f.question, a: f.answer }))}
            />

            <Footer />
        </div>
    )
}
