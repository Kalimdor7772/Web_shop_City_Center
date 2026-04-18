"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Apple, Beef, Carrot, Coffee, Croissant, Fish, IceCream, Milk } from "lucide-react";
import { t } from "@/lib/i18n";

const categories = [
    { id: 1, name: t.home.cat.produce, icon: <Apple />, accent: "from-emerald-200/70 to-lime-100", textColor: "text-emerald-800", href: "/catalog?category=Овощи и фрукты" },
    { id: 2, name: t.home.cat.bakery, icon: <Croissant />, accent: "from-amber-200/80 to-orange-100", textColor: "text-amber-800", href: "/catalog?category=Выпечка" },
    { id: 3, name: t.home.cat.dairy, icon: <Milk />, accent: "from-sky-200/80 to-cyan-100", textColor: "text-sky-800", href: "/catalog?category=Молочные продукты" },
    { id: 4, name: t.home.cat.meat, icon: <Beef />, accent: "from-rose-200/80 to-orange-100", textColor: "text-rose-800", href: "/catalog?category=Мясо и рыба" },
    { id: 5, name: t.home.cat.seafood, icon: <Fish />, accent: "from-indigo-200/80 to-sky-100", textColor: "text-indigo-800", href: "/catalog?category=Мясо и рыба" },
    { id: 6, name: t.home.cat.grocery, icon: <Carrot />, accent: "from-orange-200/80 to-yellow-100", textColor: "text-orange-800", href: "/catalog?category=Бакалея" },
    { id: 7, name: t.home.cat.coffee, icon: <Coffee />, accent: "from-stone-200/80 to-amber-100", textColor: "text-stone-800", href: "/catalog?category=Напитки" },
    { id: 8, name: t.home.cat.sweets, icon: <IceCream />, accent: "from-pink-200/80 to-rose-100", textColor: "text-pink-800", href: "/catalog?category=Кондитерские изделия" },
];

export default function CategoriesSection() {
    return (
        <section className="organic-section px-3 py-10 md:px-5">
            <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-6 py-10 md:px-8 md:py-12">
                <div className="mb-12 text-center">
                    <h2 className="font-heading text-4xl font-black tracking-[-0.04em] text-gray-900 md:text-5xl">{t.home.categoriesTitle}</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-stone-600">{t.home.categoriesSubtitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
                    {categories.map((cat, index) => (
                        <Link key={cat.id} href={cat.href} className="group">
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
