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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await params
        const body = await request.json()

        const existing = await (prisma as any).faq.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
        }

        const data: Record<string, unknown> = {}

        if (body.question !== undefined) {
            if (!body.question.trim()) {
                return NextResponse.json({ error: "question cannot be empty" }, { status: 400 })
            }
            data.question = body.question.trim()
        }
        if (body.answer !== undefined) {
            if (!body.answer.trim()) {
                return NextResponse.json({ error: "answer cannot be empty" }, { status: 400 })
            }
            data.answer = body.answer.trim()
        }
        if (body.category !== undefined) data.category = body.category?.trim() || null
        if (body.showOnHome !== undefined) data.showOnHome = Boolean(body.showOnHome)
        if (body.active !== undefined) data.active = Boolean(body.active)
        if (body.order !== undefined && Number.isFinite(Number(body.order))) {
            data.order = Number(body.order)
        }

        const faq = await (prisma as any).faq.update({ where: { id }, data })

        revalidatePath("/")
        revalidatePath("/faq")

        return NextResponse.json(faq)
    } catch (error) {
        console.error("Error updating FAQ:", error)
        return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await params

        const existing = await (prisma as any).faq.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
        }

        await (prisma as any).faq.delete({ where: { id } })

        revalidatePath("/")
        revalidatePath("/faq")

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting FAQ:", error)
        return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 })
    }
}
