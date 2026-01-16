import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter"

// GET: Fetch site settings
export async function GET() {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        // Check if admin
        const user = session?.user as any
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get or create settings
        let settings = await prisma.siteSettings.findFirst()

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    paymentMethodsEnabled: true,
                    paymentMethodOptions: ["Cash on arrival", "Bank transfer", "Credit card", "PayPal"],
                    budgetType: "dropdown",
                    budgetDropdownOptions: ["$500-$1000", "$1000-$2000", "$2000-$3500", "$3500+"],
                    budgetMin: 500,
                    budgetMax: 5000,
                    budgetStep: 100
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}

// PATCH: Update site settings
export async function PATCH(request: NextRequest) {
    const rateLimitError = await checkRateLimit("strict")
    if (rateLimitError) return rateLimitError

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const {
            paymentMethodsEnabled,
            paymentMethodOptions,
            budgetType,
            budgetDropdownOptions,
            budgetMin,
            budgetMax,
            budgetStep
        } = body

        // Validate budget type if provided
        if (budgetType && !["dropdown", "slider"].includes(budgetType)) {
            return NextResponse.json({ error: "Invalid budget type" }, { status: 400 })
        }

        const settings = await prisma.siteSettings.findFirst()

        let updatedSettings
        if (settings) {
            updatedSettings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: {
                    paymentMethodsEnabled: paymentMethodsEnabled !== undefined ? paymentMethodsEnabled : settings.paymentMethodsEnabled,
                    paymentMethodOptions: paymentMethodOptions !== undefined ? paymentMethodOptions : settings.paymentMethodOptions,
                    budgetType: budgetType !== undefined ? budgetType : settings.budgetType,
                    budgetDropdownOptions: budgetDropdownOptions !== undefined ? budgetDropdownOptions : settings.budgetDropdownOptions,
                    budgetMin: budgetMin !== undefined ? budgetMin : settings.budgetMin,
                    budgetMax: budgetMax !== undefined ? budgetMax : settings.budgetMax,
                    budgetStep: budgetStep !== undefined ? budgetStep : settings.budgetStep,
                }
            })
        } else {
            updatedSettings = await prisma.siteSettings.create({
                data: {
                    paymentMethodsEnabled: paymentMethodsEnabled ?? true,
                    paymentMethodOptions: paymentMethodOptions ?? ["Cash on arrival", "Bank transfer", "Credit card", "PayPal"],
                    budgetType: budgetType ?? "dropdown",
                    budgetDropdownOptions: budgetDropdownOptions ?? ["$500-$1000", "$1000-$2000", "$2000-$3500", "$3500+"],
                    budgetMin: budgetMin ?? 500,
                    budgetMax: budgetMax ?? 5000,
                    budgetStep: budgetStep ?? 100
                }
            })
        }

        return NextResponse.json(updatedSettings)
    } catch {
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }
}
