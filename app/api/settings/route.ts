import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter"

// Default payment methods
const DEFAULT_PAYMENT_METHODS = ["Deposit Payment", "Bank Transfer / SWIFT", "Credit Cards", "PayPal", "Payoneer"]

// Public GET: Fetch payment method settings for forms
export async function GET() {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    try {
        const settings = await prisma.siteSettings.findFirst()

        if (!settings) {
            // Return defaults if no settings exist
            return NextResponse.json({
                paymentMethodsEnabled: true,
                paymentMethodOptions: ["Cash on arrival", "Bank transfer", "Credit card", "PayPal"],
                enabledPaymentMethods: DEFAULT_PAYMENT_METHODS,
                budgetType: "dropdown",
                budgetDropdownOptions: ["$500-$1000", "$1000-$2000", "$2000-$3500", "$3500+"],
                budgetMin: 500,
                budgetMax: 5000,
                budgetStep: 100
            })
        }

        return NextResponse.json({
            paymentMethodsEnabled: settings.paymentMethodsEnabled,
            paymentMethodOptions: settings.paymentMethodOptions,
            enabledPaymentMethods: settings.enabledPaymentMethods?.length > 0
                ? settings.enabledPaymentMethods
                : DEFAULT_PAYMENT_METHODS,
            budgetType: settings.budgetType,
            budgetDropdownOptions: settings.budgetDropdownOptions,
            budgetMin: settings.budgetMin,
            budgetMax: settings.budgetMax,
            budgetStep: settings.budgetStep
        })
    } catch {
        return NextResponse.json({
            paymentMethodsEnabled: true,
            paymentMethodOptions: ["Cash on arrival", "Bank transfer", "Credit card", "PayPal"],
            enabledPaymentMethods: DEFAULT_PAYMENT_METHODS,
            budgetType: "dropdown",
            budgetDropdownOptions: ["$500-$1000", "$1000-$2000", "$2000-$3500", "$3500+"],
            budgetMin: 500,
            budgetMax: 5000,
            budgetStep: 100
        })
    }
}

