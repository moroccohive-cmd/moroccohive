import type { Metadata } from "next"

/**
 * Single source of truth for every URL, identity and geographic signal the site
 * emits. Metadata, JSON-LD, the sitemap, robots.txt and llms.txt all read from
 * here so a change to the phone number or address propagates everywhere at once.
 */

export const SITE_URL = "https://www.moroccohive.com"

export const SITE = {
    name: "Morocco Hive",
    alternateName: "MoroccoHive",
    legalName: "Morocco Hive",
    url: SITE_URL,
    logo: `${SITE_URL}/logo_1.webp`,
    image: `${SITE_URL}/hero-bg.webp`,
    description:
        "Morocco-based travel agency offering private, customizable tours led by local guides. Sahara desert, Atlas Mountains, imperial cities - designed around you.",
    telephone: "+212634717423",
    whatsapp: "+212681134299",
    email: "info@moroccohive.com",
    foundingLocation: "Marrakech, Morocco",
    priceRange: "$$-$$$",
    currenciesAccepted: "USD, EUR, MAD",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, PayPal",
    languages: ["English", "French", "Arabic", "Spanish"],
    twitter: "@moroccohive",
} as const

/** Head office. Used by PostalAddress + the geo block on LocalBusiness. */
export const SITE_ADDRESS = {
    locality: "Marrakech",
    region: "Marrakech-Safi",
    country: "MA",
    countryName: "Morocco",
    latitude: 31.6295,
    longitude: -7.9811,
} as const

/**
 * Off-site profiles. `sameAs` is how search engines and answer engines reconcile
 * this site with the same real-world business elsewhere, so only verified
 * profiles belong here.
 */
export const SITE_SAME_AS = [
    "https://www.trustpilot.com/review/moroccohive.com",
    "https://www.tripadvisor.fr/Profile/moroccohive",
    "https://www.instagram.com/moroccohive/",
]

/** Aggregate rating shown in Organization schema. Keep in sync with Trustpilot. */
export const SITE_RATING = {
    ratingValue: "4.8",
    reviewCount: "200",
    bestRating: "5",
    worstRating: "1",
} as const

/**
 * The one phrasing of the rating claim used in on-page copy, metadata and
 * generated text, so the number never drifts between pages.
 */
export const SITE_RATING_LABEL = `${SITE_RATING.ratingValue}★ on Trustpilot`

/** Turns a path into an absolute URL; passes absolute URLs through untouched. */
export function absoluteUrl(path = "/"): string {
    if (/^https?:\/\//i.test(path)) return path
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Formats a price for machine-readable output.
 *
 * Bare `toLocaleString()` follows the server's locale, which on this host emits
 * a narrow no-break space as the thousands separator ("$4 100"). Pinning to
 * en-US keeps prerendered HTML and llms.txt stable across environments.
 */
export function formatPrice(value: number): string {
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

/**
 * Picks the better of a circuit's tagline and description for summary text.
 *
 * Several circuits have a tagline holding boilerplate site-wide meta copy
 * ("Best Morocco Private Tours & Circuits | MoroccoHive") rather than a real
 * strapline. Using it verbatim gave many tour pages an identical meta
 * description, which search engines treat as duplicate. Anything carrying a
 * pipe separator or the brand name is assumed to be that boilerplate.
 */
export function bestSummary(
    tagline: string | null | undefined,
    description: string | null | undefined,
): string {
    const t = tagline?.trim()
    const looksLikeBoilerplate =
        !t ||
        t.includes("|") ||
        /morocco\s*hive/i.test(t) ||
        t.length < 25
    return looksLikeBoilerplate ? (description ?? t ?? "") : t
}

/** Trims text to a clean, word-boundary-safe meta description. */
export function truncate(text: string, max = 155): string {
    const clean = text
        .replace(/<[^>]*>/g, " ")
        .replace(/[#*_>`~[\]()]/g, "")
        .replace(/\s+/g, " ")
        .trim()
    if (clean.length <= max) return clean
    return `${clean.slice(0, clean.lastIndexOf(" ", max - 1)).trim()}…`
}

interface BuildMetadataOptions {
    title: string
    description: string
    path: string
    images?: string[]
    type?: "website" | "article"
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    tags?: string[]
    noIndex?: boolean
}

/**
 * Builds a complete, canonical-correct Metadata object. Every public page should
 * go through this rather than hand-rolling `openGraph`/`twitter` blocks, which
 * is how canonicals and OG images drifted out of sync previously.
 */
export function buildMetadata({
    title,
    description,
    path,
    images,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    tags,
    noIndex = false,
}: BuildMetadataOptions): Metadata {
    const url = absoluteUrl(path)
    const ogImages = (images?.length ? images : [SITE.image]).map((src) => ({
        url: absoluteUrl(src),
        width: 1200,
        height: 630,
        alt: title,
    }))

    return {
        title,
        description,
        alternates: { canonical: url },
        ...(noIndex ? { robots: { index: false, follow: false } } : {}),
        openGraph: {
            title,
            description,
            url,
            siteName: SITE.name,
            type,
            locale: "en_US",
            images: ogImages,
            ...(type === "article"
                ? {
                      publishedTime,
                      modifiedTime,
                      authors,
                      tags,
                  }
                : {}),
        },
        twitter: {
            card: "summary_large_image",
            site: SITE.twitter,
            title,
            description,
            images: ogImages.map((img) => img.url),
        },
    }
}

/** Metadata for pages that must never be indexed (auth, dashboard, thank-you). */
export function noIndexMetadata(title: string, description?: string): Metadata {
    return {
        title,
        description,
        robots: { index: false, follow: false, nocache: true },
    }
}
