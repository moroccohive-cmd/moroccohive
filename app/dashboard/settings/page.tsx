"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Plus, X, Loader2, Save, CreditCard, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"

interface SiteSettings {
    id: string
    paymentMethodsEnabled: boolean
    enabledPaymentMethods: string[]
    budgetType: "dropdown" | "slider"
    budgetDropdownOptions: string[]
    budgetMin: number
    budgetMax: number
    budgetStep: number
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings", { credentials: "include" })
            if (res.ok) {
                const data = await res.json()
                setSettings(data)
            }
        } catch {
            toast.error("Failed to load settings")
        } finally {
            setLoading(false)
        }
    }

    const saveSettings = async () => {
        if (!settings) return

        setSaving(true)
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    paymentMethodsEnabled: settings.paymentMethodsEnabled,
                    enabledPaymentMethods: settings.enabledPaymentMethods,
                    budgetType: settings.budgetType,
                    budgetDropdownOptions: settings.budgetDropdownOptions,
                    budgetMin: settings.budgetMin,
                    budgetMax: settings.budgetMax,
                    budgetStep: settings.budgetStep
                })
            })

            if (res.ok) {
                toast.success("Settings saved successfully!")
            } else {
                throw new Error("Failed to save")
            }
        } catch {
            toast.error("Failed to save settings")
        } finally {
            setSaving(false)
        }
    }


    const togglePaymentMethods = () => {
        if (settings) {
            setSettings({ ...settings, paymentMethodsEnabled: !settings.paymentMethodsEnabled })
        }
    }

    // Payment method options
    const PAYMENT_METHODS = [
        { value: "Deposit Payment", label: "Deposit Payment" },
        { value: "Bank Transfer / SWIFT", label: "Bank Transfer / SWIFT" },
        { value: "Credit Cards", label: "Credit Cards (Visa, Mastercard, Amex)" },
        { value: "PayPal", label: "PayPal" },
        { value: "Payoneer", label: "Payoneer" },
    ]

    const togglePaymentMethod = (methodValue: string) => {
        if (!settings) return
        const isEnabled = settings.enabledPaymentMethods.includes(methodValue)
        const newEnabledMethods = isEnabled
            ? settings.enabledPaymentMethods.filter(m => m !== methodValue)
            : [...settings.enabledPaymentMethods, methodValue]
        setSettings({ ...settings, enabledPaymentMethods: newEnabledMethods })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 max-w-2xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                    <Settings className="w-6 h-6" />
                    Site Settings
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Configure site-wide settings</p>
            </div>

            {/* Payment Methods Section */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Payment Methods</h2>
                </div>

                {/* Toggle */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="space-y-1">
                        <p className="font-medium text-foreground">Enable Payment Method Selection</p>
                        <p className="text-sm text-muted-foreground">Show payment method dropdown in booking forms</p>
                    </div>
                    <button
                        onClick={togglePaymentMethods}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${settings?.paymentMethodsEnabled ? "bg-primary" : "bg-input"
                            }`}
                    >
                        <span
                            className={`${settings?.paymentMethodsEnabled ? "translate-x-6" : "translate-x-1"
                                } inline-block h-4 w-4 transform rounded-full bg-background transition-transform`}
                        />
                    </button>
                </div>

                {/* Individual Payment Method Toggles */}
                <div className="space-y-4">
                    <p className="text-sm font-medium flex items-center gap-2">
                        Payment Methods
                        <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {settings?.enabledPaymentMethods?.length || 0} enabled
                        </span>
                    </p>
                    <div className="grid gap-2">
                        {PAYMENT_METHODS.map((method) => {
                            const isEnabled = settings?.enabledPaymentMethods?.includes(method.value) ?? false
                            return (
                                <div
                                    key={method.value}
                                    className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/40 ${isEnabled
                                            ? "bg-primary/5 border-primary/20"
                                            : "bg-muted/20 border-border/50"
                                        }`}
                                    onClick={() => togglePaymentMethod(method.value)}
                                >
                                    <span className={`text-sm font-medium ${isEnabled ? "text-foreground" : "text-muted-foreground"}`}>
                                        {method.label}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            togglePaymentMethod(method.value)
                                        }}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isEnabled ? "bg-primary" : "bg-input"}`}
                                    >
                                        <span
                                            className={`${isEnabled ? "translate-x-5" : "translate-x-1"} inline-block h-3 w-3 transform rounded-full bg-background transition-transform`}
                                        />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Toggle each payment method to enable or disable it in booking forms.
                    </p>
                </div>
            </div>

            {/* Budget Configuration Section */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Budget Settings</h2>
                        <p className="text-xs text-muted-foreground">Configure budget range options</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Budget Input Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className={`cursor-pointer border-2 p-4 rounded-xl flex items-center gap-3 transition-all ${settings?.budgetType === "dropdown" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${settings?.budgetType === "dropdown" ? "border-primary" : "border-muted-foreground"}`}>
                                    {settings?.budgetType === "dropdown" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                </div>
                                <input
                                    type="radio"
                                    name="budgetType"
                                    value="dropdown"
                                    checked={settings?.budgetType === "dropdown"}
                                    onChange={() => setSettings(settings ? { ...settings, budgetType: "dropdown" } : null)}
                                    className="hidden"
                                />
                                <span className="font-medium">Dropdown Select</span>
                            </label>

                            <label className={`cursor-pointer border-2 p-4 rounded-xl flex items-center gap-3 transition-all ${settings?.budgetType === "slider" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${settings?.budgetType === "slider" ? "border-primary" : "border-muted-foreground"}`}>
                                    {settings?.budgetType === "slider" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                </div>
                                <input
                                    type="radio"
                                    name="budgetType"
                                    value="slider"
                                    checked={settings?.budgetType === "slider"}
                                    onChange={() => setSettings(settings ? { ...settings, budgetType: "slider" } : null)}
                                    className="hidden"
                                />
                                <span className="font-medium">Range Slider</span>
                            </label>
                        </div>
                    </div>

                    {settings?.budgetType === "dropdown" ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-3">
                                <p className="text-sm font-medium">Dropdown Options</p>
                                <div className="grid gap-2">
                                    {settings.budgetDropdownOptions.map((option, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors group">
                                            <span className="text-sm">{option}</span>
                                            <button
                                                onClick={() => {
                                                    const updated = settings.budgetDropdownOptions.filter((_, i) => i !== index)
                                                    setSettings({ ...settings, budgetDropdownOptions: updated })
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add new budget range (e.g. $500-$1000)"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const val = e.currentTarget.value.trim()
                                                if (val && !settings.budgetDropdownOptions.includes(val)) {
                                                    setSettings({
                                                        ...settings,
                                                        budgetDropdownOptions: [...settings.budgetDropdownOptions, val]
                                                    })
                                                    e.currentTarget.value = ""
                                                }
                                            }
                                        }}
                                        className="flex-1"
                                    />
                                    <Button
                                        size="icon"
                                        onClick={(e) => {
                                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                            const val = input.value.trim()
                                            if (val && !settings.budgetDropdownOptions.includes(val)) {
                                                setSettings({
                                                    ...settings,
                                                    budgetDropdownOptions: [...settings.budgetDropdownOptions, val]
                                                })
                                                input.value = ""
                                            }
                                        }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Minimum</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            value={settings?.budgetMin}
                                            onChange={(e) => setSettings(settings ? { ...settings, budgetMin: parseInt(e.target.value) || 0 } : null)}
                                            className="pl-7"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Maximum</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            value={settings?.budgetMax}
                                            onChange={(e) => setSettings(settings ? { ...settings, budgetMax: parseInt(e.target.value) || 0 } : null)}
                                            className="pl-7"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Step Interval</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <Input
                                            type="number"
                                            value={settings?.budgetStep}
                                            onChange={(e) => setSettings(settings ? { ...settings, budgetStep: parseInt(e.target.value) || 0 } : null)}
                                            className="pl-7"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-muted/40 rounded-xl border border-border/50">
                                <p className="text-sm font-medium">Live Preview</p>
                                <div className="pt-6 pb-2 px-1">
                                    <Slider
                                        value={[settings?.budgetMin || 100]}
                                        min={settings?.budgetMin || 100}
                                        max={settings?.budgetMax || 10000}
                                        step={settings?.budgetStep || 100}
                                        onValueChange={() => { }}
                                        onValueCommit={() => { }}
                                        className="mb-4"
                                    />
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>${settings?.budgetMin}</span>
                                        <span className="font-semibold text-foreground text-lg">${settings?.budgetMin}</span>
                                        <span>${settings?.budgetMax}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={saveSettings} disabled={saving}>
                    {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Settings
                </Button>
            </div>
        </div>
    )
}
