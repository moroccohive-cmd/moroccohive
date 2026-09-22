import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FAQItem } from "@/components/faq-item"
import { BreadcrumbSchema, FAQSchema } from "@/components/structured-data"
import { getAllFaqs, groupFaqsByCategory, localizeFaqs } from "@/lib/site-content"
import { buildMetadata } from "@/lib/seo"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"

export function faqMetadata(locale: Locale): Metadata {
    const t = getMessages(locale).meta.faq
    return buildMetadata({ title: t.title, description: t.description, path: "/faq", locale })
}

export async function FaqView({ locale }: { locale: Locale }) {
    const messages = getMessages(locale)
    const t = messages.faq
    const faqs = localizeFaqs(await getAllFaqs(), locale)
    const groups = groupFaqsByCategory(faqs, t.generalCategory)
    // Untranslated entries are still shown, but kept out of the FAQPage schema
    // so the structured data stays in the page's language.
    const schemaItems = faqs
        .filter((faq) => !faq.lang)
        .map((faq) => ({ q: faq.question, a: faq.answer }))

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header locale={locale} />

            <main className="flex-1">
                {/* Intro */}
                <section className="border-b border-border bg-card py-16">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <span className="text-xs font-medium uppercase tracking-widest text-accent">
                            {t.eyebrow}
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {t.title}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl font-light text-muted-foreground">
                            {t.intro}
                        </p>
                    </div>
                </section>

                {/* Questions */}
                <section className="py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        {faqs.length > 0 ? (
                            <div className="space-y-12">
                                {groups.map(([category, items]) => (
                                    <div key={category}>
                                        {groups.length > 1 && (
                                            <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent">
                                                {category}
                                            </h2>
                                        )}
                                        <div className="space-y-4">
                                            {items.map((faq) => (
                                                <FAQItem
                                                    key={faq.id}
                                                    question={faq.question}
                                                    answer={faq.answer}
                                                    lang={faq.lang}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-20 text-center text-muted-foreground">
                                {t.empty}
                            </p>
                        )}
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-border bg-card py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            {t.ctaTitle}
                        </h2>
                        <p className="mt-3 font-light text-muted-foreground">
                            {t.ctaBody}
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href={localizePath(locale, "/contact")}>{t.contact}</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href={localizePath(locale, "/plan-trip")}>{t.planTrip}</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <BreadcrumbSchema items={[{ name: messages.breadcrumb.faq, path: "/faq" }]} locale={locale} />
            <FAQSchema items={schemaItems} />

            <Footer locale={locale} />
        </div>
    )
}
