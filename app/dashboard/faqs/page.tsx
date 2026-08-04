"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { HelpCircle, Plus, Trash, Search, Pencil, Home, EyeOff } from "lucide-react"

interface Faq {
    id: string
    question: string
    answer: string
    category: string | null
    showOnHome: boolean
    active: boolean
    order: number
    createdAt: string
}

const EMPTY_FORM = {
    question: "",
    answer: "",
    category: "",
    showOnHome: false,
    active: true,
    order: 0,
}

type FormState = typeof EMPTY_FORM

export default function FaqsPage() {
    const [faqs, setFaqs] = useState<Faq[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<FormState>(EMPTY_FORM)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchFaqs()
    }, [])

    const fetchFaqs = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/faqs", { credentials: "include" })
            if (res.ok) {
                setFaqs(await res.json())
            }
        } catch (e) {
            console.error("Failed to fetch FAQs:", e)
        } finally {
            setLoading(false)
        }
    }

    const openCreateForm = () => {
        setEditingId(null)
        setFormData(EMPTY_FORM)
        setError(null)
        setShowForm(true)
    }

    const openEditForm = (faq: Faq) => {
        setEditingId(faq.id)
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category ?? "",
            showOnHome: faq.showOnHome,
            active: faq.active,
            order: faq.order,
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
                editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs",
                {
                    method: editingId ? "PATCH" : "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Failed to save FAQ")
                return
            }

            closeForm()
            fetchFaqs()
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const patchFaq = async (id: string, patch: Partial<Faq>) => {
        // Optimistic - roll back if the request fails
        const previous = faqs
        setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))

        try {
            const res = await fetch(`/api/admin/faqs/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            })
            if (!res.ok) setFaqs(previous)
        } catch {
            setFaqs(previous)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this FAQ?")) return

        try {
            const res = await fetch(`/api/admin/faqs/${id}`, {
                method: "DELETE",
                credentials: "include",
            })
            if (res.ok) {
                setFaqs((prev) => prev.filter((f) => f.id !== id))
            }
        } catch (e) {
            console.error("Failed to delete FAQ:", e)
        }
    }

    const filteredFaqs = faqs.filter((f) => {
        const q = searchQuery.toLowerCase()
        return (
            f.question.toLowerCase().includes(q) ||
            f.answer.toLowerCase().includes(q) ||
            (f.category ?? "").toLowerCase().includes(q)
        )
    })

    const homeCount = faqs.filter((f) => f.showOnHome && f.active).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">FAQs</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage questions shown on the FAQ page - {homeCount} currently featured on the homepage
                    </p>
                </div>
                <Button onClick={openCreateForm} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add FAQ
                </Button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit FAQ" : "New FAQ"}</h2>
                    {error && (
                        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded px-4 py-3 text-sm mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Question *</Label>
                            <Input
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                placeholder="e.g. When is the best time to visit Morocco?"
                                maxLength={200}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Answer *</Label>
                            <Textarea
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                placeholder="Write the answer here…"
                                rows={5}
                                maxLength={2000}
                                required
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {formData.answer.length}/2000
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Category</Label>
                                <Input
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="e.g. Booking, Travel, Payments"
                                    maxLength={60}
                                    list="faq-categories"
                                />
                                <datalist id="faq-categories">
                                    {Array.from(
                                        new Set(faqs.map((f) => f.category).filter(Boolean) as string[])
                                    ).map((c) => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                            </div>

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
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 pt-2">
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={formData.showOnHome}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, showOnHome: checked })
                                    }
                                />
                                <div>
                                    <p className="text-sm font-medium">Show on homepage</p>
                                    <p className="text-xs text-muted-foreground">
                                        Featured in the homepage FAQ section
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={formData.active}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, active: checked })
                                    }
                                />
                                <div>
                                    <p className="text-sm font-medium">Published</p>
                                    <p className="text-xs text-muted-foreground">
                                        Visible on the public FAQ page
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button type="button" variant="outline" onClick={closeForm}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving…" : editingId ? "Update FAQ" : "Save FAQ"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search FAQs…"
                    className="pl-9"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse h-28" />
                    ))}
                </div>
            ) : filteredFaqs.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No FAQs yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Click &quot;Add FAQ&quot; to create the first one.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="bg-card border border-border rounded-lg p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="font-semibold text-foreground">{faq.question}</span>
                                        {faq.category && (
                                            <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
                                                {faq.category}
                                            </span>
                                        )}
                                        {faq.showOnHome && (
                                            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                                <Home className="w-3 h-3" /> Homepage
                                            </span>
                                        )}
                                        {!faq.active && (
                                            <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                                                <EyeOff className="w-3 h-3" /> Hidden
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                        {faq.answer}
                                    </p>
                                </div>

                                <div className="flex flex-shrink-0 items-center gap-1">
                                    <button
                                        onClick={() => openEditForm(faq)}
                                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded"
                                        title="Edit FAQ"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded"
                                        title="Delete FAQ"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-border pt-3">
                                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Switch
                                        checked={faq.showOnHome}
                                        onCheckedChange={(checked) => patchFaq(faq.id, { showOnHome: checked })}
                                    />
                                    Show on homepage
                                </label>
                                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Switch
                                        checked={faq.active}
                                        onCheckedChange={(checked) => patchFaq(faq.id, { active: checked })}
                                    />
                                    Published
                                </label>
                                <span className="text-xs text-muted-foreground">Order: {faq.order}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
