"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { t } from "@/lib/i18n";

// Mock Data
const products = [
    { id: 1, name: "Авокадо Хасс", price: "2 400 ₸", weight: "2 шт", image: "https://images.unsplash.com/photo-1523049673856-4286896d659f?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Молоко 3.2%", price: "450 ₸", weight: "1 л", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Хлеб Бородинский", price: "180 ₸", weight: "400 г", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Бананы", price: "890 ₸", weight: "1 кг", image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=400" },
];

const FeaturedProducts = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-2">{t.home.popularTitle}</h2>
                        <p className="text-gray-500">{t.home.popularSubtitle}</p>
                    </div>
                    <button className="text-green-600 font-semibold hover:underline hidden md:block">{t.home.viewAll}</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="h-full">
                            {/* Note: In a real app, we'd pass proper handlers or context */}
                            {/* Since this is a partial mock, we'll maintain the visual integrity */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden h-full flex flex-col items-start border border-gray-100"
                            >
                                <div className="relative h-48 w-full mb-4 rounded-2xl overflow-hidden bg-gray-50 p-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold text-gray-700 rounded-lg uppercase border border-gray-100">{product.weight}</span>
                                    </div>
                                    <button className="absolute bottom-3 right-3 bg-white p-2.5 rounded-full shadow-md text-green-600 hover:bg-green-600 hover:text-white transition-colors">
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block bg-gray-100 px-2 py-0.5 rounded">Hit</span>
                                </div>
                                <h3 className="font-bold font-heading text-lg text-gray-900 mb-1 leading-tight">{product.name}</h3>

                                <div className="mt-auto pt-2 w-full flex items-center justify-between">
                                    <div className="font-extrabold text-xl text-gray-900">{product.price}</div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-8 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 md:hidden hover:bg-gray-100 transition-colors">
                    {t.home.viewAll}
                </button>
            </div>
        </section>
    );
};

export default FeaturedProducts;
