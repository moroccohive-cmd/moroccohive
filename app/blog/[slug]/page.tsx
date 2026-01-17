import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"

interface BlogPost {
    id: string
    slug: string
    title: string
    content: string
    excerpt: string | null
    coverImage: string | null
    author: string | null
    tags: string[]
    published: boolean
    createdAt: Date
    updatedAt: Date
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug, published: true },
        })
        return post
    } catch (error) {
        console.error("Error fetching blog post:", error)
        return null
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const post = await getBlogPost(slug)

    if (!post) {
        return {
            title: "Post Not Found | Morocco Hive",
        }
    }

    return {
        title: `${post.title} | Morocco Hive Blog`,
        description: post.excerpt || post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            images: post.coverImage ? [post.coverImage] : [],
        },
    }
}

function renderHTML(content: string): string {
    return content
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

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = await getBlogPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {post.coverImage ? (
                        <Image
                            src={post.coverImage}
                            alt={post.title}
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
                    <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-medium">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
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
                                <Calendar className="h-4 w-4" />
                                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {post.author || "Morocco Hive Admin"}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <article className="py-20 container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
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

            <Footer />
        </main>
    )
}
