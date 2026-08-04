"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/image-upload"
import { Star, Plus, Trash, Search, ChevronDown, Pencil, Home } from "lucide-react"

interface Circuit {
    id: string
    name: string
    slug: string
}

interface Review {
    id: string
    circuitId: string | null
    authorName: string
    authorLocation: string | null
    authorImage: string | null
    rating: number
    text: string
    country: string | null
    displayDate: string | null
    source: string | null
    showOnHome: boolean
    order: number
    createdAt: string
    circuit: { id: string; name: string; slug: string } | null
}

const EMPTY_FORM = {
    circuitId: "",
    authorName: "",
    authorLocation: "",
    authorImage: "",
    rating: 5,
    text: "",
    country: "",
    displayDate: "",
    source: "",
    showOnHome: false,
    order: 0,
}

type FormState = typeof EMPTY_FORM

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [circuits, setCircuits] = useState<Circuit[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterCircuitId, setFilterCircuitId] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<FormState>(EMPTY_FORM)
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

    const openCreateForm = () => {
        setEditingId(null)
        setFormData(EMPTY_FORM)
        setError(null)
        setShowForm(true)
    }

    const openEditForm = (review: Review) => {
        setEditingId(review.id)
        setFormData({
            circuitId: review.circuitId ?? "",
            authorName: review.authorName,
            authorLocation: review.authorLocation ?? "",
            authorImage: review.authorImage ?? "",
            rating: review.rating,
            text: review.text,
            country: review.country ?? "",
            displayDate: review.displayDate ?? "",
            source: review.source ?? "",
            showOnHome: review.showOnHome,
            order: review.order,
        })
        setError(null)
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingId(null)
        setFormData(EMPTY_FORM)
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
            const res = await fetch(
                editingId ? `/api/admin/reviews/${editingId}` : "/api/admin/reviews",
                {
                    method: editingId ? "PATCH" : "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Failed to save review")
                return
            }

            closeForm()
            fetchReviews(filterCircuitId || undefined)
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const patchReview = async (id: string, patch: Partial<Review>) => {
        // Optimistic - roll back if the request fails
        const previous = reviews
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            })
            if (!res.ok) setReviews(previous)
        } catch {
            setReviews(previous)
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
            (r.circuit?.name ?? "").toLowerCase().includes(q)
        )
    })

    const reviewCountByCircuit = (circuitId: string) =>
        reviews.filter((r) => r.circuitId === circuitId).length

    const homeCount = reviews.filter((r) => r.showOnHome).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage traveler reviews - {homeCount} currently featured on the homepage
                    </p>
                </div>
                <Button onClick={openCreateForm} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Review
                </Button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingId ? "Edit Review" : "New Review"}
                    </h2>
                    {error && (
                        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded px-4 py-3 text-sm mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tour */}
                            <div className="space-y-1">
                                <Label>Tour</Label>
                                <div className="relative">
                                    <select
                                        value={formData.circuitId}
                                        onChange={(e) => setFormData({ ...formData, circuitId: e.target.value })}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">No tour - general review</option>
                                        {circuits.map((c) => {
                                            const count = reviewCountByCircuit(c.id)
                                            const isCurrent = editingId !== null && formData.circuitId === c.id
                                            return (
                                                <option
                                                    key={c.id}
                                                    value={c.id}
                                                    disabled={count >= 3 && !isCurrent}
                                                >
                                                    {c.name} {count >= 3 ? "(3/3 - full)" : `(${count}/3)`}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Tour reviews show on that tour&apos;s page (max 3). General reviews only
                                    show on the reviews page and homepage.
                                </p>
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
                                            aria-label={`Set rating to ${star}`}
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
                                    onChange={(e) =>
                                        setFormData({ ...formData, authorLocation: e.target.value })
                                    }
                                    placeholder="e.g. United States"
                                    maxLength={80}
                                />
                            </div>

                            {/* Country code */}
                            <div className="space-y-1">
                                <Label>Country code</Label>
                                <Input
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    placeholder="e.g. US"
                                    maxLength={8}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Shown publicly as &quot;US · May 2025&quot;.
                                </p>
                            </div>

                            {/* Display date */}
                            <div className="space-y-1">
                                <Label>Display date</Label>
                                <Input
                                    value={formData.displayDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, displayDate: e.target.value })
                                    }
                                    placeholder="e.g. May 2025"
                                    maxLength={40}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to use the date the review was added.
                                </p>
                            </div>

                            {/* Source */}
                            <div className="space-y-1">
                                <Label>Source</Label>
                                <Input
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                    placeholder="e.g. Trustpilot"
                                    maxLength={40}
                                />
                            </div>

                            {/* Sort order */}
                            <div className="space-y-1">
                                <Label>Sort order</Label>
                                <Input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) =>
                                        setFormData({ ...formData, order: Number(e.target.value) })
                                    }
                                    placeholder="0"
                                />
                                <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
                            </div>

                            {/* Author Image Upload */}
                            <div className="space-y-1 md:col-span-2">
                                <Label>Author Photo (optional)</Label>
                                <ImageUpload
                                    max={1}
                                    existingImages={formData.authorImage ? [formData.authorImage] : []}
                                    onImagesAdd={(urls) =>
                                        setFormData({ ...formData, authorImage: urls[0] ?? "" })
                                    }
                                    onRemoveImage={() => setFormData({ ...formData, authorImage: "" })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Without a photo the card shows the author&apos;s initial.
                                </p>
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

                        <div className="flex items-center gap-3 pt-2">
                            <Switch
                                checked={formData.showOnHome}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, showOnHome: checked })
                                }
                            />
                            <div>
                                <p className="text-sm font-medium">Show on homepage</p>
                                <p className="text-xs text-muted-foreground">
                                    Featured in the homepage &quot;What Our Travelers Say&quot; rail
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button type="button" variant="outline" onClick={closeForm}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving…" : editingId ? "Update Review" : "Save Review"}
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
                        <option value="">All reviews</option>
                        <option value="site">General reviews (no tour)</option>
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
                    <p className="text-sm text-muted-foreground mt-1">
                        Click &quot;Add Review&quot; to add the first one.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="bg-card border border-border rounded-lg p-5">
                            <div className="flex items-start gap-4">
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
                                            <span className="text-xs text-muted-foreground">
                                                · {review.authorLocation}
                                            </span>
                                        )}
                                        {review.circuit ? (
                                            <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
                                                {review.circuit.name}
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                                                General
                                            </span>
                                        )}
                                        {review.showOnHome && (
                                            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                                <Home className="w-3 h-3" /> Homepage
                                            </span>
                                        )}
                                        {review.source && (
                                            <span className="text-xs text-muted-foreground">
                                                via {review.source}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-0.5 mb-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-3.5 h-3.5 ${
                                                    s <= review.rating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-muted-foreground"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                        {review.text}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {review.displayDate ||
                                            new Date(review.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-shrink-0 items-center gap-1">
                                    <button
                                        onClick={() => openEditForm(review)}
                                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded"
                                        title="Edit review"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded"
                                        title="Delete review"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-border pt-3">
                                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Switch
                                        checked={review.showOnHome}
                                        onCheckedChange={(checked) =>
                                            patchReview(review.id, { showOnHome: checked })
                                        }
                                    />
                                    Show on homepage
                                </label>
                                <span className="text-xs text-muted-foreground">Order: {review.order}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
