import type { Destination } from "@/lib/destinations"

/** The prose fields of a destination guide that are translated per language. */
export type DestinationTranslation = Pick<
    Destination,
    | "name"
    | "headline"
    | "metaDescription"
    | "summary"
    | "body"
    | "highlights"
    | "bestTimeToVisit"
    | "suggestedStay"
    | "faqs"
>

export type DestinationTranslations = Record<string, DestinationTranslation>
