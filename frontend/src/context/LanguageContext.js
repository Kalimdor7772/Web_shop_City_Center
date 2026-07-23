"use client";

import React, { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setLocale as updateLocale, supportedLocales } from "@/lib/i18n";

const LanguageContext = createContext({
    locale: "ru",
    setLocale: () => {},
    supportedLocales: ["kk", "ru", "en"],
});

const getPreferredLocale = () => {
    const stored = localStorage.getItem("locale");
    if (stored && supportedLocales.includes(stored)) {
        return stored;
    }

    const browserLocale = navigator.language.slice(0, 2).toLowerCase();
    return supportedLocales.includes(browserLocale) ? browserLocale : "ru";
};

export const LanguageProvider = ({ children }) => {
    const [locale, setLocaleState] = useState("ru");

    const setLocale = useCallback((nextLocale) => {
        const resolvedLocale =
            typeof nextLocale === "function" ? nextLocale(locale) : nextLocale;
        const safeLocale = supportedLocales.includes(resolvedLocale) ? resolvedLocale : "ru";

        if (safeLocale === locale) {
            return;
        }

        updateLocale(safeLocale);

        if (typeof window !== "undefined") {
            localStorage.setItem("locale", safeLocale);
        }

        setLocaleState(safeLocale);
    }, [locale]);

    useEffect(() => {
        const preferredLocale = getPreferredLocale();

        if (preferredLocale !== locale) {
            updateLocale(preferredLocale);
            setLocaleState(preferredLocale);
            return;
        }

        updateLocale(locale, { notify: false });

        localStorage.setItem("locale", locale);
    }, [locale]);

    const value = useMemo(
        () => ({ locale, setLocale, supportedLocales }),
        [locale, setLocale]
    );

    return (
        <LanguageContext.Provider value={value}>
            <Fragment key={locale}>{children}</Fragment>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
