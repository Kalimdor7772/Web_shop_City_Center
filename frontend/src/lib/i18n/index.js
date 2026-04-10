import { en } from "./en";
import { kk } from "./kk";
import { ru } from "./ru";

const locales = { en, kk, ru };
let currentLocale = "ru";

export const supportedLocales = ["kk", "ru", "en"];
export const localeNames = { kk: "Қаз", ru: "Рус", en: "Eng" };

export const setLocale = (locale) => {
    if (supportedLocales.includes(locale)) {
        currentLocale = locale;
    }
};

export const getLocale = () => currentLocale;

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
