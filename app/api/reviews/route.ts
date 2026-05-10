import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter"

export async function GET(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general")
    if (rateLimitError) return rateLimitError

    try {
        const { searchParams } = request.nextUrl
        const circuitId = searchParams.get("circuitId")

        if (!circuitId) {
            return NextResponse.json({ error: "circuitId is required" }, { status: 400 })
        }

        const reviews = await (prisma as any).review.findMany({
            where: { circuitId },
            orderBy: { createdAt: "desc" },
            take: 3,
        })

        return NextResponse.json(reviews)
    } catch (error) {
        console.error("Error fetching reviews:", error)
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }
}
