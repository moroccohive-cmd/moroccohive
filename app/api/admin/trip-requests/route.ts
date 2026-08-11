import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter";

export async function GET(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || (session.user as { role?: string }).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status");

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [tripRequests, total, newCount] = await Promise.all([
            prisma.tripRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            }),
            prisma.tripRequest.count({ where }),
            // Unfiltered, so the header badge stays right on every tab.
            prisma.tripRequest.count({ where: { status: "new" } })
        ]);

        return NextResponse.json({
            tripRequests,
            newCount,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        })
    } catch (error) {
        console.error("Error fetching trip requests:", error)
        return NextResponse.json({ error: "Failed to fetch trip requests" }, { status: 500 })
    }
}
