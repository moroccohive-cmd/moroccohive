import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"
import { DEFAULT_LOCALE, localizePath, type Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { LanguageSwitcher } from "@/components/i18n/language-switcher"

const HeaderMobileNav = dynamic(
  () => import("@/components/header-mobile-nav").then((m) => m.HeaderMobileNav),
  { loading: () => <div className="w-10 h-10" aria-hidden="true" /> },
)

const HeaderUserMenu = dynamic(() =>
  import("@/components/header-user-menu").then((m) => m.HeaderUserMenu),
  { loading: () => <div className="w-8 h-8 rounded-full bg-muted animate-pulse" aria-hidden="true" /> },
)

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "tripIdeas", href: "/circuits" },
  { key: "destinations", href: "/destinations" },
  { key: "planTrip", href: "/plan-trip" },
  { key: "blog", href: "/blog" },
  { key: "reviews", href: "/reviews" },
  { key: "faq", href: "/faq" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const

export function Header({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getMessages(locale)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95">
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary/10 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-10 text-sm">
            <div className="flex items-center space-x-6 text-muted-foreground">
              <a href="tel:+212634717423" className="flex items-center hover:text-primary transition-colors">
                <Phone className="w-3 h-3 mr-2" />
                +212 634717423
              </a>
              <a href="mailto:info@moroccohive.com" className="flex items-center hover:text-primary transition-colors">
                <Mail className="w-3 h-3 mr-2" />
                info@moroccohive.com
              </a>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-2" />
                {t.header.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Burger (Left) */}
          <div className="md:hidden flex-1 flex justify-start">
            <HeaderMobileNav />
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
            <Link href={localizePath(locale, "/")} className="flex items-center space-x-2">
              <Image
                src="/logo_1.webp"
                alt={t.header.logoAlt}
                width={180}
                height={60}
                className="h-10 md:h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={localizePath(locale, item.href)}
                // Two-word translated labels ("Over ons") must not break
                // mid-label; English keeps its original classes untouched.
                className={`text-sm font-medium text-foreground hover:text-primary transition-colors${locale === DEFAULT_LOCALE ? "" : " whitespace-nowrap"}`}
              >
                {t.common.nav[item.key]}
              </Link>
            ))}
          </nav>

          {/* Right side: Language + Auth/User Menu */}
          <div className="flex-1 md:flex-initial flex items-center justify-end space-x-2 md:space-x-4">
            <LanguageSwitcher />
            <HeaderUserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
