"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type Slide = { src: string; alt: string }

export type LightboxLabels = {
    title: string
    close: string
    previous: string
    next: string
}

/**
 * Makes images inside `children` open in a full-screen viewer.
 *
 * Opt-in markers (server components can set these, so the page stays
 * server-rendered and only this wrapper ships to the client):
 *  - `data-lightbox="<src>"` on any element: clicking it opens <src>.
 *  - `data-lightbox-scope` on a container: every <img> inside is clickable
 *    (used for markdown rendered via dangerouslySetInnerHTML).
 * Clicks on links/buttons inside a `data-lightbox` element are ignored, so
 * overlays like a back link or favourite button keep working.
 *
 * `gallery` adds images that aren't on the page (e.g. the rest of a tour's
 * photos) so the viewer can page through them all.
 */
export function ImageLightbox({
    children,
    gallery = [],
    labels,
    className,
}: {
    children: ReactNode
    gallery?: string[]
    labels: LightboxLabels
    className?: string
}) {
    const rootRef = useRef<HTMLDivElement>(null)
    const [slides, setSlides] = useState<Slide[]>([])
    const [index, setIndex] = useState<number | null>(null)
    const touchX = useRef<number | null>(null)

    const collectSlides = useCallback((): Slide[] => {
        const seen = new Set<string>()
        const list: Slide[] = []
        const add = (src: string | null | undefined, alt = "") => {
            if (!src || seen.has(src)) return
            seen.add(src)
            list.push({ src, alt })
        }
        gallery.forEach((src) => add(src, labels.title))
        rootRef.current
            ?.querySelectorAll<HTMLElement>("[data-lightbox], [data-lightbox-scope] img")
            .forEach((el) => {
                const src = el.dataset.lightbox || el.getAttribute("src")
                add(src, el.getAttribute("alt") || el.dataset.lightboxAlt || "")
            })
        return list
    }, [gallery, labels.title])

    const openAt = useCallback(
        (src: string) => {
            const list = collectSlides()
            const i = list.findIndex((s) => s.src === src)
            setSlides(list)
            setIndex(i === -1 ? 0 : i)
        },
        [collectSlides],
    )

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement

        const opener = target.closest<HTMLElement>("[data-lightbox-open]")
        if (opener) {
            e.preventDefault()
            openAt(opener.dataset.lightboxOpen!)
            return
        }

        if (target.closest("a, button, input, select, textarea, label")) return

        const marked = target.closest<HTMLElement>("[data-lightbox]")
        if (marked?.dataset.lightbox) {
            openAt(marked.dataset.lightbox)
            return
        }

        if (target instanceof HTMLImageElement && target.closest("[data-lightbox-scope]")) {
            const src = target.getAttribute("src")
            if (src) openAt(src)
        }
    }

    const count = slides.length
    const go = useCallback(
        (delta: number) => setIndex((i) => (i === null || count < 2 ? i : (i + delta + count) % count)),
        [count],
    )

    // Warm the cache for neighbours so paging feels instant.
    useEffect(() => {
        if (index === null || count < 2) return
        for (const d of [1, -1]) {
            const img = new window.Image()
            img.src = slides[(index + d + count) % count].src
        }
    }, [index, count, slides])

    const current = index !== null ? slides[index] : null

    return (
        <div ref={rootRef} onClick={handleClick} className={className}>
            {children}

            <Dialog.Root open={current !== null} onOpenChange={(open) => !open && setIndex(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/95 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                    <Dialog.Content
                        aria-describedby={undefined}
                        className="fixed inset-0 z-[100] flex items-center justify-center outline-none"
                        onKeyDown={(e) => {
                            if (e.key === "ArrowRight") go(1)
                            else if (e.key === "ArrowLeft") go(-1)
                        }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIndex(null)
                        }}
                        onTouchStart={(e) => {
                            touchX.current = e.touches[0].clientX
                        }}
                        onTouchEnd={(e) => {
                            if (touchX.current === null) return
                            const dx = e.changedTouches[0].clientX - touchX.current
                            touchX.current = null
                            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
                        }}
                    >
                        <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>

                        {current && (
                            // Plain <img>: rich-text images can come from any host,
                            // which next/image would reject.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                key={current.src}
                                src={current.src}
                                alt={current.alt}
                                className="max-h-[calc(100dvh-6rem)] max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-8rem)] object-contain select-none"
                                draggable={false}
                            />
                        )}

                        <Dialog.Close
                            className="absolute top-4 right-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            aria-label={labels.close}
                        >
                            <X className="h-6 w-6" aria-hidden="true" />
                        </Dialog.Close>

                        {count > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => go(-1)}
                                    aria-label={labels.previous}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    <ChevronLeft className="h-7 w-7" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => go(1)}
                                    aria-label={labels.next}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                >
                                    <ChevronRight className="h-7 w-7" aria-hidden="true" />
                                </button>
                                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white tabular-nums">
                                    {(index ?? 0) + 1} / {count}
                                </p>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}
