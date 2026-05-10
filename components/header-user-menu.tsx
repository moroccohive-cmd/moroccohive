"use client"

import { useState } from "react"
import Link from "next/link"
import { User, LogOut, LayoutDashboard, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function HeaderUserMenu() {
  const [open, setOpen] = useState(false)
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login")
          router.refresh()
        },
      },
    })
  }

  if (isPending) {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" aria-hidden="true" />
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/login" className="hidden md:block">
          <Button variant="ghost" size="sm">Log In</Button>
        </Link>
        <Link href="/login" aria-label="Log in" className="md:hidden p-2 text-foreground">
          <User className="w-6 h-6" aria-hidden="true" />
        </Link>
        <Link href="/plan-trip" className="hidden md:block">
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Start Planning
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open user menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-accent/10 transition-colors border border-transparent hover:border-border"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          {session.user.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
        </div>
        <span className="hidden md:inline text-sm font-medium text-foreground">{session.user.name?.split(" ")[0]}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
            <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors" onClick={() => setOpen(false)}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
            <Link href="/profile#favorites" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors" onClick={() => setOpen(false)}>
              <Heart className="w-4 h-4 mr-2" />
              My Favorites
            </Link>
            {(session.user as { role?: string }).role === "admin" && (
              <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors" onClick={() => setOpen(false)}>
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Link>
            )}
            <div className="h-px bg-border my-1" />
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
