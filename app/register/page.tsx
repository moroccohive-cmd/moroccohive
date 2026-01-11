"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [error, setError] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Please enter a valid email"
        } else if (formData.email.trim().length > 100) {
            newErrors.email = "Email is too long"
        }

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
        setError("")

        if (!validateForm()) return

        setLoading(true)

        try {
            const { data, error } = await authClient.signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.email.split("@")[0], // Default name
                role: "user",
            } as any, {
                onSuccess: () => {
                    router.push("/profile")
                },
                onError: (ctx) => {
                    setError(ctx.error.message || "Registration failed")
                }
            })
        } catch (err) {
            setError("An error occurred during registration")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl p-8 text-foreground">
                <h1 className="text-3xl font-bold text-center text-foreground mb-2">Create Account</h1>
                <p className="text-center text-muted-foreground mb-8">Join the Morocco Hive community</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="youremail@example.com"
                            maxLength={100}
                            className={`bg-background border-input ${errors.email ? "border-destructive" : ""}`}
                        />
                        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
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
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            maxLength={128}
                            className={`bg-background border-input ${errors.confirmPassword ? "border-destructive" : ""}`}
                        />
                        {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded text-sm">{error}</div>}

                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        {loading ? "Creating account..." : "Register"}
                    </Button>
                </form>

                <p className="text-center text-muted-foreground text-sm mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    )
}

