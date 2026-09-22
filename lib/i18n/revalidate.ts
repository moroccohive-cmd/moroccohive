import { revalidatePath } from "next/cache"
import { LOCALES, localizePath } from "./config"

/**
 * revalidatePath for every language version of a page: revalidating "/faq"
 * also refreshes "/fr/faq" and "/nl/faq", so an admin edit never leaves a
 * translated page serving stale content.
 */
export function revalidateLocalizedPath(path: string, type?: "layout" | "page") {
    for (const locale of LOCALES) revalidatePath(localizePath(locale, path), type)
}
