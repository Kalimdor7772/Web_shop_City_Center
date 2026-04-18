"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Bot, CalendarRange, Coffee, Heart, Send, ShoppingBag, Sparkles, Users, Wallet, X } from "lucide-react";
import { useAI } from "@/context/AIContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getProductById } from "@/services/product.service";
import { formatPrice } from "@/lib/utils";

export default function Assistant() {
    const { isOpen, openAssistant, closeAssistant, messages, sendMessage, recommendations, emotion, isThinking } = useAI();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [inputValue, setInputValue] = useState("");
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
    }, []);

    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [isOpen, isThinking, messages, recommendations]);

    const handleSubmit = (event) => {
        event?.preventDefault();
        if (!inputValue.trim() || isThinking) return;
        sendMessage(inputValue);
        setInputValue("");
    };

    const handleQuickAction = (action) => sendMessage(action);

    const handleAddToCart = (product) => {
        addToCart(product);
        showToast(`Добавлено: ${product.name}`, { label: "В корзину", href: "/cart" });
    };

    const handleAction = async (actionValue) => {
        if (!actionValue) return;

        if (actionValue.startsWith("navigate:")) {
            window.location.assign(actionValue.split(":")[1]);
            closeAssistant();
            return;
        }

        if (actionValue.startsWith("add_to_cart:")) {
            const productId = actionValue.split(":")[1];
            let product = recommendations.find((item) => String(item.id) === String(productId));

            if (!product) {
                try {
                    const result = await getProductById(productId);
                    product = result?.data || result;
                } catch (error) {
                    console.error("Failed to fetch product for add_to_cart action:", error);
                }
            }

            if (product) {
                addToCart(product);
                showToast(`Добавлено: ${product.name}`, { label: "В корзину", href: "/cart" });
                return;
            }

            showToast("Не удалось добавить товар в корзину. Попробуйте другой вариант.");
            return;
        }

        handleQuickAction(actionValue);
    };

    const getOrbVariants = () => {
        switch (emotion) {
            case "thinking":
                return { scale: [1, 1.12, 1], rotate: [0, 90, 180, 270, 360], transition: { duration: 2, repeat: Infinity, ease: "linear" } };
            case "happy":
                return { y: [0, -8, 0], scale: [1, 1.08, 1], transition: { duration: 0.6, repeat: 1 } };
            case "advising":
                return {
                    boxShadow: ["0 0 10px rgba(31,157,104,0.22)", "0 0 24px rgba(31,157,104,0.35)", "0 0 10px rgba(31,157,104,0.22)"],
                    scale: [1, 1.05, 1],
                    transition: { duration: 1.5, repeat: Infinity }
                };
            default:
                return { scale: [1, 1.04, 1], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } };
        }
    };

    const quickActions = [
        { label: "Что на завтрак?", prompt: "Что взять на завтрак?", icon: Coffee },
        { label: "На 3 дня", prompt: "Соберите корзину на 3 дня для 2 человек", icon: CalendarRange },
        { label: "Для семьи", prompt: "Соберите корзину на неделю для семьи", icon: Users },
        { label: "Бюджет 20000 ₸", prompt: "Соберите корзину на 20000 тенге", icon: Wallet },
        { label: "Полезная корзина", prompt: "Подберите полезные продукты", icon: Heart },
        { label: "КБЖУ корзины", prompt: "Покажите КБЖУ корзины", icon: BarChart3 }
    ];

    if (!mounted) return null;

    return (
        <div className="pointer-events-none fixed bottom-3 right-3 z-[9999] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6 sm:gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.92, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 30, scale: 0.92, filter: "blur(10px)" }}
                        className="assistant-shell pointer-events-auto flex h-[min(78dvh,600px)] w-[calc(100vw-1.25rem)] max-w-[420px] flex-col overflow-hidden rounded-[1.8rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,252,245,0.96),rgba(250,244,231,0.94))] shadow-[0_24px_70px_-18px_rgba(74,54,23,0.25)] backdrop-blur-2xl sm:h-[600px] sm:w-[380px] sm:rounded-[2.5rem] md:w-[420px]"
                    >
                        <div className="assistant-shell__header flex items-center justify-between border-b border-white/60 bg-[linear-gradient(90deg,rgba(255,255,255,0.76),rgba(249,243,227,0.7))] px-4 py-4 sm:px-6 sm:py-5">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="relative">
                                    <motion.div
                                        animate={getOrbVariants()}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#147a54_0%,#1f9d68_55%,#f0b53c_140%)] text-white shadow-lg shadow-emerald-200/80 sm:h-12 sm:w-12 sm:rounded-2xl"
                                    >
                                        <Bot size={20} className="sm:h-6 sm:w-6" />
                                    </motion.div>
                                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black leading-tight tracking-tight text-gray-900 sm:text-base">AI помощник</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">онлайн</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={closeAssistant} className="glass-panel rounded-xl p-2 text-gray-400 transition-all hover:bg-white hover:text-gray-900 sm:rounded-2xl">
                                <X size={18} className="sm:h-5 sm:w-5" />
                            </button>
                        </div>

                        <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={`${msg.role}-${idx}`}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[90%] whitespace-pre-line rounded-[1.2rem] px-4 py-3 text-[13px] font-bold leading-relaxed sm:max-w-[85%] sm:rounded-[1.5rem] sm:px-5 sm:py-4 sm:text-sm ${
                                        msg.role === "user"
                                            ? "rounded-tr-none bg-emerald-700 text-white shadow-[0_16px_28px_rgba(31,157,104,0.22)]"
                                            : "glass-panel rounded-tl-none text-gray-800"
                                    }`}>
                                        {msg.text}

                                        {msg.actions && msg.actions.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {msg.actions.map((action, i) => (
                                                    <button
                                                        key={`${action.label}-${i}`}
                                                        onClick={() => void handleAction(action.action || action.label)}
                                                        className="max-w-full rounded-lg bg-emerald-700 px-3 py-1.5 text-left text-xs text-white shadow-sm transition-colors hover:bg-emerald-800"
                                                    >
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {isThinking && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="glass-panel rounded-[1.5rem] rounded-tl-none px-5 py-4">
                                        <div className="flex gap-1">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:0.2s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {recommendations.length > 0 && !isThinking && (
                                <div className="space-y-3 pt-2">
                                    <p className="px-1 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">рекомендации</p>
                                    <div className="no-scrollbar -mx-2 flex gap-3 overflow-x-auto px-2 pb-4">
                                        {recommendations.map((product) => (
                                            <motion.div key={product.id} whileHover={{ y: -5 }} className="glass-panel-strong group flex min-w-[148px] flex-col gap-3 rounded-[1.6rem] p-3 sm:min-w-[168px] sm:rounded-[2rem]">
                                                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,238,223,0.86))] p-3">
                                                    <img src={product.image} alt="" className="h-full w-full object-contain transition-transform group-hover:scale-110" />
                                                </div>
                                                <div className="px-1">
                                                    <h4 className="line-clamp-1 text-[11px] font-black text-gray-900">{product.name}</h4>
                                                    <p className="text-[13px] font-black text-emerald-700">{formatPrice(product.price)}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2 text-[10px] font-black text-white transition-all hover:bg-emerald-700"
                                                >
                                                    <ShoppingBag size={12} />
                                                    Купить
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="space-y-3 p-4 pt-0 sm:space-y-4 sm:p-6 sm:pt-0">
                            <div className="no-scrollbar flex gap-2 overflow-x-auto py-1 sm:py-2">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.label}
                                        onClick={() => handleQuickAction(action.prompt)}
                                        className="glass-panel flex shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold text-gray-600 transition-all hover:border-emerald-400 hover:bg-emerald-50/70 hover:text-emerald-700 sm:px-4 sm:text-xs"
                                    >
                                        <span className="mr-2"><action.icon size={14} /></span>
                                        {action.label}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="relative flex items-center gap-2 sm:gap-3">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(event) => setInputValue(event.target.value)}
                                    placeholder="Спросите про подборку, бюджет или конкретные товары..."
                                    className="min-w-0 flex-1 rounded-[1.1rem] bg-white/80 px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/20 sm:rounded-[1.5rem] sm:px-6 sm:py-4"
                                    disabled={isThinking}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isThinking}
                                    className="rounded-[1rem] bg-emerald-700 p-3.5 text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-800 disabled:opacity-50 disabled:shadow-none sm:rounded-2xl sm:p-4"
                                >
                                    <Send size={18} className="sm:h-5 sm:w-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button onClick={openAssistant} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="group relative pointer-events-auto">
                    <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#147a54_0%,#1f9d68_55%,#f0b53c_140%)] opacity-35 blur-xl transition-opacity group-hover:opacity-50" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/25 bg-[linear-gradient(135deg,#147a54_0%,#1f9d68_55%,#f0b53c_140%)] text-white shadow-2xl sm:h-16 sm:w-16">
                        <Sparkles size={24} className="transition-transform group-hover:rotate-12 sm:h-7 sm:w-7" />
                        {emotion !== "idle" && <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-white bg-red-500" />}
                    </div>
                </motion.button>
            )}
        </div>
    );
}
