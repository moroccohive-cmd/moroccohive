import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react"
import { TrustpilotBadge } from "@/components/trustpilot-badge"
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, localizePath, type Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { fmt } from "@/lib/i18n/format"

export function Footer({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
    const currentYear = new Date().getFullYear()
    const t = getMessages(locale)
    const f = t.footer
    const lp = (path: string) => localizePath(locale, path)

    return (
        <footer className="bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href={lp("/")} className="inline-block">
                            <Image
                                src="/logo_1.webp"
                                alt={t.header.logoAlt}
                                width={180}
                                height={180}
                                className="h-24 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            {f.tagline}
                        </p>

                        <div className="flex items-center gap-3">
                            <Image src="/Visa-Logo.webp" alt="Visa" width={50} height={32} className="h-7 w-auto object-contain opacity-80" />
                            <Image src="/MasterCard_Logo.svg.webp" alt="Mastercard" width={50} height={32} className="h-7 w-auto object-contain opacity-80" />
                            <Image src="/paypal.webp" alt="PayPal" width={70} height={32} className="h-7 w-auto object-contain opacity-80" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            {f.quickLinks}
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { href: "/", label: f.home },
                                { href: "/circuits", label: f.ourTrips },
                                { href: "/plan-trip", label: f.planTrip },
                                { href: "/reviews", label: f.reviews },
                                { href: "/faq", label: f.faq },
                                { href: "/about", label: f.aboutUs },
                                { href: "/contact", label: f.contactUs },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={lp(link.href)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Destinations */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            {f.popularDestinations}
                        </h3>
                        {/* These previously pointed at ?destination= filters, two of
                            them at the wrong one. They now link to the destination
                            guides, which is also how those pages get crawled. */}
                        <ul className="space-y-2">
                            {[
                                { name: f.destinations.marrakech, slug: "marrakech" },
                                { name: f.destinations.fes, slug: "fes" },
                                { name: f.destinations.sahara, slug: "sahara-desert-merzouga" },
                                { name: f.destinations.chefchaouen, slug: "chefchaouen" },
                                { name: f.destinations.atlas, slug: "atlas-mountains" },
                                { name: f.destinations.essaouira, slug: "essaouira" },
                            ].map((destination) => (
                                <li key={destination.slug}>
                                    <Link
                                        href={lp(`/destinations/${destination.slug}`)}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {destination.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href={lp("/destinations")} className="text-sm font-medium text-primary hover:underline">
                                    {f.allDestinations}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            {f.contactHeading}
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                                <span>{f.location}</span>
                            </li>
                            <li className="flex items-center text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
                                <a href="tel:+212634717423" className="hover:text-primary transition-colors">
                                    +212 634717423
                                </a>
                            </li>
                            <li className="flex items-center text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
                                <a href="mailto:info@moroccohive.com" className="hover:text-primary transition-colors">
                                    info@moroccohive.com
                                </a>
                            </li>
                            <li className="flex items-center text-sm text-muted-foreground">
                                <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
                                <a href="https://wa.me/212681134299" className="hover:text-primary transition-colors">
                                    +212 681134299
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col items-center gap-1 md:items-start">
                            <p className="text-sm text-muted-foreground">
                                {fmt(f.rights, { year: currentYear })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {f.builtBy}{" "}
                                <a
                                    href="https://sentinelstudio.ma"
                                    target="_blank"
                                    rel="noopener"
                                    className="font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    Sentinel Studio
                                </a>
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <TrustpilotBadge variant="dark" label={t.trustpilot.aria} />
                            <Link href={lp("/privacy-policy")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                {f.privacy}
                            </Link>
                            <Link href={lp("/terms")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                {f.terms}
                            </Link>
                        </div>
                    </div>

                    {/* Crawlable links between the language versions. The hreflang
                        tags in <head> are the primary signal; these make the other
                        languages reachable without JavaScript. */}
                    <nav
                        aria-label={t.common.language.label}
                        className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground"
                    >
                        <span>{t.common.language.label}:</span>
                        {LOCALES.map((l) => (
                            <Link
                                key={l}
                                href={localizePath(l, "/")}
                                hrefLang={l}
                                lang={l}
                                aria-current={l === locale ? "true" : undefined}
                                className={
                                    l === locale
                                        ? "font-medium text-foreground"
                                        : "hover:text-primary transition-colors"
                                }
                            >
                                {LOCALE_META[l].label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    )
}
