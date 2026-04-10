"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { Heart, ShoppingBag, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    if (wishlistItems.length === 0) {
        return (
            <main className="organic-section min-h-screen px-4 pt-24">
                <div className="mx-auto max-w-xl text-center">
                    <div className="section-shell rounded-[3rem] p-12">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/50">
                            <Heart size={48} className="text-stone-400" />
                        </div>
                        <h1 className="mb-4 text-3xl font-black text-gray-900">{t.wishlist.emptyTitle}</h1>
                        <p className="mx-auto mb-8 max-w-sm text-stone-600">{t.wishlist.emptyDesc}</p>
                        <Link href="/catalog" className="inline-flex items-center gap-2 rounded-[1.4rem] bg-emerald-700 px-8 py-3 text-white shadow-[0_18px_30px_rgba(31,157,104,0.24)] transition-all hover:-translate-y-0.5 hover:bg-emerald-800">
                            <ShoppingBag size={20} />
                            {t.wishlist.goToCatalog}
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pb-20 pt-24">
            <section className="organic-section px-3 py-8 md:px-5">
                <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-4 py-8 md:px-6 md:py-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 md:text-5xl">
                            {t.wishlist.title} <span className="ml-2 align-top text-2xl text-emerald-700 md:text-4xl">{wishlistItems.length}</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {wishlistItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                layout
                                className="glass-panel-strong group overflow-hidden rounded-[2rem] shadow-lg transition-all"
                            >
                                <div className="relative aspect-square bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,238,223,0.86))] p-6">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute left-3 top-3">
                                        <span className="rounded-full border border-white/60 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-600">
                                            {item.weight}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <Link href="/catalog" className="mb-2 block">
                                        <h3 className="truncate text-lg font-black text-gray-900 transition-colors hover:text-emerald-700">{item.name}</h3>
                                    </Link>
                                    <p className="mb-4 text-sm text-stone-500">{item.category}</p>

                                    <div className="mb-6 flex items-end justify-between">
                                        <span className="text-2xl font-black tracking-tight text-gray-900">{formatPrice(item.price)}</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                addToCart(item);
                                                showToast(t.wishlist.addedToCart, { label: t.wishlist.addToCart, href: "/cart" });
                                            }}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 font-black text-white transition-colors hover:bg-emerald-800"
                                        >
                                            <ShoppingCart size={18} />
                                            {t.wishlist.addToCart}
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/60 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                            title={t.wishlist.delete}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
