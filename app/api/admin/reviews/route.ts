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

export async function GET(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { searchParams } = request.nextUrl
        const circuitId = searchParams.get("circuitId")

        // "site" filters to reviews not attached to any tour
        const where =
            circuitId === "site" ? { circuitId: null } : circuitId ? { circuitId } : {}

        const reviews = await (prisma as any).review.findMany({
            where,
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
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
        const {
            circuitId,
            authorName,
            authorLocation,
            authorImage,
            rating,
            text,
            country,
            displayDate,
            source,
            showOnHome,
            order,
        } = body

        if (!authorName?.trim() || !text?.trim()) {
            return NextResponse.json({ error: "authorName and text are required" }, { status: 400 })
        }

        const parsedRating = parseInt(rating)
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 })
        }

        // Tour reviews are capped at 3 per tour; site-wide reviews are unlimited
        if (circuitId) {
            const count = await (prisma as any).review.count({ where: { circuitId } })
            if (count >= 3) {
                return NextResponse.json(
                    { error: "This tour already has 3 reviews. Delete one before adding a new one." },
                    { status: 400 }
                )
            }
        }

        const review = await (prisma as any).review.create({
            data: {
                circuitId: circuitId || null,
                authorName: authorName.trim(),
                authorLocation: authorLocation?.trim() || null,
                authorImage: authorImage?.trim() || null,
                rating: parsedRating,
                text: text.trim(),
                country: country?.trim() || null,
                displayDate: displayDate?.trim() || null,
                source: source?.trim() || null,
                showOnHome: Boolean(showOnHome),
                order: Number.isFinite(Number(order)) ? Number(order) : 0,
            },
        })

        revalidatePath("/")
        revalidatePath("/reviews")
        if (review.circuitId) {
            const circuit = await prisma.circuit.findUnique({
                where: { id: review.circuitId },
                select: { slug: true },
            })
            if (circuit) revalidatePath(`/circuits/${circuit.slug}`)
        }

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        console.error("Error creating review:", error)
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }
}
