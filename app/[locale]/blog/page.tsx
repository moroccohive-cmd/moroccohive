import type { Metadata } from "next"
import { BlogView, blogMetadata, parseBlogPage } from "@/components/views/blog-view"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams; searchParams: Promise<{ page?: string }> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { page } = await searchParams
    return blogMetadata(parseBlogPage(page), await resolveLocale(params))
}

export default async function Page({ params, searchParams }: Props) {
    const { page } = await searchParams
    return <BlogView page={parseBlogPage(page)} locale={await resolveLocale(params)} />
}
