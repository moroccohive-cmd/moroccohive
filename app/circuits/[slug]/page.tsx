"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Check, X, ArrowLeft, Info, Calendar, Plus, Heart } from "lucide-react"
import { FavoriteButton } from "@/components/favorite-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { Textarea } from "@/components/ui/textarea"
import { PriceBadge } from "@/components/ui/price-badge"
import { MobileBottomCTA } from "@/components/mobile-bottom-cta"
import { AuthGate } from "@/components/auth-gate"
import { useAuth } from "@/hooks/use-auth"

interface Circuit {
    id: string
    slug: string
    name: string
    tagline?: string
    description: string
    duration: number
    price: number
    isFrom?: boolean
    originalPrice?: number
    images: string[]
    highlights: string[]
    included: string[]
    excluded: string[]
    optional: string[]
    itineraryGlance: string[]
    itineraryDetail: string
    additionalInfo?: string
    mapUrl?: string
    category: string
}

export default function CircuitDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const [circuit, setCircuit] = useState<Circuit | null>(null)
    const [loading, setLoading] = useState(true)
    const [travelers, setTravelers] = useState({
        adults: 2,
        children: 0,
        infants: 0,
    })
    const [error, setError] = useState<string | null>(null)

    // Booking Form State
    const [booking, setBooking] = useState({
        travelDates: "",
        numberOfTravelers: 2,
        fullName: "",
        email: "",
        phone: "",
        countryCode: "+212",
        extraDetails: "",
        accommodation: "Standard", // NEW: accommodation preference
        preferredPaymentMethod: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [startDateError, setStartDateError] = useState("")
    const [endDateError, setEndDateError] = useState("")
    const [bookingError, setBookingError] = useState<{ message: string; isServerError: boolean } | null>(null)

    // Hardcoded payment method options with icons
    const PAYMENT_METHODS = [
        { value: "Deposit Payment", label: "Deposit Payment" },
        { value: "Bank Transfer / SWIFT", label: "Bank Transfer / SWIFT" },
        { value: "Credit Cards", label: "Credit Cards (Visa, Mastercard, Amex)" },
        { value: "PayPal", label: "PayPal" },
        { value: "Payoneer", label: "Payoneer" },
    ]
    const [paymentMethodsEnabled, setPaymentMethodsEnabled] = useState(true)
    const [enabledPaymentMethods, setEnabledPaymentMethods] = useState<string[]>(PAYMENT_METHODS.map(m => m.value))

    // Inline auth state for guest users
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [authMode, setAuthMode] = useState<"login" | "register">("login")
    const [authForm, setAuthForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        countryCode: "+212"
    })
    const [authErrors, setAuthErrors] = useState<Record<string, string>>({})
    const [authLoading, setAuthLoading] = useState(false)

    // Max lengths matching backend
    const MAX_LENGTHS = {
        fullName: 50,
        email: 100,
        phone: 20,
        extraDetails: 3000,
    }

    // Validate booking dates - returns true if valid
    const validateDates = (): boolean => {
        const dates = booking.travelDates.split(" to ")
        const startDateStr = dates[0] || ""
        const endDateStr = dates[1] || ""
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        let startErr = ""
        let endErr = ""
        let isValid = true

        if (!startDateStr) {
            startErr = "Start date is required"
            isValid = false
        } else {
            const startDate = new Date(startDateStr)
            if (startDate < today) {
                startErr = "Start date cannot be in the past"
                isValid = false
            }
        }

        if (!endDateStr) {
            endErr = "End date is required"
            isValid = false
        } else {
            const endDate = new Date(endDateStr)
            if (endDate < today) {
                endErr = "End date cannot be in the past"
                isValid = false
            } else if (startDateStr && endDateStr) {
                const startDate = new Date(startDateStr)
                if (startDateStr === endDateStr) {
                    endErr = "End date must be different from start date"
                    isValid = false
                } else if (endDate <= startDate) {
                    endErr = "End date must be after start date"
                    isValid = false
                }
            }
        }

        setStartDateError(startErr)
        setEndDateError(endErr)
        return isValid
    }

    // Validate inline auth form
    const validateAuthForm = (): boolean => {
        const newErrors: Record<string, string> = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!authForm.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(authForm.email.trim())) {
            newErrors.email = "Please enter a valid email"
        }

        if (!authForm.password) {
            newErrors.password = "Password is required"
        } else if (authForm.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }

        if (authMode === "register") {
            if (!authForm.fullName.trim()) {
                newErrors.fullName = "Full name is required"
            } else if (authForm.fullName.trim().length < 2) {
                newErrors.fullName = "Name must be at least 2 characters"
            }

            if (!authForm.phone.trim()) {
                newErrors.phone = "Phone number is required"
            } else if (authForm.phone.trim().length < 6) {
                newErrors.phone = "Please enter a valid phone number"
            }

            if (!authForm.confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password"
            } else if (authForm.password !== authForm.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match"
            }
        }

        setAuthErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle inline login
    const handleInlineLogin = async () => {
        if (!validateAuthForm()) return

        setAuthLoading(true)
        setAuthErrors({})

        try {
            await (await import("@/lib/auth-client")).authClient.signIn.email({
                email: authForm.email.trim(),
                password: authForm.password,
            }, {
                onSuccess: () => {
                    setShowAuthModal(false)
                    setAuthForm({ fullName: "", email: "", password: "", confirmPassword: "", phone: "", countryCode: "+212" })
                },
                onError: (ctx) => {
                    const errorMessage = ctx.error.message || "Login failed"
                    const lowerError = errorMessage.toLowerCase()

                    if (lowerError.includes("invalid password") || lowerError.includes("password")) {
                        setAuthErrors({ form: "Invalid email or password" })
                    } else if (lowerError.includes("not found") || lowerError.includes("user not found")) {
                        setAuthErrors({ form: "No account found with this email" })
                    } else if (lowerError.includes("verify") || lowerError.includes("verified")) {
                        setAuthErrors({ form: "Please verify your email before signing in. Check your inbox for the verification link.", isEmailError: "true" })
                    } else {
                        setAuthErrors({ form: errorMessage })
                    }
                }
            })
        } catch {
            setAuthErrors({ form: "Unable to connect to the server. Please try again later.", isServerError: "true" })
        } finally {
            setAuthLoading(false)
        }
    }

    // Handle inline register
    const handleInlineRegister = async () => {
        if (!validateAuthForm()) return

        setAuthLoading(true)
        setAuthErrors({})

        try {
            const fullPhone = `${authForm.countryCode} ${authForm.phone.trim()}`
            await (await import("@/lib/auth-client")).authClient.signUp.email({
                email: authForm.email.trim(),
                password: authForm.password,
                name: authForm.fullName.trim(),
                role: "user",
                phone: fullPhone,
            } as any, {
                onSuccess: () => {
                    setAuthErrors({ form: "Account created! Please check your email for the verification link before booking." })
                    setAuthMode("login")
                },
                onError: (ctx) => {
                    const errorMessage = ctx.error.message || "Registration failed"
                    const lowerError = errorMessage.toLowerCase()

                    if (lowerError.includes("already exists") || lowerError.includes("already registered") || lowerError.includes("user already exists")) {
                        setAuthErrors({ form: "An account with this email already exists. Please sign in instead." })
                    } else if (lowerError.includes("failed to create user") || lowerError.includes("name can only contain")) {
                        setAuthErrors({ form: "Please check your information: Name should only contain letters (no numbers or special characters), and password must be at least 8 characters." })
                    } else if (lowerError.includes("password") || lowerError.includes("at least")) {
                        setAuthErrors({ form: "Password must be at least 8 characters" })
                    } else if (lowerError.includes("email") && (lowerError.includes("send") || lowerError.includes("delivery"))) {
                        setAuthErrors({ form: "Account created but we couldn't send the verification email. Please try resending or contact support.", isEmailError: "true" })
                    } else if (lowerError.includes("email") && lowerError.includes("valid")) {
                        setAuthErrors({ form: "Please enter a valid email address" })
                    } else {
                        setAuthErrors({ form: errorMessage })
                    }
                }
            })
        } catch {
            setAuthErrors({ form: "Unable to connect to the server. Please try again later.", isServerError: "true" })
        } finally {
            setAuthLoading(false)
        }
    }

    // Pre-fill user data when authenticated (only once when user data becomes available)
    const userEmail = user?.email
    const userName = user?.name
    const userVerified = user?.emailVerified
    useEffect(() => {
        if (userEmail && userVerified) {
            setBooking((prev) => {
                // Only update if the fields are empty to avoid overwriting user input
                if (!prev.email && !prev.fullName) {
                    return {
                        ...prev,
                        fullName: userName || "",
                        email: userEmail,
                    }
                }
                return prev
            })
        }
    }, [userEmail, userName, userVerified])

    useEffect(() => {
        if (params.slug) {
            fetchCircuit(params.slug as string)
        }
    }, [params.slug])

    // Fetch payment method enabled status
    useEffect(() => {
        const fetchPaymentSettings = async () => {
            try {
                const res = await fetch("/api/settings")
                if (res.ok) {
                    const data = await res.json()
                    setPaymentMethodsEnabled(data.paymentMethodsEnabled ?? true)
                    setEnabledPaymentMethods(data.enabledPaymentMethods ?? PAYMENT_METHODS.map(m => m.value))
                }
            } catch (error) {
                console.error("Error fetching payment settings:", error)
            }
        }
        fetchPaymentSettings()
    }, [])


    const handleTravelerChange = (type: "adults" | "children" | "infants", delta: number) => {
        setTravelers((prev) => {
            const newValue = Math.max(0, prev[type] + delta)
            // Ensure at least 1 adult
            if (type === "adults" && newValue < 1) return prev

            const newTravelers = { ...prev, [type]: newValue }
            const total = newTravelers.adults + newTravelers.children + newTravelers.infants

            // Build the travelerAges string
            const parts: string[] = []
            if (newTravelers.adults > 0) parts.push(`${newTravelers.adults} adult${newTravelers.adults !== 1 ? "s" : ""}`)
            if (newTravelers.children > 0)
                parts.push(`${newTravelers.children} child${newTravelers.children !== 1 ? "ren" : ""}`)
            if (newTravelers.infants > 0) parts.push(`${newTravelers.infants} infant${newTravelers.infants !== 1 ? "s" : ""}`)

            setBooking((prev) => ({
                ...prev,
                numberOfTravelers: total,
                travelerAges: parts.join(", "),
            }))

            return newTravelers
        })
    }

    const fetchCircuit = async (slug: string) => {
        try {
            const response = await fetch(`/api/circuits/${slug}`)
            if (!response.ok) {
                throw new Error("Circuit not found")
            }
            const data = await response.json()
            setCircuit(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load circuit")
        } finally {
            setLoading(false)
        }
    }

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate dates first
        if (!validateDates()) return

        // If user is not logged in + verified, show auth modal
        if (!user || !userVerified) {
            setShowAuthModal(true)
            return
        }

        setSubmitting(true)
        setBookingError(null)

        try {
            // Use session data for authenticated users
            const submitData = {
                ...booking,
                fullName: user.name || booking.fullName,
                email: user.email || booking.email,
                phone: (user as any).phone || `${booking.countryCode} ${booking.phone}`,
                travelStyle: "Custom Circuit",
                arrivalCity: "N/A",
                departureCity: "N/A",
                accommodation: booking.accommodation,
                budget: "N/A",
                adventureActivities: [],
                desiredExperiences: `Booking for circuit: ${circuit?.name} (${circuit?.slug})`,
                preferredPaymentMethod: booking.preferredPaymentMethod,
            }

            const response = await fetch("/api/trip-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            })

            if (response.ok) {
                router.push('/circuits/thank-you')
                return
            } else {
                const data = await response.json()
                const errorMsg = data.error?.toLowerCase() || ""
                // Check for email-related errors
                if (errorMsg.includes("email") && (errorMsg.includes("send") || errorMsg.includes("failed"))) {
                    setBookingError({ message: "Your booking was saved but we couldn't send the confirmation email. Our team will contact you soon.", isServerError: true })
                } else {
                    setBookingError({ message: data.error || "Failed to send booking request. Please try again.", isServerError: response.status >= 500 })
                }
            }
        } catch (error) {
            console.error("Booking error:", error)
            setBookingError({ message: "Unable to connect to the server. Please check your connection and try again.", isServerError: true })
        } finally {
            setSubmitting(false)
        }
    }

    const renderRichText = (text: string) => {
        if (!text) return ""
        return text
            .replace(/\[CTA\]\s*title:\s*([\s\S]*?)\s*description:\s*([\s\S]*?)\s*button_text:\s*([\s\S]*?)\s*button_link:\s*([\s\S]*?)\s*\[\/CTA\]/g,
                (match, title, desc, btnText, btnLink) => {
                    return `<div class='not-prose bg-muted/30 border border-border rounded-lg p-8 my-8'><h3 class='text-2xl font-bold mb-3 text-foreground'>${title.trim()}</h3><p class='text-muted-foreground mb-6 text-lg'>${desc.trim()}</p><a href='${btnLink.trim()}' class='inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-md transition-colors text-lg no-underline'>${btnText.trim()}</a></div>`
                }
            )
            .replace(/^### (.*?)$/gm, "<h3 class='text-lg font-bold mt-6 mb-4'>$1</h3>")
            .replace(/^## (.*?)$/gm, "<h2 class='text-xl font-bold mt-8 mb-4'>$1</h2>")
            .replace(/^# (.*?)$/gm, "<h1 class='text-2xl font-bold mt-10 mb-6'>$1</h1>")
            .replace(/!\[(.*?)\]\((.*?)\)/g, "<img src='$2' alt='$1' class='rounded-lg my-2 max-w-full' />")
            .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
            .replace(/__(.*?)__/g, "<u class='underline'>$1</u>")
            .replace(/~~(.*?)~~/g, "<s class='line-through'>$1</s>")
            .replace(/`(.*?)`/g, "<code class='bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>")
            .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-primary underline hover:text-primary/80' target='_blank' rel='noopener noreferrer'>$1</a>")
            .replace(/^> (.*?)$/gm, "<blockquote class='border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4'>$1</blockquote>")
            .replace(/\n- /g, "<br />• ")
            .replace(/\n\d+\. /g, "<br />1. ")
            .replace(/\n/g, "<br />")
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background/50 flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
                        <p className="text-muted-foreground text-sm font-medium">Loading details...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (error || !circuit) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-foreground mb-2">Trip Not Found</h1>
                        <p className="text-muted-foreground mb-6">{error || "The requested circuit could not be found."}</p>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8">
                            <Link href="/circuits">Back to Trips</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div >
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent selection:text-accent-foreground">
            <Header />

            <main className="flex-1">
                {/* Soft Hero with minimal overlay */}
                <section className="relative h-[65vh] w-full">
                    {circuit.images[0] ? (
                        <Image
                            src={circuit.images[0]}
                            alt={`${circuit.name} tour hero image`}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                            fetchPriority="high"
                        />
                    ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    )}
                    {/* Softer gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <div className="max-w-7xl mx-auto">
                            <Link
                                href="/circuits"
                                className="inline-flex items-center text-white/95 hover:text-white mb-6 transition-colors text-sm font-medium bg-white/10 px-4 py-2 rounded-md border border-white/20 hover:bg-white/20"
                                aria-label="Back to all trips"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" /> All Trips
                            </Link>
                            <div className="space-y-3 animate-fade-in-up">
                                <span className="inline-block px-4 py-1.5 rounded-md bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-semibold uppercase tracking-wider">
                                    {circuit.category}
                                </span>
                                <div className="flex items-start justify-between">
                                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                                        {circuit.name}
                                    </h1>
                                    <FavoriteButton circuitId={circuit.id} className="mt-2" />
                                </div>
                                {circuit.tagline && (
                                    <p className="text-xl text-white/90 max-w-2xl font-light leading-relaxed">
                                        {circuit.tagline}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content - Minimal aesthetic (no borders, soft shadows) */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* Overview */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h2 className="text-2xl font-semibold text-foreground mb-6">The Experience</h2>
                                <p className="text-muted-foreground leading-loose text-lg font-light">
                                    {circuit.description}
                                </p>
                            </div>

                            {/* Highlights - Soft cards grid */}
                            {circuit.highlights.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Highlights</h2>

                                    <ul className="space-y-4">
                                        {circuit.highlights.map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-500 text-sm">
                                                <Check className="w-4 h-4 mr-3 mt-0.5 text-destructive flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Inclusions - Soft Lists */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-secondary" /> Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {circuit.included.map((item, index) => (
                                                <li key={index} className="flex items-start text-gray-600 text-sm font-medium">
                                                    <Check className="w-4 h-4 mr-3 mt-0.5 text-secondary flex-shrink-0" />
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-destructive/30" /> Not Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {circuit.excluded.map((item, index) => (
                                                <li key={index} className="flex items-start text-gray-500 text-sm">
                                                    <X className="w-4 h-4 mr-3 mt-0.5 text-destructive flex-shrink-0" />
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Optional Activities */}
                            {circuit.optional && circuit.optional.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Optional</h2>

                                    <ul className="space-y-4">
                                        {circuit.optional.map((item, index) => (
                                            <li key={index} className="flex items-start text-gray-500 text-sm">
                                                <Plus className="w-4 h-4 mr-3 mt-0.5 text-primary flex-shrink-0" />
                                                <span className="text-muted-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Itinerary - Minimal Timeline */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                {circuit.itineraryGlance.length > 0 && (
                                    <>
                                        <h2 className="text-2xl font-semibold text-foreground mb-8">Itinerary Overview</h2>
                                        <div className="space-y-0 relative">
                                            {/* Timeline line */}
                                            {/* <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-border" /> */}

                                            {circuit.itineraryGlance.map((day, index) => (
                                                <div key={index} className="relative pl-12 pb-8 last:pb-0 group">
                                                    {/* Dot */}
                                                    <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center z-10 group-hover:border-accent/10 transition-colors">
                                                        <div className="w-3 h-3 rounded-full bg-primary/40" />
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Day {index + 1}</span>
                                                        <h3 className="text-lg font-medium text-foreground">{day}</h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}


                                <div className="mt-10 pt-8 border-t border-border">

                                    {circuit.mapUrl && (
                                        <div className="reletive w-full">
                                            <Image src={circuit.mapUrl} alt="Map" width={400} height={400} className="object-contain rounded-lg mb-6" />
                                        </div>
                                    )}
                                    {circuit.itineraryDetail && (
                                        <>
                                            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                                <Info className="w-5 h-5 text-accent" />
                                                Detailed Itinerary
                                            </h3>
                                            <div
                                                className="prose prose-gray max-w-none text-muted-foreground leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: renderRichText(circuit.itineraryDetail) }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Additional Info */}
                            {circuit.additionalInfo && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Important Notes</h2>
                                    <div
                                        className="prose prose-gray max-w-none text-muted-foreground leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: renderRichText(circuit.additionalInfo) }}
                                    />
                                </div>
                            )}


                        </div>

                        {/* Sidebar - Floating Soft Card */}
                        <div className="lg:col-span-4" id="booking-form-section">
                            <div className="space-y-6">
                                {/* Price Card */}
                                <div className="bg-card rounded-lg p-8 shadow-[0_20px_40px_rgb(0,0,0,0.06)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                                    <div className="relative z-10 mb-8">
                                        <div className="text-center">
                                            <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">From</span>
                                            <div className="flex items-baseline justify-center gap-1 mt-2">
                                                <div className="flex items-baseline gap-4">
                                                    <PriceBadge price={circuit.price} originalPrice={circuit.originalPrice} from={circuit.isFrom} />
                                                </div>
                                                {/* <span className="text-muted-foreground font-medium">/ person</span> */}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-center justify-between p-4 bg-background rounded-lg">
                                            <span className="text-sm text-muted-foreground font-medium">Duration</span>
                                            <div className="flex items-center text-foreground font-semibold">
                                                <Clock className="w-4 h-4 mr-2 text-accent" />
                                                {circuit.duration} Days
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Form - Auth handled on submit */}
                                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                                        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Book This Trip</h3>

                                        <div className="space-y-2">
                                            <Label htmlFor="travelDates" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Earliest Start Date</Label>
                                            <Input
                                                id="travelDates"
                                                type="date"
                                                value={booking.travelDates.split(" to ")[0] || ""}
                                                onChange={(e) => {
                                                    const end = booking.travelDates.split(" to ")[1] || ""
                                                    setBooking({ ...booking, travelDates: `${e.target.value}${end ? ` to ${end}` : ""}` })
                                                    setStartDateError("")
                                                }}
                                                required
                                                className={`bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11 ${startDateError ? "border-destructive" : ""}`}
                                            />
                                            {startDateError && <p className="text-sm text-destructive">{startDateError}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="travelDates2" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Latest End Date</Label>
                                            <Input
                                                id="travelDates2"
                                                type="date"
                                                value={booking.travelDates.split(" to ")[1] || ""}
                                                onChange={(e) => {
                                                    const start = booking.travelDates.split(" to ")[0] || ""
                                                    setBooking({ ...booking, travelDates: `${start ? `${start} to ` : ""}${e.target.value}` })
                                                    setEndDateError("")
                                                }}
                                                required
                                                className={`bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11 ${endDateError ? "border-destructive" : ""}`}
                                            />
                                            {endDateError && <p className="text-sm text-destructive">{endDateError}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold mb-3">Who will be traveling?</label>
                                            <div className="space-y-4 bg-muted/30 p-6 rounded-lg border border-border">
                                                {/* Adults */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-semibold text-foreground">Adults</div>
                                                        <div className="text-sm text-muted-foreground">Above 12</div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTravelerChange("adults", -1)}
                                                            disabled={travelers.adults <= 1}
                                                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:bg-primary/10"
                                                            aria-label="Decrease number of adults"
                                                        >
                                                            <span className="text-xl font-semibold" aria-hidden="true">−</span>
                                                        </button>
                                                        <span className="text-lg font-semibold w-8 text-center" aria-live="polite">{travelers.adults}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTravelerChange("adults", 1)}
                                                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                            aria-label="Increase number of adults"
                                                        >
                                                            <span className="text-xl font-semibold" aria-hidden="true">+</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Children */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-semibold text-foreground">Children</div>
                                                        <div className="text-sm text-muted-foreground">Ages 2-12</div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTravelerChange("children", -1)}
                                                            disabled={travelers.children <= 0}
                                                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:bg-primary/10"
                                                            aria-label="Decrease number of children"
                                                        >
                                                            <span className="text-xl font-semibold" aria-hidden="true">−</span>
                                                        </button>
                                                        <span className="text-lg font-semibold w-8 text-center" aria-live="polite">{travelers.children}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTravelerChange("children", 1)}
                                                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                            aria-label="Increase number of children"
                                                        >
                                                            <span className="text-xl font-semibold" aria-hidden="true">+</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Infants */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-semibold text-foreground">Infants</div>
                                                        <div className="text-sm text-muted-foreground">Under 2</div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTravelerChange("infants", -1)}
                                                            disabled={travelers.infants <= 0}
                                                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:bg-primary/10"
                                                            aria-label="Decrease number of infants"
                                                        >
                                                            <span className="text-xl font-semibold" aria-hidden="true">−</span>
                                                        </button>
                                                        <span className="text-lg font-semibold w-8 text-center" aria-live="polite">{travelers.infants}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTravelerChange("infants", 1)}
                                                            className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                            aria-label="Increase number of infants"
                                                        >
                                                            <span className="text-xl font-semibold" aria-hidden="true">+</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Accommodation Dropdown */}
                                        <div className="space-y-2">
                                            <Label htmlFor="accommodation" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Accommodation</Label>
                                            <select
                                                id="accommodation"
                                                value={booking.accommodation}
                                                onChange={(e) => setBooking({ ...booking, accommodation: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-md focus:ring-orange-200 h-11 px-3 text-sm"
                                            >
                                                <option value="Standard">Standard</option>
                                                <option value="Comfort">Comfort</option>
                                                <option value="Luxury">Luxury</option>
                                            </select>
                                        </div>

                                        {/* Payment Method Dropdown */}
                                        {paymentMethodsEnabled && enabledPaymentMethods.length > 0 && (
                                            <div className="space-y-2">
                                                <Label htmlFor="paymentMethod" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Preferred Payment</Label>
                                                <select
                                                    id="paymentMethod"
                                                    value={booking.preferredPaymentMethod}
                                                    onChange={(e) => setBooking({ ...booking, preferredPaymentMethod: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-md focus:ring-orange-200 h-11 px-3 text-sm"
                                                >
                                                    <option value="">Select payment method (optional)</option>
                                                    {PAYMENT_METHODS.filter(m => enabledPaymentMethods.includes(m.value)).map((method) => (
                                                        <option key={method.value} value={method.value}>{method.label}</option>
                                                    ))}
                                                </select>

                                                {/* Deposit Payment Info */}
                                                {booking.preferredPaymentMethod === "Deposit Payment" && (
                                                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm space-y-1">
                                                        <p className="font-semibold text-foreground">Deposit Payment Information:</p>
                                                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                            <li>To confirm your booking, a 20% deposit is required.</li>
                                                            <li>The remaining balance will be paid in cash upon arrival in Morocco.</li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* User Badge or Contact Fields */}
                                        {user && userVerified ? (
                                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {user.name?.[0]?.toUpperCase() || "U"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-foreground truncate">{user.name}</p>
                                                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                                    </div>
                                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground text-center py-2">
                                                You'll need to sign in to complete your booking
                                            </div>
                                        )}

                                        {/* Booking error message */}
                                        {bookingError && (
                                            <div className={`px-4 py-3 rounded text-sm mb-4 ${bookingError.isServerError ? "bg-amber-500/10 text-amber-800 border border-amber-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                                                <p>{bookingError.message}</p>
                                                {bookingError.isServerError && (
                                                    <Link
                                                        href="/contact"
                                                        className="inline-flex items-center gap-1 mt-2 text-sm font-medium underline underline-offset-2 hover:no-underline"
                                                    >
                                                        Contact Support
                                                    </Link>
                                                )}
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 text-base font-medium shadow-lg shadow-gray-900/10 mt-4"
                                        >
                                            {submitting ? "Sending Request..." : "Request This Trip"}
                                        </Button>
                                        <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
                                            Request your bespoke Morocco itinerary and receive a professionally crafted, no-obligation proposal within 48 hours.
                                        </p>
                                    </form>

                                    {/* Auth Modal for guests */}
                                    {showAuthModal && (
                                        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                            <div className="bg-card border border-border rounded-xl shadow-lg max-w-md w-full p-6 overflow-auto max-h-[90vh]">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h2 className="text-xl font-bold">Sign in to Book</h2>
                                                    <button onClick={() => { setShowAuthModal(false); setAuthErrors({}) }} className="text-muted-foreground hover:text-foreground">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* Auth mode toggle */}
                                                <div className="flex mb-6 bg-muted/50 rounded-lg p-1">
                                                    <button
                                                        type="button"
                                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                                                        onClick={() => { setAuthMode("login"); setAuthErrors({}) }}
                                                    >
                                                        Sign In
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMode === "register" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                                                        onClick={() => { setAuthMode("register"); setAuthErrors({}) }}
                                                    >
                                                        Create Account
                                                    </button>
                                                </div>

                                                {/* Registration form fields */}
                                                {authMode === "register" && (
                                                    <div className="space-y-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-2">Full Name</label>
                                                            <Input
                                                                value={authForm.fullName}
                                                                onChange={(e) => setAuthForm(prev => ({ ...prev, fullName: e.target.value }))}
                                                                placeholder="John Doe"
                                                                maxLength={30}
                                                                className={authErrors.fullName ? "border-destructive" : ""}
                                                            />
                                                            {authErrors.fullName && <p className="text-sm text-destructive mt-1">{authErrors.fullName}</p>}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Email field (both modes) */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-2">Email</label>
                                                    <Input
                                                        type="email"
                                                        value={authForm.email}
                                                        onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                                                        placeholder="you@example.com"
                                                        maxLength={40}
                                                        className={authErrors.email ? "border-destructive" : ""}
                                                    />
                                                    {authErrors.email && <p className="text-sm text-destructive mt-1">{authErrors.email}</p>}
                                                </div>

                                                {/* Phone field (register only) */}
                                                {authMode === "register" && (
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                                                        <div className="flex gap-2">
                                                            <CountryCodeSelect
                                                                value={authForm.countryCode}
                                                                onChange={(val) => setAuthForm(prev => ({ ...prev, countryCode: val }))}
                                                            />
                                                            <Input
                                                                type="tel"
                                                                value={authForm.phone}
                                                                onChange={(e) => setAuthForm(prev => ({ ...prev, phone: e.target.value }))}
                                                                placeholder="123 456 7890"
                                                                maxLength={12}
                                                                className={`flex-1 ${authErrors.phone ? "border-destructive" : ""}`}
                                                            />
                                                        </div>
                                                        {authErrors.phone && <p className="text-sm text-destructive mt-1">{authErrors.phone}</p>}
                                                    </div>
                                                )}

                                                {/* Password field */}
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-2">Password</label>
                                                    <Input
                                                        type="password"
                                                        value={authForm.password}
                                                        onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                                                        placeholder="••••••••"
                                                        className={authErrors.password ? "border-destructive" : ""}
                                                    />
                                                    {authErrors.password && <p className="text-sm text-destructive mt-1">{authErrors.password}</p>}
                                                </div>

                                                {/* Confirm password (register only) */}
                                                {authMode === "register" && (
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                                        <Input
                                                            type="password"
                                                            value={authForm.confirmPassword}
                                                            onChange={(e) => setAuthForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                            placeholder="••••••••"
                                                            className={authErrors.confirmPassword ? "border-destructive" : ""}
                                                        />
                                                        {authErrors.confirmPassword && <p className="text-sm text-destructive mt-1">{authErrors.confirmPassword}</p>}
                                                    </div>
                                                )}

                                                {/* Form error message */}
                                                {authErrors.form && (
                                                    <div className={`px-4 py-3 rounded text-sm mb-4 ${authErrors.form.includes("verify") || authErrors.form.includes("check") || authErrors.form.includes("created") ? "bg-primary/10 text-primary border border-primary/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                                                        <p>{authErrors.form}</p>
                                                        {(authErrors.isServerError || authErrors.isEmailError) && (
                                                            <Link
                                                                href="/contact"
                                                                className="inline-flex items-center gap-1 mt-2 text-sm font-medium underline underline-offset-2 hover:no-underline"
                                                            >
                                                                Contact Support
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Submit button */}
                                                <Button
                                                    type="button"
                                                    onClick={authMode === "login" ? handleInlineLogin : handleInlineRegister}
                                                    disabled={authLoading}
                                                    className="w-full"
                                                >
                                                    {authLoading
                                                        ? (authMode === "login" ? "Signing in..." : "Creating account...")
                                                        : (authMode === "login" ? "Sign In & Book" : "Create Account & Book")
                                                    }
                                                </Button>

                                                {authMode === "login" && (
                                                    <p className="text-center text-sm text-muted-foreground mt-4">
                                                        <Link href="/forgot-password" className="text-primary hover:underline">
                                                            Forgot your password?
                                                        </Link>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <MobileBottomCTA
                buttonText="Request This Tour"
                onButtonClick={() => document.getElementById('booking-form-section')?.scrollIntoView({ behavior: 'smooth' })}
                price={circuit.price}
                originalPrice={circuit.originalPrice}
                isFrom={circuit.isFrom}
            />

            <Footer />
        </div>
    )
}
