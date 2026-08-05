import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FAQItem } from "@/components/faq-item"
import { BreadcrumbSchema, FAQSchema } from "@/components/structured-data"
import { getAllFaqs, groupFaqsByCategory } from "@/lib/site-content"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
    title: "Morocco Travel FAQ — Booking, Safety, Best Time to Visit",
    description:
        "Answers about booking a private Morocco tour: best time to visit, safety, travel insurance, payments, tipping and what's included in our itineraries.",
    path: "/faq",
})

export const revalidate = 3600

export default async function FaqPage() {
    const faqs = await getAllFaqs()
    const groups = groupFaqsByCategory(faqs)
    const schemaItems = faqs.map((faq) => ({ q: faq.question, a: faq.answer }))

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />

            <main className="flex-1">
                {/* Intro */}
                <section className="border-b border-border bg-card py-16">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <span className="text-xs font-medium uppercase tracking-widest text-accent">
                            Help &amp; Advice
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            Frequently Asked Questions
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl font-light text-muted-foreground">
                            Everything travelers usually ask us before booking. If your question
                            isn&apos;t here, send it over - we answer every message.
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
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-20 text-center text-muted-foreground">
                                No questions published yet.
                            </p>
                        )}
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-border bg-card py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Still have a question?
                        </h2>
                        <p className="mt-3 font-light text-muted-foreground">
                            Ask us anything about your trip - a local expert will get back to you.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Button asChild size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 rounded-md px-8 text-base font-medium">
                                <Link href="/plan-trip">Plan Your Trip</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <BreadcrumbSchema items={[{ name: "FAQ", path: "/faq" }]} />
            <FAQSchema items={schemaItems} />

            <Footer />
        </div>
    )
}
