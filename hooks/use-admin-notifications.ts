"use client"

import { useEffect, useState } from "react"

export interface AdminNotificationCounts {
    tripRequests: number
    messages: number
}

const EMPTY: AdminNotificationCounts = { tripRequests: 0, messages: 0 }

const POLL_MS = 60_000

/**
 * The sidebar renders twice (desktop rail + mobile sheet), and dashboard pages
 * ask for a refresh after marking something read. A module-level store keeps all
 * of that down to a single request per refresh.
 */
let counts: AdminNotificationCounts = EMPTY
let inFlight: Promise<void> | null = null
const subscribers = new Set<(value: AdminNotificationCounts) => void>()

function fetchCounts() {
    if (inFlight) return inFlight

    inFlight = fetch("/api/admin/notifications", { credentials: "include" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
            if (!data) return
            counts = {
                tripRequests: Number(data.tripRequests) || 0,
                messages: Number(data.messages) || 0,
            }
            subscribers.forEach((notify) => notify(counts))
        })
        .catch(() => {
            // Badges are decorative - a failed poll just leaves the last value.
        })
        .finally(() => {
            inFlight = null
        })

    return inFlight
}

/** Call after marking a request or message read so the badges catch up. */
export function refreshAdminNotifications() {
    void fetchCounts()
}

export function useAdminNotifications(): AdminNotificationCounts {
    const [value, setValue] = useState(counts)

    useEffect(() => {
        subscribers.add(setValue)
        void fetchCounts()

        const timer = window.setInterval(() => {
            if (!document.hidden) void fetchCounts()
        }, POLL_MS)

        const onVisible = () => {
            if (!document.hidden) void fetchCounts()
        }
        document.addEventListener("visibilitychange", onVisible)

        return () => {
            subscribers.delete(setValue)
            window.clearInterval(timer)
            document.removeEventListener("visibilitychange", onVisible)
        }
    }, [])

    return value
}
