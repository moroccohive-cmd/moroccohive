import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Morocco Hive - Marrakech Travel Agency",
    description: "Reach Morocco Hive in Marrakech for private tours and custom itineraries. Email, phone, or WhatsApp - we reply within 24 hours.",
    alternates: {
        canonical: "https://www.moroccohive.com/contact",
    },
    openGraph: {
        title: "Contact Morocco Hive - Marrakech Travel Agency",
        description: "Reach Morocco Hive in Marrakech for private tours and custom itineraries. Email, phone, or WhatsApp - we reply within 24 hours.",
        url: "https://www.moroccohive.com/contact",
        images: [
            {
                url: "/hero-bg.webp",
                width: 1200,
                height: 630,
                alt: "Morocco Hive - Marrakech travel agency contact",
            },
        ],
    },
    twitter: {
        title: "Contact Morocco Hive - Marrakech Travel Agency",
        description: "Reach Morocco Hive in Marrakech for private tours and custom itineraries. Email, phone, or WhatsApp - we reply within 24 hours.",
    },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
