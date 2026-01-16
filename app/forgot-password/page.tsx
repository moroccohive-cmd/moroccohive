"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Mail, ArrowLeft, Check } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.trim()) {
            setError("Email is required")
            return
        }
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email")
            return
        }

        setLoading(true)

        try {
            const { error: resetError } = await authClient.requestPasswordReset({
                email: email.trim(),
                redirectTo: "/reset-password",
            })

            if (resetError) {
                setError(resetError.message || "Failed to send reset email.")
            } else {
                setSent(true)
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
                    <p className="text-muted-foreground mb-6">
                        We&apos;ve sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                        Didn&apos;t receive the email? Check your spam folder or try again.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => setSent(false)}
                        className="w-full"
                    >
                        Try another email
                    </Button>
                    <Link href="/login" className="block mt-4 text-sm text-primary hover:underline">
                        Back to login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8">
                <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                </Link>

                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-primary" />
                </div>

                <h1 className="text-2xl font-bold text-center text-foreground mb-2">Forgot password?</h1>
                <p className="text-center text-muted-foreground mb-8">
                    No worries, we&apos;ll send you reset instructions.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="youremail@example.com"
                            maxLength={100}
                            className={`bg-background border-input ${error ? "border-destructive" : ""}`}
                        />
                        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        {loading ? "Sending..." : "Send reset link"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
