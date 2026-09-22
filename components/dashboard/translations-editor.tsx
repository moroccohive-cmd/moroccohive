"use client"

import { useState, type ReactNode } from "react"
import { Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/config"

export type TranslationValue = string | string[]
export type TranslationsValue = Partial<Record<Locale, Record<string, TranslationValue>>>

export interface TranslationField {
    key: string
    label: string
    /** list = one item per line; rich = the markdown editor used elsewhere. */
    type: "text" | "textarea" | "list" | "rich"
    /** Needed before the language version is published and indexed. */
    required?: boolean
}

type Status = "complete" | "partial" | "missing"

interface LanguageTabsProps {
    fields: TranslationField[]
    /** French / Dutch / … versions of the fields. */
    value: TranslationsValue | null | undefined
    onChange: (value: TranslationsValue) => void
    /** The record being edited — its English fields, shown as placeholders. */
    source: Record<string, unknown>
    /** The regular (English) form, rendered in the English tab. */
    children: ReactNode
}

function asText(value: unknown): string {
    if (Array.isArray(value)) return value.join("\n")
    return typeof value === "string" ? value : ""
}

function isFilled(value: unknown): boolean {
    return asText(value).trim().length > 0
}

/**
 * One tab per language. English holds the full form (it is the default and
 * what every other language falls back to); each other tab holds only the
 * text fields for that language. Anything left empty in a language shows the
 * English text on that language's page.
 */
export function LanguageTabs({ fields, value, onChange, source, children }: LanguageTabsProps) {
    const [active, setActive] = useState<Locale>(DEFAULT_LOCALE)
    const translations = value ?? {}
    const required = fields.filter((f) => f.required)

    const status = (locale: Locale): Status => {
        const entry = locale === DEFAULT_LOCALE ? source : translations[locale] ?? {}
        if (required.every((f) => isFilled(entry[f.key]))) return "complete"
        return fields.some((f) => isFilled(entry[f.key])) ? "partial" : "missing"
    }

    const setField = (locale: Locale, key: string, fieldValue: TranslationValue) => {
        onChange({ ...translations, [locale]: { ...(translations[locale] ?? {}), [key]: fieldValue } })
    }

    return (
        // A required English input left empty blocks submit; jump back to the
        // English tab so the browser can show which field it is.
        <div className="space-y-6" onInvalidCapture={() => setActive(DEFAULT_LOCALE)}>
            <div className="sticky top-0 z-20 -mx-1 bg-background/95 px-1 py-2 backdrop-blur">
                <div role="tablist" aria-label="Content language" className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
                    {LOCALES.map((locale) => {
                        const s = status(locale)
                        const selected = active === locale
                        return (
                            <button
                                key={locale}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                onClick={() => setActive(locale)}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                    selected
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {LOCALE_META[locale].label}
                                {locale === DEFAULT_LOCALE ? (
                                    <span className={`text-xs ${selected ? "opacity-80" : "opacity-60"}`}>(default)</span>
                                ) : (
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                            s === "complete"
                                                ? "bg-green-500/15 text-green-700"
                                                : s === "partial"
                                                  ? "bg-amber-500/15 text-amber-700"
                                                  : selected
                                                    ? "bg-primary-foreground/20"
                                                    : "bg-muted"
                                        }`}
                                    >
                                        {s === "complete" ? "Done" : s === "partial" ? "Partial" : "Empty"}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* English: the full form. Kept mounted so nothing is lost when switching tabs. */}
            <div role="tabpanel" hidden={active !== DEFAULT_LOCALE} className="space-y-6">
                {children}
            </div>

            {active !== DEFAULT_LOCALE && (
                <div role="tabpanel" className="space-y-6">
                    <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <p>
                            Write the {LOCALE_META[active].label} version here. Any field you leave empty shows the
                            English text. Photos, prices and settings are shared by all languages — edit them in the
                            English tab.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 space-y-5">
                        {fields.map((field) => {
                            const id = `tr-${active}-${field.key}`
                            const current = translations[active]?.[field.key]
                            const english = asText(source[field.key])
                            return (
                                <div key={id} className="space-y-2">
                                    <Label htmlFor={id}>
                                        {field.label}
                                        {field.type === "list" && (
                                            <span className="ml-2 font-normal text-muted-foreground">one item per line</span>
                                        )}
                                    </Label>
                                    {field.type === "text" && (
                                        <Input
                                            id={id}
                                            value={asText(current)}
                                            onChange={(e) => setField(active, field.key, e.target.value)}
                                            placeholder={english}
                                        />
                                    )}
                                    {field.type === "textarea" && (
                                        <Textarea
                                            id={id}
                                            rows={4}
                                            value={asText(current)}
                                            onChange={(e) => setField(active, field.key, e.target.value)}
                                            placeholder={english}
                                        />
                                    )}
                                    {field.type === "list" && (
                                        <Textarea
                                            id={id}
                                            rows={Math.max(3, english.split("\n").length)}
                                            value={asText(current)}
                                            onChange={(e) => setField(active, field.key, e.target.value.split("\n"))}
                                            placeholder={english}
                                        />
                                    )}
                                    {field.type === "rich" && (
                                        <RichTextEditor
                                            value={asText(current)}
                                            onChange={(val) => setField(active, field.key, val)}
                                            placeholder={english.slice(0, 200) || "Translation..."}
                                        />
                                    )}
                                    {english && !isFilled(current) && (
                                        <p className="text-xs text-muted-foreground">Empty — the English text is shown.</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export const CIRCUIT_TRANSLATION_FIELDS: TranslationField[] = [
    { key: "name", label: "Circuit name", type: "text", required: true },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "description", label: "Description", type: "textarea", required: true },
    { key: "highlights", label: "Highlights", type: "list" },
    { key: "included", label: "Included", type: "list" },
    { key: "excluded", label: "Not included", type: "list" },
    { key: "optional", label: "Optional", type: "list" },
    { key: "itineraryGlance", label: "Itinerary at a glance", type: "list" },
    { key: "itineraryDetail", label: "Detailed itinerary", type: "rich" },
    { key: "additionalInfo", label: "Important notes", type: "rich" },
]

export const BLOG_TRANSLATION_FIELDS: TranslationField[] = [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "excerpt", label: "Excerpt", type: "textarea" },
    { key: "content", label: "Content", type: "rich", required: true },
]

export const FAQ_TRANSLATION_FIELDS: TranslationField[] = [
    { key: "question", label: "Question", type: "text", required: true },
    { key: "answer", label: "Answer", type: "textarea", required: true },
    { key: "category", label: "Category", type: "text" },
]
