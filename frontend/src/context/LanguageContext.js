"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setLocale as updateLocale, supportedLocales } from "@/lib/i18n";

const LanguageContext = createContext({
    locale: "ru",
    setLocale: () => {},
    supportedLocales: ["kk", "ru", "en"],
});

export const LanguageProvider = ({ children }) => {
    const [locale, setLocaleState] = useState(() => {
        if (typeof window === "undefined") {
            return "ru";
        }

        const stored = localStorage.getItem("locale");
        const initialLocale = stored && supportedLocales.includes(stored)
            ? stored
            : (() => {
                const browserLocale = navigator.language.slice(0, 2).toLowerCase();
                return supportedLocales.includes(browserLocale) ? browserLocale : "ru";
            })();

        updateLocale(initialLocale);
        return initialLocale;
    });

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

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
