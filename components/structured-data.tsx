import {
  SITE,
  SITE_ADDRESS,
  SITE_RATING,
  SITE_SAME_AS,
  SITE_URL,
  absoluteUrl,
  truncate,
} from "@/lib/seo"
import type { Destination } from "@/lib/destinations"

/**
 * JSON-LD emitters.
 *
 * Everything is keyed to stable @id values (`${SITE_URL}#organization`, etc.) so
 * separate blocks on the same page resolve to one connected graph rather than a
 * pile of unrelated entities. Search engines and answer engines both rely on
 * that linkage to work out who publishes what.
 */

const ORG_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped below to prevent a "</script>" inside
      // any DB-sourced string from breaking out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

/** Reference to the publishing organisation, for embedding in other schemas. */
const orgRef = { "@id": ORG_ID }

/**
 * Primary business entity. Emitted once, in the root layout.
 *
 * TravelAgency inherits from LocalBusiness, so this single node carries the
 * local-SEO signals (geo, address, opening hours, service area) and the
 * publisher identity that Article/Product schemas point back to.
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TravelAgency", "LocalBusiness"],
        "@id": ORG_ID,
        name: SITE.name,
        alternateName: SITE.alternateName,
        legalName: SITE.legalName,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: SITE.logo,
          contentUrl: SITE.logo,
          caption: SITE.name,
        },
        image: SITE.image,
        description: SITE.description,
        telephone: SITE.telephone,
        email: SITE.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE_ADDRESS.locality,
          addressRegion: SITE_ADDRESS.region,
          addressCountry: SITE_ADDRESS.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE_ADDRESS.latitude,
          longitude: SITE_ADDRESS.longitude,
        },
        // Where the business actually operates, as resolvable place entities
        // rather than a bare "MA" string.
        areaServed: [
          {
            "@type": "Country",
            name: "Morocco",
            sameAs: "https://en.wikipedia.org/wiki/Morocco",
          },
          ...[
            ["Marrakech", "https://en.wikipedia.org/wiki/Marrakesh"],
            ["Fes", "https://en.wikipedia.org/wiki/Fez,_Morocco"],
            ["Casablanca", "https://en.wikipedia.org/wiki/Casablanca"],
            ["Rabat", "https://en.wikipedia.org/wiki/Rabat"],
            ["Chefchaouen", "https://en.wikipedia.org/wiki/Chefchaouen"],
            ["Merzouga", "https://en.wikipedia.org/wiki/Merzouga"],
            ["Essaouira", "https://en.wikipedia.org/wiki/Essaouira"],
            ["Tangier", "https://en.wikipedia.org/wiki/Tangier"],
            ["Ouarzazate", "https://en.wikipedia.org/wiki/Ouarzazate"],
            ["Meknes", "https://en.wikipedia.org/wiki/Meknes"],
          ].map(([name, sameAs]) => ({ "@type": "City", name, sameAs })),
          {
            "@type": "Place",
            name: "Sahara Desert",
            sameAs: "https://en.wikipedia.org/wiki/Sahara",
          },
          {
            "@type": "Place",
            name: "Atlas Mountains",
            sameAs: "https://en.wikipedia.org/wiki/Atlas_Mountains",
          },
        ],
        knowsLanguage: SITE.languages,
        priceRange: SITE.priceRange,
        currenciesAccepted: SITE.currenciesAccepted,
        paymentAccepted: SITE.paymentAccepted,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "08:00",
            closes: "20:00",
          },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: SITE.telephone,
            email: SITE.email,
            contactType: "customer service",
            areaServed: "Worldwide",
            availableLanguage: SITE.languages,
          },
          {
            "@type": "ContactPoint",
            telephone: SITE.whatsapp,
            contactType: "reservations",
            contactOption: "TollFree",
            areaServed: "Worldwide",
            availableLanguage: SITE.languages,
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: SITE_RATING.ratingValue,
          reviewCount: SITE_RATING.reviewCount,
          bestRating: SITE_RATING.bestRating,
          worstRating: SITE_RATING.worstRating,
        },
        sameAs: SITE_SAME_AS,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE.name,
        description: SITE.description,
        publisher: orgRef,
        inLanguage: "en",
      },
    ],
  }

  return <JsonLd data={schema} />
}

interface FAQItem {
  q: string
  a: string
}

/**
 * FAQPage. `speakable` marks the answers as safe to read aloud, which is also
 * the strongest hint available that these blocks are quotable answers.
 */
export function FAQSchema({ items }: { items: FAQItem[] }) {
  if (!items.length) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    isPartOf: { "@id": WEBSITE_ID },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".faq-answer"],
    },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  return <JsonLd data={schema} />
}

export interface Crumb {
  name: string
  /** Site-relative path. Omit on the final crumb. */
  path?: string
}

/** Breadcrumb trail. Drives the path display under a Google result. */
export function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map(
      (crumb, index, all) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        // The last crumb is the current page and takes no `item` URL.
        ...(index === all.length - 1 || !crumb.path
          ? {}
          : { item: absoluteUrl(crumb.path) }),
      }),
    ),
  }

  return <JsonLd data={schema} />
}

export interface TourSchemaProps {
  name: string
  slug: string
  description: string
  images: string[]
  price: number
  /** Days. Converted to an ISO 8601 duration. */
  duration: number
  category: string
  itinerary?: string[]
  highlights?: string[]
  aggregateRating?: { ratingValue: number; reviewCount: number } | null
  reviews?: {
    authorName: string
    rating: number
    text: string
    createdAt: string
  }[]
}

/**
 * TouristTrip for a circuit page, with an Offer so price and availability can
 * surface directly in results and AI answers.
 */
export function TourSchema({
  name,
  slug,
  description,
  images,
  price,
  duration,
  category,
  itinerary = [],
  highlights = [],
  aggregateRating,
  reviews = [],
}: TourSchemaProps) {
  const url = absoluteUrl(`/circuits/${slug}`)

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name,
    description: truncate(description, 500),
    url,
    image: images.map((img) => absoluteUrl(img)),
    touristType: category,
    // P7D for a 7-day trip.
    itinerary: itinerary.length
      ? {
          "@type": "ItemList",
          numberOfItems: itinerary.length,
          itemListElement: itinerary.map((day, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "TouristAttraction",
              name: day,
            },
          })),
        }
      : undefined,
    subjectOf: highlights.length
      ? { "@type": "CreativeWork", abstract: highlights.join(" · ") }
      : undefined,
    provider: orgRef,
    offers: {
      "@type": "Offer",
      "@id": `${url}#offer`,
      url,
      price: price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      // Offers need a horizon; a rolling year avoids a stale hard-coded date.
      priceValidUntil: new Date(Date.now() + 365 * 864e5)
        .toISOString()
        .slice(0, 10),
      seller: orgRef,
      availableAtOrFrom: {
        "@type": "Place",
        name: "Morocco",
        address: {
          "@type": "PostalAddress",
          addressCountry: "MA",
        },
      },
    },
    ...(aggregateRating && aggregateRating.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggregateRating.ratingValue.toFixed(1),
            reviewCount: aggregateRating.reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    ...(reviews.length
      ? {
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.authorName },
            datePublished: r.createdAt.slice(0, 10),
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: "5",
              worstRating: "1",
            },
            reviewBody: truncate(r.text, 400),
          })),
        }
      : {}),
    // Duration expressed on the trip itself for engines that read it.
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Duration",
      value: `${duration} days`,
    },
  }

  return <JsonLd data={schema} />
}

export interface ArticleSchemaProps {
  title: string
  slug: string
  description: string
  image?: string | null
  author?: string | null
  publishedAt: string
  modifiedAt: string
  tags?: string[]
  wordCount?: number
}

/** BlogPosting for an article page, attributed back to the organisation. */
export function ArticleSchema({
  title,
  slug,
  description,
  image,
  author,
  publishedAt,
  modifiedAt,
  tags = [],
  wordCount,
}: ArticleSchemaProps) {
  const url = absoluteUrl(`/blog/${slug}`)

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: truncate(title, 110),
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: image ? [absoluteUrl(image)] : [SITE.image],
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: author
      ? { "@type": "Person", name: author }
      : { "@type": "Organization", name: SITE.name, url: SITE_URL },
    publisher: orgRef,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en",
    ...(tags.length ? { keywords: tags.join(", ") } : {}),
    ...(wordCount ? { wordCount } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-summary"],
    },
  }

  return <JsonLd data={schema} />
}

export interface ListItemInput {
  name: string
  path: string
  description?: string
  image?: string | null
  price?: number
}

/**
 * ItemList for listing pages. Gives crawlers and answer engines the full set of
 * offerings in one parse rather than requiring them to follow every link.
 */
export function ItemListSchema({
  name,
  description,
  path,
  items,
}: {
  name: string
  description: string
  path: string
  items: ListItemInput[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(path)}#collection`,
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": WEBSITE_ID },
    about: orgRef,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(item.path),
        name: item.name,
        ...(item.description
          ? { description: truncate(item.description, 200) }
          : {}),
        ...(item.image ? { image: absoluteUrl(item.image) } : {}),
      })),
    },
  }

  return <JsonLd data={schema} />
}

/**
 * TouristDestination for a destination page. The `geo` block plus a `sameAs`
 * link to the encyclopedia entry is what lets an engine confirm this page is
 * about the real place rather than a similarly named one.
 */
export function DestinationSchema({
  destination,
  circuitCount,
}: {
  destination: Destination
  circuitCount: number
}) {
  const url = absoluteUrl(`/destinations/${destination.slug}`)

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${url}#destination`,
    name: destination.name,
    description: destination.summary,
    url,
    image: absoluteUrl(destination.image),
    sameAs: destination.sameAs,
    geo: {
      "@type": "GeoCoordinates",
      latitude: destination.latitude,
      longitude: destination.longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: destination.name,
      addressRegion: destination.region,
      addressCountry: "MA",
    },
    containedInPlace: {
      "@type": "Country",
      name: "Morocco",
      sameAs: "https://en.wikipedia.org/wiki/Morocco",
    },
    touristType: ["Cultural tourism", "Adventure travel", "Private tours"],
    includesAttraction: destination.highlights.map((h) => ({
      "@type": "TouristAttraction",
      name: h,
    })),
    isPartOf: { "@id": WEBSITE_ID },
    ...(circuitCount > 0
      ? {
          availableAtOrFrom: orgRef,
          potentialAction: {
            "@type": "ViewAction",
            name: `Browse ${circuitCount} tours featuring ${destination.name}`,
            target: url,
          },
        }
      : {}),
  }

  return <JsonLd data={schema} />
}

/**
 * Standalone review collection for the reviews page. Reviews are attached to the
 * organisation, which is where an aggregate rating legitimately belongs when the
 * page is not about one specific product.
 */
export function ReviewCollectionSchema({
  reviews,
}: {
  reviews: {
    authorName: string
    authorLocation?: string | null
    rating: number
    text: string
    createdAt: Date | string
    displayDate?: string | null
  }[]
}) {
  if (!reviews.length) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE_URL,
    // No aggregateRating here on purpose. This node shares ORG_ID with the
    // Organization node emitted in the root layout, so engines merge the two
    // into one entity - repeating the rating gave that entity two of them and
    // Search Console rejected every nested Review with "Review has multiple
    // aggregate ratings". The layout node is the single source of the site-wide
    // figure; this block only contributes the individual reviews.
    review: reviews.slice(0, 25).map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.authorName,
        ...(r.authorLocation ? { address: r.authorLocation } : {}),
      },
      datePublished: new Date(r.createdAt).toISOString().slice(0, 10),
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: truncate(r.text, 400),
      itemReviewed: { "@id": ORG_ID },
    })),
  }

  return <JsonLd data={schema} />
}

/** Generic WebPage node with speakable hints, for informational pages. */
export function WebPageSchema({
  name,
  description,
  path,
  speakableSelectors = [".page-summary"],
}: {
  name: string
  description: string
  path: string
  speakableSelectors?: string[]
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": WEBSITE_ID },
    about: orgRef,
    inLanguage: "en",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: speakableSelectors,
    },
  }

  return <JsonLd data={schema} />
}
