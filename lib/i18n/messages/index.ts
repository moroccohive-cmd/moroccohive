import type { Locale } from "../config"
import { en, type Messages } from "./en"
import { fr } from "./fr"
import { nl } from "./nl"
import { labelFor } from "../format"

export type { Messages }

const MESSAGES: Record<Locale, Messages> = { en, fr, nl }

/**
 * Full message set for a locale. Server components only — importing this from
 * a client component would ship every language to the browser. Client
 * components get `common` from I18nProvider, or their section via props.
 */
export function getMessages(locale: Locale): Messages {
    return MESSAGES[locale]
}

/** Display name for a circuit category stored in English. */
export function categoryLabel(messages: Messages, category: string): string {
    return labelFor(messages.categories, category)
}
