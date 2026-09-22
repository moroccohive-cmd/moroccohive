import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin } from "lucide-react"
import { localeAlternates } from "@/lib/seo"
import type { Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"

export function privacyMetadata(locale: Locale): Metadata {
    const t = getMessages(locale).meta.privacy
    return { title: t.title, description: t.description, alternates: localeAlternates("/privacy-policy", locale) }
}

export function termsMetadata(locale: Locale): Metadata {
    const t = getMessages(locale).meta.terms
    return { title: t.title, description: t.description, alternates: localeAlternates("/terms", locale) }
}

const SiteLink = () => (
    <a href="https://www.moroccohive.com" className="text-primary hover:underline">
        https://www.moroccohive.com
    </a>
)

const EmailLink = () => (
    <a href="mailto:info@moroccohive.com" className="text-primary hover:underline">
        info@moroccohive.com
    </a>
)

function Bullets({ items }: { items: string[] }) {
    return (
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    )
}

export function PrivacyView({ locale }: { locale: Locale }) {
    const t = getMessages(locale).privacy

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header locale={locale} />
            <main className="flex-1 py-12 md:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">{t.title}</h1>
                    <p className="text-muted-foreground mb-8">{t.updated}</p>

                    <div className="prose prose-gray max-w-none space-y-8">
                        <p className="text-lg">
                            {t.introBefore}{" "}
                            <SiteLink />.
                        </p>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s1Title}</h2>
                            <p className="mb-4">{t.s1Lead}</p>
                            <Bullets items={t.s1Items} />
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s2Title}</h2>
                            <p className="mb-4">{t.s2Lead}</p>
                            <Bullets items={t.s2Items} />
                            <p className="mt-4 font-medium">{t.s2Strong}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s3Title}</h2>
                            <p className="text-muted-foreground">{t.s3Text}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s4Title}</h2>
                            <p className="mb-4">{t.s4Lead}</p>
                            <Bullets items={t.s4Items} />
                            <p className="mt-4 text-muted-foreground">{t.s4Outro}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s5Title}</h2>
                            <p className="text-muted-foreground">{t.s5Text}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s6Title}</h2>
                            <p className="text-muted-foreground">{t.s6Text}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s7Title}</h2>
                            <p className="mb-4">{t.s7Lead}</p>
                            <Bullets items={t.s7Items} />
                            <p className="mt-4 text-muted-foreground">
                                {t.s7Contact}{" "}
                                <EmailLink />.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s8Title}</h2>
                            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span>{t.s8Address}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <EmailLink />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <span>{t.s8Phone}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s9Title}</h2>
                            <p className="text-muted-foreground">{t.s9Text}</p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </div>
    )
}

export function TermsView({ locale }: { locale: Locale }) {
    const t = getMessages(locale).terms

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header locale={locale} />
            <main className="flex-1 py-12 md:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">{t.title}</h1>
                    <p className="text-muted-foreground mb-8">{t.updated}</p>

                    <div className="prose prose-gray max-w-none space-y-8">
                        <p className="text-lg">
                            {t.introBefore}{" "}
                            <SiteLink />{t.introAfter}
                        </p>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s1Title}</h2>
                            <p className="mb-4">{t.s1Lead}</p>
                            <Bullets items={t.s1Items} />
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s2Title}</h2>
                            <Bullets items={t.s2Items} />
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s3Title}</h2>
                            <Bullets items={t.s3Items} />
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s4Title}</h2>
                            <p className="mb-4">{t.s4Lead}</p>
                            <Bullets items={t.s4Items} />
                            <p className="mt-4 font-medium">{t.s4Strong}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s5Title}</h2>
                            <p className="mb-4">{t.s5Lead}</p>
                            <Bullets items={t.s5Items} />
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s6Title}</h2>
                            <p className="text-muted-foreground">{t.s6Text}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s7Title}</h2>
                            <p className="mb-4">{t.s7Lead}</p>
                            <Bullets items={t.s7Items} />
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s8Title}</h2>
                            <p className="text-muted-foreground">{t.s8Text}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">{t.s9Title}</h2>
                            <p className="mb-4">{t.s9Lead}</p>
                            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <EmailLink />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <span>+212 634 717 423</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer locale={locale} />
        </div>
    )
}
