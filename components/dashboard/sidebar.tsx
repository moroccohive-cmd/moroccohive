"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Map, Calendar, Mail, LogOut, User, FileText, Settings, Star, HelpCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Circuits", href: "/dashboard/circuits", icon: Map },
    { name: "Blog", href: "/dashboard/blog", icon: FileText },
    { name: "Trip Requests", href: "/dashboard/trip-requests", icon: Calendar },
    { name: "Messages", href: "/dashboard/messages", icon: Mail },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function SidebarContent() {
    const { user, logout } = useAuth()
    const pathname = usePathname()

    return (
        <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                        src="/logo_1.webp"
                        alt="MoroccoHive"
                        width={180}
                        height={60}
                        className="h-16 w-auto object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-6 px-3 py-4 overflow-y-auto">
                <div>
                    <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Overview
                    </p>
                    <Link
                        href="/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                            pathname === "/dashboard"
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </Link>
                </div>

                <div>
                    <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Content
                    </p>
                    <div className="space-y-1">
                        {[
                            { name: "Circuits", href: "/dashboard/circuits", icon: Map },
                            { name: "Blog", href: "/dashboard/blog", icon: FileText },
                            { name: "Reviews", href: "/dashboard/reviews", icon: Star },
                            { name: "FAQs", href: "/dashboard/faqs", icon: HelpCircle },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                    pathname.startsWith(item.href)
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Management
                    </p>
                    <div className="space-y-1">
                        {[
                            { name: "Trip Requests", href: "/dashboard/trip-requests", icon: Calendar },
                            { name: "Messages", href: "/dashboard/messages", icon: Mail },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                    pathname.startsWith(item.href)
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        System
                    </p>
                    <Link
                        href="/dashboard/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                            pathname.startsWith("/dashboard/settings")
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </div>

                <div>
                    <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Account
                    </p>
                    <Link
                        href="/dashboard/profile"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                            pathname.startsWith("/dashboard/profile")
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <User className="h-5 w-5" />
                        Profile
                    </Link>
                </div>
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-sidebar-border">
                <div className="mb-2 px-3 py-2 text-sm font-medium text-sidebar-foreground/70 flex items-center gap-3">
                    <User className="h-4 w-4" />
                    <span className="truncate">{user?.email}</span>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    )
}

export function Sidebar() {
    return (
        <div className="hidden lg:flex h-screen sticky top-0 left-0 w-64 flex-col">
            <SidebarContent />
        </div>
    )
}
