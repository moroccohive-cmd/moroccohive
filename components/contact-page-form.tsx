"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { useI18n } from "@/components/i18n/i18n-provider"
import type { ContactFormMessages } from "@/components/contact-form"

/** The message form card on /contact. */
export function ContactPageForm({ messages: t }: { messages: ContactFormMessages }) {
    const { locale } = useI18n()
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
            errors.name = t.errors.nameRequired
        } else if (!nameRegex.test(contactForm.name.trim())) {
            errors.name = t.errors.nameLetters
        } else if (contactForm.name.trim().length > 50) {
            errors.name = t.errors.nameLong
        }

        if (!contactForm.email.trim()) {
            errors.email = t.errors.emailRequired
        } else if (!emailRegex.test(contactForm.email.trim())) {
            errors.email = t.errors.emailInvalid
        } else if (contactForm.email.trim().length > 100) {
            errors.email = t.errors.emailLong
        }

        if (!contactForm.phone.trim()) {
            errors.phone = t.errors.phoneRequired
        } else if (!phoneRegex.test(contactForm.phone.trim())) {
            errors.phone = t.errors.phoneDigits
        } else if (contactForm.phone.trim().length > 20) {
            errors.phone = t.errors.phoneLong
        }

        if (!contactForm.subject.trim()) {
            errors.subject = t.errors.subjectRequired
        } else if (contactForm.subject.trim().length > 200) {
            errors.subject = t.errors.subjectLong
        }

        if (!contactForm.message.trim()) {
            errors.message = t.errors.messageRequired
        } else if (contactForm.message.trim().length > 2000) {
            errors.message = t.errors.messageLong
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
                    phone: `${contactForm.countryCode} ${contactForm.phone}`,
                    locale,
                }),
            })

            if (response.ok) {
                setSent(true)
                setContactForm({ name: "", email: "", phone: "", countryCode: "+212", subject: "", message: "" })
                setTimeout(() => setSent(false), 5000)
            } else {
                if (response.status === 429) alert(t.tooMany)
            }
        } catch {
            alert(t.failed)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="bg-card rounded-xl shadow-[0_20px_40px_rgb(0,0,0,0.06)] p-8 md:p-10 border border-border/50">
            {sent ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{t.sentTitle}</h3>
                    <p className="text-muted-foreground">
                        {t.sentBody}
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.name}</Label>
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
                        <Label htmlFor="email" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.email}</Label>
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
                        <Label htmlFor="phone" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.phone}</Label>
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
                        <Label htmlFor="subject" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.subject}</Label>
                        <Input
                            id="subject"
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                            maxLength={200}
                            placeholder={t.subjectPlaceholder}
                            className={`bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring ${contactErrors.subject ? "border-destructive" : ""}`}
                        />
                        {contactErrors.subject && <p className="text-sm text-destructive">{contactErrors.subject}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">{t.message}</Label>
                        <Textarea
                            id="message"
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            maxLength={2000}
                            placeholder={t.messagePlaceholder}
                            className={`bg-background border-input min-h-[140px] rounded-md focus:ring-ring focus:border-ring resize-none p-4 ${contactErrors.message ? "border-destructive" : ""}`}
                        />
                        {contactErrors.message && <p className="text-sm text-destructive">{contactErrors.message}</p>}
                    </div>
                    <Button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-md text-base font-medium shadow-lg mt-2"
                    >
                        {sending ? t.sending : t.send}
                    </Button>
                </form>
            )}
        </div>
    )
}
