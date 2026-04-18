"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { motion } from "framer-motion";
import { Heart, Plus, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { t } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { getProductWeightLabel } from "@/lib/product";

const ProductCard = ({ product, onClick, compact = false }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { showToast } = useToast();

    if (!product) return null;

    const weightLabel = getProductWeightLabel(product) || t.common.unknownWeight;

    const handleAddToCart = (event) => {
        event.stopPropagation();
        addToCart(product);
        showToast(t.common.addedToCart, { label: t.common.addToCart, href: "/cart" });
    };

    const handleToggleWishlist = (event) => {
        event.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.22 }}
            onClick={onClick}
            className="group h-full cursor-pointer"
        >
            <div className="glass-panel-strong relative flex h-full flex-col overflow-hidden rounded-[2.2rem] border border-white/60 transition-all duration-300 hover:shadow-[0_24px_60px_rgba(122,92,47,0.18)]">
                <div className={`relative w-full overflow-hidden bg-[linear-gradient(180deg,#fff8ef_0%,#f7ecd9_100%)] ${compact ? "aspect-[0.95]" : "aspect-[1.35]"} p-6`}>
                    <div className="absolute inset-x-6 top-5 h-24 rounded-full bg-amber-200/20 blur-2xl" />
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/30 to-transparent" />

                    <img
                        src={product.image}
                        alt={product.name}
                        className="block h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />

                    <div className="absolute left-3 top-3 z-20">
                        <span className="rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-600 shadow-sm backdrop-blur">
                            {weightLabel}
                        </span>
                    </div>

                    <div className="absolute right-3 top-3 z-20 translate-x-10 transition-transform duration-300 group-hover:translate-x-0">
                        <button
                            onClick={handleToggleWishlist}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/60 shadow-md transition-colors ${
                                isInWishlist(product.id)
                                    ? "border-red-500 bg-red-500 text-white"
                                    : "bg-white/90 text-gray-400 hover:bg-red-50 hover:text-red-500"
                            }`}
                        >
                            <Heart size={18} className={isInWishlist(product.id) ? "fill-current" : ""} />
                        </button>
                    </div>
                </div>

                <div className={`relative flex flex-grow flex-col ${compact ? "p-5" : "p-6 md:p-7"}`}>
                    <div className="mb-2 flex items-center gap-1.5">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-gray-700">{product.rating || "4.8"}</span>
                        {product.brand && (
                            <span className="ml-auto max-w-[110px] truncate rounded-full border border-amber-100 bg-white/70 px-2.5 py-1 text-[10px] font-medium text-stone-500">
                                {product.brand}
                            </span>
                        )}
                    </div>

                    <h3 className={`mb-1 line-clamp-2 font-black leading-snug text-gray-900 transition-colors group-hover:text-emerald-700 ${compact ? "text-base" : "text-xl md:text-2xl"}`}>
                        {product.name}
                    </h3>
                    <p className={`mb-4 uppercase tracking-[0.18em] text-stone-400 ${compact ? "text-xs" : "text-[11px]"}`}>{product.category}</p>

                    <div className="mt-auto flex items-end justify-between gap-2">
                        <div className="flex flex-col">
                            <span className="mb-0.5 text-xs text-gray-400 line-through">
                                {formatPrice((product.price || 0) * 1.2)}
                            </span>
                            <span className={`${compact ? "text-xl" : "text-2xl md:text-3xl"} font-extrabold tracking-tight text-gray-900`}>
                                {formatPrice(product.price)}
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="flex h-11 items-center gap-2 rounded-[1rem] bg-emerald-50 px-4 text-sm font-bold text-emerald-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:text-white hover:shadow-lg"
                        >
                            <span className="hidden sm:inline">{t.common.addToCart}</span>
                            <Plus size={20} className="sm:hidden" />
                            <ShoppingCart size={18} className="hidden sm:block" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
