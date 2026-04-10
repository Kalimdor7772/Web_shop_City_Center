"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import HeroScene from "./HeroScene";

const highlights = [
    { label: "Fresh Picks", value: "120+" },
    { label: "Local Farms", value: "18" },
    { label: "Fast Delivery", value: "15 min" },
];

const HeroSection = () => {
    return (
        <section className="organic-section relative w-full overflow-hidden px-3 py-10 md:px-5 md:py-14">
            <div className="section-shell relative mx-auto grid min-h-[680px] max-w-7xl grid-cols-1 gap-12 overflow-hidden rounded-[3rem] px-6 py-8 md:grid-cols-[1.08fr_0.92fr] md:px-10 md:py-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,183,51,0.16),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(31,157,104,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.4),transparent)]" />
                <div className="absolute right-[-6%] top-[-6%] h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[15%] h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative z-10 flex flex-col justify-center"
                >
                    <div className="glass-panel mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-emerald-800">
                        <Leaf className="h-4 w-4" />
                        {t.home.deliveryBadge}
                    </div>

                    <h1 className="max-w-2xl font-heading text-5xl font-black leading-[0.95] tracking-[-0.05em] text-gray-900 md:text-7xl">
                        {t.home.heroTitle}
                    </h1>
                    <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-stone-600 md:text-xl">
                        {t.home.heroSubtitle}
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <Link href="/catalog" className="group inline-flex items-center justify-center gap-3 rounded-[1.5rem] bg-emerald-700 px-8 py-4 text-lg font-bold text-white shadow-[0_18px_34px_rgba(31,157,104,0.28)] hover:-translate-y-1 hover:bg-emerald-800">
                            <ShoppingBag className="h-6 w-6" />
                            {t.home.shopNow}
                        </Link>
                        <Link href="/deals" className="glass-panel group inline-flex items-center justify-center gap-3 rounded-[1.5rem] px-8 py-4 text-lg font-bold text-gray-900 hover:-translate-y-1">
                            {t.home.deals}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                        {highlights.map((item) => (
                            <div key={item.label} className="glass-panel rounded-[1.75rem] px-5 py-4">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">{item.label}</p>
                                <p className="mt-2 text-2xl font-black text-gray-900">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15 }}
                    className="relative z-10 hidden min-h-[520px] items-center justify-center md:flex"
                >
                    <div className="relative h-[560px] w-full max-w-[520px]">
                        <div className="absolute inset-x-[8%] top-8 h-[420px] rounded-[3rem] bg-[radial-gradient(circle_at_top,#fff8d6,rgba(255,255,255,0.76)_48%,rgba(255,250,244,0.4)_100%)] shadow-[0_40px_100px_rgba(122,92,47,0.18)]" />
                        <div className="glass-panel-strong absolute left-4 top-0 h-[520px] w-[78%] overflow-hidden rounded-[3rem] border border-white/60">
                            <HeroScene />
                            <div className="absolute inset-x-6 top-6 flex items-center justify-between">
                                <div className="glass-panel rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.26em] text-emerald-800">
                                    Seasonal
                                </div>
                                <div className="glass-panel flex h-11 w-11 items-center justify-center rounded-full text-amber-500">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 rounded-[2rem] bg-white/68 p-5 shadow-[0_20px_50px_rgba(122,92,47,0.18)] backdrop-blur-xl">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Today&apos;s harvest</p>
                                <p className="mt-2 text-2xl font-black text-gray-900">Organic picks for your basket</p>
                                <div className="mt-4 flex items-center gap-3">
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Farm fresh</span>
                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Same day</span>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            animate={{ y: [0, -12, 0], rotate: [6, 1, 6] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="glass-panel-strong absolute right-0 top-10 rounded-[2rem] px-5 py-4"
                        >
                            <div className="text-4xl">{"\uD83C\uDF4A"}</div>
                            <p className="mt-2 text-sm font-bold text-gray-900">Citrus glow</p>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 14, 0], rotate: [-8, -2, -8] }}
                            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                            className="glass-panel-strong absolute bottom-8 left-0 rounded-[2rem] px-5 py-4"
                        >
                            <div className="text-4xl">{"\uD83E\uDD6C"}</div>
                            <p className="mt-2 text-sm font-bold text-gray-900">Green energy</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
