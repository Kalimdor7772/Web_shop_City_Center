"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gift, ShoppingCart, TrendingUp, Zap } from "lucide-react";
import { products } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { getProductWeightLabel } from "@/lib/product";

function SectionHeader({ title, icon: Icon, colorClass }) {
    return (
        <div className="mb-8 flex items-center gap-3">
            <div className={`rounded-2xl p-3 ${colorClass} bg-opacity-10`}>
                <Icon className={colorClass.replace("bg-", "text-")} size={28} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">{title}</h2>
        </div>
    );
}

function PromoCard({ product, onAddToCart }) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-2xl"
        >
            <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
                <span className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    product.badgeType === "hot"
                        ? "border-red-400 bg-red-500 text-white"
                        : product.badgeType === "hit"
                            ? "border-yellow-300 bg-yellow-400 text-black"
                            : "border-green-500 bg-green-600 text-white"
                }`}>
                    {product.badge}
                </span>
            </div>

            <div className="relative mb-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gray-50 p-8">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                />
            </div>

            <div className="flex flex-1 flex-col">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">{product.subcategory || product.category}</p>
                <h3 className="mb-4 line-clamp-2 text-lg font-black leading-tight text-gray-900 transition-colors group-hover:text-green-600">
                    {product.name}
                </h3>

                <div className="mt-auto">
                    <div className="mb-6 flex items-end gap-3">
                        <div className="flex flex-col">
                            {product.oldPrice && (
                                <span className="text-sm font-bold text-gray-400 line-through decoration-red-500/50">
                                    {formatPrice(product.oldPrice)}
                                </span>
                            )}
                            <span className="text-3xl font-black tracking-tight text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                        <span className="mb-1 text-xs font-bold text-gray-400">{getProductWeightLabel(product)}</span>
                    </div>

                    <button
                        onClick={() => onAddToCart(product)}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 py-4 text-sm font-black text-white transition-all active:scale-95 hover:bg-green-600 shadow-xl shadow-gray-200"
                    >
                        <ShoppingCart size={18} />
                        В корзину
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
                badge: "Хит",
                badgeType: "hit"
            }));

        const breakfastBundle = products
            .filter((product) => product.category === "Молочные продукты" || product.category === "Хлеб и выпечка")
            .slice(0, 2);

        return { hotDeals, meatDeals, popularDeals, breakfastBundle };
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        showToast("Товар добавлен в корзину", {
            label: "В корзину",
            href: "/cart"
        });
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#F8F9FA] px-4 pb-24 pt-32 sm:px-8">
            <div className="absolute right-0 top-0 h-[500px] w-[500px] -mr-64 -mt-64 rounded-full bg-red-500/5 blur-[100px]" />
            <div className="absolute bottom-1/2 left-0 h-[400px] w-[400px] -ml-64 rounded-full bg-yellow-500/5 blur-[100px]" />

            <div className="mx-auto max-w-7xl">
                <div className="relative mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-6 py-2 shadow-sm"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                        </span>
                        <span className="text-sm font-black uppercase tracking-widest text-gray-900">Горячие предложения</span>
                    </motion.div>
                    <h1 className="mb-6 text-5xl font-black tracking-tighter text-gray-900 md:text-7xl">
                        Акции и предложения
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg font-medium text-gray-500">
                        Лучшие цены недели, наборы со скидкой и выгодные предложения по популярным товарам.
                    </p>
                </div>

                <section className="mb-24">
                    <SectionHeader title="Горячие предложения" icon={Zap} colorClass="bg-red-500" />
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {promoData.hotDeals.map((product) => (
                            <PromoCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                </section>

                <section className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="group relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-green-600 to-emerald-800 p-12 text-white shadow-2xl shadow-green-600/20"
                    >
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <span className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">Flash Sale</span>
                                <h3 className="mb-4 text-4xl font-black leading-tight">Свежее мясо<br />со скидкой 20%</h3>
                                <p className="mb-10 max-w-xs font-medium text-white/80">Подборка мясных и рыбных товаров со сниженной ценой на этой неделе.</p>
                            </div>
                            <Link href="/catalog" className="flex w-fit items-center gap-3 font-black text-white transition-all hover:gap-5">
                                В каталог <ArrowRight size={20} />
                            </Link>
                        </div>
                        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:bg-white/20" />
                    </motion.div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            {promoData.meatDeals.slice(0, 2).map((product) => (
                                <PromoCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mb-24">
                    <SectionHeader title="Вместе дешевле" icon={Gift} colorClass="bg-purple-500" />
                    <div className="relative flex flex-col items-center gap-12 overflow-hidden rounded-[3.5rem] border border-gray-100 bg-white p-12 shadow-sm lg:flex-row">
                        <div className="relative z-10 flex-1 text-center lg:text-left">
                            <span className="mb-4 block text-sm font-black uppercase tracking-widest text-purple-600">Выгодный набор</span>
                            <h3 className="mb-6 text-4xl font-black leading-tight text-gray-900 md:text-5xl">Завтрак<br />для чемпиона</h3>
                            <p className="mb-10 max-w-md text-lg font-medium text-gray-500">Молочные продукты и выпечка в одной подборке по более приятной цене.</p>
                            <div className="flex justify-center gap-4 lg:justify-start">
                                <span className="text-4xl font-black text-gray-900 opacity-20 line-through">3 500 ₸</span>
                                <span className="text-4xl font-black text-green-600">2 900 ₸</span>
                            </div>
                        </div>
                        <div className="relative z-10 flex flex-1 gap-4">
                            {promoData.breakfastBundle.map((item, index) => (
                                <div key={index} className="flex h-40 w-40 items-center justify-center rounded-3xl border border-gray-100 bg-gray-50 p-6">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                                </div>
                            ))}
                        </div>
                        <div className="absolute right-0 top-0 hidden h-full w-1/2 rounded-l-[300px] bg-purple-50 lg:block" />
                    </div>
                </section>

                <section>
                    <SectionHeader title="Популярное со скидкой" icon={TrendingUp} colorClass="bg-blue-500" />
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {promoData.popularDeals.map((product) => (
                            <PromoCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                </section>

                <div className="relative mt-32 overflow-hidden rounded-[4rem] bg-gray-900 p-16 text-center text-white shadow-3xl">
                    <div className="relative z-10">
                        <h2 className="mb-8 text-4xl font-black md:text-6xl">Готовы наполнить холодильник?</h2>
                        <Link href="/catalog" className="inline-flex items-center gap-3 rounded-2xl bg-green-600 px-12 py-5 text-xl font-black transition-all hover:-translate-y-1 hover:bg-white hover:text-green-600">
                            Перейти в каталог <ArrowRight />
                        </Link>
                    </div>
                    <div className="absolute right-0 top-0 -mr-32 -mt-32 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
                </div>
            </div>
        </main>
    );
}
