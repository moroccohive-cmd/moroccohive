import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle } from "lucide-react"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"
import { buildMetadata } from "@/lib/seo"
import type { Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"

export function aboutMetadata(locale: Locale): Metadata {
    const t = getMessages(locale).meta.about
    return buildMetadata({ title: t.title, description: t.description, path: "/about", locale })
}

export function AboutView({ locale }: { locale: Locale }) {
    const messages = getMessages(locale)
    const t = messages.about

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header locale={locale} />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">{t.title}</h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            {t.lead}
                        </p>
                    </div>
                </section>

                {/* Introduction */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t.intro}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Who We Are */}
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6">{t.whoTitle}</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                                {t.whoP1}
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                {t.whoP2Before} <strong className="text-foreground">{t.whoP2Brand}</strong> {t.whoP2After}
                            </p>
                        </div>
                    </div>
                </section>

                {/* What We Do */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6">{t.whatTitle}</h2>
                        <p className="text-muted-foreground mb-8">
                            {t.whatIntro}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {t.services.map((service, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-foreground">{service}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-muted-foreground mt-8">
                            {t.whatOutro}
                        </p>
                    </div>
                </section>

                {/* Why Travel With Us */}
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8">{t.whyTitle}</h2>
                        <div className="space-y-6">
                            {t.whyUs.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Philosophy */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6">{t.philosophyTitle}</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                                {t.philosophyP1}
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                {t.philosophyP2}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Booking & Travel Support */}
                <section className="py-12 md:py-16 bg-primary/5">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8">{t.bookingTitle}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {t.bookingFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-lg text-muted-foreground">
                            {t.bookingOutro}
                        </p>
                    </div>
                </section>
            </main>

            <BreadcrumbSchema items={[{ name: messages.breadcrumb.about, path: "/about" }]} locale={locale} />
            <WebPageSchema
                name={t.title}
                description={t.schemaDescription}
                path="/about"
                locale={locale}
            />

            <Footer locale={locale} />
        </div>
    )
}
