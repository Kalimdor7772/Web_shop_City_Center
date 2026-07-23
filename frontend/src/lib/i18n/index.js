import { useSyncExternalStore } from "react";
import { en } from "./en";
import { kk } from "./kk";
import { ru } from "./ru";

const locales = { en, kk, ru };
let currentLocale = "ru";
const listeners = new Set();

const isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeTranslationString = (value) => {
    if (typeof value !== "string") return value;
    return value.replaceAll("в‚ё", "₸");
};

const createTranslationProxy = (localeNode, fallbackNode) =>
    new Proxy(
        {},
        {
            get: (_, property) => {
                const localizedValue = localeNode?.[property];
                const fallbackValue = fallbackNode?.[property];
                const resolvedValue = localizedValue ?? fallbackValue;

                if (isPlainObject(resolvedValue)) {
                    return createTranslationProxy(
                        isPlainObject(localizedValue) ? localizedValue : undefined,
                        isPlainObject(fallbackValue) ? fallbackValue : undefined
                    );
                }

                if (resolvedValue === undefined) {
                    return undefined;
                }

                return normalizeTranslationString(resolvedValue);
            }
        }
    );

export const supportedLocales = ["kk", "ru", "en"];
export const localeNames = { kk: "Қаз", ru: "Рус", en: "Eng" };

export const setLocale = (locale, options = {}) => {
    const { notify = true } = options;

    if (!supportedLocales.includes(locale)) {
        return;
    }

    const hasChanged = currentLocale !== locale;
    currentLocale = locale;

    if (notify && hasChanged) {
        listeners.forEach((callback) => callback());
    }
};

export const getLocale = () => currentLocale;

export const subscribe = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

export const useTranslation = () => {
    useSyncExternalStore(subscribe, getLocale, getLocale);
    return t;
};

export const t = new Proxy(
    {},
    {
        get: (_, property) => {
            const localizedValue = locales[currentLocale]?.[property];
            const fallbackValue = locales.ru?.[property];

            if (isPlainObject(localizedValue) || isPlainObject(fallbackValue)) {
                return createTranslationProxy(
                    isPlainObject(localizedValue) ? localizedValue : undefined,
                    isPlainObject(fallbackValue) ? fallbackValue : undefined
                );
            }

            const resolvedValue = localizedValue ?? fallbackValue;
            return resolvedValue === undefined ? undefined : normalizeTranslationString(resolvedValue);
        }
    }
);
