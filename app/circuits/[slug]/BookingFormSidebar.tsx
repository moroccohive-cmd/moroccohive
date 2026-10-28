"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { PriceBadge } from "@/components/ui/price-badge"
import { MobileBottomCTA } from "@/components/mobile-bottom-cta"
import { Clock, Check } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useI18n } from "@/components/i18n/i18n-provider"
import { fmt } from "@/lib/i18n/format"
import type { Messages } from "@/lib/i18n/messages"

export type BookingMessages = Messages["booking"]

interface CircuitInfo {
    id: string
    slug: string
    name: string
    price: number
    originalPrice?: number
    isFrom?: boolean
    duration: number
}

// Values are stored in English with the request; labels come from messages.
const PAYMENT_METHODS = [
    { value: "Deposit Payment" },
    { value: "Bank Transfer / SWIFT" },
    { value: "Credit Cards" },
    { value: "PayPal" },
    { value: "Payoneer" },
    { value: "Wise" },
    { value: "Mercury" },
]

export function BookingFormSidebar({ circuit, messages: t }: { circuit: CircuitInfo; messages: BookingMessages }) {
    const router = useRouter()
    const { locale, lp } = useI18n()
    const { user } = useAuth()
    const userVerified = user?.emailVerified

    const [travelers, setTravelers] = useState({ adults: 2, children: 0, infants: 0 })
    const [booking, setBooking] = useState({
        travelDates: "",
        numberOfTravelers: 2,
        travelerAges: "2 adults",
        fullName: "",
        email: "",
        phone: "",
        countryCode: "+212",
        accommodation: "Standard",
        preferredPaymentMethod: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [startDateError, setStartDateError] = useState("")
    const [endDateError, setEndDateError] = useState("")
    const [bookingError, setBookingError] = useState<{ message: string; isServerError: boolean } | null>(null)
    const [paymentMethodsEnabled, setPaymentMethodsEnabled] = useState(true)
    const [enabledPaymentMethods, setEnabledPaymentMethods] = useState<string[]>(PAYMENT_METHODS.map(m => m.value))

    // Pre-fill from authenticated user
    useEffect(() => {
        if (user?.email && userVerified) {
            setBooking(prev => (!prev.email && !prev.fullName)
                ? { ...prev, fullName: user.name || "", email: user.email }
                : prev
            )
        }
    }, [user?.email, user?.name, userVerified])

    // Fetch payment settings
    useEffect(() => {
        fetch("/api/settings")
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data) {
                    setPaymentMethodsEnabled(data.paymentMethodsEnabled ?? true)
                    setEnabledPaymentMethods(data.enabledPaymentMethods ?? PAYMENT_METHODS.map(m => m.value))
                }
            })
            .catch(() => {})
    }, [])

    const validateDates = (): boolean => {
        const [startDateStr = "", endDateStr = ""] = booking.travelDates.split(" to ")
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        let startErr = ""
        let endErr = ""
        let valid = true

        if (!startDateStr) {
            startErr = t.errors.startRequired; valid = false
        } else if (new Date(startDateStr) < today) {
            startErr = t.errors.startPast; valid = false
        }

        if (!endDateStr) {
            endErr = t.errors.endRequired; valid = false
        } else {
            const end = new Date(endDateStr)
            if (end < today) {
                endErr = t.errors.endPast; valid = false
            } else if (startDateStr === endDateStr) {
                endErr = t.errors.endSame; valid = false
            } else if (startDateStr && end <= new Date(startDateStr)) {
                endErr = t.errors.endBefore; valid = false
            }
        }

        setStartDateError(startErr)
        setEndDateError(endErr)
        return valid
    }

    const handleTravelerChange = (type: "adults" | "children" | "infants", delta: number) => {
        setTravelers(prev => {
            const val = Math.max(0, prev[type] + delta)
            if (type === "adults" && val < 1) return prev
            const next = { ...prev, [type]: val }
            const total = next.adults + next.children + next.infants
            const parts: string[] = []
            if (next.adults > 0) parts.push(`${next.adults} adult${next.adults !== 1 ? "s" : ""}`)
            if (next.children > 0) parts.push(`${next.children} child${next.children !== 1 ? "ren" : ""}`)
            if (next.infants > 0) parts.push(`${next.infants} infant${next.infants !== 1 ? "s" : ""}`)
            setBooking(b => ({ ...b, numberOfTravelers: total, travelerAges: parts.join(", ") }))
            return next
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateDates()) return

        if (!user || !userVerified) {
            const nameRegex = /^[a-zA-Z\s]+$/
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const phoneRegex = /^[0-9]+$/

            if (!booking.fullName.trim()) return setBookingError({ message: t.errors.nameRequired, isServerError: false })
            if (!nameRegex.test(booking.fullName.trim())) return setBookingError({ message: t.errors.nameLetters, isServerError: false })
            if (booking.fullName.trim().length > 50) return setBookingError({ message: t.errors.nameLong, isServerError: false })
            if (!booking.email.trim()) return setBookingError({ message: t.errors.emailRequired, isServerError: false })
            if (!emailRegex.test(booking.email.trim())) return setBookingError({ message: t.errors.emailInvalid, isServerError: false })
            if (booking.email.trim().length > 100) return setBookingError({ message: t.errors.emailLong, isServerError: false })
            if (!booking.phone.trim()) return setBookingError({ message: t.errors.phoneRequired, isServerError: false })
            if (!phoneRegex.test(booking.phone.trim())) return setBookingError({ message: t.errors.phoneDigits, isServerError: false })
            if (booking.phone.trim().length > 20) return setBookingError({ message: t.errors.phoneLong, isServerError: false })
        }

        setSubmitting(true)
        setBookingError(null)

        try {
            const response = await fetch("/api/trip-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...booking,
                    fullName: (user && userVerified) ? (user.name || booking.fullName) : booking.fullName,
                    email: (user && userVerified) ? (user.email || booking.email) : booking.email,
                    phone: (user && userVerified) ? ((user as any).phone || `${booking.countryCode} ${booking.phone}`) : `${booking.countryCode} ${booking.phone}`,
                    travelStyle: "Custom Circuit",
                    arrivalCity: "N/A",
                    departureCity: "N/A",
                    budget: "N/A",
                    adventureActivities: [],
                    desiredExperiences: `Booking for circuit: ${circuit.name} (${circuit.slug})`,
                    locale,
                }),
            })

            if (response.ok) {
                router.push(lp("/circuits/thank-you"))
                return
            }

            const data = await response.json()
            const errorMsg = data.error?.toLowerCase() || ""
            if (errorMsg.includes("email") && (errorMsg.includes("send") || errorMsg.includes("failed"))) {
                setBookingError({ message: t.errors.emailFailed, isServerError: true })
            } else {
                setBookingError({ message: data.error || t.errors.failed, isServerError: response.status >= 500 })
            }
        } catch {
            setBookingError({ message: t.errors.network, isServerError: true })
        } finally {
            setSubmitting(false)
        }
    }

    const scrollToForm = () => document.getElementById("booking-form-section")?.scrollIntoView({ behavior: "smooth" })

    return (
        <>
            <div className="lg:col-span-4" id="booking-form-section">
                <div className="space-y-6">
                    <div className="bg-card rounded-lg p-8 shadow-[0_20px_40px_rgb(0,0,0,0.06)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="relative z-10 mb-8">
                            <div className="text-center">
                                <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{t.from}</span>
                                <div className="flex items-baseline justify-center gap-1 mt-2">
                                    <PriceBadge price={circuit.price} originalPrice={circuit.originalPrice} from={circuit.isFrom} />
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-between p-4 bg-background rounded-lg">
                                <span className="text-sm text-muted-foreground font-medium">{t.duration}</span>
                                <div className="flex items-center text-foreground font-semibold">
                                    <Clock className="w-4 h-4 mr-2 text-accent" />
                                    {fmt(t.days, { days: circuit.duration })}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">{fmt(t.fromPerPerson, { price: circuit.price })}</h3>

                            {/* Dates */}
                            <div className="space-y-2">
                                <Label htmlFor="travelDates" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.startDate}</Label>
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
                                <Label htmlFor="travelDates2" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.endDate}</Label>
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

                            {/* Travelers */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold mb-3">{t.whoTraveling}</label>
                                <div className="space-y-4 bg-muted/30 p-6 rounded-lg border border-border">
                                    {(["adults", "children", "infants"] as const).map((type) => (
                                        <div key={type} className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-foreground capitalize">{t[type]}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {type === "adults" ? t.adultsHint : type === "children" ? t.childrenHint : t.infantsHint}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleTravelerChange(type, -1)}
                                                    disabled={type === "adults" ? travelers.adults <= 1 : travelers[type] <= 0}
                                                    className="w-10 h-10 rounded-full border-2 border-border hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:bg-primary/10"
                                                    aria-label={fmt(t.decrease, { type: t[type].toLowerCase() })}
                                                >
                                                    <span className="text-xl font-semibold" aria-hidden="true">−</span>
                                                </button>
                                                <span className="text-lg font-semibold w-8 text-center" aria-live="polite">{travelers[type]}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleTravelerChange(type, 1)}
                                                    className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                    aria-label={fmt(t.increase, { type: t[type].toLowerCase() })}
                                                >
                                                    <span className="text-xl font-semibold" aria-hidden="true">+</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Accommodation */}
                            <div className="space-y-2">
                                <Label htmlFor="accommodation" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.accommodation}</Label>
                                <select
                                    id="accommodation"
                                    value={booking.accommodation}
                                    onChange={(e) => setBooking({ ...booking, accommodation: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-md focus:ring-orange-200 h-11 px-3 text-sm"
                                >
                                    <option value="Standard">{t.accommodationLevels.Standard}</option>
                                    <option value="Comfort">{t.accommodationLevels.Comfort}</option>
                                    <option value="Luxury">{t.accommodationLevels.Luxury}</option>
                                </select>
                            </div>

                            {/* Payment Method */}
                            {paymentMethodsEnabled && enabledPaymentMethods.length > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="paymentMethod" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.preferredPayment}</Label>
                                    <select
                                        id="paymentMethod"
                                        value={booking.preferredPaymentMethod}
                                        onChange={(e) => setBooking({ ...booking, preferredPaymentMethod: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-md focus:ring-orange-200 h-11 px-3 text-sm"
                                    >
                                        <option value="">{t.selectPayment}</option>
                                        {PAYMENT_METHODS.filter(m => enabledPaymentMethods.includes(m.value)).map((method) => (
                                            <option key={method.value} value={method.value}>{t.paymentMethods[method.value] ?? method.value}</option>
                                        ))}
                                    </select>
                                    {booking.preferredPaymentMethod === "Deposit Payment" && (
                                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm space-y-1">
                                            <p className="font-semibold text-foreground">{t.depositTitle}</p>
                                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                <li>{t.depositLine1}</li>
                                                <li>{t.depositLine2}</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Contact / User badge */}
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
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.fullName}</Label>
                                        <Input
                                            value={booking.fullName}
                                            onChange={(e) => setBooking({ ...booking, fullName: e.target.value })}
                                            placeholder="John Doe"
                                            maxLength={50}
                                            className="bg-gray-50 border-gray-100 rounded-md h-11"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.email}</Label>
                                        <Input
                                            type="email"
                                            value={booking.email}
                                            onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                                            placeholder="you@example.com"
                                            maxLength={100}
                                            className="bg-gray-50 border-gray-100 rounded-md h-11"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.phone}</Label>
                                        <div className="flex gap-2">
                                            <CountryCodeSelect
                                                value={booking.countryCode}
                                                onChange={(val) => setBooking({ ...booking, countryCode: val })}
                                            />
                                            <Input
                                                type="tel"
                                                value={booking.phone}
                                                onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                                                placeholder="123 456 7890"
                                                maxLength={20}
                                                className="flex-1 bg-gray-50 border-gray-100 rounded-md h-11"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {bookingError && (
                                <div className={`px-4 py-3 rounded text-sm mb-4 ${bookingError.isServerError ? "bg-amber-500/10 text-amber-800 border border-amber-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                                    <p>{bookingError.message}</p>
                                    {bookingError.isServerError && (
                                        <Link href={lp("/contact")} className="inline-flex items-center gap-1 mt-2 text-sm font-medium underline underline-offset-2 hover:no-underline">
                                            {t.contactSupport}
                                        </Link>
                                    )}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 text-base font-medium shadow-lg shadow-gray-900/10 mt-4"
                            >
                                {submitting ? t.submitting : t.submit}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
                                {t.disclaimer}
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            <MobileBottomCTA
                buttonText={t.mobileCta}
                fromLabel={t.from}
                onButtonClick={scrollToForm}
                price={circuit.price}
                originalPrice={circuit.originalPrice}
                isFrom={circuit.isFrom}
            />
        </>
    )
}
