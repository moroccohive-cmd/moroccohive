"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:font-sans group-[.toaster]:rounded-xl font-medium",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                    success: "group-[.toaster]:!border-emerald-500/20 group-[.toaster]:!bg-emerald-50 group-[.toaster]:!text-emerald-800",
                    error: "group-[.toaster]:!border-destructive/20 group-[.toaster]:!bg-destructive/10 group-[.toaster]:!text-destructive",
                    warning: "group-[.toaster]:!border-amber-500/20 group-[.toaster]:!bg-amber-50 group-[.toaster]:!text-amber-800",
                    info: "group-[.toaster]:!border-blue-500/20 group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-800",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
