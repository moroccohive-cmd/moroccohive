import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, CheckCircle, Clock, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactPageForm } from "@/components/contact-page-form"
import { buildMetadata } from "@/lib/seo"
import type { Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"

export function contactMetadata(locale: Locale): Metadata {
    const t = getMessages(locale).meta.contact
    return buildMetadata({ title: t.title, description: t.description, path: "/contact", locale })
}

export function ContactView({ locale }: { locale: Locale }) {
    const messages = getMessages(locale)
    const t = messages.contact

    const contactMethods = [
        {
            icon: Mail,
            title: t.methods.email,
            value: "info@moroccohive.com",
            href: "mailto:info@moroccohive.com",
        },
        {
            icon: Phone,
            title: t.methods.phone,
            value: "+212 634 717 423",
            secondValue: "+212 681 134 299",
            href: "tel:+212634717423",
        },
        {
            icon: MapPin,
            title: t.methods.location,
            value: t.methods.locationValue,
        },
    ]

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

                {/* Contact Methods */}
                <section className="py-12 md:py-16">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8 text-center">{t.getInTouch}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {contactMethods.map((method, index) => (
                                <div key={index} className="bg-card border border-border rounded-xl p-6 text-center">
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                        <method.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                                    {method.href ? (
                                        <a href={method.href} className="text-primary hover:underline block">
                                            {method.value}
                                        </a>
                                    ) : (
                                        <p className="text-muted-foreground">{method.value}</p>
                                    )}
                                    {method.secondValue && (
                                        <a href={`tel:${method.secondValue.replace(/\s/g, "")}`} className="text-primary hover:underline block mt-1">
                                            {method.secondValue}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-muted-foreground mt-8">
                            {t.worldwide}
                        </p>
                    </div>
                </section>

                {/* Contact Form & Info */}
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Form - Same as Home Page */}
                            <ContactPageForm messages={messages.contactForm} />

                            {/* Info */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4">{t.planTitle}</h3>
                                    <p className="text-muted-foreground mb-4">{t.planIntro}</p>
                                    <ul className="space-y-2">
                                        {t.tripDetails.map((detail, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-muted-foreground">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-4 italic">
                                        {t.planOutro}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-4">{t.whyTitle}</h3>
                                    <ul className="space-y-2">
                                        {t.whyContact.map((reason, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-muted-foreground">{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <h3 className="font-semibold">{t.responseTitle}</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        {t.responseBody}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-4">{t.ctaTitle}</h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            {t.ctaBody}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="mailto:info@moroccohive.com">
                                <Button size="lg">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {t.emailUs}
                                </Button>
                            </a>
                            <a href="https://wa.me/212681134299" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" variant="outline">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    {t.whatsapp}
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer locale={locale} />
        </div>
    )
}
