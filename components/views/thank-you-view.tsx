import type { Metadata } from "next"
import Link from "next/link"
import { Check, Home, Plane } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"

type Kind = "circuit" | "planTrip"

// Post-conversion pages: keep them out of the index so they never compete
// with the tour pages or /plan-trip itself in search results.
export function thankYouMetadata(kind: Kind, locale: Locale): Metadata {
    const meta = getMessages(locale).meta
    const t = kind === "circuit" ? meta.circuitThankYou : meta.planTripThankYou
    return {
        title: t.title,
        description: t.description,
        robots: { index: false, follow: false },
    }
}

export function ThankYouView({ kind, locale }: { kind: Kind; locale: Locale }) {
    const t = getMessages(locale).thankYou[kind]
    const accent = kind === "circuit" ? "secondary" : "primary"

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header locale={locale} />
            <main className="flex-1 flex items-center justify-center py-20">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className={`w-20 h-20 ${accent === "secondary" ? "bg-secondary/10" : "bg-primary/10"} rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce`}>
                        <Check className={`w-12 h-12 ${accent === "secondary" ? "text-secondary" : "text-primary"}`} />
                    </div>
                    <h1 className="text-4xl font-bold font-serif mb-4">{t.title}</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        {t.body}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild>
                            <Link href={localizePath(locale, "/")}>
                                <Home className="mr-2 h-4 w-4" />
                                {t.home}
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={localizePath(locale, "/circuits")}>
                                <Plane className="mr-2 h-4 w-4" />
                                {t.browse}
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </div>
    )
}
