"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingCart as CartIcon, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getProductWeightLabel } from "@/lib/product";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/i18n";

export default function CartPage() {
    const router = useRouter();
    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalPrice,
        totalItems,
    } = useCart();

    const handleClearCart = () => {
        if (window.confirm(t.cart.clearConfirm)) {
            clearCart();
        }
    };

    const getBrandLabel = (item) => {
        if (typeof item.manufacturer === "string" && item.manufacturer) {
            return item.manufacturer;
        }

        if (item.manufacturer?.name) {
            return item.manufacturer.name;
        }

        return item.brand || "Local Farmer";
    };

    const getWeightLabel = (item) => getProductWeightLabel(item);

    if (cartItems.length === 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md">
                    <CartIcon size={40} className="text-gray-400" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">{t.cart.emptyTitle}</h1>
                <p className="mb-8 max-w-md text-center text-gray-500">{t.cart.emptyDesc}</p>
                <Link
                    href="/catalog"
                    className="rounded-xl bg-[#00A082] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#00A082]/20 transition-all hover:bg-[#008f73] active:scale-95"
                >
                    {t.cart.goToCatalog}
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/catalog"
                            className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm transition-all hover:bg-gray-100 hover:text-gray-900"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{t.cart.title}</h1>
                            <p className="text-sm text-gray-500">
                                {t.cart.itemsCount} {totalItems}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleClearCart}
                        className="text-sm font-medium text-red-500 transition-all hover:text-red-600 hover:underline"
                    >
                        {t.cart.clearCart}
                    </button>
                </div>

                <div className="relative grid gap-8 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-lg md:gap-8 md:p-6"
                            >
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-2 md:h-28 md:w-28">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="min-w-0 flex-grow">
                                    <div className="mb-1 flex items-start justify-between">
                                        <h3 className="truncate pr-4 text-lg font-semibold leading-tight text-gray-900 transition-colors group-hover:text-[#00A082] md:text-xl">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                                            {getBrandLabel(item)}
                                        </span>
                                        {getWeightLabel(item) && (
                                            <span className="text-xs text-gray-400">{getWeightLabel(item)}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-end justify-between gap-4">
                                        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                disabled={item.quantity <= 1}
                                                className={`rounded-lg p-2 transition-all ${
                                                    item.quantity <= 1
                                                        ? "cursor-not-allowed text-gray-300"
                                                        : "text-gray-600 shadow-sm hover:bg-white hover:text-gray-900"
                                                }`}
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center text-base font-bold text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => increaseQuantity(item.id)}
                                                className="rounded-lg p-2 text-gray-600 shadow-sm transition-all hover:bg-white hover:text-gray-900"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-bold tracking-tight text-gray-900">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="mt-0.5 text-[10px] font-bold uppercase text-gray-500">
                                                    {formatPrice(item.price)} / шт.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="self-start rounded-xl p-3 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 md:self-center"
                                    aria-label="Remove item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
                            <h2 className="relative mb-8 text-2xl font-bold text-gray-900">{t.cart.summary}</h2>

                            <div className="relative mb-8 space-y-4">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>
                                        {t.cart.items} ({totalItems})
                                    </span>
                                    <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>{t.cart.discount}</span>
                                    <span className="font-medium text-[#FFC220]">- 0 ₸</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>{t.cart.delivery}</span>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#00A082]">{t.cart.free}</span>
                                </div>
                            </div>

                            <div className="relative mb-8 border-t border-gray-100 pt-6">
                                <div className="flex items-end justify-between">
                                    <span className="pb-1 font-bold text-gray-900">{t.cart.total}</span>
                                    <span className="text-3xl font-black tracking-tight text-gray-900">{formatPrice(totalPrice)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/checkout")}
                                className="group relative w-full overflow-hidden rounded-2xl bg-[#00A082] py-4 font-bold uppercase tracking-widest text-white shadow-lg shadow-[#00A082]/30 transition-all hover:bg-[#008f73] active:scale-[0.98]"
                            >
                                <span className="relative z-10">{t.cart.checkout}</span>
                            </button>

                            <button
                                onClick={() => router.push("/nutrition")}
                                className="mt-3 w-full rounded-2xl bg-gray-100 py-4 font-bold uppercase tracking-widest text-gray-900 transition-all hover:bg-gray-200 active:scale-[0.98]"
                            >
                                КБЖУ корзины
                            </button>

                            <p className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] font-bold uppercase text-gray-400">
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                {t.cart.secure}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
