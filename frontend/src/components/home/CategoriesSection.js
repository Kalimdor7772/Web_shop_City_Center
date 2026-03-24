"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Apple, Croissant, Milk, Beef, Fish, Carrot, Coffee, IceCream } from "lucide-react";
import { t } from "@/lib/i18n";

const categories = [
    { id: 1, name: t.home.cat.produce, icon: <Apple />, color: "bg-green-100", textColor: "text-green-700", href: "/catalog/vegetables" },
    { id: 2, name: t.home.cat.bakery, icon: <Croissant />, color: "bg-yellow-100", textColor: "text-yellow-700", href: "/catalog/bakery" },
    { id: 3, name: t.home.cat.dairy, icon: <Milk />, color: "bg-blue-100", textColor: "text-blue-700", href: "/catalog/dairy" },
    { id: 4, name: t.home.cat.meat, icon: <Beef />, color: "bg-red-100", textColor: "text-red-700", href: "/catalog/meat" },
    { id: 5, name: t.home.cat.seafood, icon: <Fish />, color: "bg-indigo-100", textColor: "text-indigo-700", href: "/catalog/fish" },
    { id: 6, name: t.home.cat.grocery, icon: <Carrot />, color: "bg-orange-100", textColor: "text-orange-700", href: "/catalog/grocery" },
    { id: 7, name: t.home.cat.coffee, icon: <Coffee />, color: "bg-amber-100", textColor: "text-amber-700", href: "/catalog/coffee" },
    { id: 8, name: t.home.cat.sweets, icon: <IceCream />, color: "bg-pink-100", textColor: "text-pink-700", href: "/catalog/sweets" },
];

const CategoriesSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4 tracking-tight">{t.home.categoriesTitle}</h2>
                    <p className="text-gray-500 text-lg font-medium">{t.home.categoriesSubtitle}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {categories.map((cat, index) => (
                        <Link key={cat.id} href={cat.href} className="group">
                            <motion.div
                                whileHover={{ y: -10, rotateX: 5 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`h-48 ${cat.color} rounded-[2rem] p-6 flex flex-col items-center justify-center gap-5 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 border border-white/50 relative overflow-hidden`}
                            >
                                {/* Decorative circle */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl transition-all group-hover:scale-150 duration-500" />

                                <div className={`p-4 bg-white/80 rounded-2xl ${cat.textColor} backdrop-blur-md shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    {React.cloneElement(cat.icon, { size: 36, strokeWidth: 2 })}
                                </div>
                                <span className={`font-bold text-xl text-center ${cat.textColor} relative z-10 font-heading`}>
                                    {cat.name}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
