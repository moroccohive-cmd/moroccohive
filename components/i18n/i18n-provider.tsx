"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { DEFAULT_LOCALE, localizePath, type Locale } from "@/lib/i18n/config"
import { common as enCommon, type CommonMessages } from "@/lib/i18n/messages/common/en"

interface I18nValue {
    locale: Locale
    common: CommonMessages
    /** Prefixes a site path for the active locale. */
    lp: (path: string) => string
}

// English is the default so the original, unprefixed pages need no provider
// and keep working exactly as before.
const I18nContext = createContext<I18nValue>({
    locale: DEFAULT_LOCALE,
    common: enCommon,
    lp: (path) => path,
})

export function I18nProvider({
    locale,
    common,
    children,
}: {
    locale: Locale
    common: CommonMessages
    children: ReactNode
}) {
    const value = useMemo<I18nValue>(
        () => ({ locale, common, lp: (path: string) => localizePath(locale, path) }),
        [locale, common],
    )
    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
    return useContext(I18nContext)
}
