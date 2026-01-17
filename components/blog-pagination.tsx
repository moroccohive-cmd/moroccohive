"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface BlogPaginationProps {
    currentPage: number
    totalPages: number
}

export default function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
    const pathname = usePathname()

    return (
        <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Blog pagination">
            {currentPage > 1 ? (
                <Link
                    href={`${pathname}?page=${currentPage - 1}`}
                    className="px-6 py-2 rounded-full border border-border hover:border-primary transition-colors font-medium"
                    aria-label="Go to previous page"
                >
                    Previous
                </Link>
            ) : (
                <span
                    className="px-6 py-2 rounded-full border border-border opacity-50 cursor-not-allowed font-medium"
                    aria-disabled="true"
                >
                    Previous
                </span>
            )}

            <span className="text-muted-foreground font-medium" aria-current="page">
                Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
                <Link
                    href={`${pathname}?page=${currentPage + 1}`}
                    className="px-6 py-2 rounded-full border border-border hover:border-primary transition-colors font-medium"
                    aria-label="Go to next page"
                >
                    Next
                </Link>
            ) : (
                <span
                    className="px-6 py-2 rounded-full border border-border opacity-50 cursor-not-allowed font-medium"
                    aria-disabled="true"
                >
                    Next
                </span>
            )}
        </nav>
    )
}
