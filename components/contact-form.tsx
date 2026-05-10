"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+1",
    subject: "",
    message: "",
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    const nameRe = /^[a-zA-Z\s]+$/
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRe = /^[0-9]+$/

    if (!form.name.trim()) e.name = "Name is required"
    else if (!nameRe.test(form.name.trim())) e.name = "Name can only contain letters"
    else if (form.name.trim().length > 50) e.name = "Name is too long (max 50 characters)"

    if (!form.email.trim()) e.email = "Email is required"
    else if (!emailRe.test(form.email.trim())) e.email = "Please enter a valid email"
    else if (form.email.trim().length > 100) e.email = "Email is too long"

    if (!form.phone.trim()) e.phone = "Phone is required"
    else if (!phoneRe.test(form.phone.trim())) e.phone = "Phone can only contain numbers"
    else if (form.phone.trim().length > 20) e.phone = "Phone number is too long"

    if (!form.subject.trim()) e.subject = "Subject is required"
    else if (form.subject.trim().length > 200) e.subject = "Subject is too long (max 200 characters)"

    if (!form.message.trim()) e.message = "Message is required"
    else if (form.message.trim().length > 2000) e.message = "Message is too long (max 2000 characters)"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSending(true)
    setErrors({})

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: `${form.countryCode} ${form.phone}` }),
      })

      if (response.ok) {
        setSent(true)
        setForm({ name: "", email: "", phone: "", countryCode: "+212", subject: "", message: "" })
        setTimeout(() => setSent(false), 5000)
      } else if (response.status === 429) {
        alert("Too many requests. Please try again later.")
      }
    } catch {
      alert("Failed to send message.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="p-8 md:p-10">
            <span className="text-accent font-medium tracking-widest text-xs uppercase block mb-4">Get in Touch</span>
            <h2 className="text-4xl font-bold text-foreground mb-6 tracking-tight">Let&apos;s plan your dream trip</h2>
            <p className="text-muted-foreground mb-12 font-light leading-relaxed">
              Have questions or ready to start planning? Send us a message and our travel experts will get right back to you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mt-1 mr-4">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email Us</h4>
                  <p className="text-muted-foreground font-light mt-1">info@moroccohive.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mt-1 mr-4">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Call Us</h4>
                  <p className="text-muted-foreground font-light mt-1">+212 634717423</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mt-1 mr-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Visit Us</h4>
                  <p className="text-muted-foreground font-light mt-1">Morocco Hive, Marrakech, Morocco</p>
                </div>
              </div>
            </div>
          </div>

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
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={50}
                    className={`bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring ${errors.name ? "border-destructive" : ""}`}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={100}
                    className={`bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring ${errors.email ? "border-destructive" : ""}`}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Phone Number</Label>
                  <div className="flex gap-2">
                    <CountryCodeSelect
                      value={form.countryCode}
                      onChange={(val) => setForm({ ...form, countryCode: val })}
                    />
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      maxLength={20}
                      className={`flex-1 bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring ${errors.phone ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Subject</Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    maxLength={200}
                    placeholder="Trip Inquiry..."
                    className={`bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring ${errors.subject ? "border-destructive" : ""}`}
                  />
                  {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Message</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    maxLength={2000}
                    placeholder="Tell us about your dream trip..."
                    className={`bg-background border-input min-h-[140px] rounded-md focus:ring-ring focus:border-ring resize-none p-4 ${errors.message ? "border-destructive" : ""}`}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
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
        </div>
      </div>
    </section>
  )
}
