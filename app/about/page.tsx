import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Mail, CheckCircle, Clock, MessageCircle } from "lucide-react"
import { BreadcrumbSchema, WebPageSchema } from "@/components/structured-data"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
    title: "About Morocco Hive - Morocco-Based Private Tour Agency",
    description:
        "Morocco Hive is a Marrakech-based travel agency creating private, customizable tours led by local experts. Learn our story, team, and philosophy.",
    path: "/about",
})

export default function AboutPage() {
    const services = [
        "Private Morocco tours",
        "Small group tours",
        "Custom-made itineraries",
        "Sahara Desert experiences & desert camps",
        "Camel rides & outdoor adventures",
        "Hotel & traditional riad bookings",
        "Transport with experienced drivers",
        "Local guides & cultural activities",
    ]

    const whyUs = [
        { title: "Local Expertise", description: "We live here. We know the routes, the seasons, and the details that make the difference." },
        { title: "Tailor-Made Journeys", description: "No copy-paste tours. Every itinerary is crafted around you." },
        { title: "No generic packages", description: "We don't sell the same 7-day circuit to everyone. Each itinerary is built around where you actually want to go." },
        { title: "Reliable & Transparent", description: "Clear communication, honest advice, and flexible booking options." },
        { title: "Worldwide Travelers Welcome", description: "We work with travelers from all over the world and understand international expectations." },
    ]

    const bookingFeatures = [
        "Flexible booking options",
        "Deposits available to secure your trip",
        "Pay-on-arrival options for peace of mind",
        "Ongoing support before and during your journey",
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">About Morocco Hive</h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            A Morocco-based travel agency in Marrakech. We plan private tours and custom itineraries, and we're available before, during, and after your trip.
                        </p>
                    </div>
                </section>

                {/* Introduction */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We are a Morocco-based travel agency located in Marrakech, specializing in private tours,
                                small group journeys, and fully customized itineraries designed for travelers from around the world.
                                Our goal is straightforward: help you see more of Morocco than the standard circuit, comfortably
                                and at your own pace.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Who We Are */}
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6">Who We Are</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                                Morocco Hive is an independently owned travel business, created by locals who know Morocco well:
                                its landscapes, cultures, traditions, and the places most visitors never reach.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                The name <strong className="text-foreground">Morocco Hive</strong> reflects our philosophy: like a hive,
                                Morocco is alive with diversity (deserts, mountains, cities, coastlines, and cultures) all working
                                together to create something unlike anywhere else. We connect these elements to build journeys that feel
                                organic and well-balanced.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What We Do */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6">What We Do</h2>
                        <p className="text-muted-foreground mb-8">
                            We design and organize personalized travel experiences across Morocco, including:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {services.map((service, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-foreground">{service}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-muted-foreground mt-8">
                            Whether you are visiting Morocco for the first time or returning to explore deeper,
                            we tailor each journey to match your interests, pace, and travel style.
                        </p>
                    </div>
                </section>

                {/* Why Travel With Us */}
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8">Why Travel With Morocco Hive</h2>
                        <div className="space-y-6">
                            {whyUs.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Philosophy */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6">Our Travel Philosophy</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                                We believe travel should be personal, respectful, and honest. Our goal isn't just to show you the highlights,
                                but to give you context: the food, the history, the hospitality, and the everyday life that makes Morocco worth the trip.
                            </p>
                            <p className="text-muted-foreground leading-relaxed mt-4">
                                We support responsible tourism by working with local drivers, guides, riads, and desert camps,
                                helping communities benefit directly from tourism.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Booking & Travel Support */}
                <section className="py-12 md:py-16 bg-primary/5">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8">Booking & Travel Support</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {bookingFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-lg text-muted-foreground">
                            From your first message to the end of your trip, we are here to guide you.
                        </p>
                    </div>
                </section>
            </main>

            <BreadcrumbSchema items={[{ name: "About", path: "/about" }]} />
            <WebPageSchema
                name="About Morocco Hive"
                description="Morocco Hive is a Marrakech-based travel agency creating private, customizable tours led by local experts."
                path="/about"
            />

            <Footer />
        </div>
    )
}
