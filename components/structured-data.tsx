export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Morocco Hive",
    alternateName: "MoroccoHive",
    url: "https://www.moroccohive.com",
    logo: "https://www.moroccohive.com/logo_1.webp",
    image: "https://www.moroccohive.com/hero-bg.webp",
    description:
      "Morocco-based travel agency offering private, customizable tours led by local guides.",
    telephone: "+212634717423",
    email: "info@moroccohive.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
    areaServed: "MA",
    priceRange: "$$-$$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "200",
      bestRating: "5",
    },
    sameAs: ["https://www.trustpilot.com/review/moroccohive.com"],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQItem {
  q: string
  a: string
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
