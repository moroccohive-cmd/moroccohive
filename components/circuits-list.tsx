"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, X } from "lucide-react"
import { FavoriteButton } from "@/components/favorite-button"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Circuit {
    id: string
    slug: string
    name: string
    tagline: string | null
    description: string
    duration: number
    price: number
    originalPrice: number | null
    isFrom: boolean | null
    images: string[]
    highlights: string[]
    category: string
}

type DurationBucket = "all" | "short" | "medium" | "long"
type SortOption = "default" | "price-asc" | "price-desc" | "duration-asc" | "duration-desc"

const DURATION_LABELS: Record<DurationBucket, string> = {
    all: "Any duration",
    short: "1-3 days",
    medium: "4-7 days",
    long: "8+ days",
}

const SORT_LABELS: Record<SortOption, string> = {
    default: "Featured",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    "duration-asc": "Duration: Short to Long",
    "duration-desc": "Duration: Long to Short",
}

function matchesDuration(days: number, bucket: DurationBucket): boolean {
    if (bucket === "all") return true
    if (bucket === "short") return days <= 3
    if (bucket === "medium") return days >= 4 && days <= 7
    return days >= 8
}

export function CircuitsList({ circuits }: { circuits: Circuit[] }) {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState<string>("all")
    const [duration, setDuration] = useState<DurationBucket>("all")
    const [sort, setSort] = useState<SortOption>("default")

    const categories = useMemo(() => {
        const set = new Set<string>()
        for (const c of circuits) set.add(c.category)
        return Array.from(set).sort((a, b) => a.localeCompare(b))
    }, [circuits])

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase()
        const list = circuits.filter((c) => {
            if (category !== "all" && c.category !== category) return false
            if (!matchesDuration(c.duration, duration)) return false
            if (term) {
                const haystack = `${c.name} ${c.tagline ?? ""} ${c.description} ${c.category}`.toLowerCase()
                if (!haystack.includes(term)) return false
            }
            return true
        })

        const sorted = [...list]
        switch (sort) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price)
                break
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price)
                break
            case "duration-asc":
                sorted.sort((a, b) => a.duration - b.duration)
                break
            case "duration-desc":
                sorted.sort((a, b) => b.duration - a.duration)
                break
        }
        return sorted
    }, [circuits, search, category, duration, sort])

    const hasActiveFilters =
        search.trim() !== "" || category !== "all" || duration !== "all" || sort !== "default"

    function resetFilters() {
        setSearch("")
        setCategory("all")
        setDuration("all")
        setSort("default")
    }

    return (
        <>
            {/* ── Filter Panel ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-10 space-y-6">

                {/* Search */}
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Search</p>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                        <Input
                            type="search"
                            placeholder="Search tours..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-11 h-11 rounded-xl border-gray-200 bg-gray-50/60 focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:border-orange-400 text-sm placeholder:text-gray-400 transition-all"
                            aria-label="Search tours"
                        />
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Category */}
                <div className="space-y-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Category</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setCategory("all")}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                                category === "all"
                                    ? "bg-orange-500 text-white shadow-sm"
                                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500"
                            }`}
                        >
                            All
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setCategory(c)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                                    category === c
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Duration + Sort */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="space-y-2.5 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Duration</p>
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(DURATION_LABELS) as DurationBucket[]).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setDuration(key)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                                        duration === key
                                            ? "bg-orange-500 text-white shadow-sm"
                                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500"
                                    }`}
                                >
                                    {DURATION_LABELS[key]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2.5 lg:min-w-[220px]">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Sort by</p>
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortOption)}
                                aria-label="Sort tours"
                                className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/60 px-4 pr-10 text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all cursor-pointer"
                            >
                                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                                    <option key={key} value={key}>
                                        {SORT_LABELS[key]}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result count + clear */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="block w-[3px] h-5 rounded-full bg-orange-400 flex-shrink-0" />
                        <p className="text-sm text-gray-500">
                            Showing{" "}
                            <span className="font-semibold text-gray-800">{filtered.length}</span>
                            {" "}of{" "}
                            <span className="font-semibold text-gray-800">{circuits.length}</span>{" "}
                            tours
                        </p>
                    </div>
                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 gap-1.5"
                        >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                            Clear filters
                        </Button>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-md shadow-sm border border-gray-100">
                    <p className="text-gray-400">
                        {circuits.length === 0
                            ? "No journeys available at the moment."
                            : "No tours match your filters."}
                    </p>
                    {circuits.length > 0 && hasActiveFilters && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="mt-4"
                        >
                            Clear filters
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filtered.map((circuit) => (
                        <Link
                            key={circuit.id}
                            href={`/circuits/${circuit.slug}`}
                            className="group block"
                            aria-label={`View tour: ${circuit.name} - ${circuit.duration} days from $${circuit.price}`}
                        >
                            <article className="bg-white rounded-md overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col transform hover:-translate-y-1">
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    {circuit.images[0] ? (
                                        <Image
                                            src={circuit.images[0]}
                                            alt={`${circuit.name} tour image`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                                            <span className="text-sm">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 z-10">
                                        <FavoriteButton circuitId={circuit.id} />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="inline-block px-3 py-1 rounded-md bg-white/95 text-xs font-semibold text-gray-700 uppercase tracking-wide shadow-sm border border-gray-100">
                                            {circuit.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                                            <span>{circuit.duration} Days</span>
                                            <div className="flex flex-col">
                                                <div className="flex flex-col items-baseline">
                                                    <p className="text-xl text-foreground font-bold">${circuit.price} <span className="text-muted-foreground text-sm font-medium">/ person</span></p>
                                                    {circuit.originalPrice != null && (
                                                        <span className="text-sm text-muted-foreground line-through">${circuit.originalPrice}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors leading-tight">
                                            {circuit.name}
                                        </h2>
                                    </div>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1 font-light">
                                        {circuit.description}
                                    </p>

                                    <div className="flex items-center text-gray-900 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                                        View Itinerary <ArrowRight className="ml-2 h-4 w-4 text-orange-400" aria-hidden="true" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )
}
