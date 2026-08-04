import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter"

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || (session.user as any).role !== "admin") return null
    return session
}

export async function GET() {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const faqs = await (prisma as any).faq.findMany({
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        })

        return NextResponse.json(faqs)
    } catch (error) {
        console.error("Error fetching FAQs:", error)
        return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { question, answer, category, showOnHome, active, order } = body

        if (!question?.trim() || !answer?.trim()) {
            return NextResponse.json({ error: "question and answer are required" }, { status: 400 })
        }

        const faq = await (prisma as any).faq.create({
            data: {
                question: question.trim(),
                answer: answer.trim(),
                category: category?.trim() || null,
                showOnHome: Boolean(showOnHome),
                active: active === undefined ? true : Boolean(active),
                order: Number.isFinite(Number(order)) ? Number(order) : 0,
            },
        })

        revalidatePath("/")
        revalidatePath("/faq")

        return NextResponse.json(faq, { status: 201 })
    } catch (error) {
        console.error("Error creating FAQ:", error)
        return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 })
    }
}
