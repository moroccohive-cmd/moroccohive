"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

const SLIDES = [
  {
    src: "/morocco-ait-ben-haddou-ksar-tour.jpg",
    alt: "Ait Ben Haddou - the fortified earthen ksar on the edge of the Sahara",
  },
  {
    src: "/morocco-volubilis-roman-ruins-tour.jpg",
    alt: "Volubilis - the Roman basilica arches and Triumphal Arch near Meknes",
  },
  {
    src: "/morocco-casablanca-hassan-ii-mosque.jpg",
    alt: "Casablanca - the Hassan II Mosque and its 210-metre minaret on the Atlantic shore",
  },
  {
    src: "/morocco-merzouga-camel-trek-sahara.jpg",
    alt: "Merzouga - a camel caravan crossing the golden Erg Chebbi dunes",
  },
  {
    src: "/morocco-fes-chouara-tannery-medina.jpg",
    alt: "Fes - the Chouara tannery dye pits in the heart of the old medina",
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

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [next])

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {SLIDES.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={alts?.[i] ?? slide.alt}
            fill
            sizes="100vw"
            priority={i === 0}
            loading="eager"
            fetchPriority={i === 0 ? "high" : "low"}
            aria-hidden={i !== current}
            style={{ animationPlayState: current === i ? "running" : "paused" }}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i % 2 === 0 ? "hero-pan-in" : "hero-pan-out"
            } ${current === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Slide Indicators — the bar is 6px tall, so the button pads it out to a 24px touch target */}
      <div className="absolute bottom-8 right-6 z-20 flex items-center">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
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
