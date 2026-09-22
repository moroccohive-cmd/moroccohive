import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { BreadcrumbSchema, ItemListSchema } from "@/components/structured-data"
import { buildMetadata } from "@/lib/seo"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { getLocalizedDestinations } from "@/lib/i18n/destinations"

export function destinationsMetadata(locale: Locale): Metadata {
    const t = getMessages(locale).meta.destinations
    return buildMetadata({ title: t.title, description: t.description, path: "/destinations", locale })
}

export function DestinationsView({ locale }: { locale: Locale }) {
    const messages = getMessages(locale)
    const t = messages.destinations
    const destinations = getLocalizedDestinations(locale)
    const lp = (path: string) => localizePath(locale, path)

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header locale={locale} />

            <main className="flex-1">
                <section className="border-b border-border bg-card py-16">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <span className="text-xs font-medium uppercase tracking-widest text-accent">
                            {t.eyebrow}
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t.title}
                        </h1>
                        {/* Answer-first summary: the block most likely to be quoted. */}
                        <p className="page-summary mx-auto mt-5 max-w-2xl font-light leading-relaxed text-muted-foreground">
                            {t.summary}
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {destinations.map((destination) => (
                                <Link
                                    key={destination.slug}
                                    href={lp(`/destinations/${destination.slug}`)}
                                    className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
                                >
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className="rounded-md bg-accent/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                                            {t.types[destination.type] ?? destination.type}
                                        </span>
                                    </div>

                                    <h2 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                                        {destination.name}
                                    </h2>

                                    <p className="mb-5 flex-1 text-sm font-light leading-relaxed text-muted-foreground line-clamp-4">
                                        {destination.summary}
                                    </p>

                                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                                            {destination.region}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                                            {destination.suggestedStay}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-t border-border bg-card py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t.combineTitle}
                        </h2>
                        <p className="mt-3 font-light text-muted-foreground">
                            {t.combineBody}
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href={lp("/plan-trip")}>
                                    {t.planTrip} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href={lp("/circuits")}>{t.browseTours}</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <BreadcrumbSchema items={[{ name: messages.breadcrumb.destinations, path: "/destinations" }]} locale={locale} />
            <ItemListSchema
                name={t.schemaName}
                description={t.schemaDescription}
                path="/destinations"
                locale={locale}
                items={destinations.map((d) => ({
                    name: d.name,
                    path: `/destinations/${d.slug}`,
                    description: d.summary,
                    image: d.image,
                }))}
            />

            <Footer locale={locale} />
        </div>
    )
}
