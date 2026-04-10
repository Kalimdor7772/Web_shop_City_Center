"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { t } from "@/lib/i18n";

const products = [
    { id: 1, name: "Авокадо Хасс", price: "2 400 ₸", weight: "2 шт", image: "https://images.unsplash.com/photo-1523049673856-4286896d659f?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Молоко 3.2%", price: "450 ₸", weight: "1 л", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Хлеб Бородинский", price: "180 ₸", weight: "400 г", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Бананы", price: "890 ₸", weight: "1 кг", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=400" },
];

export default function FeaturedProducts() {
    return (
        <section className="organic-section px-3 py-10 md:px-5">
            <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-6 py-10 md:px-8 md:py-12">
                <div className="mb-10 flex items-end justify-between gap-6">
                    <div>
                        <h2 className="font-heading text-3xl font-black tracking-[-0.04em] text-gray-900 md:text-4xl">{t.home.popularTitle}</h2>
                        <p className="mt-2 text-stone-600">{t.home.popularSubtitle}</p>
                    </div>
                    <button className="glass-panel hidden rounded-full px-5 py-3 font-semibold text-emerald-700 md:block">{t.home.viewAll}</button>
                </div>

                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            whileHover={{ y: -7 }}
                            className="glass-panel-strong group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/60 p-4"
                        >
                            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#fff8ef_0%,#f9eddc_100%)] p-4">
                                <div className="absolute inset-x-8 top-6 h-20 rounded-full bg-amber-200/20 blur-2xl" />
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute left-3 top-3">
                                    <span className="rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-600">
                                        {product.weight}
                                    </span>
                                </div>
                                <button className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-white shadow-[0_14px_24px_rgba(31,157,104,0.24)] transition-transform duration-300 hover:scale-105">
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="mb-2 inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-800">
                                Hit
                            </div>
                            <h3 className="font-heading text-lg font-black text-gray-900">{product.name}</h3>
                            <div className="mt-auto pt-4 text-xl font-black text-gray-900">{product.price}</div>
                        </motion.div>
                    ))}
                </div>

                <button className="glass-panel mt-8 w-full rounded-[1.25rem] py-3 font-bold text-emerald-700 md:hidden">
                    {t.home.viewAll}
                </button>
            </div>
        </section>
    );
}
