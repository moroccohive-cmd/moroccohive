import type { Metadata } from "next"
import { BlogPostView, blogPostMetadata } from "@/components/views/blog-post-view"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    return blogPostMetadata(slug, "en")
}

export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params
    return <BlogPostView slug={slug} locale="en" />
}
