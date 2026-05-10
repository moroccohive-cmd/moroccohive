import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter"

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || (session.user as any).role !== "admin") return null
    return session
}

export async function GET(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = request.nextUrl
        const circuitId = searchParams.get("circuitId")

        const where = circuitId ? { circuitId } : {}

        const reviews = await (prisma as any).review.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { circuit: { select: { id: true, name: true, slug: true } } },
        })

        return NextResponse.json(reviews)
    } catch (error) {
        console.error("Error fetching reviews:", error)
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json()
        const { circuitId, authorName, authorLocation, authorImage, rating, text } = body

        if (!circuitId || !authorName || !text) {
            return NextResponse.json({ error: "circuitId, authorName, and text are required" }, { status: 400 })
        }

        const parsedRating = parseInt(rating)
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 })
        }

        // Enforce max 3 reviews per circuit
        const count = await (prisma as any).review.count({ where: { circuitId } })
        if (count >= 3) {
            return NextResponse.json(
                { error: "This tour already has 3 reviews. Delete one before adding a new one." },
                { status: 400 }
            )
        }

        const review = await (prisma as any).review.create({
            data: {
                circuitId,
                authorName: authorName.trim(),
                authorLocation: authorLocation?.trim() || null,
                authorImage: authorImage?.trim() || null,
                rating: parsedRating,
                text: text.trim(),
            },
        })

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        console.error("Error creating review:", error)
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }
}
