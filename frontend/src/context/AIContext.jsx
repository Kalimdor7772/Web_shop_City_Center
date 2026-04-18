"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { notifyCartCleared, notifyProductAdded, sendUserMessage } from "@/services/aiSeller.service";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const createInitialAssistantMessage = () => ({
    role: "assistant",
    text: "Здравствуйте. Я ваш помощник по покупкам в City Center. Помогу подобрать продукты, собрать корзину и довести заказ до оформления.",
});

const AIContext = createContext({
    isOpen: false,
    messages: [],
    recommendations: [],
    emotion: "idle",
    isThinking: false,
    openAssistant: () => {},
    closeAssistant: () => {},
    sendMessage: () => {},
    trackCategory: () => {},
    trackProductView: () => {},
});

const getHistoryKey = (userId) => `ai_chat_history:${userId || "guest"}`;
const getPreferencesKey = (userId) => `ai_preferences:${userId || "guest"}`;

const readJSON = (key, fallback) => {
    try {
        const rawValue = localStorage.getItem(key);
        return rawValue ? JSON.parse(rawValue) : fallback;
    } catch (error) {
        console.error(`Failed to read ${key}`, error);
        return fallback;
    }
};

export const AIProvider = ({ children }) => {
    const { user } = useAuth();
    const { cartItems, totalItems, totalPrice } = useCart();
    const historyKey = useMemo(() => getHistoryKey(user?.id), [user?.id]);
    const preferencesKey = useMemo(() => getPreferencesKey(user?.id), [user?.id]);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([createInitialAssistantMessage()]);
    const [recommendations, setRecommendations] = useState([]);
    const [emotion, setEmotion] = useState("idle");
    const [isThinking, setIsThinking] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const hasProactivelyOpened = useRef(false);
    const emotionTimer = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedMessages = readJSON(historyKey, [createInitialAssistantMessage()]);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages(Array.isArray(storedMessages) && storedMessages.length > 0 ? storedMessages : [createInitialAssistantMessage()]);
        setRecommendations([]);
        setEmotion("idle");
        setIsThinking(false);
        hasProactivelyOpened.current = false;
        setIsInitialized(true);
    }, [historyKey]);

    useEffect(() => {
        if (!isInitialized || typeof window === "undefined") return;
        localStorage.setItem(historyKey, JSON.stringify(messages));
    }, [historyKey, isInitialized, messages]);

    const addAssistantMessage = useCallback(({ text, recs = [], newEmotion = "happy", actions = [] }) => {
        setIsThinking(false);
        setMessages((prev) => [...prev, { role: "assistant", text, actions }]);
        setRecommendations(recs);
        setEmotion(newEmotion);

        if (emotionTimer.current) {
            clearTimeout(emotionTimer.current);
        }

        emotionTimer.current = setTimeout(() => {
            setEmotion("idle");
        }, 5000);
    }, []);

    const updatePreferences = useCallback((category) => {
        if (typeof window === "undefined") return {};

        try {
            const preferences = readJSON(preferencesKey, {});
            if (category) {
                preferences[category] = (preferences[category] || 0) + 1;
                localStorage.setItem(preferencesKey, JSON.stringify(preferences));
            }
            return preferences;
        } catch (error) {
            console.error("Preference save error", error);
            return {};
        }
    }, [preferencesKey]);

    const getPreferences = useCallback(() => {
        if (typeof window === "undefined") return {};
        return readJSON(preferencesKey, {});
    }, [preferencesKey]);

    useEffect(() => {
        const handleProductAdded = async (event) => {
            const detail = event.detail;
            if (detail?.silentAI) return;
            const product = detail.product || detail;
            const state = detail.state;

            if (!product) return;

            const currentPrefs = updatePreferences(product.category);
            const isFirstItem = state?.totalItems === 1;
            const shouldOpen = !isOpen && (!hasProactivelyOpened.current || isFirstItem);

            if (shouldOpen) {
                setIsOpen(true);
                hasProactivelyOpened.current = true;
            }

            if (isOpen || shouldOpen) {
                setIsThinking(true);
                setEmotion("thinking");

                try {
                    const reply = await notifyProductAdded(product, state, currentPrefs);
                    addAssistantMessage({
                        text: reply.text,
                        recs: reply.recommendations || [],
                        newEmotion: reply.emotion,
                        actions: reply.actions || [],
                    });
                } catch (error) {
                    console.error("AI Error", error);
                    setIsThinking(false);
                    setEmotion("idle");
                }
            }
        };

        window.addEventListener("cart:product_added", handleProductAdded);
        return () => window.removeEventListener("cart:product_added", handleProductAdded);
    }, [addAssistantMessage, isOpen, updatePreferences]);

    useEffect(() => {
        const handleProductRemoved = (event) => {
            const product = event.detail;
            const displayName = product?.name || "товар";

            if (isOpen) {
                addAssistantMessage({
                    text: `Убрали ${displayName}? Если хотите, я помогу найти похожую замену или вернуть что-то в корзину.`,
                    newEmotion: "idle",
                });
            }
        };

        window.addEventListener("cart:product_removed", handleProductRemoved);
        return () => window.removeEventListener("cart:product_removed", handleProductRemoved);
    }, [addAssistantMessage, isOpen]);

    useEffect(() => {
        const handleCartCleared = async () => {
            hasProactivelyOpened.current = false;

            if (isOpen) {
                setIsThinking(true);
                setEmotion("thinking");

                try {
                    const reply = await notifyCartCleared();
                    addAssistantMessage({
                        text: reply.text,
                        newEmotion: reply.emotion,
                        actions: reply.actions || [],
                    });
                } catch {
                    setIsThinking(false);
                }
            }
        };

        window.addEventListener("cart:cleared", handleCartCleared);
        return () => window.removeEventListener("cart:cleared", handleCartCleared);
    }, [addAssistantMessage, isOpen]);

    const openAssistant = useCallback(() => setIsOpen(true), []);
    const closeAssistant = useCallback(() => setIsOpen(false), []);

    const sendMessage = useCallback(async (text) => {
        if (!text || !text.trim()) return;

        setMessages((prev) => [...prev, { role: "user", text }]);
        setIsThinking(true);
        setEmotion("thinking");

        try {
            const currentPrefs = getPreferences();
            const reply = await sendUserMessage(text, currentPrefs, {
                items: cartItems,
                totalItems,
                totalPrice,
            });

            addAssistantMessage({
                text: reply.text,
                recs: reply.recommendations || [],
                newEmotion: reply.emotion,
                actions: reply.actions || [],
            });
        } catch (error) {
            console.error(error);
            addAssistantMessage({
                text: "Не удалось связаться с AI-сервером. Попробуйте еще раз через пару секунд.",
                newEmotion: "idle",
            });
        }
    }, [addAssistantMessage, cartItems, getPreferences, totalItems, totalPrice]);

    const trackCategory = useCallback((categoryName) => {
        updatePreferences(categoryName);
    }, [updatePreferences]);

    const trackProductView = useCallback(() => {}, []);

    return (
        <AIContext.Provider
            value={{
                isOpen,
                messages,
                recommendations,
                emotion,
                isThinking,
                openAssistant,
                closeAssistant,
                sendMessage,
                trackCategory,
                trackProductView,
            }}
        >
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) throw new Error("useAI must be used within an AIProvider");
    return context;
};
