"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { Star, Plus, Trash, Search, ChevronDown } from "lucide-react"

interface Circuit {
    id: string
    name: string
    slug: string
}

interface Review {
    id: string
    circuitId: string
    authorName: string
    authorLocation: string | null
    authorImage: string | null
    rating: number
    text: string
    createdAt: string
    circuit: { id: string; name: string; slug: string }
}

const EMPTY_FORM = {
    circuitId: "",
    authorName: "",
    authorLocation: "",
    authorImage: "",
    rating: 5,
    text: "",
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [circuits, setCircuits] = useState<Circuit[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterCircuitId, setFilterCircuitId] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState(EMPTY_FORM)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchCircuits()
        fetchReviews()
    }, [])

    const fetchCircuits = async () => {
        try {
            const res = await fetch("/api/admin/circuits?limit=100", { credentials: "include" })
            if (res.ok) {
                const data = await res.json()
                setCircuits(data.circuits)
            }
        } catch (e) {
            console.error("Failed to fetch circuits:", e)
        }
    }

    const fetchReviews = async (circuitId?: string) => {
        setLoading(true)
        try {
            const url = circuitId
                ? `/api/admin/reviews?circuitId=${circuitId}`
                : "/api/admin/reviews"
            const res = await fetch(url, { credentials: "include" })
            if (res.ok) {
                setReviews(await res.json())
            }
        } catch (e) {
            console.error("Failed to fetch reviews:", e)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (circuitId: string) => {
        setFilterCircuitId(circuitId)
        fetchReviews(circuitId || undefined)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
            const res = await fetch("/api/admin/reviews", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Failed to add review")
                return
            }

            setFormData(EMPTY_FORM)
            setShowForm(false)
            fetchReviews(filterCircuitId || undefined)
        } catch (e) {
            setError("Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this review?")) return

        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "DELETE",
                credentials: "include",
            })
            if (res.ok) {
                setReviews((prev) => prev.filter((r) => r.id !== id))
            }
        } catch (e) {
            console.error("Failed to delete review:", e)
        }
    }

    const filteredReviews = reviews.filter((r) => {
        const q = searchQuery.toLowerCase()
        return (
            r.authorName.toLowerCase().includes(q) ||
            r.text.toLowerCase().includes(q) ||
            r.circuit.name.toLowerCase().includes(q)
        )
    })

    const reviewCountByCircuit = (circuitId: string) =>
        reviews.filter((r) => r.circuitId === circuitId).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage customer reviews for each tour (max 3 per tour)
                    </p>
                </div>
                <Button
                    onClick={() => { setShowForm(!showForm); setError(null) }}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Review
                </Button>
            </div>

            {/* Add Review Form */}
            {showForm && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">New Review</h2>
                    {error && (
                        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded px-4 py-3 text-sm mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tour */}
                            <div className="space-y-1">
                                <Label>Tour *</Label>
                                <div className="relative">
                                    <select
                                        value={formData.circuitId}
                                        onChange={(e) => setFormData({ ...formData, circuitId: e.target.value })}
                                        required
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">Select a tour…</option>
                                        {circuits.map((c) => {
                                            const count = reviewCountByCircuit(c.id)
                                            return (
                                                <option key={c.id} value={c.id} disabled={count >= 3}>
                                                    {c.name} {count >= 3 ? "(3/3 — full)" : `(${count}/3)`}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="space-y-1">
                                <Label>Rating *</Label>
                                <div className="flex items-center gap-1 h-10">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-6 h-6 transition-colors ${
                                                    star <= formData.rating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-muted-foreground"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Author Name */}
                            <div className="space-y-1">
                                <Label>Author Name *</Label>
                                <Input
                                    value={formData.authorName}
                                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                    placeholder="e.g. Sarah M."
                                    maxLength={80}
                                    required
                                />
                            </div>

                            {/* Author Location */}
                            <div className="space-y-1">
                                <Label>Author Location</Label>
                                <Input
                                    value={formData.authorLocation}
                                    onChange={(e) => setFormData({ ...formData, authorLocation: e.target.value })}
                                    placeholder="e.g. United States"
                                    maxLength={80}
                                />
                            </div>

                            {/* Author Image Upload */}
                            <div className="space-y-1 md:col-span-2">
                                <Label>Author Photo (optional)</Label>
                                <ImageUpload
                                    max={1}
                                    existingImages={formData.authorImage ? [formData.authorImage] : []}
                                    onImagesAdd={(urls) => setFormData({ ...formData, authorImage: urls[0] ?? "" })}
                                    onRemoveImage={() => setFormData({ ...formData, authorImage: "" })}
                                />
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="space-y-1">
                            <Label>Review Text *</Label>
                            <Textarea
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                placeholder="Write the customer review here…"
                                rows={4}
                                maxLength={1000}
                                required
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {formData.text.length}/1000
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { setShowForm(false); setError(null); setFormData(EMPTY_FORM) }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving…" : "Save Review"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search reviews…"
                        className="pl-9"
                    />
                </div>
                <div className="relative sm:w-64">
                    <select
                        value={filterCircuitId}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All tours</option>
                        {circuits.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse h-28" />
                    ))}
                </div>
            ) : filteredReviews.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No reviews yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Click "Add Review" to add the first one.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {review.authorImage ? (
                                    <img
                                        src={review.authorImage}
                                        alt={review.authorName}
                                        className="w-12 h-12 rounded-full object-cover border border-border"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {review.authorName[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="font-semibold text-foreground">{review.authorName}</span>
                                    {review.authorLocation && (
                                        <span className="text-xs text-muted-foreground">· {review.authorLocation}</span>
                                    )}
                                    <span className="text-xs text-muted-foreground">·</span>
                                    <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
                                        {review.circuit.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5 mb-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                    {review.text}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            {/* Delete */}
                            <button
                                onClick={() => handleDelete(review.id)}
                                className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                                title="Delete review"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
