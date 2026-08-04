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

export function HeroBackgroundSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <>
      <div className="absolute inset-0 z-0">
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
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              current === i ? "opacity-100" : "opacity-0"
            }`}
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
            className={`rounded-full transition-all duration-300 ${
              current === i
                ? "w-4 h-1.5 bg-white/70"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </>
  )
}
