import { BreadcrumbSchema } from "@/components/structured-data"
import { contactMetadata } from "@/components/views/contact-view"

export const metadata = contactMetadata("en")

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <BreadcrumbSchema items={[{ name: "Contact", path: "/contact" }]} />
        </>
    )
}
