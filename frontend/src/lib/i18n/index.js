import { useSyncExternalStore } from "react";
import { en } from "./en";
import { kk } from "./kk";
import { ru } from "./ru";

const locales = { en, kk, ru };
let currentLocale = "ru";
const listeners = new Set();

export const supportedLocales = ["kk", "ru", "en"];
export const localeNames = { kk: "Қаз", ru: "Рус", en: "Eng" };

export const setLocale = (locale) => {
    if (supportedLocales.includes(locale)) {
        currentLocale = locale;
        listeners.forEach((callback) => callback());
    }
};

export const getLocale = () => currentLocale;

export const subscribe = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

export const useTranslation = () => {
    useSyncExternalStore(subscribe, getLocale);
    return t;
};

export const t = new Proxy(
    {},
    {
        get: (_, property) => {
            const translation = locales[currentLocale]?.[property];
            if (translation !== undefined) {
                return translation;
            }
            return locales.ru[property];
        }
    }
);
