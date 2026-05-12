import type React from "react"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import Script from "next/script"
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

        {/* Partytown config - must run before partytown.js */}
        <Script id="partytown-gtm-forward" strategy="lazyOnload">
          {`
            partytown = {
              lib: "/~partytown/",
              forward: ["dataLayer.push", "gtag"]
            };
          `}
        </Script>

        <Script
          src="/~partytown/partytown.js"
          strategy="lazyOnload"
        />

        {/* GTM - runs inside Partytown web worker */}
        <Script id="google-tag-manager" type="text/partytown">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WRZQZ6RN');
          `}
        </Script>
      </head>
      <body className={`${quicksand.className} font-sans antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WRZQZ6RN"
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
