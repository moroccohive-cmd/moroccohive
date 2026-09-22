import type { Metadata } from "next"
import { BlogView, blogMetadata, parseBlogPage } from "@/components/views/blog-view"

type Props = { searchParams: Promise<{ page?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { page } = await searchParams
    return blogMetadata(parseBlogPage(page), "en")
}

export default async function BlogListingPage({ searchParams }: Props) {
    const { page } = await searchParams
    return <BlogView page={parseBlogPage(page)} locale="en" />
}
