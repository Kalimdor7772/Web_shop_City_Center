"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Target, Zap, TrendingDown, Clock, ArrowRight, MessageSquare, Bot } from "lucide-react";
import { useAI } from "@/context/AIContext";
import { t } from "@/lib/i18n";
import Link from "next/link";

export default function AIPage() {
    const { openAssistant } = useAI();

    const features = [
        {
            title: t.ai_info.features.selection,
            desc: t.ai_info.features.selectionDesc,
            icon: Target,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: t.ai_info.features.recommendations,
            desc: t.ai_info.features.recommendationsDesc,
            icon: Sparkles,
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            title: t.ai_info.features.saving,
            desc: t.ai_info.features.savingDesc,
            icon: TrendingDown,
            color: "text-green-500",
            bg: "bg-green-50"
        },
        {
            title: t.ai_info.features.fast,
            desc: t.ai_info.features.fastDesc,
            icon: Clock,
            color: "text-orange-500",
            bg: "bg-orange-50"
        }
    ];

    const examples = [
        { q: t.ai_info.dialogs.example1.q, a: t.ai_info.dialogs.example1.a },
        { q: t.ai_info.dialogs.example2.q, a: t.ai_info.dialogs.example2.a }
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white mb-8"
                        >
                            <Sparkles size={16} className="text-violet-400" />
                            <span className="text-sm font-bold tracking-widest uppercase">ШОПИНГ НОВОГО ПОКОЛЕНИЯ</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight"
                        >
                            {t.ai_info.hero.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            {t.ai_info.hero.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                        >
                            <button
                                onClick={openAssistant}
                                className="px-10 py-5 bg-violet-600 hover:bg-violet-700 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-violet-600/30 transition-all flex items-center justify-center gap-3"
                            >
                                <Bot size={24} />
                                {t.ai_info.hero.cta}
                            </button>
                            <Link
                                href="/catalog"
                                className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-[2rem] font-black text-xl transition-all"
                            >
                                {t.ai_info.cta.goCatalog}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${f.bg} flex items-center justify-center mb-8`}>
                                    <f.icon className={f.color} size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4">{f.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Chat Examples */}
            <section className="py-32 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                                {t.ai_info.dialogs.title}
                            </h2>
                            <div className="space-y-8">
                                {examples.map((ex, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 text-gray-800 px-6 py-4 rounded-3xl rounded-tl-none font-bold shadow-sm flex items-center gap-3 max-w-[90%]">
                                                <MessageSquare size={18} className="text-gray-400" />
                                                {ex.q}
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="bg-violet-600 text-white px-6 py-4 rounded-3xl rounded-tr-none font-bold shadow-xl flex items-center gap-3 max-w-[90%]">
                                                <Sparkles size={18} className="text-violet-300" />
                                                {ex.a}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            <div className="w-full aspect-square bg-gradient-to-tr from-violet-100 to-fuchsia-100 rounded-[4rem] relative flex items-center justify-center p-12">
                                <motion.div
                                    animate={{
                                        y: [0, -20, 0],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                    className="w-full h-full bg-white rounded-[3rem] shadow-2xl border border-white p-8 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-24 h-24 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-violet-500/50">
                                        <Sparkles size={48} />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">AI Помощник</h4>
                                    <div className="space-y-3 w-full max-w-[200px]">
                                        <div className="h-2 w-full bg-gray-100 rounded-full" />
                                        <div className="h-2 w-[80%] bg-gray-100 rounded-full mx-auto" />
                                        <div className="h-2 w-[60%] bg-gray-100 rounded-full mx-auto" />
                                    </div>
                                </motion.div>

                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                                {t.ai_info.cta.title}
                            </h2>
                            <p className="text-xl text-gray-400 mb-12 font-medium">
                                {t.ai_info.cta.subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <button
                                    onClick={openAssistant}
                                    className="px-12 py-6 bg-white text-gray-900 rounded-[2rem] font-black text-xl hover:bg-violet-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-2xl shadow-black/50"
                                >
                                    {t.ai_info.hero.cta}
                                </button>
                                <Link
                                    href="/catalog"
                                    className="px-12 py-6 bg-white/10 text-white rounded-[2rem] font-black text-xl border border-white/10 hover:bg-white/20 transition-all transform hover:-translate-y-1"
                                >
                                    {t.ai_info.cta.goCatalog}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
