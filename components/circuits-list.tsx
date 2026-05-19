"use client"

import { useMemo, useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, X, Check, ChevronDown } from "lucide-react"
import { FavoriteButton } from "@/components/favorite-button"
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

type DurationFilter = "all" | "5" | "6-7" | "8-9" | "10-13"
type TourTypeFilter = "all" | "Luxury & Grand Tours" | "Desert & Sahara" | "Imperial Cities" | "Honeymoon & Couples" | "Family with Kids"
type PriceFilter = "all" | "under-1500" | "1500-2000" | "2000-2500" | "2500+"
type SortOption = "default" | "price-asc" | "price-desc" | "duration-asc" | "duration-desc"

const DURATION_OPTIONS: { value: DurationFilter; label: string }[] = [
    { value: "all", label: "All Durations" },
    { value: "5", label: "5 Days" },
    { value: "6-7", label: "6-7 Days" },
    { value: "8-9", label: "8-9 Days" },
    { value: "10-13", label: "10-13 Days" },
]

const TOUR_TYPE_OPTIONS: { value: TourTypeFilter; label: string }[] = [
    { value: "all", label: "All Types" },
    { value: "Luxury & Grand Tours", label: "Luxury & Grand Tours" },
    { value: "Desert & Sahara", label: "Desert & Sahara" },
    { value: "Imperial Cities", label: "Imperial Cities" },
    { value: "Honeymoon & Couples", label: "Honeymoon & Couples" },
    { value: "Family with Kids", label: "Family with Kids" },
]

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
    { value: "all", label: "All Prices" },
    { value: "under-1500", label: "Under $1,500" },
    { value: "1500-2000", label: "$1,500 – $2,000" },
    { value: "2000-2500", label: "$2,000 – $2,500" },
    { value: "2500+", label: "$2,500+" },
]

const SORT_LABELS: Record<SortOption, string> = {
    default: "Featured",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    "duration-asc": "Duration: Short to Long",
    "duration-desc": "Duration: Long to Short",
}

function matchesDuration(days: number, filter: DurationFilter): boolean {
    if (filter === "all") return true
    if (filter === "5") return days === 5
    if (filter === "6-7") return days >= 6 && days <= 7
    if (filter === "8-9") return days >= 8 && days <= 9
    if (filter === "10-13") return days >= 10 && days <= 13
    return true
}

function matchesTourType(category: string, filter: TourTypeFilter): boolean {
    if (filter === "all") return true
    return category.toLowerCase() === filter.toLowerCase()
}

function matchesPrice(price: number, filter: PriceFilter): boolean {
    if (filter === "all") return true
    if (filter === "under-1500") return price < 1500
    if (filter === "1500-2000") return price >= 1500 && price <= 2000
    if (filter === "2000-2500") return price > 2000 && price <= 2500
    if (filter === "2500+") return price > 2500
    return true
}


function FilterCheckbox<T extends string>({
    options,
    value,
    onChange,
}: {
    options: { value: T; label: string }[]
    value: T
    onChange: (v: T) => void
}) {
    return (
        <div className="flex flex-col gap-2">
            {options.map((opt) => (
                <label
                    key={opt.value}
                    className="flex items-start gap-2.5 cursor-pointer group"
                    onClick={() => onChange(opt.value)}
                >
                    <div
                        className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                            value === opt.value
                                ? "bg-orange-500 border-orange-500"
                                : "border-gray-300 bg-white group-hover:border-orange-400"
                        }`}
                    >
                        {value === opt.value && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm leading-snug ${value === opt.value ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                        {opt.label}
                    </span>
                </label>
            ))}
        </div>
    )
}

function CircuitsListContent({ circuits }: { circuits: Circuit[] }) {
    const [duration, setDuration] = useState<DurationFilter>("all")
    const [tourType, setTourType] = useState<TourTypeFilter>("all")
    const [price, setPrice] = useState<PriceFilter>("all")
    const [sort, setSort] = useState<SortOption>("default")

    const filtered = useMemo(() => {
        const list = circuits.filter((c) => {
            if (!matchesDuration(c.duration, duration)) return false
            if (!matchesTourType(c.category, tourType)) return false
            if (!matchesPrice(c.price, price)) return false
            return true
        })

        const sorted = [...list]
        switch (sort) {
            case "price-asc": sorted.sort((a, b) => a.price - b.price); break
            case "price-desc": sorted.sort((a, b) => b.price - a.price); break
            case "duration-asc": sorted.sort((a, b) => a.duration - b.duration); break
            case "duration-desc": sorted.sort((a, b) => b.duration - a.duration); break
        }
        return sorted
    }, [circuits, duration, tourType, price, sort])

    const hasActiveFilters =
        duration !== "all" || tourType !== "all" || price !== "all" || sort !== "default"

    function resetFilters() {
        setDuration("all")
        setTourType("all")
        setPrice("all")
        setSort("default")
    }

    return (
        <>
            {/* ── Filter Panel ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* 1. Trip Duration */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                            Trip Duration
                        </p>
                        <FilterCheckbox
                            options={DURATION_OPTIONS}
                            value={duration}
                            onChange={setDuration}
                        />
                    </div>

                    {/* 2. Tour Type */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                            Tour Type
                        </p>
                        <FilterCheckbox
                            options={TOUR_TYPE_OPTIONS}
                            value={tourType}
                            onChange={setTourType}
                        />
                    </div>

                    {/* 3. Price Range */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                            Price Range
                        </p>
                        <FilterCheckbox
                            options={PRICE_OPTIONS}
                            value={price}
                            onChange={setPrice}
                        />
                    </div>

                </div>

                {/* Result count + sort + clear */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-100">
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
                    <div className="flex items-center gap-3">
                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortOption)}
                                aria-label="Sort tours"
                                className="h-9 rounded-lg border border-gray-200 bg-gray-50/60 px-3 pr-8 text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all cursor-pointer"
                            >
                                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                                    <option key={key} value={key}>{SORT_LABELS[key]}</option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
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
                                            alt={`${circuit.name} – ${circuit.duration}-day Morocco tour`}
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
                                            <div className="flex flex-col items-end">
                                                <p className="text-xl text-foreground font-bold">
                                                    ${circuit.price}{" "}
                                                    <span className="text-muted-foreground text-sm font-medium">/ person</span>
                                                </p>
                                                {circuit.originalPrice != null && (
                                                    <span className="text-sm text-muted-foreground line-through">${circuit.originalPrice}</span>
                                                )}
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

export function CircuitsList({ circuits }: { circuits: Circuit[] }) {
    return (
        <Suspense fallback={<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 h-64 animate-pulse" />}>
            <CircuitsListContent circuits={circuits} />
        </Suspense>
    )
}
