"use client"

import { useEffect, useState } from "react"
import { Mail, Search, Eye, Trash, Phone } from "lucide-react"
import { refreshAdminNotifications } from "@/hooks/use-admin-notifications"

interface ContactMessage {
    id: string
    name: string
    email: string
    phone?: string | null
    subject: string
    message: string
    status: string
    createdAt: string
}

/** The form writes "new"; the schema default is "unread". Both mean unhandled. */
const isUnread = (status: string) => status === "new" || status === "unread"

export default function MessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [totalMessages, setTotalMessages] = useState(0)
    const [newMessages, setNewMessages] = useState(0)
    const itemsPerPage = 10

    useEffect(() => {
        fetchMessages(1, true)
    }, [])

    const fetchMessages = async (page: number, isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        else setLoadingMore(true)

        try {
            const response = await fetch(`/api/admin/messages?page=${page}&limit=${itemsPerPage}`, {
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json()
                if (isInitial) {
                    setMessages(data.messages)
                } else {
                    setMessages(prev => [...prev, ...data.messages])
                }
                setHasMore(data.pagination.currentPage < data.pagination.pages)
                setTotalMessages(data.pagination.total)
                setNewMessages(data.newCount ?? 0)
            }
        } catch (error) {
            console.error("Failed to fetch:", error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchMessages(nextPage)
        }
    }

    const deleteMessage = async (id: string) => {
        if (!confirm("Delete this message?")) return

        try {
            const response = await fetch(`/api/admin/messages/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                fetchMessages(1, true)
                setCurrentPage(1)
                refreshAdminNotifications()
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null)
                }
            }
        } catch (error) {
            console.error("Failed to delete:", error)
        }
    }

    const markAsRead = async (id: string) => {
        // Patched in place rather than re-fetched: the message the admin just
        // opened would otherwise jump as the list collapsed back to page one.
        setMessages(prev => prev.map(m => (m.id === id ? { ...m, status: "read" } : m)))
        setNewMessages(prev => Math.max(0, prev - 1))

        try {
            await fetch(`/api/admin/messages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: "read" })
            })
            refreshAdminNotifications()
        } catch (error) {
            console.error("Failed to update:", error)
        }
    }

    const query = searchQuery.toLowerCase()
    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        (msg.phone ?? "").toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query)
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
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
                    {newMessages > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive border border-destructive/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                            {newMessages} new
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    {totalMessages} total messages
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
            </div>

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No messages</h3>
                    <p className="text-muted-foreground">Contact messages will appear here</p>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border">
                    <div className="divide-y divide-border">
                        {filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-4 cursor-pointer transition-colors ${isUnread(message.status)
                                    ? "bg-primary/5 border-l-4 border-l-primary hover:bg-primary/10"
                                    : "hover:bg-muted/50"
                                    }`}
                                onClick={() => {
                                    setSelectedMessage(message)
                                    if (isUnread(message.status)) markAsRead(message.id)
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className={isUnread(message.status) ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}>
                                                {message.name}
                                            </h3>
                                            {isUnread(message.status) && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-destructive text-white">
                                                    New
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(message.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-1 text-sm text-muted-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                                {message.email}
                                            </span>
                                            {message.phone && (
                                                <a
                                                    href={`tel:${message.phone.replace(/\s+/g, "")}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors"
                                                >
                                                    <Phone className="h-3.5 w-3.5 shrink-0" />
                                                    {message.phone}
                                                </a>
                                            )}
                                        </div>
                                        {message.subject && (
                                            <p className="text-sm font-medium text-foreground mb-1">{message.subject}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedMessage(message)
                                            }}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deleteMessage(message.id)
                                            }}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More trigger */}
                    {hasMore && (
                        <div className="p-4 flex justify-center border-t border-border">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                            >
                                {loadingMore ? "Loading more..." : "Load more messages"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">{selectedMessage.name}</h2>
                                <p className="text-sm text-muted-foreground mt-1">{selectedMessage.email}</p>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Mail className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                                        <p className="text-foreground font-medium truncate group-hover:text-primary transition-colors">
                                            {selectedMessage.email}
                                        </p>
                                    </div>
                                </a>

                                {selectedMessage.phone ? (
                                    <a
                                        href={`tel:${selectedMessage.phone.replace(/\s+/g, "")}`}
                                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Phone className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                                            <p className="text-foreground font-medium truncate group-hover:text-primary transition-colors">
                                                {selectedMessage.phone}
                                            </p>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                                            <p className="text-muted-foreground">Not provided</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedMessage.subject && (
                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Subject</h3>
                                    <p className="text-foreground">{selectedMessage.subject}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Message</h3>
                                <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium"
                                >
                                    Reply via Email
                                </a>
                                <button
                                    onClick={() => deleteMessage(selectedMessage.id)}
                                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

