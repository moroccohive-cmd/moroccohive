import type { Metadata } from "next"
import { ContactView, contactMetadata } from "@/components/views/contact-view"
import { BreadcrumbSchema } from "@/components/structured-data"
import { getMessages } from "@/lib/i18n/messages"
import { resolveLocale, type LocaleParams } from "@/lib/i18n/route"

type Props = { params: LocaleParams }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return contactMetadata(await resolveLocale(params))
}

export default async function Page({ params }: Props) {
    const locale = await resolveLocale(params)
    return (
        <>
            <ContactView locale={locale} />
            <BreadcrumbSchema
                items={[{ name: getMessages(locale).breadcrumb.contact, path: "/contact" }]}
                locale={locale}
            />
        </>
    )
}
