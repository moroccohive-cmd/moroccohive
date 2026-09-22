"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/components/i18n/i18n-provider"
import { fmt } from "@/lib/i18n/format"

interface BlogPaginationProps {
    currentPage: number
    totalPages: number
}

export default function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
    const pathname = usePathname()
    const { pagination: t } = useI18n().common

    return (
        <nav className="mt-12 flex items-center justify-center gap-4" aria-label={t.nav}>
            {currentPage > 1 ? (
                <Link
                    href={`${pathname}?page=${currentPage - 1}`}
                    className="px-6 py-2 rounded-full border border-border hover:border-primary transition-colors font-medium"
                    aria-label={t.previousAria}
                >
                    {t.previous}
                </Link>
            ) : (
                <span
                    className="px-6 py-2 rounded-full border border-border opacity-50 cursor-not-allowed font-medium"
                    aria-disabled="true"
                >
                    {t.previous}
                </span>
            )}

            <span className="text-muted-foreground font-medium" aria-current="page">
                {fmt(t.pageOf, { current: currentPage, total: totalPages })}
            </span>

            {currentPage < totalPages ? (
                <Link
                    href={`${pathname}?page=${currentPage + 1}`}
                    className="px-6 py-2 rounded-full border border-border hover:border-primary transition-colors font-medium"
                    aria-label={t.nextAria}
                >
                    {t.next}
                </Link>
            ) : (
                <span
                    className="px-6 py-2 rounded-full border border-border opacity-50 cursor-not-allowed font-medium"
                    aria-disabled="true"
                >
                    {t.next}
                </span>
            )}
        </nav>
    )
}
