"use client"

import type { ComponentProps } from "react"
import { useSelectedLayoutSegment } from "next/navigation"
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config"

/**
 * The root `<html>` element, with `lang` set from the first URL segment.
 *
 * English pages and the /fr, /nl trees share one root layout, which cannot read
 * route params. The selected child segment is available during server
 * rendering, though, so this still ships the right `lang` in the initial HTML
 * — and keeps every page statically renderable, which reading request headers
 * would not.
 */
export function Html({ children, ...props }: ComponentProps<"html">) {
    const segment = useSelectedLayoutSegment()
    const lang = isLocale(segment) ? segment : DEFAULT_LOCALE

    return (
        <html {...props} lang={lang}>
            {children}
        </html>
    )
}
