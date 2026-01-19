import type React from "react"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"
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
      <body className={`${quicksand.className} font-sans antialiased`}>
        {children}
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  )
}
