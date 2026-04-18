"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, TrendingUp, Zap } from "lucide-react";
import { t } from "@/lib/i18n";
import { products } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { getProductWeightLabel } from "@/lib/product";

function SectionHeader({ title, icon: Icon, accent, iconClass = "text-gray-900" }) {
    return (
        <div className="mb-8 flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${accent}`}>
                <Icon className={iconClass} size={28} />
            </div>
            <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-stone-500">{t.deals.sectionTag}</p>
                <h2 className="text-3xl font-black tracking-[-0.04em] text-gray-900 md:text-4xl">{title}</h2>
            </div>
        </div>
    );
}

function PromoCard({ product, onAddToCart }) {
    return (
        <motion.div
            whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
            className="glass-panel-strong group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] p-6"
        >
            <div className="absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-white/55 to-transparent" />
            <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
                <span
                    className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] shadow-sm ${
                        product.badgeType === "hot"
                            ? "border-rose-300 bg-rose-500 text-white"
                            : product.badgeType === "hit"
                                ? "border-amber-200 bg-amber-300 text-stone-900"
                                : "border-emerald-400 bg-emerald-600 text-white"
                    }`}
                >
                    {product.badge}
                </span>
            </div>

            <div className="relative mb-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,238,223,0.86))] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(31,157,104,0.12),transparent_55%)]" />
                <img
                    src={product.image}
                    alt={product.name}
                    className="relative h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            <div className="flex flex-1 flex-col">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-stone-400">
                    {product.subcategory || product.category}
                </p>
                <h3 className="mb-4 line-clamp-2 text-xl font-black leading-tight tracking-[-0.03em] text-gray-900 transition-colors group-hover:text-emerald-700">
                    {product.name}
                </h3>

                <div className="mt-auto">
                    <div className="mb-6 flex items-end gap-3">
                        <div className="flex flex-col">
                            {product.oldPrice && (
                                <span className="text-sm font-bold text-stone-400 line-through decoration-rose-400/70">
                                    {formatPrice(product.oldPrice)}
                                </span>
                            )}
                            <span className="text-3xl font-black tracking-tight text-gray-900">{formatPrice(product.price)}</span>
                        </div>
                        <span className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                            {getProductWeightLabel(product)}
                        </span>
                    </div>

                    <button
                        onClick={() => onAddToCart(product)}
                        className="flex w-full items-center justify-center gap-3 rounded-[1.4rem] bg-emerald-700 py-4 text-sm font-black text-white shadow-[0_18px_30px_rgba(31,157,104,0.24)] transition-all active:scale-95 hover:-translate-y-0.5 hover:bg-emerald-800"
                    >
                        <ShoppingCart size={18} />
                        {t.common.addToCart}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function DealsPage() {
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const promoData = useMemo(() => {
        const hotDeals = products.slice(0, 4).map((product) => ({
            ...product,
            oldPrice: product.price * 1.3,
            badge: "-30%",
            badgeType: "hot"
        }));

        const meatDeals = products
            .filter((product) => product.category === "Мясо и рыба")
            .slice(0, 4)
            .map((product) => ({
                ...product,
                oldPrice: product.price * 1.2,
                badge: "-20%",
                badgeType: "discount"
            }));

        const popularDeals = products
            .filter((product) => product.price > 1000)
            .slice(10, 14)
            .map((product) => ({
                ...product,
                badge: t.deals.hitBadge,
                badgeType: "hit"
            }));

        const breakfastBundle = products
            .filter((product) => product.category === "Молочные продукты" || product.category === "Хлеб и выпечка")
            .slice(0, 2);

        return { hotDeals, meatDeals, popularDeals, breakfastBundle };
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        showToast(t.common.addedToCart, { label: t.common.addToCart, href: "/cart" });
    };

    return (
        <main className="min-h-screen pb-24 pt-24">
            <section className="organic-section px-3 py-10 md:px-5 md:py-14">
                <div className="section-shell relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] px-6 py-12 md:px-10 md:py-16">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,183,51,0.16),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(239,68,68,0.12),transparent_28%)]" />
                    <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-amber-200/25 blur-3xl" />
                    <div className="absolute -left-12 bottom-0 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        <div className="glass-panel mb-8 inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-stone-800">
                            <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-70" />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
                            </span>
                            <span>{t.deals.hotDealsLabel}</span>
                        </div>

                        <h1 className="font-heading text-5xl font-black leading-[0.92] tracking-[-0.05em] text-gray-900 md:text-7xl">
                            {t.deals.title}
                        </h1>
                        <p className="mx-auto mt-8 max-w-3xl text-xl font-medium leading-relaxed text-stone-600">
                            {t.deals.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            <section className="organic-section px-3 py-10 md:px-5">
                <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-6 py-10 md:px-8 md:py-12">
                    <SectionHeader title={t.deals.hotDealsSectionTitle} icon={Zap} accent="from-rose-200/80 to-orange-100" iconClass="text-rose-700" />
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {promoData.hotDeals.map((product) => (
                            <PromoCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="organic-section px-3 py-10 md:px-5">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <motion.div whileHover={{ scale: 1.01 }} className="section-shell group relative overflow-hidden rounded-[3rem] px-8 py-10 text-gray-900 md:px-10 md:py-12">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(19,120,82,0.18),rgba(31,157,104,0.08),rgba(247,183,51,0.10))]" />
                        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl transition-all duration-700 group-hover:bg-amber-200/30" />

                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <span className="glass-panel mb-6 inline-block rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-800">
                                    {t.deals.bannerHotLabel}
                                </span>
                                <h3 className="mb-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
                                    {t.deals.bannerHotTitle.split("\n").map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            {index + 1 < t.deals.bannerHotTitle.split("\n").length && <br />}
                                        </React.Fragment>
                                    ))}
                                </h3>
                                <p className="mb-10 max-w-xl text-lg font-medium leading-relaxed text-stone-600">
                                    {t.deals.bannerHotDescription}
                                </p>
                            </div>
                            <Link href="/catalog" className="inline-flex w-fit items-center gap-3 rounded-[1.4rem] bg-emerald-700 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_rgba(31,157,104,0.22)] transition-all hover:-translate-y-1 hover:gap-4 hover:bg-emerald-800">
                                {t.deals.bannerHotCta} <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {promoData.meatDeals.slice(0, 2).map((product) => (
                            <PromoCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="organic-section px-3 py-10 md:px-5">
                <div className="section-shell relative mx-auto flex max-w-7xl flex-col items-center gap-12 overflow-hidden rounded-[3.5rem] px-8 py-12 lg:flex-row lg:px-12">
                    <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(226,196,255,0.30),transparent_65%)] lg:block" />
                    <div className="relative z-10 flex-1 text-center lg:text-left">
                        <span className="glass-panel mb-4 inline-block rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-violet-700">{t.deals.bundle.label}</span>
                        <h3 className="mb-6 text-4xl font-black leading-tight tracking-[-0.04em] text-gray-900 md:text-5xl">
                            {t.deals.bundle.title.split("\n").map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    {index + 1 < t.deals.bundle.title.split("\n").length && <br />}
                                </React.Fragment>
                            ))}
                        </h3>
                        <p className="mb-10 max-w-md text-lg font-medium leading-relaxed text-stone-600">
                            {t.deals.bundle.description}
                        </p>
                        <div className="flex justify-center gap-4 lg:justify-start">
                            <span className="text-4xl font-black text-stone-300 line-through">3 500 ₸</span>
                            <span className="text-4xl font-black text-emerald-700">2 900 ₸</span>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-1 flex-wrap justify-center gap-4">
                        {promoData.breakfastBundle.map((item) => (
                            <div key={item.id} className="glass-panel-strong flex h-44 w-44 items-center justify-center rounded-[2rem] p-6">
                                <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="organic-section px-3 py-10 md:px-5">
                <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-6 py-10 md:px-8 md:py-12">
                    <SectionHeader title={t.deals.popularSectionTitle} icon={TrendingUp} accent="from-sky-200/80 to-cyan-100" iconClass="text-sky-700" />
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {promoData.popularDeals.map((product) => (
                            <PromoCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="organic-section px-3 py-10 md:px-5">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[linear-gradient(135deg,#147a54_0%,#1f9d68_45%,#f0b53c_130%)] p-10 text-white shadow-[0_30px_90px_rgba(31,157,104,0.26)] md:p-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-4xl font-black leading-tight md:text-6xl">{t.deals.final.title}</h2>
                        <p className="mt-6 text-xl font-medium text-white/88">{t.deals.final.subtitle}</p>
                        <Link href="/catalog" className="mt-10 inline-flex items-center gap-3 rounded-[1.5rem] bg-white px-12 py-5 text-xl font-black text-emerald-800 shadow-[0_18px_40px_rgba(255,255,255,0.22)] transition-all hover:-translate-y-1">
                            {t.deals.final.cta} <ArrowRight size={22} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
