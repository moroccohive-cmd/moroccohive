import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, X, Plus, Info, Star } from "lucide-react"
import prisma from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FavoriteButton } from "@/components/favorite-button"
import { BookingFormSidebar } from "./BookingFormSidebar"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const circuit = await prisma.circuit.findUnique({
        where: { slug },
        select: { name: true, description: true, tagline: true, images: true },
    })

    if (!circuit) return { title: "Circuit Not Found" }

    const description = circuit.tagline || (circuit.description?.slice(0, 155) + "...") || ""

    return {
        title: `${circuit.name} | MoroccoHive`,
        description,
        openGraph: {
            title: circuit.name,
            description,
            images: (circuit.images as string[])?.[0] ? [{ url: (circuit.images as string[])[0] }] : [],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: circuit.name,
            description,
            images: (circuit.images as string[])?.[0] ? [(circuit.images as string[])[0]] : [],
        },
    }
}

function renderRichText(text: string): string {
    if (!text) return ""
    return text
        .replace(/\[CTA\]\s*title:\s*([\s\S]*?)\s*description:\s*([\s\S]*?)\s*button_text:\s*([\s\S]*?)\s*button_link:\s*([\s\S]*?)\s*\[\/CTA\]/g,
            (_m, title, desc, btnText, btnLink) =>
                `<div class='not-prose bg-muted/30 border border-border rounded-lg p-8 my-8'><h3 class='text-2xl font-bold mb-3 text-foreground'>${title.trim()}</h3><p class='text-muted-foreground mb-6 text-lg'>${desc.trim()}</p><a href='${btnLink.trim()}' class='inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-md transition-colors text-lg no-underline'>${btnText.trim()}</a></div>`
        )
        .replace(/^### (.*?)$/gm, "<h3 class='text-lg font-bold mt-6 mb-4'>$1</h3>")
        .replace(/^## (.*?)$/gm, "<h2 class='text-xl font-bold mt-8 mb-4'>$1</h2>")
        .replace(/^# (.*?)$/gm, "<h1 class='text-2xl font-bold mt-10 mb-6'>$1</h1>")
        .replace(/!\[(.*?)\]\((.*?)\)/g, "<img src='$2' alt='$1' class='rounded-lg my-2 max-w-full' />")
        .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
        .replace(/__(.*?)__/g, "<u class='underline'>$1</u>")
        .replace(/~~(.*?)~~/g, "<s class='line-through'>$1</s>")
        .replace(/`(.*?)`/g, "<code class='bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>")
        .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-primary underline hover:text-primary/80' target='_blank' rel='noopener noreferrer'>$1</a>")
        .replace(/^> (.*?)$/gm, "<blockquote class='border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4'>$1</blockquote>")
        .replace(/\n- /g, "<br />• ")
        .replace(/\n\d+\. /g, "<br />1. ")
        .replace(/\n/g, "<br />")
}

export default async function CircuitDetailPage({ params }: Props) {
    const { slug } = await params

    const circuit = await prisma.circuit.findUnique({ where: { slug } })
    if (!circuit) notFound()

    const reviewsRaw = await (prisma as any).review.findMany({
        where: { circuitId: circuit.id },
        orderBy: { createdAt: "desc" },
        take: 3,
    })

    const reviews = reviewsRaw.map((r: any) => ({
        ...r,
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    }))

    const images = circuit.images as string[]
    const highlights = circuit.highlights as string[]
    const included = circuit.included as string[]
    const excluded = circuit.excluded as string[]
    const optional = circuit.optional as string[]
    const itineraryGlance = circuit.itineraryGlance as string[]

    const avgRating = reviews.length
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent selection:text-accent-foreground">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <section className="relative h-[65vh] w-full">
                    {images[0] ? (
                        <Image
                            src={images[0]}
                            alt={`${circuit.name} tour hero image`}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                            fetchPriority="high"
                        />
                    ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <div className="max-w-7xl mx-auto">
                            <Link
                                href="/circuits"
                                className="inline-flex items-center text-white/95 hover:text-white mb-6 transition-colors text-sm font-medium bg-white/10 px-4 py-2 rounded-md border border-white/20 hover:bg-white/20"
                                aria-label="Back to all trips"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" /> All Trips
                            </Link>
                            <div className="space-y-3">
                                <span className="inline-block px-4 py-1.5 rounded-md bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-semibold uppercase tracking-wider">
                                    {circuit.category}
                                </span>
                                <div className="flex items-start justify-between">
                                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                                        {circuit.name}
                                    </h1>
                                    <FavoriteButton circuitId={circuit.id} className="mt-2" />
                                </div>
                                {circuit.tagline && (
                                    <p className="text-xl text-white/90 max-w-2xl font-light leading-relaxed">
                                        {circuit.tagline}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Main content — server-rendered, fully indexable */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* Overview */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h2 className="text-2xl font-semibold text-foreground mb-6">The Experience</h2>
                                <p className="text-muted-foreground leading-loose text-lg font-light">
                                    {circuit.description}
                                </p>
                            </div>

                            {/* Highlights */}
                            {highlights.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Highlights</h2>
                                    <ul className="space-y-4">
                                        {highlights.map((item, i) => (
                                            <li key={i} className="flex items-start text-gray-500 text-sm">
                                                <Check className="w-4 h-4 mr-3 mt-0.5 text-destructive flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Inclusions / Exclusions */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-secondary" /> Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {included.map((item, i) => (
                                                <li key={i} className="flex items-start text-gray-600 text-sm font-medium">
                                                    <Check className="w-4 h-4 mr-3 mt-0.5 text-secondary flex-shrink-0" />
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-destructive/30" /> Not Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {excluded.map((item, i) => (
                                                <li key={i} className="flex items-start text-gray-500 text-sm">
                                                    <X className="w-4 h-4 mr-3 mt-0.5 text-destructive flex-shrink-0" />
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Optional Activities */}
                            {optional.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Optional</h2>
                                    <ul className="space-y-4">
                                        {optional.map((item, i) => (
                                            <li key={i} className="flex items-start text-gray-500 text-sm">
                                                <Plus className="w-4 h-4 mr-3 mt-0.5 text-primary flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Itinerary */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                {itineraryGlance.length > 0 && (
                                    <>
                                        <h2 className="text-2xl font-semibold text-foreground mb-8">Itinerary Overview</h2>
                                        <div className="space-y-0 relative">
                                            {itineraryGlance.map((day, i) => (
                                                <div key={i} className="relative pl-12 pb-8 last:pb-0 group">
                                                    <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center z-10 group-hover:border-accent/10 transition-colors">
                                                        <div className="w-3 h-3 rounded-full bg-primary/40" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Day {i + 1}</span>
                                                        <h3 className="text-lg font-medium text-foreground">{day}</h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="mt-10 pt-8 border-t border-border">
                                    {circuit.mapUrl && (
                                        <div className="relative w-full">
                                            <Image src={circuit.mapUrl} alt="Map" width={400} height={400} className="object-contain rounded-lg mb-6" />
                                        </div>
                                    )}
                                    {circuit.itineraryDetail && (
                                        <>
                                            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                                <Info className="w-5 h-5 text-accent" />
                                                Detailed Itinerary
                                            </h3>
                                            <div
                                                className="prose prose-gray max-w-none text-muted-foreground leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: renderRichText(circuit.itineraryDetail) }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Additional Info */}
                            {circuit.additionalInfo && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Important Notes</h2>
                                    <div
                                        className="prose prose-gray max-w-none text-muted-foreground leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: renderRichText(circuit.additionalInfo) }}
                                    />
                                </div>
                            )}

                            {/* Reviews */}
                            {reviews.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-2">Traveler Reviews</h2>
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`w-4 h-4 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {avgRating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                                        </span>
                                    </div>
                                    <div className="space-y-6">
                                        {reviews.map((review: any) => (
                                            <div key={review.id} className="flex items-start gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
                                                <div className="flex-shrink-0">
                                                    {review.authorImage ? (
                                                        <img
                                                            src={review.authorImage}
                                                            alt={review.authorName}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                            {review.authorName[0]?.toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="font-semibold text-foreground">{review.authorName}</span>
                                                        {review.authorLocation && (
                                                            <span className="text-sm text-muted-foreground">· {review.authorLocation}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-0.5 mb-3">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                                                            />
                                                        ))}
                                                        <span className="text-xs text-muted-foreground ml-1">
                                                            {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">"{review.text}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar — client component for booking interactivity only */}
                        <BookingFormSidebar
                            circuit={{
                                id: circuit.id,
                                slug: circuit.slug,
                                name: circuit.name,
                                price: circuit.price,
                                originalPrice: circuit.originalPrice ?? undefined,
                                isFrom: circuit.isFrom ?? undefined,
                                duration: circuit.duration,
                            }}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
