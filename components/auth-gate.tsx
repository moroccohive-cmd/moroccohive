"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Lock, Mail, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"

interface AuthGateProps {
    children: React.ReactNode
    title?: string
    description?: string
}

export function AuthGate({ children, title, description }: AuthGateProps) {
    const { user, loading } = useAuth()
    const [resending, setResending] = useState(false)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    // Not logged in
    if (!user) {
        return (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                    {title || "Sign in to continue"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {description || "Create an account or sign in to complete your request. It only takes a moment!"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/register">Create Account</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Logged in but email not verified
    if (!user.emailVerified) {
        const handleResend = async () => {
            setResending(true)
            try {
                await authClient.sendVerificationEmail({
                    email: user.email,
                    callbackURL: window.location.pathname
                })
                alert("Verification email sent! Please check your inbox.")
            } catch (err) {
                alert("Failed to send verification email. Please try again.")
            } finally {
                setResending(false)
            }
        }

        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                    Verify your email
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Please verify your email address <strong>{user.email}</strong> to continue. Check your inbox for the verification link.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleResend} disabled={resending}>
                        {resending ? "Sending..." : "Resend Verification Email"}
                    </Button>
                </div>
            </div>
        )
    }

    // User is authenticated and email verified - render children
    return <>{children}</>
}
