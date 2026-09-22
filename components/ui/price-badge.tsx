"use client"

import * as React from "react"
import { useI18n } from "@/components/i18n/i18n-provider"

interface PriceBadgeProps {
    price: number | null | undefined
    originalPrice?: number | null
    from?: boolean
}

function formatPrice(n?: number | null) {
    if (n == null) return "0"
    if (Number.isInteger(n)) return n.toLocaleString()
    return n.toFixed(2)
}

export function PriceBadge({ price, originalPrice, from }: PriceBadgeProps) {
    const { common } = useI18n()
    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-baseline">
                <span className="text-2xl font-bold">${formatPrice(price ?? 0)} <span className="text-muted-foreground font-medium">{common.price.perPerson}</span></span>
                {originalPrice != null && (
                    <span className="text-sm text-muted-foreground line-through">${formatPrice(originalPrice)}</span>
                )}
            </div>
        </div>
    )
}

export default PriceBadge
