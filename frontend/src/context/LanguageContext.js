"use client";

import React, { createContext, Fragment, useContext, useEffect, useMemo, useState } from "react";
import { setLocale as updateLocale, supportedLocales } from "@/lib/i18n";

const LanguageContext = createContext({
    locale: "ru",
    setLocale: () => {},
    supportedLocales: ["kk", "ru", "en"],
});

const getInitialLocale = () => {
    if (typeof window === "undefined") return "ru";

    const stored = localStorage.getItem("locale");
    if (stored && supportedLocales.includes(stored)) {
        return stored;
    }

    const browserLocale = navigator.language.slice(0, 2).toLowerCase();
    return supportedLocales.includes(browserLocale) ? browserLocale : "ru";
};

export const LanguageProvider = ({ children }) => {
    const [locale, setLocaleState] = useState(getInitialLocale);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("locale", locale);
        }
        updateLocale(locale);
    }, [locale]);

    const value = useMemo(
        () => ({ locale, setLocale: setLocaleState, supportedLocales }),
        [locale]
    );

    return (
        <LanguageContext.Provider value={value}>
            <Fragment key={locale}>{children}</Fragment>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
