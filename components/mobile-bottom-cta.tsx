import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileBottomCTAProps {
    title?: string
    description?: string
    buttonText: string
    href?: string
    onButtonClick?: () => void
    price?: number
    originalPrice?: number
    isFrom?: boolean
    className?: string
}

export function MobileBottomCTA({
    title,
    description,
    buttonText,
    href,
    onButtonClick,
    price,
    originalPrice,
    isFrom,
    className
}: MobileBottomCTAProps) {
    // Only render if we have a button action (href or onClick)
    if (!href && !onButtonClick) return null

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border pt-4 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.05)]",
            className
        )}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    {(price !== undefined) ? (
                        <div className="flex flex-col">
                            {isFrom && <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">From</span>}
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-primary">
                                    €{price.toLocaleString()}
                                </span>
                                {originalPrice && originalPrice > price && (
                                    <span className="text-xs text-muted-foreground line-through decoration-destructive/50">
                                        €{originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {title && <span className="font-semibold text-foreground text-sm">{title}</span>}
                            {description && <span className="text-xs text-muted-foreground line-clamp-1">{description}</span>}
                        </div>
                    )}
                </div>

                {href ? (
                    <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                        <Link href={href}>
                            {buttonText}
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={onButtonClick}
                        size="lg"
                        className="rounded-full px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                        {buttonText}
                    </Button>
                )}
            </div>
        </div>
    )
}
