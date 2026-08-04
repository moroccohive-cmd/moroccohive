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

        const existing = await (prisma as any).review.findUnique({
            where: { id },
            include: { circuit: { select: { slug: true } } },
        })
        if (!existing) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 })
        }

        const data: Record<string, unknown> = {}

        if (body.circuitId !== undefined) {
            const nextCircuitId = body.circuitId || null
            // Re-check the 3-per-tour cap when moving a review onto a different tour
            if (nextCircuitId && nextCircuitId !== existing.circuitId) {
                const count = await (prisma as any).review.count({ where: { circuitId: nextCircuitId } })
                if (count >= 3) {
                    return NextResponse.json(
                        { error: "This tour already has 3 reviews. Delete one before moving another in." },
                        { status: 400 }
                    )
                }
            }
            data.circuitId = nextCircuitId
        }

        if (body.authorName !== undefined) {
            if (!body.authorName.trim()) {
                return NextResponse.json({ error: "authorName cannot be empty" }, { status: 400 })
            }
            data.authorName = body.authorName.trim()
        }
        if (body.text !== undefined) {
            if (!body.text.trim()) {
                return NextResponse.json({ error: "text cannot be empty" }, { status: 400 })
            }
            data.text = body.text.trim()
        }
        if (body.rating !== undefined) {
            const parsedRating = parseInt(body.rating)
            if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
                return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 })
            }
            data.rating = parsedRating
        }
        if (body.authorLocation !== undefined) data.authorLocation = body.authorLocation?.trim() || null
        if (body.authorImage !== undefined) data.authorImage = body.authorImage?.trim() || null
        if (body.country !== undefined) data.country = body.country?.trim() || null
        if (body.displayDate !== undefined) data.displayDate = body.displayDate?.trim() || null
        if (body.source !== undefined) data.source = body.source?.trim() || null
        if (body.showOnHome !== undefined) data.showOnHome = Boolean(body.showOnHome)
        if (body.order !== undefined && Number.isFinite(Number(body.order))) {
            data.order = Number(body.order)
        }

        const review = await (prisma as any).review.update({
            where: { id },
            data,
            include: { circuit: { select: { id: true, name: true, slug: true } } },
        })

        revalidatePath("/")
        revalidatePath("/reviews")
        // The review may have moved between tours - refresh both pages
        if (existing.circuit?.slug) revalidatePath(`/circuits/${existing.circuit.slug}`)
        if (review.circuit?.slug) revalidatePath(`/circuits/${review.circuit.slug}`)

        return NextResponse.json(review)
    } catch (error) {
        console.error("Error updating review:", error)
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
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

        const existing = await (prisma as any).review.findUnique({
            where: { id },
            include: { circuit: { select: { slug: true } } },
        })
        if (!existing) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 })
        }

        await (prisma as any).review.delete({ where: { id } })

        revalidatePath("/")
        revalidatePath("/reviews")
        if (existing.circuit?.slug) revalidatePath(`/circuits/${existing.circuit.slug}`)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting review:", error)
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
    }
}
