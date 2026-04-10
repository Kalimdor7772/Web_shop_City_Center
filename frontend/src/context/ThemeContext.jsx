"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({
    theme: "system",
    resolvedTheme: "light",
    mounted: false,
    setTheme: () => {},
});

const STORAGE_KEY = "theme-preference";

function resolveTheme(theme) {
    if (theme !== "system") {
        return theme;
    }

    if (typeof window === "undefined") {
        return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("system");
    const [resolvedTheme, setResolvedTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const savedTheme = localStorage.getItem(STORAGE_KEY) || "system";
        setTheme(savedTheme);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = (nextTheme) => {
            const resolved = resolveTheme(nextTheme);
            const root = document.documentElement;
            root.dataset.theme = resolved;
            root.style.colorScheme = resolved;
            setResolvedTheme(resolved);
        };

        applyTheme(theme);
        if (mounted) {
            localStorage.setItem(STORAGE_KEY, theme);
        }

        const handleChange = () => {
            if (theme === "system") {
                applyTheme("system");
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [mounted, theme]);

    const value = useMemo(
        () => ({
            theme,
            resolvedTheme,
            mounted,
            setTheme,
        }),
        [mounted, theme, resolvedTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}
