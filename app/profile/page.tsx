"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Heart,
    User as UserIcon,
    Calendar,
    MapPin,
    Trash2,
    Loader2,
    ArrowRight,
    Edit2,
    Check,
    X,
    Mail,
    Phone,
    ShieldAlert,
    LogOut
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { toast } from "sonner"

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession()
    const [favorites, setFavorites] = useState<any[]>([])
    const [loadingFavs, setLoadingFavs] = useState(true)
    const router = useRouter()

    // Edit state
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        bio: "",
        location: "",
        countryCode: "+1"
    })
    const [originalData, setOriginalData] = useState<any>(null)
    const [updating, setUpdating] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const [newEmail, setNewEmail] = useState("")
    const [emailChangeModalOpen, setEmailChangeModalOpen] = useState(false)
    const [changingEmail, setChangingEmail] = useState(false)

    // Password change state
    const [passwordModalOpen, setPasswordModalOpen] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
    const [changingPassword, setChangingPassword] = useState(false)

    // Restoring missing state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // ... existing handleUpdateProfile ...

    const handleChangeEmail = async () => {
        if (!newEmail || !newEmail.includes("@")) {
            toast.error("Please enter a valid email")
            return
        }

        setChangingEmail(true)
        try {
            const { error } = await authClient.changeEmail({
                newEmail: newEmail,
                callbackURL: "/profile" // Redirect back to profile after verification
            })

            if (error) {
                const lowerError = (error.message || "").toLowerCase()
                if (lowerError.includes("already") || lowerError.includes("exists")) {
                    throw new Error("This email is already in use by another account")
                } else if (lowerError.includes("invalid") || lowerError.includes("valid")) {
                    throw new Error("Please enter a valid email address")
                } else {
                    throw new Error(error.message)
                }
            }

            toast.success("Verification link sent to your new email!")
            setEmailChangeModalOpen(false)
            setNewEmail("")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to initiate email change")
        } finally {
            setChangingEmail(false)
        }
    }

    const handleChangePassword = async () => {
        // Validate password form
        const errors: Record<string, string> = {}

        if (!passwordForm.currentPassword) {
            errors.currentPassword = "Current password is required"
        }

        if (!passwordForm.newPassword) {
            errors.newPassword = "New password is required"
        } else if (passwordForm.newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters"
        }

        if (!passwordForm.confirmPassword) {
            errors.confirmPassword = "Please confirm your new password"
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            errors.confirmPassword = "Passwords do not match"
        }

        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors)
            return
        }

        setChangingPassword(true)
        setPasswordErrors({})

        try {
            const { error } = await authClient.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            })

            if (error) throw new Error(error.message)

            toast.success("Password changed successfully!")
            setPasswordModalOpen(false)
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed to change password"
            const lowerError = errorMsg.toLowerCase()
            if (lowerError.includes("incorrect") || lowerError.includes("wrong") || lowerError.includes("invalid")) {
                setPasswordErrors({ currentPassword: "Current password is incorrect" })
            } else if (lowerError.includes("same") || lowerError.includes("different")) {
                setPasswordErrors({ newPassword: "New password must be different from current password" })
            } else {
                setPasswordErrors({ form: errorMsg })
            }
        } finally {
            setChangingPassword(false)
        }
    }

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login")
        } else if (session?.user) {
            // Initialize form data from session
            const user = session.user as any
            const phoneStr = user.phone || ""
            let phone = phoneStr
            let countryCode = "+1"

            if (phoneStr.includes(" ")) {
                const parts = phoneStr.split(" ")
                countryCode = parts[0]
                phone = parts.slice(1).join(" ")
            }

            const initialData = {
                name: user.name || "",
                phone: phone,
                bio: user.bio || "",
                location: user.location || "",
                countryCode
            }
            setFormData(initialData)
            setOriginalData(initialData)
        }
    }, [session, isPending, router])

    const [tripRequests, setTripRequests] = useState<any[]>([])
    const [loadingRequests, setLoadingRequests] = useState(true)

    // ... existing handleUpdateProfile ...

    useEffect(() => {
        if (session) {
            fetchFavorites()
            fetchTripRequests()
        }
    }, [session])

    const fetchTripRequests = async () => {
        try {
            const res = await fetch("/api/trip-requests")
            if (res.ok) {
                const data = await res.json()
                setTripRequests(data.tripRequests)
            }
        } catch (error) {
            console.error("Error fetching trip requests:", error)
        } finally {
            setLoadingRequests(false)
        }
    }

    const fetchFavorites = async () => {
        try {
            const res = await fetch("/api/favorites")
            const data = await res.json()
            setFavorites(data)
        } catch (error) {
            console.error("Error fetching favorites:", error)
        } finally {
            setLoadingFavs(false)
        }
    }

    const removeFavorite = async (id: string) => {
        try {
            const res = await fetch(`/api/favorites/${id}`, { method: "DELETE" })
            if (res.ok) {
                setFavorites(favorites.filter(f => f.id !== id))
            }
        } catch (error) {
            console.error("Error removing favorite:", error)
        }
    }

    const handleUpdateProfile = async () => {
        // Client-side validation
        if (!formData.name.trim()) {
            toast.error("Name cannot be empty")
            return
        }
        if (formData.name.length < 2) {
            toast.error("Name must be at least 2 characters")
            return
        }
        if (formData.name.length > 50) {
            toast.error("Name must be less than 50 characters")
            return
        }
        // Name regex: allow letters, spaces, hyphens, apostrophes, and standard accents (multilingual support)
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.name)) {
            toast.error("Name can only contain letters, spaces, hyphens, and apostrophes")
            return
        }
        // Validate phone if present (matches backend strictness if provided)
        if (formData.phone && formData.phone.trim()) {
            const cleanPhone = formData.phone.trim();
            if (cleanPhone.length < 6) {
                toast.error("Please enter a valid phone number")
                return
            }
            if (cleanPhone.length > 30) {
                toast.error("Phone number is too long")
                return
            }
            if (!/^[0-9\s\-+()]+$/.test(cleanPhone)) {
                toast.error("Phone can only contain numbers, spaces, and dashes")
                return
            }
        }
        if (formData.bio && formData.bio.length > 500) {
            toast.error("Bio must be less than 500 characters")
            return
        }
        if (formData.location && formData.location.length > 100) {
            toast.error("Location must be less than 100 characters")
            return
        }

        setUpdating(true)
        try {
            const fullPhone = formData.phone ? `${formData.countryCode} ${formData.phone}` : ""

            await authClient.updateUser({
                name: formData.name,
                image: session?.user.image
            })

            // We use authClient.updateUser which handles the update
            const { error } = await authClient.updateUser({
                name: formData.name,
                image: session?.user?.image,
                // Cast to any to pass additional fields
                ...({ bio: formData.bio, location: formData.location, phone: fullPhone } as any)
            })

            if (error) {
                const lowerError = (error.message || "").toLowerCase()
                if (lowerError.includes("name") && lowerError.includes("only contain")) {
                    throw new Error("Name can only contain letters, spaces, hyphens, and apostrophes")
                } else if (lowerError.includes("failed to update")) {
                    throw new Error("Please check your information and try again")
                } else {
                    throw new Error(error.message)
                }
            }

            setOriginalData({ ...formData })
            setIsEditing(false)
            toast.success("Profile updated successfully!")
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update profile")
        } finally {
            setUpdating(false)
        }
    }

    const handleVerifyEmail = async () => {
        setVerifying(true)
        try {
            await authClient.sendVerificationEmail({
                email: session!.user.email,
                callbackURL: window.location.href
            })
            toast.success("Verification email sent! Please check your inbox.")
        } catch (error) {
            toast.error("Failed to send verification email")
        } finally {
            setVerifying(false)
        }
    }

    const handleDeleteAccount = async () => {
        setDeleting(true)
        try {
            // Use authClient to delete user
            const { error } = await authClient.deleteUser({
                callbackURL: "/" // Redirect to home after deletion
            })

            if (error) throw new Error(error.message)

            // Redirect happens automatically or we push
            router.push("/")
        } catch (error) {
            console.error("Error deleting account:", error)
            toast.error("Failed to delete account")
            setDeleting(false)
        }
    }

    if (isPending || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const user = session.user as any

    return (
        <div className="min-h-screen bg-background flex flex-col relative">
            <Header />

            <main className="flex-1 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Header & Edit Form */}
                    <div className="bg-card rounded-2xl p-8 shadow-sm border border-border mb-12">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Avatar Section */}
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-5xl mb-4 border-4 border-background shadow-sm">
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                                {!isEditing && (
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${user.emailVerified ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"}`}>
                                        {user.emailVerified ? (
                                            <>
                                                <Check className="w-3 h-3" /> Verified
                                            </>
                                        ) : (
                                            <>
                                                <ShieldAlert className="w-3 h-3" /> Unverified
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Info/Form Section */}
                            <div className="flex-1 space-y-6">
                                <div className="flex items-start justify-between">
                                    {!isEditing ? (
                                        <div>
                                            <h1 className="text-3xl font-bold text-foreground mb-1">{user.name}</h1>
                                            <div className="flex items-center text-muted-foreground mb-4">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {user.email}
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="h-auto p-0 ml-2 text-xs text-primary"
                                                    onClick={() => setEmailChangeModalOpen(true)}
                                                >
                                                    Change
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                {user.bio && (
                                                    <div className="col-span-full bg-muted/30 p-4 rounded-lg italic text-muted-foreground border border-border/50">
                                                        "{user.bio}"
                                                    </div>
                                                )}

                                                {(user.location || formData.location) && (
                                                    <div className="flex items-center text-muted-foreground">
                                                        <MapPin className="w-4 h-4 mr-2 text-primary/70" />
                                                        {user.location || formData.location || "No location set"}
                                                    </div>
                                                )}

                                                {(user.phone || formData.phone) && (
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Phone className="w-4 h-4 mr-2 text-primary/70" />
                                                        {user.phone || (formData.phone ? `${formData.countryCode} ${formData.phone}` : "No phone set")}
                                                    </div>
                                                )}

                                                <div className="flex items-center text-muted-foreground">
                                                    <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Full Name</label>
                                                    <Input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                        placeholder="Your Name"
                                                        maxLength={30}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Location</label>
                                                    <Input
                                                        value={formData.location}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                                        placeholder="City, Country"
                                                        maxLength={30}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Phone Number</label>
                                                <div className="flex gap-2">
                                                    <CountryCodeSelect
                                                        value={formData.countryCode}
                                                        onChange={(val) => setFormData(prev => ({ ...prev, countryCode: val }))}
                                                    />
                                                    <Input
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                        placeholder="Phone Number"
                                                        className="flex-1"
                                                        maxLength={12}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Bio</label>
                                                <Textarea
                                                    value={formData.bio}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                                    placeholder="Tell us a bit about yourself..."
                                                    rows={3}
                                                    className="resize-none"
                                                    maxLength={500}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Account Actions */}
                                {!isEditing ? (
                                    <div className="pt-6 mt-6 border-t border-border flex flex-wrap gap-4 justify-between items-center">
                                        {!user.emailVerified && (
                                            <div className="flex items-center gap-4 bg-yellow-500/5 px-4 py-3 rounded-lg border border-yellow-500/10 w-full md:w-auto">
                                                <div className="text-sm text-yellow-700">
                                                    <p className="font-medium">Email not verified</p>
                                                    <p className="text-xs opacity-80">Verify to access all features</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleVerifyEmail}
                                                    disabled={verifying}
                                                    className="ml-auto border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-700"
                                                >
                                                    {verifying ? "Sending..." : "Verify Now"}
                                                </Button>
                                            </div>
                                        )}

                                        <div className="ml-auto flex flex-wrap items-center gap-3 justify-end">
                                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setPasswordModalOpen(true)}
                                                className="border-primary/30 hover:bg-primary/10 text-primary"
                                            >
                                                Change Password
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive"
                                                onClick={() => setDeleteModalOpen(true)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pt-6 mt-6 border-t border-border flex justify-end gap-3 flex-wrap">
                                        <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData(originalData); }}>
                                            <X className="w-4 h-4 mr-2" /> Cancel
                                        </Button>
                                        <Button onClick={handleUpdateProfile} disabled={updating} className="min-w-[140px]">
                                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Trip Requests Section */}
                    <div id="requests" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-foreground flex items-center">
                                <Calendar className="w-6 h-6 mr-3 text-primary fill-primary/20" />
                                My Trip Requests
                            </h2>
                            <span className="bg-muted px-3 py-1 rounded-full text-sm font-medium">{tripRequests.length} requests</span>
                        </div>

                        {loadingRequests ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : tripRequests.length > 0 ? (
                            <div className="space-y-4">
                                {tripRequests.map((request: any) => (
                                    <div key={request.id} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-lg">{request.travelStyle} Trip to {request.arrivalCity}</h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${request.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                                        request.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                            request.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {request.travelDates}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4" />
                                                        {request.arrivalCity} → {request.departureCity}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <UserIcon className="w-4 h-4" />
                                                        {request.numberOfTravelers} travelers
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="text-sm text-muted-foreground">
                                                    Submitted on {new Date(request.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card border-2 border-dashed border-border rounded-xl py-12 text-center">
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">No trip requests yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-sm">
                                    Plan your dream trip to Morocco with us!
                                </p>
                                <Link href="/plan-trip">
                                    <Button size="sm">Plan a Trip</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Favorites Section */}
                    <div id="favorites" className="space-y-6 mt-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-foreground flex items-center">
                                <Heart className="w-6 h-6 mr-3 text-primary fill-primary/20" />
                                My Favorite Trips
                            </h2>
                            <span className="bg-muted px-3 py-1 rounded-full text-sm font-medium">{favorites.length} saved</span>
                        </div>

                        {loadingFavs ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : favorites.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {favorites.map((fav) => (
                                    <div key={fav.id} className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border/50 flex flex-col md:flex-row h-full md:h-48">
                                        <div className="relative w-full md:w-48 h-48 md:h-full flex-shrink-0">
                                            {fav.circuit.images?.[0] ? (
                                                <Image
                                                    src={fav.circuit.images[0]}
                                                    alt={fav.circuit.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-accent/5 flex items-center justify-center">
                                                    <MapPin className="w-8 h-8 text-accent/20" />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => removeFavorite(fav.id)}
                                                className="absolute top-2 left-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                title="Remove from favorites"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{fav.circuit.category}</span>
                                                <span className="text-sm font-bold text-foreground">${fav.circuit.price}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
                                                {fav.circuit.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-auto">
                                                {fav.circuit.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/50">
                                                <span className="text-xs text-muted-foreground flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" /> {fav.circuit.duration} Days
                                                </span>
                                                <Link href={`/circuits/${fav.circuit.slug}`} className="text-primary text-sm font-bold flex items-center hover:underline">
                                                    View Details <ArrowRight className="w-3 h-3 ml-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card border-2 border-dashed border-border rounded-xl py-12 text-center">
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">No favorites yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-sm">
                                    Start exploring our circuits and save the ones you love!
                                </p>
                                <Link href="/circuits">
                                    <Button size="sm">Explore Trips</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Change Email Modal */}
            {emailChangeModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Mail className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold">Change Email Address</h2>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                            Enter your new email address. We will send a verification link to this address. Your email will not be updated until you verify it.
                        </p>
                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Email</label>
                                <Input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="new-email@example.com"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setEmailChangeModalOpen(false)} disabled={changingEmail}>
                                Cancel
                            </Button>
                            <Button onClick={handleChangeEmail} disabled={changingEmail}>
                                {changingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Verification Link"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4 text-destructive">
                            <ShieldAlert className="w-8 h-8" />
                            <h2 className="text-xl font-bold">Delete Account?</h2>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data, including favorites and trip history, will be lost.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={deleting}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete Account"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Change Modal */}
            {passwordModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Change Password</h2>
                            <button onClick={() => { setPasswordModalOpen(false); setPasswordErrors({}) }} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {passwordErrors.form && (
                            <div className="px-4 py-3 rounded text-sm mb-4 bg-destructive/10 text-destructive border border-destructive/20">
                                {passwordErrors.form}
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Password</label>
                                <Input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    placeholder="••••••••"
                                    className={passwordErrors.currentPassword ? "border-destructive" : ""}
                                />
                                {passwordErrors.currentPassword && <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <Input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="••••••••"
                                    className={passwordErrors.newPassword ? "border-destructive" : ""}
                                />
                                {passwordErrors.newPassword && <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Confirm New Password</label>
                                <Input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="••••••••"
                                    className={passwordErrors.confirmPassword ? "border-destructive" : ""}
                                />
                                {passwordErrors.confirmPassword && <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button variant="outline" onClick={() => { setPasswordModalOpen(false); setPasswordErrors({}) }} disabled={changingPassword}>
                                Cancel
                            </Button>
                            <Button onClick={handleChangePassword} disabled={changingPassword}>
                                {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Change Password"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}
