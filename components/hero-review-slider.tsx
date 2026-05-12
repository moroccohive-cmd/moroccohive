"use client"

import { useState, useEffect, useCallback } from "react"
import { Star } from "lucide-react"

const REVIEWS = [
  {
    text: "Best tour guide we've had in Morocco. Abdellatif truly knows the country.",
    author: "Martin S.",
    location: "Canada",
  },
  {
    text: "Abdellatif made every day fun and interesting - a wonderful, immersive experience from start to finish.",
    author: "Natalie F.",
    location: "USA",
  },
  {
    text: "Our trip was spectacular! The Riads were gorgeous and Abdellatif was knowledgeable, friendly and fun.",
    author: "Claramarie C.",
    location: "San Jose, CA",
  },
]

export function HeroReviewSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % REVIEWS.length),
    [],
  )

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  const review = REVIEWS[current]

  return (
    <div className="flex flex-col items-center gap-2 min-h-[72px]">
      <p
        key={current}
        className="text-white/70 text-sm italic max-w-md text-center transition-opacity duration-500"
      >
        &ldquo;{review.text}&rdquo; - {review.author}, {review.location}
      </p>
      <div className="flex items-center gap-2">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Review ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              current === i
                ? "w-4 h-1.5 bg-white/70"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
