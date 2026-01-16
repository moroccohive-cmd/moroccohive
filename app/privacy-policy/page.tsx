import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata = {
    title: "Privacy Policy | Morocco Hive",
    description: "Morocco Hive Privacy Policy - How we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-8">Last updated: January 15, 2026</p>

                    <div className="prose prose-gray max-w-none space-y-8">
                        <p className="text-lg">
                            Welcome to Morocco Hive ("we," "our," or "us"). We respect your privacy and are committed
                            to protecting any personal information you share with us through our website{" "}
                            <a href="https://www.moroccohive.com" className="text-primary hover:underline">
                                https://www.moroccohive.com
                            </a>.
                        </p>

                        <section>
                            <h2 className="text-xl font-bold mb-4">1. Information We Collect</h2>
                            <p className="mb-4">We may collect the following information when you use our website or contact us:</p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Full name</li>
                                <li>Email address</li>
                                <li>Phone number / WhatsApp number</li>
                                <li>Travel preferences and itinerary details</li>
                                <li>Any information you voluntarily provide via contact or booking forms</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">2. How We Use Your Information</h2>
                            <p className="mb-4">We use your information to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Respond to inquiries and requests</li>
                                <li>Organize tours, bookings, and travel services</li>
                                <li>Communicate regarding reservations, payments, or itinerary changes</li>
                                <li>Improve our services and customer experience</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                            <p className="mt-4 font-medium">We do not sell or rent your personal data to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">3. Payments</h2>
                            <p className="text-muted-foreground">
                                Morocco Hive may request deposits or allow payment on arrival. We do not store or process
                                credit card details directly on our website. Payment arrangements are handled securely via
                                agreed methods with the client.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">4. Sharing Information</h2>
                            <p className="mb-4">
                                We may share limited personal information only with trusted partners when necessary, such as:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Hotels</li>
                                <li>Transport providers</li>
                                <li>Local guides or activity operators</li>
                            </ul>
                            <p className="mt-4 text-muted-foreground">
                                This information is shared strictly to deliver the requested travel services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">5. Data Protection</h2>
                            <p className="text-muted-foreground">
                                We take reasonable technical and organizational measures to protect your personal data
                                from unauthorized access, misuse, or disclosure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">6. Cookies</h2>
                            <p className="text-muted-foreground">
                                Our website may use cookies to improve functionality and user experience. You can disable
                                cookies through your browser settings if you prefer.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">7. Your Rights</h2>
                            <p className="mb-4">You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Request access to your personal data</li>
                                <li>Request correction or deletion of your data</li>
                                <li>Withdraw consent for communication at any time</li>
                            </ul>
                            <p className="mt-4 text-muted-foreground">
                                To exercise these rights, contact us at{" "}
                                <a href="mailto:info@moroccohive.com" className="text-primary hover:underline">
                                    info@moroccohive.com
                                </a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">8. Contact Information</h2>
                            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span>Morocco Hive, Marrakech, Morocco</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <a href="mailto:info@moroccohive.com" className="text-primary hover:underline">
                                        info@moroccohive.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <span>Phone: +212 634 717 423 | WhatsApp: +212 681 134 299</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">9. Governing Law</h2>
                            <p className="text-muted-foreground">
                                This Privacy Policy is governed by the laws of Morocco.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
