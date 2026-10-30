"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

// The first slide is the LCP image, so it is the lightest one (~110 KB on a phone).
const SLIDES = [
  {
    src: "/hero/merzouga-enhanced.webp",
    position: "68% 50%",
    alt: "Merzouga - a camel caravan crossing the golden Erg Chebbi dunes",
  },
  {
    src: "/hero/ait-ben-haddou-enhanced.webp",
    position: "55% 50%",
    alt: "Ait Ben Haddou - the fortified earthen ksar on the edge of the Sahara",
  },
  {
    src: "/hero/volubilis-enhanced.webp",
    position: "42% 35%",
    alt: "Volubilis - the Roman basilica arches and Triumphal Arch near Meknes",
  },
  {
    src: "/hero/casablanca-enhanced.webp",
    position: "44% 10%",
    alt: "Casablanca - the Hassan II Mosque and its 210-metre minaret on the Atlantic shore",
  },
  {
    src: "/hero/fes-enhanced.webp",
    position: "40% 60%",
    alt: "Fes - the Chouara tannery dye pits in the heart of the old medina",
  },
  {
    src: "/hero/chefchaouen-enhanced.webp",
    position: "57% 50%",
    alt: "Chefchaouen - the blue-washed square of the Blue City beneath the Rif Mountains",
  },
]

const SLIDE_DURATION = 2500

export function HeroBackgroundSlider({
  alts,
  showLabel = "Show background image {n}",
}: {
  /** Translated alt text, one per slide, in slide order. */
  alts?: string[]
  showLabel?: string
} = {}) {
  const [current, setCurrent] = useState(0)
  // Only the first slide is in the initial HTML; the rest mount once the page
  // has finished loading so they don't compete with it for bandwidth (LCP).
  const [deferredMounted, setDeferredMounted] = useState(false)
  const [loaded, setLoaded] = useState<boolean[]>(() => SLIDES.map(() => false))

  const markLoaded = useCallback(
    (i: number) => setLoaded((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v)))),
    []
  )

  useEffect(() => {
    const mount = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(() => setDeferredMounted(true), { timeout: 2000 })
      else setTimeout(() => setDeferredMounted(true), 200)
    }
    if (document.readyState === "complete") mount()
    else {
      window.addEventListener("load", mount, { once: true })
      return () => window.removeEventListener("load", mount)
    }
  }, [])

  // Advance only onto a slide that has finished downloading, so a slow
  // connection never fades to a blank frame.
  const next = useCallback(
    () =>
      setCurrent((c) => {
        const n = (c + 1) % SLIDES.length
        return loaded[n] ? n : c
      }),
    [loaded]
  )

  useEffect(() => {
    if (!deferredMounted) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [next, deferredMounted])

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {SLIDES.map((slide, i) => {
          if (i !== 0 && !deferredMounted) return null
          return (
          <Image
            key={slide.src}
            src={slide.src}
            alt={alts?.[i] ?? slide.alt}
            fill
            sizes="(max-aspect-ratio: 3/2) 140vh, 100vw"
            priority={i === 0}
            loading="eager"
            fetchPriority={i === 0 ? "high" : "low"}
            // Native load rather than next/image's onLoad, which waits on img.decode()
            // and can stall for off-screen (opacity-0) images in some browsers.
            ref={(img) => {
              if (!img) return
              if (img.complete && img.naturalWidth) markLoaded(i)
              else img.addEventListener("load", () => markLoaded(i), { once: true })
            }}
            aria-hidden={i !== current}
            style={{
              objectPosition: slide.position,
              transformOrigin: slide.position,
              animationPlayState: current === i ? "running" : "paused",
            }}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i % 2 === 0 ? "hero-pan-in" : "hero-pan-out"
            } ${current === i && (i === 0 || loaded[i]) ? "opacity-100" : "opacity-0"}`}
          />
          )
        })}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Slide Indicators — the bar is 6px tall, so the button pads it out to a 24px touch target */}
      <div className="absolute bottom-8 right-6 z-20 flex items-center">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => (i === 0 || loaded[i]) && setCurrent(i)}
            aria-label={showLabel.replace("{n}", String(i + 1))}
            aria-current={current === i}
            className="group flex h-6 items-center justify-center px-2.5"
          >
            <span
              className={`block h-1.5 overflow-hidden rounded-full transition-all duration-500 ease-out ${
                current === i
                  ? "w-8 bg-white/25"
                  : "w-1.5 bg-white/30 group-hover:scale-125 group-hover:bg-white/60"
              }`}
            >
              {current === i && (
                <span
                  key={current}
                  className="hero-progress block h-full w-full rounded-full bg-white/80"
                  style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}
