import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter";

/**
 * Unread counters for the dashboard sidebar badges. Contact messages are
 * created with status "new", but the schema default is "unread" - count both so
 * rows written either way still show up.
 */
export async function GET() {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || (session.user as { role?: string }).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [tripRequests, messages] = await Promise.all([
            prisma.tripRequest.count({ where: { status: "new" } }),
            prisma.contactMessage.count({ where: { status: { in: ["new", "unread"] } } }),
        ]);

        return NextResponse.json({ tripRequests, messages })
    } catch (error) {
        console.error("Error fetching notification counts:", error)
        return NextResponse.json(
            { error: "Failed to fetch notification counts" },
            { status: 500 }
        )
    }
}
