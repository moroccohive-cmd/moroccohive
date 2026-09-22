import { DESTINATIONS, getDestination, type Destination } from "@/lib/destinations"
import type { Locale } from "../config"
import type { DestinationTranslations } from "./types"
import { fr } from "./fr"
import { nl } from "./nl"

const TRANSLATIONS: Partial<Record<Locale, DestinationTranslations>> = { fr, nl }

/**
 * A destination guide in the requested language. Coordinates, sameAs links,
 * keywords and images always come from the English source in
 * lib/destinations.ts, so only the prose is duplicated per language.
 */
export function localizeDestination(destination: Destination, locale: Locale): Destination {
    const translation = TRANSLATIONS[locale]?.[destination.slug]
    return translation ? { ...destination, ...translation } : destination
}

export function getLocalizedDestination(slug: string, locale: Locale): Destination | undefined {
    const destination = getDestination(slug)
    return destination && localizeDestination(destination, locale)
}

export function getLocalizedDestinations(locale: Locale): Destination[] {
    return DESTINATIONS.map((d) => localizeDestination(d, locale))
}
