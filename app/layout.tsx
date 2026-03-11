import type React from "react"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
import Script from "next/script"
import "./globals.css"

import { WhatsAppButton } from "@/components/whatsapp-button"
import { Toaster } from "@/components/ui/sonner"

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Morocco Hive",
  description: "A Better Way to Experience Morocco",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VRGBVDD9B5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VRGBVDD9B5');
            gtag('config', 'AW-17989754948');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WRZQZ6RN');
          `}
        </Script>

        {/* TrustBox (Trustpilot) bootstrap */}
        <Script
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${quicksand.className} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
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
