import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CircuitsList } from "@/components/circuits-list"
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
    title: "Private Morocco Tour Itineraries | 5–13 Days | MoroccoHive",
    description: "Browse private Morocco tour itineraries - from Sahara desert camps to imperial cities. 5 to 13 days. Fully customizable. From $1,400/person.",
}

// Disable caching to ensure fresh data (updated slugs, etc.) is always served
export const dynamic = "force-dynamic"
export const revalidate = 0

interface Circuit {
    id: string
    slug: string
    name: string
    tagline: string | null
    description: string
    duration: number
    price: number
    originalPrice: number | null
    isFrom: boolean | null
    images: string[]
    highlights: string[]
    category: string
}

async function getCircuits(): Promise<Circuit[]> {
    try {
        const circuits = await prisma.circuit.findMany({
            where: { active: true },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                slug: true,
                name: true,
                tagline: true,
                description: true,
                duration: true,
                price: true,
                originalPrice: true,
                isFrom: true,
                images: true,
                highlights: true,
                category: true,
            }
        })
        return circuits
    } catch (error) {
        console.error("Error fetching circuits:", error)
        return []
    }
}

export default async function CircuitsPage() {
    const circuits = await getCircuits()

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
            <Header />

            <main className="flex-1">
                {/* Soft Hero */}
                <section className="bg-white pt-32 pb-16 px-4 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto text-center space-y-4">
                        <span className="text-orange-500 font-medium text-sm tracking-widest uppercase">Explore Morocco</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Browse Private Morocco Tour Itineraries</h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
                            From Sahara desert camps to imperial cities. 5 to 13 days. Fully customizable. From $1,400/person.
                        </p>
                    </div>
                </section>

                {/* Circuits Grid */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CircuitsList circuits={circuits} />
                </section>
            </main>

            <Footer />
        </div>
    )
}
