"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, CheckCircle, Clock, Check, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"

export default function ContactPage() {
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        phone: "",
        countryCode: "+212",
        subject: "",
        message: ""
    })
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [contactErrors, setContactErrors] = useState<Record<string, string>>({})

    const validateContactForm = (): boolean => {
        const errors: Record<string, string> = {}
        const nameRegex = /^[a-zA-Z\s]+$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^[0-9]+$/

        if (!contactForm.name.trim()) {
            errors.name = "Name is required"
        } else if (!nameRegex.test(contactForm.name.trim())) {
            errors.name = "Name can only contain letters"
        } else if (contactForm.name.trim().length > 50) {
            errors.name = "Name is too long (max 50 characters)"
        }

        if (!contactForm.email.trim()) {
            errors.email = "Email is required"
        } else if (!emailRegex.test(contactForm.email.trim())) {
            errors.email = "Please enter a valid email"
        } else if (contactForm.email.trim().length > 100) {
            errors.email = "Email is too long"
        }

        if (!contactForm.phone.trim()) {
            errors.phone = "Phone is required"
        } else if (!phoneRegex.test(contactForm.phone.trim())) {
            errors.phone = "Phone can only contain numbers"
        } else if (contactForm.phone.trim().length > 20) {
            errors.phone = "Phone number is too long"
        }

        if (!contactForm.subject.trim()) {
            errors.subject = "Subject is required"
        } else if (contactForm.subject.trim().length > 200) {
            errors.subject = "Subject is too long (max 200 characters)"
        }

        if (!contactForm.message.trim()) {
            errors.message = "Message is required"
        } else if (contactForm.message.trim().length > 2000) {
            errors.message = "Message is too long (max 2000 characters)"
        }

        setContactErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateContactForm()) return

        setSending(true)
        setContactErrors({})

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...contactForm,
                    phone: `${contactForm.countryCode} ${contactForm.phone}`
                }),
            })

            if (response.ok) {
                setSent(true)
                setContactForm({ name: "", email: "", phone: "", countryCode: "+212", subject: "", message: "" })
                setTimeout(() => setSent(false), 5000)
            } else {
                if (response.status === 429) alert("Too many requests. Please try again later.")
            }
        } catch {
            alert("Failed to send message.")
        } finally {
            setSending(false)
        }
    }

    const contactMethods = [
        {
            icon: Mail,
            title: "Email",
            value: "info@moroccohive.com",
            href: "mailto:info@moroccohive.com",
        },
        {
            icon: Phone,
            title: "Phone & WhatsApp",
            value: "+212 634 717 423",
            secondValue: "+212 681 134 299",
            href: "tel:+212634717423",
        },
        {
            icon: MapPin,
            title: "Location",
            value: "Marrakech, Morocco",
        },
    ]

    const whyContact = [
        "Local Morocco-based travel experts",
        "Personalized itineraries, not standard packages",
        "Flexible booking options (deposits & pay on arrival)",
        "Reliable communication via email or WhatsApp",
    ]

    const tripDetails = [
        "Your travel dates",
        "Number of travelers",
        "Places you'd like to visit",
        "Travel style (private, group, luxury, adventure, etc.)",
        "Any special requests or interests",
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Contact Us</h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            We're here to help you plan an unforgettable journey in Morocco. Whether you're looking for
                            a private tour, a custom itinerary, or simply need travel advice, feel free to reach out.
                        </p>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="py-12 md:py-16">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8 text-center">Get in Touch</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {contactMethods.map((method, index) => (
                                <div key={index} className="bg-card border border-border rounded-xl p-6 text-center">
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                        <method.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                                    {method.href ? (
                                        <a href={method.href} className="text-primary hover:underline block">
                                            {method.value}
                                        </a>
                                    ) : (
                                        <p className="text-muted-foreground">{method.value}</p>
                                    )}
                                    {method.secondValue && (
                                        <a href={`tel:${method.secondValue.replace(/\s/g, "")}`} className="text-primary hover:underline block mt-1">
                                            {method.secondValue}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-muted-foreground mt-8">
                            We work with travelers from all over the world, and we are available to answer questions before, during, and after your trip.
                        </p>
                    </div>
                </section>

                {/* Contact Form & Info */}
                <section className="py-12 md:py-16 bg-muted/30">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Form - Same as Home Page */}
                            <div className="bg-card rounded-xl shadow-[0_20px_40px_rgb(0,0,0,0.06)] p-8 md:p-10 border border-border/50">
                                {sent ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Check className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-4">Message Sent!</h3>
                                        <p className="text-muted-foreground">
                                            Thank you for contacting us. We will get back to you shortly.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Name</Label>
                                            <Input
                                                id="name"
                                                value={contactForm.name}
                                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                maxLength={50}
                                                placeholder=""
                                                className={`bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring ${contactErrors.name ? "border-destructive" : ""}`}
                                            />
                                            {contactErrors.name && <p className="text-sm text-destructive">{contactErrors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                maxLength={100}
                                                placeholder=""
                                                className={`bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring ${contactErrors.email ? "border-destructive" : ""}`}
                                            />
                                            {contactErrors.email && <p className="text-sm text-destructive">{contactErrors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Phone Number</Label>
                                            <div className="flex gap-2">
                                                <CountryCodeSelect
                                                    value={contactForm.countryCode}
                                                    onChange={(val) => setContactForm({ ...contactForm, countryCode: val })}
                                                />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={contactForm.phone}
                                                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                                    maxLength={20}
                                                    placeholder=""
                                                    className={`flex-1 bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring ${contactErrors.phone ? "border-destructive" : ""}`}
                                                />
                                            </div>
                                            {contactErrors.phone && <p className="text-sm text-destructive">{contactErrors.phone}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Subject</Label>
                                            <Input
                                                id="subject"
                                                value={contactForm.subject}
                                                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                                maxLength={200}
                                                placeholder="Trip Inquiry..."
                                                className={`bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring ${contactErrors.subject ? "border-destructive" : ""}`}
                                            />
                                            {contactErrors.subject && <p className="text-sm text-destructive">{contactErrors.subject}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Message</Label>
                                            <Textarea
                                                id="message"
                                                value={contactForm.message}
                                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                                maxLength={2000}
                                                placeholder="Tell us about your dream trip..."
                                                className={`bg-background border-input min-h-[140px] rounded-md focus:ring-ring focus:border-ring resize-none p-4 ${contactErrors.message ? "border-destructive" : ""}`}
                                            />
                                            {contactErrors.message && <p className="text-sm text-destructive">{contactErrors.message}</p>}
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={sending}
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-md text-base font-medium shadow-lg mt-2"
                                        >
                                            {sending ? "Sending..." : "Send Message"}
                                        </Button>
                                    </form>
                                )}
                            </div>

                            {/* Info */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Plan Your Trip With Us</h3>
                                    <p className="text-muted-foreground mb-4">When contacting us, feel free to share:</p>
                                    <ul className="space-y-2">
                                        {tripDetails.map((detail, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-muted-foreground">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-sm text-muted-foreground mt-4 italic">
                                        The more details you provide, the better we can tailor your experience.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold mb-4">Why Contact Morocco Hive?</h3>
                                    <ul className="space-y-2">
                                        {whyContact.map((reason, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-muted-foreground">{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <h3 className="font-semibold">Response Time</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        We aim to respond to all inquiries within 24 hours. If you don't see our reply,
                                        please check your spam folder or contact us via WhatsApp for a faster response.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-12 md:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-4">Let's Start Your Morocco Journey</h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            Morocco is a land of contrasts, culture, and unforgettable experiences.
                            Contact Morocco Hive today and let us help you design a journey made just for you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="mailto:info@moroccohive.com">
                                <Button size="lg">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email Us
                                </Button>
                            </a>
                            <a href="https://wa.me/212634717423" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" variant="outline">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
