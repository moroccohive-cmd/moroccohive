import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone } from "lucide-react"

export const metadata = {
    title: "Terms of Use",
    description: "Morocco Hive Terms of Use - Terms and conditions for using our website and services.",
    alternates: { canonical: "https://www.moroccohive.com/terms" },
}

export default function TermsOfUsePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">Terms of Use</h1>
                    <p className="text-muted-foreground mb-8">Last updated: January 15, 2026</p>

                    <div className="prose prose-gray max-w-none space-y-8">
                        <p className="text-lg">
                            By accessing or using{" "}
                            <a href="https://www.moroccohive.com" className="text-primary hover:underline">
                                https://www.moroccohive.com
                            </a>, you agree to be bound by the following Terms of Use.
                            If you do not agree, please do not use our website or services.
                        </p>

                        <section>
                            <h2 className="text-xl font-bold mb-4">1. About Morocco Hive</h2>
                            <p className="mb-4">
                                Morocco Hive is an individually owned travel agency registered in Morocco,
                                offering travel and tourism services worldwide, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Private tours</li>
                                <li>Group tours</li>
                                <li>Custom itineraries</li>
                                <li>Hotel bookings</li>
                                <li>Transport and drivers</li>
                                <li>Activities such as camel rides, desert camps, and guided tours</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">2. Booking Conditions</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Bookings may require a deposit to confirm services</li>
                                <li>Remaining balances may be paid on arrival in Morocco, unless otherwise agreed</li>
                                <li>Prices depend on availability, season, and selected services</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">3. Cancellations & Changes</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Cancellation policies vary depending on suppliers (hotels, camps, transport, etc.)</li>
                                <li>Deposits may be non-refundable depending on the services booked</li>
                                <li>Changes requested by the client are subject to availability and may incur additional costs</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">4. Liability Disclaimer</h2>
                            <p className="mb-4">
                                Morocco Hive acts as an organizer and intermediary between clients and service providers.
                                We are not liable for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Accidents, injuries, illness, or loss of personal belongings</li>
                                <li>Delays, cancellations, or disruptions caused by weather, strikes, or force majeure</li>
                                <li>Actions or omissions of third-party providers</li>
                            </ul>
                            <p className="mt-4 font-medium">Clients participate in tours and activities at their own risk.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">5. Travel Responsibility</h2>
                            <p className="mb-4">Clients are responsible for:</p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Valid passports, visas, and travel documents</li>
                                <li>Travel insurance (strongly recommended)</li>
                                <li>Following local laws, customs, and safety instructions</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">6. Intellectual Property</h2>
                            <p className="text-muted-foreground">
                                All website content (text, images, logos) belongs to Morocco Hive unless stated otherwise
                                and may not be copied or used without written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">7. Website Use</h2>
                            <p className="mb-4">You agree not to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Use the website for unlawful purposes</li>
                                <li>Attempt to damage, hack, or disrupt the website</li>
                                <li>Misuse contact forms or submit false information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">8. Governing Law</h2>
                            <p className="text-muted-foreground">
                                These Terms of Use are governed by and interpreted under the laws of Morocco.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">9. Contact</h2>
                            <p className="mb-4">For any questions regarding these Terms, contact us at:</p>
                            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <a href="mailto:info@moroccohive.com" className="text-primary hover:underline">
                                        info@moroccohive.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <span>+212 634 717 423</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
