"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react"

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading")
    const [resending, setResending] = useState(false)
    const { data: session } = authClient.useSession()

    useEffect(() => {
        if (token) {
            // Verify the token
            verifyEmail()
        } else if (session?.user && !session.user.emailVerified) {
            // No token but user is logged in with unverified email
            setStatus("pending")
        } else if (session?.user?.emailVerified) {
            // Already verified
            setStatus("success")
        } else {
            setStatus("pending")
        }
    }, [token, session])

    const verifyEmail = async () => {
        try {
            await authClient.verifyEmail({
                query: { token: token! }
            })
            setStatus("success")
            setTimeout(() => {
                router.push("/profile")
            }, 2000)
        } catch (err) {
            setStatus("error")
        }
    }

    const resendVerification = async () => {
        if (!session?.user?.email) return

        setResending(true)
        try {
            await authClient.sendVerificationEmail({
                email: session.user.email,
                callbackURL: "/verify-email"
            })
            alert("Verification email sent! Please check your inbox.")
        } catch (err) {
            alert("Failed to send verification email. Please try again.")
        } finally {
            setResending(false)
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8 text-center">
                    <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                    <h1 className="text-xl font-bold text-foreground">Verifying your email...</h1>
                </div>
            </div>
        )
    }

    if (status === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h1>
                    <p className="text-muted-foreground mb-6">
                        Your email has been successfully verified. You can now access all features.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/profile">Continue to Profile</Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
                    <p className="text-muted-foreground mb-6">
                        This verification link is invalid or has expired.
                    </p>
                    <div className="space-y-3">
                        {session?.user && (
                            <Button onClick={resendVerification} disabled={resending} className="w-full">
                                {resending ? "Sending..." : "Resend verification email"}
                            </Button>
                        )}
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/login">Back to login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Pending state - show instructions
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Verify your email</h1>
                <p className="text-muted-foreground mb-6">
                    We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                    Didn&apos;t receive the email? Check your spam folder or click below to resend.
                </p>
                <div className="space-y-3">
                    {session?.user && (
                        <Button onClick={resendVerification} disabled={resending} className="w-full">
                            {resending ? "Sending..." : "Resend verification email"}
                        </Button>
                    )}
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/">Back to home</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}
