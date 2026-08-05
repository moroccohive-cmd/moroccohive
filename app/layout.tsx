import type React from "react"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import { GoogleTagManager } from "@next/third-parties/google"
import "./globals.css"

import dynamic from "next/dynamic"
import { OrganizationSchema } from "@/components/structured-data"
import { SITE, SITE_URL } from "@/lib/seo"

const WhatsAppButton = dynamic(() =>
  import("@/components/whatsapp-button").then((m) => m.WhatsAppButton),
)

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => m.Toaster),
)

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Morocco Hive | Private Tours in Morocco",
    template: "%s | Morocco Hive",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "travel",
  // Without max-image-preview:large, Google renders a thumbnail instead of a
  // full-width image in Discover and AI Overviews. max-snippet:-1 lifts the
  // snippet length cap, which matters for being quoted by answer engines.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Stops iOS Safari auto-linking numbers in body copy as phone numbers.
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/hero-bg.webp",
        width: 1200,
        height: 630,
        alt: "Morocco Sahara desert dunes - private tours by Morocco Hive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    images: ["/hero-bg.webp"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googleadservices.com" />
      </head>
      <GoogleTagManager gtmId="GTM-W6TNN8QF" />
      <body className={`${quicksand.className} font-sans antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W6TNN8QF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  )
}
