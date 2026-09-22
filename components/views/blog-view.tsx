import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import BlogPagination from "@/components/blog-pagination"
import { BreadcrumbSchema, ItemListSchema } from "@/components/structured-data"
import { buildMetadata } from "@/lib/seo"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { fmt, formatDate } from "@/lib/i18n/format"
import { localizeRecord } from "@/lib/i18n/content"

export function parseBlogPage(page: string | undefined): number {
    return Math.max(1, parseInt(page || "1", 10) || 1)
}

/**
 * Paginated, so the canonical has to carry ?page=N. Pointing every page at
 * /blog would tell Google pages 2+ are duplicates and drop those posts from
 * the index.
 */
export function blogMetadata(pageNum: number, locale: Locale): Metadata {
    const t = getMessages(locale).meta.blog
    return buildMetadata({
        title: pageNum > 1 ? fmt(t.titlePaged, { page: pageNum }) : t.title,
        description: t.description,
        path: pageNum > 1 ? `/blog?page=${pageNum}` : "/blog",
        locale,
    })
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
                    translations: true,
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

export async function BlogView({ page, locale }: { page: number; locale: Locale }) {
    const messages = getMessages(locale)
    const t = messages.blog
    const lp = (path: string) => localizePath(locale, path)
    const { blogs: rawBlogs, pagination } = await getBlogs(page)
    const blogs = rawBlogs.map((post) => localizeRecord("blog", post, locale).data)

    return (
        <main className="min-h-screen bg-background">
            <Header locale={locale} />

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
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.title}</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        {t.intro}
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 container mx-auto px-6">
                {blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" aria-hidden="true" />
                        <h2 className="text-2xl font-semibold">{t.emptyTitle}</h2>
                        <p className="text-muted-foreground mt-2">{t.emptyBody}</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((post) => (
                                <Link
                                    key={post.id}
                                    href={lp(`/blog/${post.slug}`)}
                                    className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                                    aria-label={fmt(t.readAria, { title: post.title })}
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={fmt(t.coverAlt, { title: post.title })}
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
                                                    {formatDate(post.createdAt, locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </time>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" aria-hidden="true" />
                                                <span>{post.author || t.defaultAuthor}</span>
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                            {post.excerpt || t.defaultExcerpt}
                                        </p>

                                        <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider">
                                            <span className="sr-only">{fmt(t.readAria, { title: post.title })}</span>
                                            <span aria-hidden="true">{t.readMore}</span>
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

            <BreadcrumbSchema items={[{ name: messages.breadcrumb.blog, path: "/blog" }]} locale={locale} />
            <ItemListSchema
                name={t.schemaName}
                description={t.schemaDescription}
                path={page > 1 ? `/blog?page=${page}` : "/blog"}
                locale={locale}
                items={blogs.map((post) => ({
                    name: post.title,
                    path: `/blog/${post.slug}`,
                    description: post.excerpt ?? undefined,
                    image: post.coverImage,
                }))}
            />

            <Footer locale={locale} />
        </main>
    )
}
