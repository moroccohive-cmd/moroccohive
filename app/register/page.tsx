"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { CountryCodeSelect } from "@/components/ui/country-code-select"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        countryCode: "+1",
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
        const nameRegex = /^[a-zA-Z\s'-]+$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^[0-9\s\-+()]+$/

        // Full name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required"
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = "Name must be at least 2 characters"
        } else if (formData.fullName.trim().length > 50) {
            newErrors.fullName = "Name is too long (max 50 characters)"
        } else if (!nameRegex.test(formData.fullName.trim())) {
            newErrors.fullName = "Name can only contain letters, spaces, hyphens, and apostrophes"
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Please enter a valid email"
        } else if (formData.email.trim().length > 100) {
            newErrors.email = "Email is too long"
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required"
        } else if (formData.phone.trim().length < 6) {
            newErrors.phone = "Please enter a valid phone number"
        } else if (formData.phone.trim().length > 20) {
            newErrors.phone = "Phone number is too long"
        } else if (!phoneRegex.test(formData.phone.trim())) {
            newErrors.phone = "Phone can only contain numbers, spaces, and dashes"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        } else if (formData.password.length > 128) {
            newErrors.password = "Password is too long (max 128 characters)"
        }

        // Confirm password validation
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
            const fullPhone = `${formData.countryCode} ${formData.phone.trim()}`
            const { data, error } = await authClient.signUp.email({
                email: formData.email.trim(),
                password: formData.password,
                name: formData.fullName.trim(),
                role: "user",
                phone: fullPhone,
            } as any, {
                onSuccess: () => {
                    router.push("/verify-email")
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
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                        <Input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            maxLength={50}
                            className={`bg-background border-input ${errors.fullName ? "border-destructive" : ""}`}
                        />
                        {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                    </div>

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
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                        <div className="flex gap-2">
                            <CountryCodeSelect
                                value={formData.countryCode}
                                onChange={(val) => setFormData((prev) => ({ ...prev, countryCode: val }))}
                            />
                            <Input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="123 456 7890"
                                maxLength={20}
                                className={`flex-1 bg-background border-input ${errors.phone ? "border-destructive" : ""}`}
                            />
                        </div>
                        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
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

