"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Trip Ideas", href: "/circuits" },
  { name: "Plan Your Trip", href: "/plan-trip" },
  { name: "Blog", href: "/blog" },
  { name: "Guest Reviews", href: "/reviews" },
  { name: "FAQ", href: "/faq" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function HeaderMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
      </button>

      {open && (
        <div id="mobile-menu" className="absolute left-0 right-0 top-full md:hidden border-t border-border bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/10 hover:text-primary"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/plan-trip" className="block px-3 py-2" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full bg-accent hover:bg-accent/90">
                Start Planning
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
