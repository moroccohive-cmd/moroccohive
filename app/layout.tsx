import type React from "react"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import { GoogleTagManager } from "@next/third-parties/google"
import "./globals.css"

import dynamic from "next/dynamic"
import { OrganizationSchema } from "@/components/structured-data"

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
  metadataBase: new URL("https://www.moroccohive.com"),
  title: {
    default: "Morocco Hive | Private Tours in Morocco",
    template: "%s | Morocco Hive",
  },
  description: "Morocco-based travel agency offering private, customizable tours led by local guides. Sahara desert, Atlas Mountains, imperial cities - designed around you.",
  openGraph: {
    siteName: "Morocco Hive",
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
    site: "@moroccohive",
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
