import type { Metadata } from "next"
import { BlogPostView, blogPostMetadata } from "@/components/views/blog-post-view"
import { resolveLocale } from "@/lib/i18n/route"

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    return blogPostMetadata(slug, await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    const { slug } = await params
    return <BlogPostView slug={slug} locale={await resolveLocale(params)} />
}
