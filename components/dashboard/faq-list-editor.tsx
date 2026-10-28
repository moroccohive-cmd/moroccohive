"use client"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export interface FaqValue {
    question: string
    answer: string
}

function asFaqs(value: unknown): FaqValue[] {
    if (!Array.isArray(value)) return []
    return value.map((item) => ({
        question: typeof item?.question === "string" ? item.question : "",
        answer: typeof item?.answer === "string" ? item.answer : "",
    }))
}

/** The English FAQ list: add, edit and remove question/answer pairs. */
export function FaqListEditor({ value, onChange }: { value: FaqValue[]; onChange: (value: FaqValue[]) => void }) {
    const update = (index: number, patch: Partial<FaqValue>) =>
        onChange(value.map((faq, i) => (i === index ? { ...faq, ...patch } : faq)))

    return (
        <div className="space-y-4">
            {value.map((faq, idx) => (
                <div key={idx} className="space-y-2 rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor={`faq-q-${idx}`}>Question {idx + 1}</Label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onChange(value.filter((_, i) => i !== idx))}
                            aria-label={`Remove question ${idx + 1}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <Input
                        id={`faq-q-${idx}`}
                        value={faq.question}
                        onChange={(e) => update(idx, { question: e.target.value })}
                        placeholder="e.g., What is the best time to visit Marrakech?"
                        className="bg-background border-input"
                    />
                    <Textarea
                        value={faq.answer}
                        onChange={(e) => update(idx, { answer: e.target.value })}
                        placeholder="Answer..."
                        rows={3}
                        className="bg-background border-input"
                        aria-label={`Answer ${idx + 1}`}
                    />
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => onChange([...value, { question: "", answer: "" }])}>
                <Plus className="mr-2 h-4 w-4" />
                Add question
            </Button>
            {value.length > 0 && (
                <p className="text-xs text-muted-foreground">Questions missing an answer (or vice versa) are not saved.</p>
            )}
        </div>
    )
}

/**
 * A language tab's FAQ list: one row per English question, in the same order.
 * Anything left empty shows the English text.
 */
export function FaqTranslationEditor({
    idPrefix,
    english,
    value,
    onChange,
}: {
    idPrefix: string
    english: unknown
    value: unknown
    onChange: (value: FaqValue[]) => void
}) {
    const source = asFaqs(english).filter((faq) => faq.question || faq.answer)
    const current = asFaqs(value)

    if (!source.length) {
        return <p className="text-sm text-muted-foreground">Add FAQs in the English tab first.</p>
    }

    const update = (index: number, patch: Partial<FaqValue>) => {
        const next = source.map((_, i) => current[i] ?? { question: "", answer: "" })
        next[index] = { ...next[index], ...patch }
        onChange(next)
    }

    return (
        <div className="space-y-4">
            {source.map((faq, idx) => (
                <div key={idx} className="space-y-2 rounded-lg border border-border bg-background p-4">
                    <Label htmlFor={`${idPrefix}-q-${idx}`}>Question {idx + 1}</Label>
                    <Input
                        id={`${idPrefix}-q-${idx}`}
                        value={current[idx]?.question ?? ""}
                        onChange={(e) => update(idx, { question: e.target.value })}
                        placeholder={faq.question}
                    />
                    <Textarea
                        value={current[idx]?.answer ?? ""}
                        onChange={(e) => update(idx, { answer: e.target.value })}
                        placeholder={faq.answer}
                        rows={3}
                        aria-label={`Answer ${idx + 1}`}
                    />
                </div>
            ))}
        </div>
    )
}
