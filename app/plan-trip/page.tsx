"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { authClient } from "@/lib/auth-client"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import {
    Check,
    ChevronRight,
    ChevronLeft,
    Users,
    Calendar,
    MapPin,
    Home,
    DollarSign,
    Heart,
    User,
    Sparkles,
    Plane,
    Star,
    Mail,
    Lock,
    Phone,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

const STEPS = [
    { id: 1, name: "Travel Style", icon: Users },
    { id: 2, name: "When & Where", icon: MapPin },
    { id: 3, name: "Preferences", icon: Heart },
    { id: 4, name: "Complete", icon: Mail },
]

// Accommodation levels defined outside component to prevent re-renders
const ACCOMMODATION_LEVELS = [
    {
        name: "Standard",
        stars: 3,
        iconSrc: "/furniture-bedroom-single-bed.svg",
    },
    {
        name: "Comfort",
        stars: 4,
        iconSrc: "/double-bed-bedroom-pillow.svg",
    },
    {
        name: "Luxury",
        stars: 5,
        iconSrc: "/double-bed-bedroom-pillow.svg",
        extraIconSrc: "/nightstand.svg",
    },
]

export default function PlanTripPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [travelers, setTravelers] = useState({
        adults: 2,
        children: 0,
        infants: 0,
    })
    const [formData, setFormData] = useState({
        travelStyle: "",
        travelDates: "",
        arrivalCity: "",
        departureCity: "",
        accommodation: "",
        budget: "",
        adventureActivities: [] as string[],
        experiences: [] as string[],
        importantFactors: [] as string[],
        desiredExperiences: "",
        transportation: "",
        importantCriteria: "",
        numberOfTravelers: 2,
        travelerAges: "2 adults",
        extraDetails: "",
        fullName: "",
        email: "",
        phone: "",
        countryCode: "+1",
        preferredPaymentMethod: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    // Hardcoded payment method options with icons
    const PAYMENT_METHODS = [
        { value: "Deposit Payment", label: "Deposit Payment", icon: "/deposit-payment-icon.png" },
        { value: "Bank Transfer / SWIFT", label: "Bank Transfer / SWIFT", icon: "/bank-transfer-icon.svg" },
        { value: "Credit Cards", label: "Credit Cards (Visa, Mastercard, Amex)", icon: "/credit-card-icon.svg" },
        { value: "PayPal", label: "PayPal", icon: "/paypal-icon.svg" },
        { value: "Payoneer", label: "Payoneer", icon: "/payoneer-icon.svg" },
    ]
    const [paymentMethodsEnabled, setPaymentMethodsEnabled] = useState(true)
    const [enabledPaymentMethods, setEnabledPaymentMethods] = useState<string[]>(PAYMENT_METHODS.map(m => m.value))

    // Separate state for slider display to prevent full form re-renders
    const [sliderBudget, setSliderBudget] = useState<number>(500)

    // Inline auth form state
    const [authMode, setAuthMode] = useState<"login" | "register">("login")
    const [authForm, setAuthForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        countryCode: "+1",
    })
    const [authErrors, setAuthErrors] = useState<Record<string, string>>({})
    const [authLoading, setAuthLoading] = useState(false)

    // Pre-fill user data when authenticated (only once when user data becomes available)
    const userEmail = user?.email
    const userName = user?.name
    const userVerified = user?.emailVerified
    useEffect(() => {
        if (userEmail && userVerified) {
            setFormData((prev) => {
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

    // Auto-set travelers when travel style is solo or couple
    useEffect(() => {
        if (formData.travelStyle === "solo") {
            setTravelers({ adults: 1, children: 0, infants: 0 })
            setFormData((prev) => ({
                ...prev,
                numberOfTravelers: 1,
                travelerAges: "1 adult",
            }))
        } else if (formData.travelStyle === "couple") {
            setTravelers({ adults: 2, children: 0, infants: 0 })
            setFormData((prev) => ({
                ...prev,
                numberOfTravelers: 2,
                travelerAges: "2 adults",
            }))
        }
    }, [formData.travelStyle])

    const experiencesList = [
        {
            name: "History & culture",
            image: "https://images.unsplash.com/photo-1677860659944-232d921b6d61?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Nature & landscapes",
            image: "https://images.unsplash.com/photo-1716240772720-81a703864c6e?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Wildlife & safari",
            image: "https://images.unsplash.com/photo-1674336636823-d0d472fbc846?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Relaxation & wellness",
            image: "https://images.unsplash.com/photo-1494719019271-7bfff81660d2?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Active & adventure",
            image: "https://images.unsplash.com/photo-1535191162489-aaec838b5221?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Luxury travel",
            image: "https://images.unsplash.com/photo-1624804823268-7d5454caa8c8?q=80&w=400&h=300&fit=crop",
        },
    ]

    const importantFactorsList = [
        {
            name: "Historical Sites, Museums & Monuments",
            description:
                "Immerse yourself in the hustle and bustle of Morocco's cities as you explore labyrinthine backstreets, architecture dating back centuries, and souks brimming with spices, wool rugs, and more.",
            image: "https://images.unsplash.com/photo-1763146741803-ad266856fd5d?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Nature & Outdoors",
            description:
                "From the snowcapped Atlas mountains to the undulating dunes of the Sahara desert and out to the vast coastline, discover Morocco's natural wonders on hikes, nature tours, and other outdoor excursions.",
            image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Active Vacation",
            description:
                "Morocco offers limitless options for adventure, including mountain hikes through Berber villages, camel rides in the desert, sandboarding down the Sahara dunes, galloping on horseback along the beach, and more.",
            image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Local Cuisine",
            description:
                "Experience the highlights of Moroccan cuisine, from cooking classes and market visits to wine tastings in beautiful vineyards and enjoying a home-cooked tajine in the company of locals.",
            image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Experience Culture & Local Life",
            description:
                "Immerse yourself in local life by exploring small villages, getting lost in quirky souqs, and sipping on chai nana (mint tea) on a café patio while enjoying the culture around you.",
            image: "https://images.unsplash.com/flagged/photo-1591534907501-99a5d580c876?q=80&w=400&h=300&fit=crop",
        },
    ]

    const activities = [
        {
            name: "Long Hikes (4 hrs-Full Day)",
            description:
                "Get the blood pumping on scenic day hikes like the summit trek up Mount Toubkal or the High Atlas trail.",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Multi-Day Trekking",
            description:
                "Pack your overnight gear and head out on multi-day treks throughout Morocco from High Atlas to Sahara.",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Horseback Riding",
            description: "Experience the beauty of Morocco on horseback as you gallop through the surf near Essaouira.",
            image: "https://images.unsplash.com/photo-1566673186995-e3f5e6fbaf80?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Surfing",
            description:
                "Explore Morocco's long coastline, a prime surf destination for beginners and experienced wave riders.",
            image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "ATV",
            description:
                "Hop on an ATV and zip around the gorges of the High Atlas mountains or the arid hills of Agafay Desert.",
            image: "https://images.unsplash.com/photo-1701257868711-e9bbfb8b22fc?q=80&w=400&h=300&fit=crop",
        },
        {
            name: "Hot Air Balloon",
            description: "Experience breathtaking views of the Atlas Mountains and local landscapes from a hot air balloon.",
            image: "https://images.unsplash.com/photo-1675782222193-eac743938486?q=80&w=400&h=300&fit=crop",
        },
    ]

    const handleActivityToggle = (activity: string) => {
        setFormData((prev) => ({
            ...prev,
            adventureActivities: prev.adventureActivities.includes(activity)
                ? prev.adventureActivities.filter((a) => a !== activity)
                : [...prev.adventureActivities, activity],
        }))
    }

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

            setFormData((prev) => ({
                ...prev,
                numberOfTravelers: total,
                travelerAges: parts.join(", "),
            }))

            return newTravelers
        })
    }

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {}
        const nameRegex = /^[a-zA-Z\s]+$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^[0-9]+$/
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (step === 1) {
            if (!formData.travelStyle) newErrors.travelStyle = "Please select your travel style"
            // Only validate number of travelers for family/group
            if ((formData.travelStyle === "family" || formData.travelStyle === "group") &&
                (!formData.numberOfTravelers || formData.numberOfTravelers < 1)) {
                newErrors.numberOfTravelers = "Please enter number of travelers"
            }
        } else if (step === 2) {
            const dates = formData.travelDates.split(" to ")
            const startDateStr = dates[0] || ""
            const endDateStr = dates[1] || ""

            // Separate validation for start date
            if (!startDateStr) {
                newErrors.startDate = "Start date is required"
            } else {
                const startDate = new Date(startDateStr)
                if (startDate < today) {
                    newErrors.startDate = "Start date cannot be in the past"
                }
            }

            // Separate validation for end date
            if (!endDateStr) {
                newErrors.endDate = "End date is required"
            } else {
                const endDate = new Date(endDateStr)
                if (endDate < today) {
                    newErrors.endDate = "End date cannot be in the past"
                } else if (startDateStr && endDateStr) {
                    const startDate = new Date(startDateStr)
                    if (startDateStr === endDateStr) {
                        newErrors.endDate = "End date must be different from start date"
                    } else if (endDate <= startDate) {
                        newErrors.endDate = "End date must be after start date"
                    }
                }
            }
            if (!formData.arrivalCity) newErrors.arrivalCity = "Please select arrival city"
            if (!formData.departureCity) newErrors.departureCity = "Please select departure city"
        } else if (step === 3) {
            if (!formData.accommodation) newErrors.accommodation = "Please select accommodation"
            if (!formData.budget) newErrors.budget = "Please select budget"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
            window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
            // Scroll to first error with a slight delay to ensure UI updates
            setTimeout(() => {
                const firstErrorField = document.querySelector('[class*="border-destructive"], [class*="text-destructive"]')
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" })
                }
            }, 100)
        }
    }

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
        window.scrollTo({ top: 0, behavior: "smooth" })
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
            await authClient.signIn.email({
                email: authForm.email.trim(),
                password: authForm.password,
            }, {
                onSuccess: () => {
                    // User state will update automatically
                },
                onError: (ctx) => {
                    // Map common error codes to user-friendly messages
                    const errorMessage = ctx.error.message || "Login failed"
                    if (errorMessage.includes("Invalid password") || errorMessage.includes("password")) {
                        setAuthErrors({ form: "Invalid email or password" })
                    } else if (errorMessage.includes("not found") || errorMessage.includes("User not found")) {
                        setAuthErrors({ form: "No account found with this email" })
                    } else if (errorMessage.includes("verified") || errorMessage.includes("verify")) {
                        setAuthErrors({ form: "Please verify your email before logging in" })
                    } else {
                        setAuthErrors({ form: errorMessage })
                    }
                }
            })
        } catch {
            setAuthErrors({ form: "An error occurred during login" })
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
            await authClient.signUp.email({
                email: authForm.email.trim(),
                password: authForm.password,
                name: authForm.fullName.trim(),
                role: "user",
                phone: fullPhone,
            } as any, {
                onSuccess: () => {
                    setAuthErrors({ form: "Please check your email to verify your account, then come back to submit your request!" })
                },
                onError: (ctx) => {
                    // Map common error codes to user-friendly messages
                    const errorMessage = ctx.error.message || "Registration failed"
                    const lowerError = errorMessage.toLowerCase()

                    if (lowerError.includes("already exists") || lowerError.includes("already registered") || lowerError.includes("user already exists")) {
                        setAuthErrors({ form: "An account with this email already exists. Please sign in instead." })
                    } else if (lowerError.includes("failed to create user") || lowerError.includes("name can only contain")) {
                        // Better Auth wraps validation errors as "Failed to create user"
                        // The actual error is logged server-side, so provide helpful guidance
                        setAuthErrors({ form: "Please check your information: Name should only contain letters (no numbers or special characters), and password must be at least 8 characters." })
                    } else if (lowerError.includes("password") || lowerError.includes("at least")) {
                        setAuthErrors({ form: "Password must be at least 8 characters" })
                    } else if (lowerError.includes("email") && lowerError.includes("valid")) {
                        setAuthErrors({ form: "Please enter a valid email address" })
                    } else {
                        setAuthErrors({ form: errorMessage })
                    }
                }
            })
        } catch {
            setAuthErrors({ form: "An error occurred during registration. Please check your information and try again." })
        } finally {
            setAuthLoading(false)
        }
    }

    const handleSubmit = async () => {
        // Validate contact fields if not authenticated
        if (!user?.emailVerified) {
            const nameRegex = /^[a-zA-Z\s]+$/
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const phoneRegex = /^[0-9]+$/
            const newErrors: Record<string, string> = {}

            if (!formData.fullName.trim()) {
                newErrors.fullName = "Please enter your full name"
            } else if (!nameRegex.test(formData.fullName.trim())) {
                newErrors.fullName = "Name can only contain letters and spaces"
            } else if (formData.fullName.trim().length > 50) {
                newErrors.fullName = "Name is too long (max 50 characters)"
            }

            if (!formData.email.trim()) {
                newErrors.email = "Please enter your email"
            } else if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = "Please enter a valid email address"
            } else if (formData.email.trim().length > 100) {
                newErrors.email = "Email is too long (max 100 characters)"
            }

            if (!formData.phone.trim()) {
                newErrors.phone = "Please enter your phone number"
            } else if (!phoneRegex.test(formData.phone.trim())) {
                newErrors.phone = "Phone can only contain numbers"
            } else if (formData.phone.trim().length > 20) {
                newErrors.phone = "Phone number is too long (max 20 digits)"
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(prev => ({ ...prev, ...newErrors }))
                return
            }
        }

        setSubmitting(true)
        try {
            const response = await fetch("/api/trip-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    fullName: user?.emailVerified ? (user.name || formData.fullName) : formData.fullName,
                    email: user?.emailVerified ? user.email : formData.email,
                    phone: user?.emailVerified ? ((user as any).phone || `${formData.countryCode} ${formData.phone}`) : `${formData.countryCode} ${formData.phone}`,
                    preferredPaymentMethod: formData.preferredPaymentMethod,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to submit")
            }

            router.push('/plan-trip/thank-you')
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to submit request")
        } finally {
            setSubmitting(false)
        }
    }



    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Plan Your Dream Trip</h1>
                        <div className="max-w-2xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                                    <Image src="/agent-2.webp" alt="Abdellatif" fill className="object-cover" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                        Let&apos;s together create a dream Morocco tour
                                        <Sparkles className="w-5 h-5 text-primary opacity-50" />
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm italic">
                                        &quot;Hello, I&apos;m Abdellatif, Moroccohive&apos;s personal contact! I&apos;ll walk you through
                                        the form to construct your ideal tour over the course of the next three minutes. After you&apos;re
                                        done, a local expert will respond to you with a first customized travel suggestion in no more than
                                        48 hours (and often quicker).&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex items-center justify-center gap-x-3 text-xs text-muted-foreground mb-8 whitespace-nowrap">
                        <span>Free consultation</span>
                        <span className="text-border">·</span>
                        <span>No credit card required</span>
                        <span className="text-border">·</span>
                        <span>Reply within 48h</span>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between">
                            {STEPS.map((step, index) => {
                                const Icon = step.icon
                                const isActive = currentStep === step.id
                                const isCompleted = currentStep > step.id

                                return (
                                    <div key={step.id} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center relative flex-1">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center border-1 transition-all ${isCompleted
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : isActive
                                                        ? "bg-primary/10 border-primary text-primary"
                                                        : "bg-muted border-border text-muted-foreground"
                                                    }`}
                                            >
                                                {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                            </div>
                                            <p
                                                className={`mt-2 text-sm text-nowrap font-medium ${isActive ? "text-foreground" : "text-muted-foreground"
                                                    }`}
                                            >
                                                {step.name}
                                            </p>
                                        </div>
                                        {/* {index < STEPS.length - 1 && (
                                            <div
                                                className={`h-0.5 flex-1 mx-2 ${isCompleted ? "bg-primary" : "bg-border"
                                                    }`}
                                            />
                                        )} */}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                        {/* Step 1: Travel Style */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center mb-6">
                                    <Users className="w-12 h-12 text-primary mx-auto mb-3" />
                                    <h2 className="text-2xl font-bold mb-2">Who&apos;s Traveling?</h2>
                                    <p className="text-muted-foreground">Help us understand your group</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3">Travel Style</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {["Solo", "Couple", "Family", "Group"].map((style) => (
                                            <button
                                                key={style}
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, travelStyle: style.toLowerCase() }))}
                                                className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${formData.travelStyle === style.toLowerCase()
                                                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-lg"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                <div className="flex justify-center mb-3">
                                                    {style === "Solo" && <User className="w-8 h-8 text-primary/60" />}
                                                    {style === "Couple" && <Heart className="w-8 h-8 text-primary/60" />}
                                                    {style === "Family" && <Users className="w-8 h-8 text-primary/60" />}
                                                    {style === "Group" && <Users className="w-8 h-8 text-primary/60" />}
                                                </div>
                                                <span className="text-sm font-semibold tracking-wide uppercase">{style}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.travelStyle && <p className="text-sm text-destructive mt-2">{errors.travelStyle}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3">Who will be traveling?</label>

                                    {/* Show simplified summary for solo/couple */}
                                    {(formData.travelStyle === "solo" || formData.travelStyle === "couple") ? (
                                        <div className="bg-muted/30 p-6 rounded-lg border border-border">
                                            <div className="text-center">
                                                <div className="text-lg font-semibold text-foreground mb-1">
                                                    {formData.travelStyle === "solo" ? "1 Adult" : "2 Adults"}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {formData.travelStyle === "solo"
                                                        ? "Solo travel selected"
                                                        : "Couple travel selected"}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Show full travelers selection for family/group */
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
                                                    >
                                                        <span className="text-xl font-semibold">−</span>
                                                    </button>
                                                    <span className="text-lg font-semibold w-8 text-center">{travelers.adults}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTravelerChange("adults", 1)}
                                                        className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                    >
                                                        <span className="text-xl font-semibold">+</span>
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
                                                    >
                                                        <span className="text-xl font-semibold">−</span>
                                                    </button>
                                                    <span className="text-lg font-semibold w-8 text-center">{travelers.children}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTravelerChange("children", 1)}
                                                        className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                    >
                                                        <span className="text-xl font-semibold">+</span>
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
                                                    >
                                                        <span className="text-xl font-semibold">−</span>
                                                    </button>
                                                    <span className="text-lg font-semibold w-8 text-center">{travelers.infants}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTravelerChange("infants", 1)}
                                                        className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                    >
                                                        <span className="text-xl font-semibold">+</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Summary */}
                                            <div className="pt-4 border-t border-border">
                                                <div className="text-sm text-muted-foreground">
                                                    Total travelers:{" "}
                                                    <span className="font-semibold text-foreground">{formData.numberOfTravelers}</span>
                                                </div>
                                                {formData.travelerAges && (
                                                    <div className="text-sm text-muted-foreground mt-1">{formData.travelerAges}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {errors.numberOfTravelers && (
                                        <p className="text-sm text-destructive mt-2">{errors.numberOfTravelers}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: When & Where */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center mb-6">
                                    <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                                    <h2 className="text-2xl font-bold mb-2">When & Where?</h2>
                                    <p className="text-muted-foreground">Plan your journey through Morocco</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-4">
                                        <Calendar className="inline w-4 h-4 mr-1 text-primary" />
                                        Travel Window
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                                                Earliest Start Date
                                            </Label>
                                            <Input
                                                type="date"
                                                value={formData.travelDates.split(" to ")[0] || ""}
                                                onChange={(e) => {
                                                    const end = formData.travelDates.split(" to ")[1] || ""
                                                    setFormData({ ...formData, travelDates: `${e.target.value}${end ? ` to ${end}` : ""}` })
                                                    setErrors(prev => ({ ...prev, startDate: "" }))
                                                }}
                                                className={`bg-background h-11 border-border focus:ring-primary/20 ${errors.startDate ? "border-destructive" : ""}`}
                                            />
                                            {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">
                                                Latest End Date
                                            </Label>
                                            <Input
                                                type="date"
                                                value={formData.travelDates.split(" to ")[1] || ""}
                                                onChange={(e) => {
                                                    const start = formData.travelDates.split(" to ")[0] || ""
                                                    setFormData({ ...formData, travelDates: `${start ? `${start} to ` : ""}${e.target.value}` })
                                                    setErrors(prev => ({ ...prev, endDate: "" }))
                                                }}
                                                className={`bg-background h-11 border-border focus:ring-primary/20 ${errors.endDate ? "border-destructive" : ""}`}
                                            />
                                            {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="arrivalCity" className="block text-sm font-semibold mb-2">
                                            <Plane className="inline w-4 h-4 mr-1" />
                                            Arrival City
                                        </label>
                                        <select
                                            id="arrivalCity"
                                            value={formData.arrivalCity}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, arrivalCity: e.target.value }))}
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        >
                                            <option value="">Select city</option>
                                            <option value="Marrakech">Marrakech</option>
                                            <option value="Casablanca">Casablanca</option>
                                            <option value="Fes">Fes</option>
                                            <option value="Tangier">Tangier</option>
                                            <option value="Agadir">Agadir</option>
                                            <option value="Ouarzazate">Ouarzazate</option>
                                            <option value="Essaouira">Essaouira</option>
                                            <option value="Rabat">Rabat</option>
                                        </select>
                                        {errors.arrivalCity && <p className="text-sm text-destructive mt-2">{errors.arrivalCity}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="departureCity" className="block text-sm font-semibold mb-2">
                                            <Plane className="inline w-4 h-4 mr-1 transform rotate-45" />
                                            Departure City
                                        </label>
                                        <select
                                            id="departureCity"
                                            value={formData.departureCity}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, departureCity: e.target.value }))}
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        >
                                            <option value="">Select city</option>
                                            <option value="Marrakech">Marrakech</option>
                                            <option value="Casablanca">Casablanca</option>
                                            <option value="Fes">Fes</option>
                                            <option value="Tangier">Tangier</option>
                                            <option value="Agadir">Agadir</option>
                                            <option value="Ouarzazate">Ouarzazate</option>
                                            <option value="Essaouira">Essaouira</option>
                                            <option value="Rabat">Rabat</option>
                                        </select>
                                        {errors.departureCity && <p className="text-sm text-destructive mt-2">{errors.departureCity}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Preferences */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center mb-6">
                                    <Heart className="w-12 h-12 text-primary mx-auto mb-3" />
                                    <h2 className="text-2xl font-bold mb-2">Your Preferences</h2>
                                    <p className="text-muted-foreground">Customize your perfect experience</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-6 text-center">
                                        What is your preferred accommodation type?
                                    </label>
                                    <div className="grid grid-cols-3 justify-items-center gap-4 md:gap-8 lg:gap-12">
                                        {ACCOMMODATION_LEVELS.map((level) => (
                                            <button
                                                key={level.name}
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, accommodation: level.name.toLowerCase() }))}
                                                className="flex flex-col cursor-pointer items-center group w-full"
                                            >
                                                <div
                                                    className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border border-border/50 flex flex-col items-center justify-center transition-all duration-300 ${formData.accommodation === level.name.toLowerCase()
                                                        ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)] scale-110"
                                                        : "bg-card group-hover:border-primary/30 group-hover:bg-primary/[0.02]"
                                                        }`}
                                                >
                                                    <div className="flex mb-2 sm:mb-3">
                                                        {Array.from({ length: level.stars }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 fill-primary text-primary ${i > 0 ? "ml-0.5" : ""}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="relative flex items-end justify-center">
                                                        <Image src={level.iconSrc} alt={level.name} width={40} height={40} />
                                                        {level.extraIconSrc && (
                                                            <Image className="pb-3" src={level.extraIconSrc} alt="" width={20} height={20} />
                                                        )}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`mt-3 sm:mt-4 md:mt-5 font-bold tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 ${formData.accommodation === level.name.toLowerCase() ? "text-primary scale-110" : "text-muted-foreground/70"}`}
                                                >
                                                    {level.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.accommodation && (
                                        <p className="text-sm text-center text-destructive mt-6">{errors.accommodation}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="budget" className="block text-sm font-semibold mb-2">
                                        <DollarSign className="inline w-4 h-4 mr-1" />
                                        Budget Range (per person)
                                    </label>

                                    <select
                                        id="budget"
                                        value={formData.budget}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                                        className="w-full px-4 py-3 cursor-pointer border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                    >
                                        <option value="">Select budget</option>
                                        <option value="$500-$1000">$500-$1000</option>
                                        <option value="$1000-$2000">$1000-$2000</option>
                                        <option value="$2000-$3500">$2000-$3500</option>
                                        <option value="$3500+">$3500+</option>
                                    </select>
                                    {errors.budget && <p className="text-sm text-destructive mt-2">{errors.budget}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-4">Adventure Activities (Optional)</label>
                                    <div className="space-y-4">
                                        {activities.map((activity) => (
                                            <div
                                                key={activity.name}
                                                onClick={() => handleActivityToggle(activity.name)}
                                                className={`flex flex-col sm:flex-row items-center p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-accent/5 ${formData.adventureActivities.includes(activity.name)
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center mb-3 sm:mb-0 sm:mr-6 shrink-0 transition-colors ${formData.adventureActivities.includes(activity.name)
                                                        ? "bg-primary border-primary"
                                                        : "border-muted-foreground/30"
                                                        }`}
                                                >
                                                    {formData.adventureActivities.includes(activity.name) && (
                                                        <Check className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                                <div className="relative w-full sm:w-32 h-32 sm:h-20 rounded-lg overflow-hidden shrink-0 mb-3 sm:mb-0 sm:mr-6">
                                                    <Image
                                                        src={activity.image || "/placeholder.svg"}
                                                        alt={activity.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="text-center sm:text-left w-full">
                                                    <h4 className="font-bold text-lg mb-1">{activity.name}</h4>
                                                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-6 text-center">
                                        What experiences are you looking for in Morocco? (Optional)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                        {experiencesList.map((exp) => (
                                            <button
                                                key={exp.name}
                                                type="button"
                                                onClick={() => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        experiences: prev.experiences.includes(exp.name)
                                                            ? prev.experiences.filter((e) => e !== exp.name)
                                                            : [...prev.experiences, exp.name],
                                                    }))
                                                }}
                                                className={`group relative cursor-pointer aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${formData.experiences.includes(exp.name)
                                                    ? "border-primary shadow-lg scale-[1.02]"
                                                    : "border-transparent hover:border-primary/40"
                                                    }`}
                                            >
                                                <Image
                                                    src={exp.image || "/placeholder.svg"}
                                                    alt={exp.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div
                                                    className={`absolute inset-0 bg-black/40 transition-opacity ${formData.experiences.includes(exp.name) ? "opacity-20" : "group-hover:opacity-30"}`}
                                                />
                                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                    <span className="text-white text-xs md:text-sm font-bold block">{exp.name}</span>
                                                </div>
                                                <div
                                                    className={`absolute top-2 right-2 w-5 h-5 rounded-full border border-white/50 flex items-center justify-center transition-all ${formData.experiences.includes(exp.name)
                                                        ? "bg-primary border-primary scale-110"
                                                        : "bg-black/20"
                                                        }`}
                                                >
                                                    {formData.experiences.includes(exp.name) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-6 text-center">
                                        Which of the following are important for this trip to Morocco? (Optional)
                                    </label>
                                    <div className="space-y-4 mb-8">
                                        {importantFactorsList.map((factor) => (
                                            <div
                                                key={factor.name}
                                                onClick={() => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        importantFactors: prev.importantFactors.includes(factor.name)
                                                            ? prev.importantFactors.filter((f) => f !== factor.name)
                                                            : [...prev.importantFactors, factor.name],
                                                    }))
                                                }}
                                                className={`flex flex-col sm:flex-row items-center p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-accent/5 ${formData.importantFactors.includes(factor.name)
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border"
                                                    }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 shrink-0 transition-colors ${formData.importantFactors.includes(factor.name)
                                                        ? "bg-primary border-primary"
                                                        : "border-muted-foreground/30"
                                                        }`}
                                                >
                                                    {formData.importantFactors.includes(factor.name) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <div className="relative w-full sm:w-24 h-32 sm:h-16 rounded-lg overflow-hidden shrink-0 mb-3 sm:mb-0 sm:mr-4">
                                                    <Image
                                                        src={factor.image || "/placeholder.svg"}
                                                        alt={factor.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="text-center sm:text-left w-full">
                                                    <h4 className="font-bold text-sm mb-1">{factor.name}</h4>
                                                    <p className="text-[12px] text-muted-foreground font-light leading-relaxed line-clamp-3 sm:line-clamp-2">
                                                        {factor.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="desiredExperiences" className="block text-sm font-semibold mb-2">
                                        <Sparkles className="inline w-4 h-4 mr-1 text-primary" />
                                        Additional information (optional)
                                    </label>
                                    <textarea
                                        id="desiredExperiences"
                                        value={formData.desiredExperiences}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, desiredExperiences: e.target.value }))}
                                        rows={4}
                                        placeholder="e.g. local market tours, hiking, river cruises, cooking classes"
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
                                    />
                                    {errors.desiredExperiences && (
                                        <p className="text-sm text-destructive mt-2">{errors.desiredExperiences}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Complete - Auth & Submit */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center mb-6">
                                    <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
                                    <h2 className="text-2xl font-bold mb-2">Almost Done!</h2>
                                    <p className="text-muted-foreground">
                                        {user?.emailVerified
                                            ? "Review your trip details and submit your request"
                                            : "Fill in your contact details and submit your request"
                                        }
                                    </p>
                                </div>

                                {user?.emailVerified ? (
                                    // User is logged in and verified - show summary and submit
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Check className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{user.name || "Welcome!"}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Click submit to send your personalized trip request. We&apos;ll get back to you within 24 hours.
                                        </p>

                                        {/* Payment Method Dropdown */}
                                        {paymentMethodsEnabled && enabledPaymentMethods.length > 0 && (
                                            <div className="mb-4 space-y-2">
                                                <label className="block text-sm font-medium mb-2">Preferred Payment Method</label>
                                                <select
                                                    value={formData.preferredPaymentMethod}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, preferredPaymentMethod: e.target.value }))}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                                >
                                                    <option value="">Select payment method (optional)</option>
                                                    {PAYMENT_METHODS.filter(m => enabledPaymentMethods.includes(m.value)).map((method) => (
                                                        <option key={method.value} value={method.value}>{method.label}</option>
                                                    ))}
                                                </select>

                                                {/* Deposit Payment Info */}
                                                {formData.preferredPaymentMethod === "Deposit Payment" && (
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
                                        <Button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            {submitting ? "Submitting..." : "Submit Trip Request"}
                                            <Sparkles className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    // Guest user - show contact fields
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Full Name <span className="text-destructive">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                                    placeholder="John Doe"
                                                    maxLength={50}
                                                    className={`pl-10 ${errors.fullName ? "border-destructive" : ""}`}
                                                />
                                            </div>
                                            {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email <span className="text-destructive">*</span></label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                    placeholder="youremail@example.com"
                                                    maxLength={100}
                                                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                                                />
                                            </div>
                                            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Phone <span className="text-destructive">*</span></label>
                                            <div className="flex gap-2">
                                                <CountryCodeSelect
                                                    value={formData.countryCode}
                                                    onChange={(val) => setFormData(prev => ({ ...prev, countryCode: val }))}
                                                />
                                                <div className="relative flex-1">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                        placeholder="123 456 7890"
                                                        maxLength={20}
                                                        className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                                                    />
                                                </div>
                                            </div>
                                            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                                        </div>

                                        {/* Payment Method Dropdown */}
                                        {paymentMethodsEnabled && enabledPaymentMethods.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium mb-2">Preferred Payment Method</label>
                                                <select
                                                    value={formData.preferredPaymentMethod}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, preferredPaymentMethod: e.target.value }))}
                                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                                >
                                                    <option value="">Select payment method (optional)</option>
                                                    {PAYMENT_METHODS.filter(m => enabledPaymentMethods.includes(m.value)).map((method) => (
                                                        <option key={method.value} value={method.value}>{method.label}</option>
                                                    ))}
                                                </select>
                                                {formData.preferredPaymentMethod === "Deposit Payment" && (
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

                                        <Button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            {submitting ? "Submitting..." : "Submit Trip Request"}
                                            <Sparkles className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="flex cursor-pointer items-center gap-2 bg-transparent"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            {currentStep < STEPS.length ? (
                                <Button type="button" onClick={nextStep} className="flex cursor-pointer items-center gap-2">
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    {submitting ? "Submitting..." : "Submit Request"}
                                    <Sparkles className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div >
            </main >

            <Footer />

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div >
    )
}
