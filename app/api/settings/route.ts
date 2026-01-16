import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter"

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
            budgetType: "dropdown",
            budgetDropdownOptions: ["$500-$1000", "$1000-$2000", "$2000-$3500", "$3500+"],
            budgetMin: 500,
            budgetMax: 5000,
            budgetStep: 100
        })
    }
}
