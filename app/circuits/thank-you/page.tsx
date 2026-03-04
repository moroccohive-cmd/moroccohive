import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, Home, Plane } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Booking Request Sent | Morocco Hive",
    description: "Your trip booking request has been received. Our team will get back to you shortly to confirm your booking.",
}

export default function CircuitThankYouPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-20">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Check className="w-12 h-12 text-secondary" />
                    </div>
                    <h1 className="text-4xl font-bold font-serif mb-4">Request Sent!</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Thank you for your booking request. Our team will get back to you shortly to confirm your trip details
                        and finalize your itinerary.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/circuits">
                                <Plane className="mr-2 h-4 w-4" />
                                Browse More Trips
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
