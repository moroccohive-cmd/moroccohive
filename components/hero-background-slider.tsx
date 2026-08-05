"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

const SLIDES = [
  {
    src: "/hero-bg.webp",
    alt: "Luxury Sahara desert camp at sunset with a camel caravan on the dunes - private tour by MoroccoHive",
  },
  {
    src: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=2070",
    alt: "Marrakech - the Koutoubia Mosque minaret with the snow-capped Atlas Mountains behind it",
  },
  {
    src: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=2070",
    alt: "Chefchaouen - the blue-washed houses of the medina climbing the Rif mountainside",
  },
  {
    src: "https://images.unsplash.com/photo-1518979142375-743eaff7a103?q=80&w=2070",
    alt: "Fes - the Chouara tannery dye pits in the heart of the old medina",
  },
  {
    src: "https://images.unsplash.com/photo-1664346399421-971cb37cb450?q=80&w=2070",
    alt: "Ait Ben Haddou - the fortified earthen ksar on the edge of the Sahara",
  },
  {
    src: "https://images.unsplash.com/photo-1743963790208-07ce117cdfc6?q=80&w=2070",
    alt: "Essaouira - the seafront ramparts of the old town above the Atlantic",
  },
]

const SLIDE_DURATION = 2500

export function HeroBackgroundSlider() {
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
            alt={slide.alt}
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

      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-6 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Background image ${i + 1}`}
            className={`h-1.5 overflow-hidden rounded-full transition-all duration-500 ease-out ${
              current === i
                ? "w-8 bg-white/25"
                : "w-1.5 bg-white/30 hover:scale-125 hover:bg-white/60"
            }`}
          >
            {current === i && (
              <span
                key={current}
                className="hero-progress block h-full w-full rounded-full bg-white/80"
                style={{ animationDuration: `${SLIDE_DURATION}ms` }}
              />
            )}
          </button>
        ))}
      </div>
    </>
  )
}
