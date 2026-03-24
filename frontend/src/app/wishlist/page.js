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

    // Empty State
    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-xl text-center">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Heart size={48} className="text-gray-500" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-4">{t.wishlist.emptyTitle}</h1>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t.wishlist.emptyDesc}</p>
                    <Link href="/catalog">
                        <div className="inline-flex items-center gap-2 px-8 py-3 bg-neon-blue text-black font-bold rounded-xl hover:bg-white transition-colors cursor-pointer group">
                            <ShoppingBag size={20} />
                            {t.wishlist.goToCatalog}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-4 md:px-6">
            <div className="container mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">
                        {t.wishlist.title} <span className="text-neon-purple text-2xl md:text-4xl align-top ml-2">{wishlistItems.length}</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            layout
                            className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-lg group hover:border-white/20 transition-all"
                        >
                            <div className="relative aspect-square bg-white p-6">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-1 bg-black/80 backdrop-blur text-[10px] font-bold text-white rounded uppercase tracking-wide">
                                        {item.weight}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <Link href="/catalog" className="block mb-2">
                                    <h3 className="text-lg font-bold text-white truncate hover:text-neon-blue transition-colors">{item.name}</h3>
                                </Link>
                                <p className="text-sm text-gray-500 mb-4">{item.category}</p>

                                <div className="flex items-end justify-between mb-6">
                                    <span className="text-2xl font-bold text-white tracking-tight">{formatPrice(item.price)}</span>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            addToCart(item);
                                            showToast(t.wishlist.addedToCart, { label: t.wishlist.addToCart, href: "/cart" });
                                        }}
                                        className="flex-1 bg-neon-blue text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={18} />
                                        {t.wishlist.addToCart}
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors border border-white/10 hover:border-red-500/30"
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
        </div>
    );
}
