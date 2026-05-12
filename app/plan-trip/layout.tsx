import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Plan Your Morocco Trip - Custom Itinerary in 48h | Morocco Hive",
    description: "Tell us your dates, group, and interests. A Morocco-based travel expert sends you a custom private tour proposal within 48 hours. Free, no obligation.",
    alternates: {
        canonical: "https://www.moroccohive.com/plan-trip",
    },
    openGraph: {
        title: "Plan Your Morocco Trip - Custom Itinerary in 48h | Morocco Hive",
        description: "Tell us your dates, group, and interests. A Morocco-based travel expert sends you a custom private tour proposal within 48 hours. Free, no obligation.",
        url: "https://www.moroccohive.com/plan-trip",
        images: [
            {
                url: "/hero-bg.webp",
                width: 1200,
                height: 630,
                alt: "Plan your private Morocco tour with Morocco Hive",
            },
        ],
    },
    twitter: {
        title: "Plan Your Morocco Trip - Custom Itinerary in 48h | Morocco Hive",
        description: "Tell us your dates, group, and interests. A Morocco-based travel expert sends you a custom private tour proposal within 48 hours. Free, no obligation.",
    },
}

export default function PlanTripLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
