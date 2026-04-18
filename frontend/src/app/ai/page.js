"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Clock, MessageSquare, Sparkles, Target, TrendingDown } from "lucide-react";
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
            accent: "from-sky-200/80 to-cyan-100",
            iconColor: "text-sky-700",
        },
        {
            title: t.ai_info.features.recommendations,
            desc: t.ai_info.features.recommendationsDesc,
            icon: Sparkles,
            accent: "from-amber-200/80 to-orange-100",
            iconColor: "text-amber-700",
        },
        {
            title: t.ai_info.features.saving,
            desc: t.ai_info.features.savingDesc,
            icon: TrendingDown,
            accent: "from-emerald-200/80 to-lime-100",
            iconColor: "text-emerald-700",
        },
        {
            title: t.ai_info.features.fast,
            desc: t.ai_info.features.fastDesc,
            icon: Clock,
            accent: "from-rose-200/80 to-orange-100",
            iconColor: "text-rose-700",
        }
    ];

    const examples = [
        { q: t.ai_info.dialogs.example1.q, a: t.ai_info.dialogs.example1.a },
        { q: t.ai_info.dialogs.example2.q, a: t.ai_info.dialogs.example2.a }
    ];

    return (
        <main className="min-h-screen pb-20">
            <section className="organic-section px-3 py-10 md:px-5 md:py-14">
                <div className="section-shell relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] px-6 py-12 md:px-10 md:py-16">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,183,51,0.16),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(31,157,104,0.16),transparent_28%)]" />
                    <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
                    <div className="absolute -left-12 bottom-0 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-5xl text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel mb-8 inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-emerald-800"
                        >
                            <Sparkles size={16} className="text-amber-500" />
                            <span>{t.ai_info.overview.badge}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-5xl font-black leading-[0.92] tracking-[-0.05em] text-gray-900 md:text-7xl"
                        >
                            {t.ai_info.hero.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="mx-auto mt-8 max-w-3xl text-xl font-medium leading-relaxed text-stone-600"
                        >
                            {t.ai_info.hero.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.16 }}
                            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
                        >
                            <button
                                onClick={openAssistant}
                                className="inline-flex items-center justify-center gap-3 rounded-[1.5rem] bg-emerald-700 px-10 py-5 text-xl font-black text-white shadow-[0_18px_34px_rgba(31,157,104,0.28)] transition-all hover:-translate-y-1 hover:bg-emerald-800"
                            >
                                <Bot size={24} />
                                {t.ai_info.hero.cta}
                            </button>
                            <Link
                                href="/catalog"
                                className="glass-panel inline-flex items-center justify-center gap-3 rounded-[1.5rem] px-10 py-5 text-xl font-black text-gray-900 transition-all hover:-translate-y-1"
                            >
                                {t.ai_info.cta.goCatalog}
                                <ArrowRight size={22} />
                            </Link>
                        </motion.div>

                        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {t.ai_info.stats.map((item) => (
                                <div key={item.label} className="glass-panel rounded-[1.75rem] px-5 py-4 text-left">
                                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">{item.label}</p>
                                    <p className="mt-2 text-lg font-black text-gray-900">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="organic-section px-3 py-10 md:px-5">
                <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-6 py-10 md:px-8 md:py-12">
                    <div className="mb-10 flex items-end justify-between gap-6">
                        <div>
                            <h2 className="font-heading text-4xl font-black tracking-[-0.04em] text-gray-900 md:text-5xl">
                                {t.ai_info.overview.title}
                            </h2>
                            <p className="mt-3 max-w-2xl text-lg font-medium text-stone-600">
                                {t.ai_info.overview.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                viewport={{ once: true }}
                                className="glass-panel-strong rounded-[2rem] p-7"
                            >
                                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${feature.accent}`}>
                                    <feature.icon className={feature.iconColor} size={30} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">{feature.title}</h3>
                                <p className="mt-4 leading-relaxed text-stone-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="organic-section px-3 py-10 md:px-5">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="section-shell rounded-[3rem] px-6 py-10 md:px-8">
                        <h2 className="font-heading text-4xl font-black tracking-[-0.04em] text-gray-900 md:text-5xl">
                            {t.ai_info.dialogs.title}
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg font-medium text-stone-600">
                            Несколько примеров того, как AI помогает прямо в процессе покупок.
                        </p>

                        <div className="mt-10 space-y-8">
                            {examples.map((example, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    viewport={{ once: true }}
                                    className="space-y-4"
                                >
                                    <div className="flex justify-start">
                                        <div className="glass-panel flex max-w-[92%] items-start gap-3 rounded-[1.5rem] rounded-tl-none px-5 py-4 text-sm font-bold text-gray-900 shadow-sm">
                                            <MessageSquare size={18} className="mt-0.5 text-stone-400" />
                                            <span>{example.q}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="max-w-[92%] rounded-[1.5rem] rounded-tr-none bg-emerald-700 px-5 py-4 text-sm font-bold leading-relaxed text-white shadow-[0_18px_34px_rgba(31,157,104,0.22)]">
                                            {example.a}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="section-shell relative overflow-hidden rounded-[3rem] px-6 py-10 md:px-8">
                        <div className="absolute right-[-10%] top-[-10%] h-56 w-56 rounded-full bg-amber-200/25 blur-3xl" />
                        <div className="absolute bottom-[-10%] left-[-10%] h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

                        <motion.div
                            animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="glass-panel-strong relative z-10 mx-auto flex min-h-[420px] max-w-[420px] flex-col justify-between rounded-[2.5rem] p-8"
                        >
                            <div className="flex items-center justify-between">
                                <div className="glass-panel flex h-14 w-14 items-center justify-center rounded-[1.25rem] text-emerald-700">
                                    <Bot size={28} />
                                </div>
                                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                                    Ready
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.24em] text-stone-500">{t.ai_info.card.status}</p>
                                <h3 className="mt-3 text-3xl font-black leading-tight text-gray-900">
                                    {t.ai_info.card.title}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {t.ai_info.card.bullets.map((item) => (
                                    <div key={item} className="glass-panel flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-bold text-gray-900">
                                        <Sparkles size={16} className="text-amber-500" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="organic-section px-3 py-10 md:px-5">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[linear-gradient(135deg,#147a54_0%,#1f9d68_45%,#f0b53c_130%)] p-10 text-white shadow-[0_30px_90px_rgba(31,157,104,0.26)] md:p-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-4xl font-black leading-tight md:text-6xl">
                            {t.ai_info.cta.title}
                        </h2>
                        <p className="mt-6 text-xl font-medium text-white/88">
                            {t.ai_info.cta.subtitle}
                        </p>
                        <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">
                            <button
                                onClick={openAssistant}
                                className="rounded-[1.5rem] bg-white px-12 py-5 text-xl font-black text-emerald-800 shadow-[0_18px_40px_rgba(255,255,255,0.22)] transition-all hover:-translate-y-1"
                            >
                                {t.ai_info.hero.cta}
                            </button>
                            <Link
                                href="/catalog"
                                className="rounded-[1.5rem] border border-white/30 bg-white/10 px-12 py-5 text-xl font-black text-white transition-all hover:-translate-y-1 hover:bg-white/20"
                            >
                                {t.ai_info.cta.goCatalog}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
