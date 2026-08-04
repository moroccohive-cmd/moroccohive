"use client"

import Image from "next/image"
import { useState } from "react"

/**
 * next/image only accepts root-relative paths or hosts allowlisted in
 * next.config.ts, and throws on anything else. Author photos come from
 * admin input, so route the odd ones to a plain <img> instead.
 */
function avatarKind(src: string | null): "none" | "optimized" | "plain" {
    const value = src?.trim()
    if (!value) return "none"
    if (value.startsWith("/")) return "optimized"
    if (/^https?:\/\//i.test(value)) return "plain"
    return "none"
}

interface ReviewAvatarProps {
    src: string | null
    name: string
}

const IMAGE_CLASS = "h-10 w-10 flex-shrink-0 rounded-full object-cover ring-1 ring-border/70"

/**
 * Author photo with an initial-letter fallback. Uploads get deleted and admins
 * paste bad URLs, so a dead src has to degrade to the initial rather than
 * leaving the browser's broken-image icon in the card.
 */
export function ReviewAvatar({ src, name }: ReviewAvatarProps) {
    const [failed, setFailed] = useState(false)
    const kind = failed ? "none" : avatarKind(src)

    if (kind === "optimized") {
        return (
            <Image
                src={src!}
                alt=""
                width={40}
                height={40}
                className={IMAGE_CLASS}
                onError={() => setFailed(true)}
            />
        )
    }

    if (kind === "plain") {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src!}
                alt=""
                width={40}
                height={40}
                loading="lazy"
                className={IMAGE_CLASS}
                onError={() => setFailed(true)}
            />
        )
    }

    return (
        <span
            aria-hidden="true"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
        >
            {name.trim()[0]?.toUpperCase() ?? "?"}
        </span>
    )
}
