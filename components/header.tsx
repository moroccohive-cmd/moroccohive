import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"

const HeaderMobileNav = dynamic(
  () => import("@/components/header-mobile-nav").then((m) => m.HeaderMobileNav),
  { loading: () => <div className="w-10 h-10" aria-hidden="true" /> },
)

const HeaderUserMenu = dynamic(() =>
  import("@/components/header-user-menu").then((m) => m.HeaderUserMenu),
  { loading: () => <div className="w-8 h-8 rounded-full bg-muted animate-pulse" aria-hidden="true" /> },
)

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Trip Ideas", href: "/circuits" },
  { name: "Plan Your Trip", href: "/plan-trip" },
  { name: "Blog", href: "/blog" },
  { name: "Guest Reviews", href: "/#testimonials" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
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
                Morocco
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
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo_1.webp"
                alt="MoroccoHive Logo"
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
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side: Auth/User Menu */}
          <div className="flex-1 md:flex-initial flex items-center justify-end space-x-4">
            <HeaderUserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
