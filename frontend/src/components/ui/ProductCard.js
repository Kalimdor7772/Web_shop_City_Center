"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import { motion } from "framer-motion";
import { Heart, Plus, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { getProductWeightLabel } from "@/lib/product";

const ProductCard = ({ product, onClick }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { showToast } = useToast();

    if (!product) return null;

    const weightLabel = getProductWeightLabel(product) || "Вес уточняется";

    const handleAddToCart = (event) => {
        event.stopPropagation();
        addToCart(product);
        showToast("Товар добавлен в корзину", { label: "В корзину", href: "/cart" });
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
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className="group h-full cursor-pointer"
        >
            <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50 p-6">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="block h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />

                    <div className="absolute left-3 top-3 z-20">
                        <span className="rounded-lg border border-gray-100 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-700 shadow-sm backdrop-blur">
                            {weightLabel}
                        </span>
                    </div>

                    <div className="absolute right-3 top-3 z-20 translate-x-10 transition-transform duration-300 group-hover:translate-x-0">
                        <button
                            onClick={handleToggleWishlist}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 shadow-md transition-colors ${
                                isInWishlist(product.id)
                                    ? "border-red-500 bg-red-500 text-white"
                                    : "bg-white text-gray-400 hover:bg-red-50 hover:text-red-500"
                            }`}
                        >
                            <Heart size={18} className={isInWishlist(product.id) ? "fill-current" : ""} />
                        </button>
                    </div>
                </div>

                <div className="relative flex flex-grow flex-col p-5">
                    <div className="mb-2 flex items-center gap-1.5">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-gray-700">{product.rating || "4.5"}</span>
                        {product.brand && (
                            <span className="ml-auto max-w-[100px] truncate rounded-md border border-gray-100 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-400">
                                {product.brand}
                            </span>
                        )}
                    </div>

                    <h3 className="mb-1 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-green-600">
                        {product.name}
                    </h3>
                    <p className="mb-4 text-xs text-gray-400">{product.category}</p>

                    <div className="mt-auto flex items-end justify-between gap-2">
                        <div className="flex flex-col">
                            <span className="mb-0.5 text-xs text-gray-400 line-through">
                                {formatPrice((product.price || 0) * 1.2)}
                            </span>
                            <span className="text-xl font-extrabold tracking-tight text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="flex h-11 items-center gap-2 rounded-xl bg-green-50 px-4 text-sm font-bold text-green-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-600 hover:text-white hover:shadow-lg"
                        >
                            <span className="hidden sm:inline">В корзину</span>
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
