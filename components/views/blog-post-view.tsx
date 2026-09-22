import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar, User, ArrowLeft, Languages } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import { MobileBottomCTA } from "@/components/mobile-bottom-cta"
import { ArticleSchema, BreadcrumbSchema } from "@/components/structured-data"
import { buildMetadata, truncate } from "@/lib/seo"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"
import { formatDate } from "@/lib/i18n/format"
import { localizeRecord } from "@/lib/i18n/content"

async function getBlogPost(slug: string) {
    try {
        return await prisma.blogPost.findUnique({
            where: { slug, published: true },
        })
    } catch (error) {
        console.error("Error fetching blog post:", error)
        return null
    }
}

export async function blogPostMetadata(slug: string, locale: Locale): Promise<Metadata> {
    const record = await getBlogPost(slug)

    if (!record) {
        return {
            title: getMessages(locale).meta.blog.notFound,
        }
    }

    const { data: post, locales } = localizeRecord("blog", record, locale)

    const ogImage = post.coverImage
        ? post.coverImage.replace(/^https?:\/\/[^/]+/, "")
        : null

    return buildMetadata({
        title: post.title,
        description: truncate(post.excerpt || post.content, 155),
        path: `/blog/${post.slug}`,
        images: ogImage ? [ogImage] : undefined,
        type: "article",
        publishedTime: new Date(post.createdAt).toISOString(),
        modifiedTime: new Date(post.updatedAt).toISOString(),
        authors: [post.author || "Morocco Hive"],
        tags: post.tags,
        locale,
        // An untranslated post canonicalises to the English original.
        locales,
    })
}

function renderHTML(content: string): string {
    return content
        .replace(/\[CTA\]\s*title:\s*([\s\S]*?)\s*description:\s*([\s\S]*?)\s*button_text:\s*([\s\S]*?)\s*button_link:\s*([\s\S]*?)\s*\[\/CTA\]/g,
            (match, title, desc, btnText, btnLink) => {
                return `<div class='not-prose bg-muted/30 border border-border rounded-lg p-8 my-8'><h3 class='text-2xl font-bold mb-3 text-foreground'>${title.trim()}</h3><p class='text-muted-foreground mb-6 text-lg'>${desc.trim()}</p><a href='${btnLink.trim()}' class='inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-md transition-colors text-lg no-underline'>${btnText.trim()}</a></div>`
            }
        )
        .replace(/^### (.*?)$/gm, "<h3 class='text-2xl font-bold mt-8 mb-4'>$1</h3>")
        .replace(/^## (.*?)$/gm, "<h2 class='text-3xl font-bold mt-10 mb-6'>$1</h2>")
        .replace(/^# (.*?)$/gm, "<h1 class='text-4xl font-bold mt-12 mb-8'>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold'>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
        .replace(/__(.*?)__/g, "<u class='underline'>$1</u>")
        .replace(/~~(.*?)~~/g, "<s class='line-through'>$1</s>")
        .replace(/`(.*?)`/g, "<code class='bg-muted px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>")
        .replace(/!\[(.*?)\]\((.*?)\)/g,
            "<img src='$2' alt='$1' class='rounded-lg my-2 max-w-full' />"
        )
        .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-primary underline hover:text-primary/80' target='_blank' rel='noopener noreferrer'>$1</a>")
        .replace(/^> (.*?)$/gm, "<blockquote class='border-l-4 border-primary pl-6 italic text-xl text-muted-foreground my-8'>$1</blockquote>")
        .replace(/\n- /g, "<br />• ")
        .replace(/\n\d+\. /g, "<br />1. ")
}

export async function BlogPostView({ slug, locale }: { slug: string; locale: Locale }) {
    const record = await getBlogPost(slug)

    if (!record) {
        notFound()
    }

    const messages = getMessages(locale)
    const t = messages.blog
    const { data: post, translated } = localizeRecord("blog", record, locale)

    return (
        <main className="min-h-screen bg-background">
            <Header locale={locale} />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {post.coverImage ? (
                        <Image
                            src={post.coverImage}
                            alt={t.coverAlt.replace("{title}", post.title)}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                            fetchPriority="high"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <Link href={localizePath(locale, "/blog")} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-medium" aria-label={t.backAria}>
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        {t.back}
                    </Link>

                    <div className="max-w-4xl">
                        {post.tags?.[0] && (
                            <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider mb-4 inline-block">
                                {post.tags[0]}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-white/80">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" aria-hidden="true" />
                                <time dateTime={new Date(post.createdAt).toISOString()}>
                                    {formatDate(post.createdAt, locale, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </time>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" aria-hidden="true" />
                                <span>{post.author || t.adminAuthor}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <article className="py-20 container mx-auto px-6" lang={translated ? undefined : "en"}>
                <div className="max-w-3xl mx-auto">
                    {!translated && t.englishOnly && (
                        <p lang={locale} className="mb-10 flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                            <Languages className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
                            {t.englishOnly}
                        </p>
                    )}

                    {/* Main Content */}
                    <div
                        className="prose prose-lg max-w-none text-foreground/90 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderHTML(post.content) }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-16 flex flex-wrap gap-2 pt-8 border-t border-border">
                            {post.tags.map((tag: string, idx: number) => (
                                <span key={idx} className="px-4 py-1.5 bg-muted rounded-full text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>

            <MobileBottomCTA
                title={t.mobileTitle}
                description={t.mobileDescription}
                buttonText={t.mobileButton}
                href={localizePath(locale, "/plan-trip")}
            />

            <BreadcrumbSchema
                locale={locale}
                items={[
                    { name: messages.breadcrumb.blog, path: "/blog" },
                    { name: post.title, path: `/blog/${post.slug}` },
                ]}
            />
            <ArticleSchema
                locale={translated ? locale : "en"}
                title={post.title}
                slug={post.slug}
                description={truncate(post.excerpt || post.content, 200)}
                image={post.coverImage}
                author={post.author}
                publishedAt={new Date(post.createdAt).toISOString()}
                modifiedAt={new Date(post.updatedAt).toISOString()}
                tags={post.tags}
                wordCount={post.content.split(/\s+/).filter(Boolean).length}
            />

            <Footer locale={locale} />
        </main>
    )
}
