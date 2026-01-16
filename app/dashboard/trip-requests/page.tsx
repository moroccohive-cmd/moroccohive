"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar, MapPin, Users, Mail, Phone, Search } from "lucide-react"

interface TripRequest {
    id: string
    travelStyle: string
    travelDates: string
    arrivalCity: string
    departureCity: string
    accommodation: string
    budget: string
    adventureActivities: string[]
    experiences: string[]
    importantFactors: string[]
    desiredExperiences: string
    numberOfTravelers: number
    travelerAges: string
    fullName: string
    email: string
    phone: string
    status: string
    createdAt: string
    preferredPaymentMethod?: string
    user?: {
        name: string
        email: string
        image?: string
    }
}

const statusStyles = {
    new: "bg-orange-50 text-orange-700 border-orange-200",
    contacted: "bg-blue-50 text-blue-700 border-blue-200",
    "in-progress": "bg-purple-50 text-purple-700 border-purple-200",
    quoted: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-300",
}

export default function TripRequestsPage() {
    const [requests, setRequests] = useState<TripRequest[]>([])
    const [selectedRequest, setSelectedRequest] = useState<TripRequest | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [updating, setUpdating] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const itemsPerPage = 6

    useEffect(() => {
        // Reset and fetch when filter changes
        setRequests([])
        setCurrentPage(1)
        setHasMore(true)
        fetchRequests(1, true)
    }, [statusFilter])

    const fetchRequests = async (page: number, isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        else setLoadingMore(true)

        try {
            const url = statusFilter === "all"
                ? `/api/admin/trip-requests?page=${page}&limit=${itemsPerPage}`
                : `/api/admin/trip-requests?status=${statusFilter}&page=${page}&limit=${itemsPerPage}`

            const response = await fetch(url, { credentials: "include" })

            if (response.ok) {
                const data = await response.json()
                if (isInitial) {
                    setRequests(data.tripRequests)
                } else {
                    setRequests(prev => [...prev, ...data.tripRequests])
                }
                setHasMore(data.pagination.currentPage < data.pagination.pages)
            }
        } catch {
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchRequests(nextPage)
        }
    }

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/trip-requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                await fetchRequests(1, true)
                setCurrentPage(1)
                if (selectedRequest?.id === id) {
                    setSelectedRequest({ ...selectedRequest, status: newStatus })
                }
            }
        } catch (error) {
            console.error("Failed to update:", error)
        } finally {
            setUpdating(false)
        }
    }

    const filteredRequests = requests.filter(req =>
        req.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Trip Requests</h1>
                <p className="text-sm text-muted-foreground mt-1">{requests.length} total requests</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", "new", "contacted", "in-progress", "quoted", "confirmed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${statusFilter === status
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {status === "all" ? "All" : status.replace("-", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
                    <p className="text-muted-foreground">
                        {statusFilter === "all"
                            ? "No trip requests yet"
                            : `No ${statusFilter} requests`}
                    </p>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border">
                    <div className="divide-y divide-border">
                        {filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                onClick={() => setSelectedRequest(request)}
                                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-medium text-foreground">{request.fullName}</h3>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded border ${statusStyles[request.status as keyof typeof statusStyles] || statusStyles.new}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{request.travelDates}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span>{request.arrivalCity}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {request.user?.image ? (
                                                    <img src={request.user.image} alt={request.user.name} className="w-4 h-4 rounded-full object-cover" />
                                                ) : (
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <span>{request.numberOfTravelers} travelers</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More trigger */}
                    {hasMore && (
                        <div className="p-4 flex justify-center">
                            <Button
                                variant="ghost"
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="text-muted-foreground"
                            >
                                {loadingMore ? "Loading more..." : "Scroll for more or Click to load"}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
                        {/* Header */}
                        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                    {selectedRequest.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{selectedRequest.fullName}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Submitted {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(selectedRequest.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 rounded-full hover:bg-muted transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Registered User Badge */}
                            {selectedRequest.user && (
                                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 flex items-center gap-4">
                                    {selectedRequest.user.image ? (
                                        <img src={selectedRequest.user.image} alt={selectedRequest.user.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <Users className="w-7 h-7" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-foreground">{selectedRequest.user.name}</h3>
                                        </div>
                                        <p className="text-muted-foreground">{selectedRequest.user.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Status Update Card */}
                            <div className="bg-muted/30 border border-border rounded-xl p-5">
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    Update Status
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { status: "new", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
                                        { status: "contacted", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
                                        { status: "in-progress", color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
                                        { status: "quoted", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30" },
                                        { status: "confirmed", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
                                        { status: "cancelled", color: "bg-red-500/10 text-red-600 border-red-500/30" },
                                    ].map(({ status, color }) => (
                                        <button
                                            key={status}
                                            onClick={() => updateStatus(selectedRequest.id, status)}
                                            disabled={updating}
                                            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${selectedRequest.status === status
                                                ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                                : `${color} hover:scale-105`
                                                }`}
                                        >
                                            {status.replace("-", " ").charAt(0).toUpperCase() + status.replace("-", " ").slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Info Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Travel Details Card */}
                                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        Travel Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Style</span>
                                            <p className="text-foreground font-semibold capitalize mt-1">{selectedRequest.travelStyle}</p>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Travelers</span>
                                            <p className="text-foreground font-semibold mt-1">{selectedRequest.numberOfTravelers}</p>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3 col-span-2">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Dates</span>
                                            <p className="text-foreground font-semibold mt-1">{selectedRequest.travelDates}</p>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3 col-span-2">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Route</span>
                                            <p className="text-foreground font-semibold mt-1 flex items-center gap-2">
                                                {selectedRequest.arrivalCity}
                                                <span className="text-primary">→</span>
                                                {selectedRequest.departureCity}
                                            </p>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Accommodation</span>
                                            <p className="text-foreground font-semibold capitalize mt-1">{selectedRequest.accommodation}</p>
                                        </div>
                                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                                            <span className="text-xs text-primary uppercase tracking-wide">Budget</span>
                                            <p className="text-primary font-bold text-lg mt-1">{selectedRequest.budget}</p>
                                        </div>
                                        {selectedRequest.preferredPaymentMethod && (
                                            <div className="bg-muted/50 rounded-lg p-3 col-span-2">
                                                <span className="text-xs text-muted-foreground uppercase tracking-wide">Payment Method</span>
                                                <p className="text-foreground font-semibold mt-1">{selectedRequest.preferredPaymentMethod}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Card */}
                                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-3">
                                        <a
                                            href={`mailto:${selectedRequest.email}`}
                                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                                                <p className="text-foreground font-medium group-hover:text-primary transition-colors">{selectedRequest.email}</p>
                                            </div>
                                        </a>
                                        <a
                                            href={`tel:${selectedRequest.phone}`}
                                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Phone className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                                                <p className="text-foreground font-medium group-hover:text-primary transition-colors">{selectedRequest.phone}</p>
                                            </div>
                                        </a>
                                        {selectedRequest.travelerAges && (
                                            <div className="p-3 bg-muted/50 rounded-lg">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Traveler Ages</p>
                                                <p className="text-foreground font-medium mt-1">{selectedRequest.travelerAges}</p>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => window.location.href = `mailto:${selectedRequest.email}?subject=Regarding Your Trip Request to Morocco`}
                                        className="w-full mt-2"
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email
                                    </Button>
                                </div>
                            </div>

                            {/* Activities & Experiences */}
                            {(selectedRequest.adventureActivities.length > 0 || (selectedRequest.experiences && selectedRequest.experiences.length > 0)) && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {selectedRequest.adventureActivities.length > 0 && (
                                        <div className="bg-card border border-border rounded-xl p-5">
                                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">🏔️</span>
                                                Activities
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRequest.adventureActivities.map((activity) => (
                                                    <span key={activity} className="px-3 py-1.5 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full text-sm font-medium">
                                                        {activity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedRequest.experiences && selectedRequest.experiences.length > 0 && (
                                        <div className="bg-card border border-border rounded-xl p-5">
                                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">✨</span>
                                                Target Experiences
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRequest.experiences.map((exp) => (
                                                    <span key={exp} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
                                                        {exp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Key Priorities */}
                            {selectedRequest.importantFactors && selectedRequest.importantFactors.length > 0 && (
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">⭐</span>
                                        Key Priorities
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.importantFactors.map((factor) => (
                                            <span key={factor} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full text-sm font-medium">
                                                {factor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Information */}
                            {selectedRequest.desiredExperiences && (
                                <div className="bg-card border border-border rounded-xl p-5">
                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">📝</span>
                                        Additional Notes
                                    </h3>
                                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedRequest.desiredExperiences}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

