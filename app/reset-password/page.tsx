"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Lock, Check, AlertCircle } from "lucide-react"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [formData, setFormData] = useState({ password: "", confirmPassword: "" })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [tokenError, setTokenError] = useState(false)

    useEffect(() => {
        if (!token) {
            setTokenError(true)
        }
    }, [token])

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        } else if (formData.password.length > 128) {
            newErrors.password = "Password is too long"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return
        if (!token) return

        setLoading(true)

        try {
            await authClient.resetPassword({
                newPassword: formData.password,
                token,
            })
            setSuccess(true)
        } catch (err) {
            setErrors({ form: "Failed to reset password. The link may have expired." })
        } finally {
            setLoading(false)
        }
    }

    if (tokenError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Reset Link</h1>
                    <p className="text-muted-foreground mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/forgot-password">Request new link</Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Password Reset!</h1>
                    <p className="text-muted-foreground mb-6">
                        Your password has been successfully reset. You can now sign in with your new password.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/login">Sign in</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-primary" />
                </div>

                <h1 className="text-2xl font-bold text-center text-foreground mb-2">Set new password</h1>
                <p className="text-center text-muted-foreground mb-8">
                    Your new password must be at least 8 characters
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">New Password</label>
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="••••••••"
                            maxLength={128}
                            className={`bg-background border-input ${errors.password ? "border-destructive" : ""}`}
                        />
                        {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Confirm Password</label>
                        <Input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="••••••••"
                            maxLength={128}
                            className={`bg-background border-input ${errors.confirmPassword ? "border-destructive" : ""}`}
                        />
                        {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {errors.form && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded text-sm">
                            {errors.form}
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        {loading ? "Resetting..." : "Reset password"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}
