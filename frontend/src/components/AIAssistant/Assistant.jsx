"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Bot, CalendarRange, Coffee, Heart, Send, ShoppingBag, Sparkles, Users, Wallet, X } from "lucide-react";
import { useAI } from "@/context/AIContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

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
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isOpen, isThinking, messages, recommendations]);

    const handleSubmit = (event) => {
        event?.preventDefault();
        if (!inputValue.trim() || isThinking) return;
        sendMessage(inputValue);
        setInputValue("");
    };

    const handleQuickAction = (action) => {
        sendMessage(action);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        showToast(`Добавлено: ${product.name}`, { label: "В корзину", href: "/cart" });
    };

    const getOrbVariants = () => {
        switch (emotion) {
            case "thinking":
                return {
                    scale: [1, 1.15, 1],
                    rotate: [0, 90, 180, 270, 360],
                    transition: { duration: 2, repeat: Infinity, ease: "linear" }
                };
            case "happy":
                return {
                    y: [0, -8, 0],
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.6, repeat: 1 }
                };
            case "advising":
                return {
                    boxShadow: ["0 0 10px rgba(139, 92, 246, 0.4)", "0 0 25px rgba(139, 92, 246, 0.8)", "0 0 10px rgba(139, 92, 246, 0.4)"],
                    scale: [1, 1.05, 1],
                    transition: { duration: 1.5, repeat: Infinity }
                };
            default:
                return {
                    scale: [1, 1.05, 1],
                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                };
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
        <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
                        className="pointer-events-auto flex h-[600px] w-[380px] flex-col overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-2xl md:w-[420px]"
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <motion.div
                                        animate={getOrbVariants()}
                                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-200"
                                    >
                                        <Bot size={24} />
                                    </motion.div>
                                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
                                </div>
                                <div>
                                    <h3 className="leading-tight tracking-tight font-black text-gray-900">AI помощник</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Онлайн</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={closeAssistant} className="rounded-2xl p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="scrollbar-hide flex-1 space-y-6 overflow-y-auto px-6 py-6">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={`${msg.role}-${idx}`}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] whitespace-pre-line rounded-[1.5rem] px-5 py-4 text-sm font-bold leading-relaxed ${msg.role === "user"
                                            ? "rounded-tr-none bg-gray-900 text-white"
                                            : "rounded-tl-none border border-gray-200 bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {msg.text}

                                        {msg.actions && msg.actions.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {msg.actions.map((action, i) => (
                                                    <button
                                                        key={`${action.label}-${i}`}
                                                        onClick={() => {
                                                            if (action.action.startsWith("navigate:")) {
                                                                window.location.href = action.action.split(":")[1];
                                                                closeAssistant();
                                                            } else {
                                                                handleQuickAction(action.action || action.label);
                                                            }
                                                        }}
                                                        className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white shadow-sm transition-colors hover:bg-violet-700"
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
                                    <div className="rounded-[1.5rem] rounded-tl-none border border-gray-200 bg-gray-100 px-5 py-4">
                                        <div className="flex gap-1">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {recommendations.length > 0 && !isThinking && (
                                <div className="space-y-3 pt-2">
                                    <p className="px-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Рекомендации</p>
                                    <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-4 no-scrollbar">
                                        {recommendations.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                whileHover={{ y: -5 }}
                                                className="group flex min-w-[160px] flex-col gap-3 rounded-3xl border border-gray-100 bg-white p-3 shadow-sm"
                                            >
                                                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 p-3">
                                                    <img src={product.image} alt="" className="h-full w-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                                                </div>
                                                <div className="px-1">
                                                    <h4 className="line-clamp-1 text-[11px] font-black text-gray-900">{product.name}</h4>
                                                    <p className="text-[13px] font-black text-green-600">{product.price} ₸</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2 text-[10px] font-black text-white transition-all hover:bg-green-600"
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

                        <div className="space-y-4 p-6 pt-0">
                            <div className="no-scrollbar flex gap-2 overflow-x-auto py-2">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.label}
                                        onClick={() => handleQuickAction(action.prompt)}
                                        className="flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 transition-all hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600"
                                    >
                                        <span className="mr-2"><action.icon size={14} /></span>
                                        {action.label}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(event) => setInputValue(event.target.value)}
                                    placeholder="Спросите про подборку на неделю, бюджет, КБЖУ или конкретные товары..."
                                    className="flex-1 rounded-[1.5rem] bg-gray-100 px-6 py-4 text-sm font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500"
                                    disabled={isThinking}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isThinking}
                                    className="rounded-2xl bg-violet-600 p-4 text-white shadow-lg shadow-violet-200 transition-all hover:bg-violet-700 disabled:opacity-50 disabled:shadow-none"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    onClick={openAssistant}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative pointer-events-auto"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 opacity-40 blur-xl transition-opacity group-hover:opacity-60" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-2xl">
                        <Sparkles size={28} className="transition-transform group-hover:rotate-12" />
                        {emotion !== "idle" && (
                            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-white bg-red-500" />
                        )}
                    </div>
                </motion.button>
            )}
        </div>
    );
}
