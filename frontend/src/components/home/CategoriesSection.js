"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Apple, Beef, Carrot, Coffee, Croissant, Fish, IceCream, Milk } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { HOME_CATEGORY_CONFIG } from "@/lib/catalog";

const CATEGORY_ICONS = {
    produce: Apple,
    bakery: Croissant,
    dairy: Milk,
    meat: Beef,
    seafood: Fish,
    grocery: Carrot,
    coffee: Coffee,
    sweets: IceCream,
};

export default function CategoriesSection() {
    const t = useTranslation();
    const categories = HOME_CATEGORY_CONFIG.map((item) => {
        const Icon = CATEGORY_ICONS[item.translationKey];

        return {
            ...item,
            name: t.home?.cat?.[item.translationKey],
            icon: <Icon />,
        };
    });

    return (
        <section className="organic-section px-3 py-10 md:px-5">
            <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-6 py-10 md:px-8 md:py-12">
                <div className="mb-12 text-center">
                    <h2 className="font-heading text-4xl font-black tracking-[-0.04em] text-gray-900 md:text-5xl">{t.home?.categoriesTitle}</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-stone-600">{t.home?.categoriesSubtitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            href={{ pathname: "/catalog", query: { category: cat.category, ...(cat.subcategory ? { subcategory: cat.subcategory } : {}) } }}
                            className="group"
                            aria-label={`${cat.name} - ${cat.subcategory || cat.category}`}
                        >
                            <motion.div
                                whileHover={{ y: -10, rotateX: 4, rotateY: -4 }}
                                whileTap={{ scale: 0.97 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`relative flex h-48 cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-[2rem] border border-white/50 bg-gradient-to-br ${cat.accent} p-6 shadow-[0_18px_44px_rgba(122,92,47,0.12)]`}
                            >
                                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl transition-all duration-500 group-hover:scale-150" />
                                <div className={`rounded-[1.5rem] bg-white/80 p-4 shadow-md backdrop-blur ${cat.textColor}`}>
                                    {React.cloneElement(cat.icon, { size: 34, strokeWidth: 2 })}
                                </div>
                                <span className={`relative z-10 text-center font-heading text-xl font-black ${cat.textColor}`}>
                                    {cat.name}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
