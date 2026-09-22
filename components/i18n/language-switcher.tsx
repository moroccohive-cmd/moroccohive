"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check, ChevronDown, Globe } from "lucide-react"
import { LOCALES, LOCALE_META, localizePath, splitLocale } from "@/lib/i18n/config"
import { useI18n } from "@/components/i18n/i18n-provider"

/**
 * Links to the current page in every other language. These are plain crawlable
 * links with hreflang, so they double as internal links between the language
 * versions — the hreflang tags in <head> are the primary signal, these back
 * them up.
 */
export function LanguageSwitcher() {
    const { locale, common } = useI18n()
    const pathname = usePathname() || "/"
    const { path } = splitLocale(pathname)
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const onPointer = (event: PointerEvent) => {
            if (!ref.current?.contains(event.target as Node)) setOpen(false)
        }
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false)
        }
        document.addEventListener("pointerdown", onPointer)
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("pointerdown", onPointer)
            document.removeEventListener("keydown", onKey)
        }
    }, [open])

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={`${common.language.change} (${LOCALE_META[locale].label})`}
                aria-expanded={open}
                aria-haspopup="true"
                aria-controls="language-menu"
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/10"
            >
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span>{LOCALE_META[locale].short}</span>
                <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>

            {open && (
                <ul
                    id="language-menu"
                    aria-label={common.language.label}
                    className="absolute right-0 z-50 mt-2 w-40 rounded-md border border-border bg-card py-1 shadow-lg"
                >
                    {LOCALES.map((l) => (
                        <li key={l}>
                            <Link
                                href={localizePath(l, path)}
                                hrefLang={l}
                                lang={l}
                                prefetch={false}
                                aria-current={l === locale ? "true" : undefined}
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-between px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent/10"
                            >
                                {LOCALE_META[l].label}
                                {l === locale && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
