import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CircuitsList } from "@/components/circuits-list"
import prisma from "@/lib/prisma"
import { BreadcrumbSchema, ItemListSchema } from "@/components/structured-data"
import { bestSummary, buildMetadata } from "@/lib/seo"
import type { Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { localizeRecord } from "@/lib/i18n/content"

export function circuitsMetadata(locale: Locale): Metadata {
    const t = getMessages(locale).meta.circuits
    return buildMetadata({ title: t.title, description: t.description, path: "/circuits", locale })
}

async function getCircuits() {
    try {
        return await prisma.circuit.findMany({
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
                translations: true,
            },
        })
    } catch (error) {
        console.error("Error fetching circuits:", error)
        return []
    }
}

export async function CircuitsView({ locale }: { locale: Locale }) {
    const t = getMessages(locale)
    // The translations blob is only needed server-side; keep it out of the
    // props serialised for the client-side filter list.
    const circuits = (await getCircuits()).map((c) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { translations, ...rest } = localizeRecord("circuit", c, locale).data
        return rest
    })

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
            <Header locale={locale} />

            <main className="flex-1">
                {/* Soft Hero */}
                <section className="bg-white pt-32 pb-16 px-4 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto text-center space-y-4">
                        <span className="text-orange-500 font-medium text-sm tracking-widest uppercase">{t.circuits.eyebrow}</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{t.circuits.title}</h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
                            {t.circuits.subtitle}
                        </p>
                    </div>
                </section>

                {/* Circuits Grid */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CircuitsList
                        circuits={circuits}
                        messages={{ list: t.circuitsList, categories: t.categories }}
                    />
                </section>
            </main>

            <BreadcrumbSchema items={[{ name: t.breadcrumb.tours, path: "/circuits" }]} locale={locale} />
            <ItemListSchema
                name={t.circuits.schemaName}
                description={t.circuits.schemaDescription}
                path="/circuits"
                locale={locale}
                items={circuits.map((c) => ({
                    name: c.name,
                    path: `/circuits/${c.slug}`,
                    description: bestSummary(c.tagline, c.description),
                    image: c.images?.[0],
                    price: c.price,
                }))}
            />

            <Footer locale={locale} />
        </div>
    )
}
