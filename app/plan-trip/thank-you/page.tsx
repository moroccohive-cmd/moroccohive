import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, Home, Plane } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Thank You | Morocco Hive",
    description: "Your trip plan request has been received. We'll get back to you within 24 hours with a personalized itinerary.",
}

export default function PlanTripThankYouPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-20">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Check className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold font-serif mb-4">Thank You!</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        We&apos;ve received your trip request and will get back to you within 24 hours with a personalized
                        itinerary.
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
                                Browse Trips
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
