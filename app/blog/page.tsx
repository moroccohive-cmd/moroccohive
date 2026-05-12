import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import BlogPagination from "@/components/blog-pagination"

export const metadata: Metadata = {
    title: "Morocco Travel Blog | Tips & Guides by Local Experts | MoroccoHive",
    description: "Insider travel guides, tips, and cultural insights from Morocco - written by locals who live here. Plan smarter before you arrive.",
}

interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string | null
    coverImage: string | null
    author: string | null
    tags: string[]
    createdAt: Date
}

async function getBlogs(page: number = 1, limit: number = 9) {
    try {
        const skip = (page - 1) * limit

        const [blogs, total] = await Promise.all([
            prisma.blogPost.findMany({
                where: { published: true },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    excerpt: true,
                    coverImage: true,
                    author: true,
                    tags: true,
                    createdAt: true,
                }
            }),
            prisma.blogPost.count({ where: { published: true } })
        ])

        return {
            blogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        }
    } catch (error) {
        console.error("Error fetching blogs:", error)
        return { blogs: [], pagination: { total: 0, page: 1, limit: 9, totalPages: 0 } }
    }
}

export default async function BlogListingPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams
    const page = parseInt(params.page || "1")
    const { blogs, pagination } = await getBlogs(page)

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Header */}
            <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src="/hero-bg.webp"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                        fetchPriority="high"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Morocco Hive Blog</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        Insider travel guides, tips, and cultural insights from Morocco - written by locals who live here. Plan smarter before you arrive.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 container mx-auto px-6">
                {blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" aria-hidden="true" />
                        <h2 className="text-2xl font-semibold">No posts yet</h2>
                        <p className="text-muted-foreground mt-2">Check back soon for more stories!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((post: BlogPost) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                                    aria-label={`Read article: ${post.title}`}
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={`Cover image for ${post.title}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <FileText className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
                                            </div>
                                        )}
                                        {post.tags?.[0] && (
                                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                                                {post.tags[0]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" aria-hidden="true" />
                                                <time dateTime={new Date(post.createdAt).toISOString()}>
                                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </time>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" aria-hidden="true" />
                                                <span>{post.author || "Morocco Hive"}</span>
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                            {post.excerpt || "Discover more about this journey through Morocco..."}
                                        </p>

                                        <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider">
                                            <span className="sr-only">Read article: {post.title}</span>
                                            <span aria-hidden="true">Read More</span>
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <BlogPagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                            />
                        )}
                    </>
                )}
            </section>

            <Footer />
        </main>
    )
}
