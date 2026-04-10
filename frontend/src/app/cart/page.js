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
        if (typeof item.manufacturer === "string" && item.manufacturer) return item.manufacturer;
        if (item.manufacturer?.name) return item.manufacturer.name;
        return item.brand || "Local Farmer";
    };

    if (cartItems.length === 0) {
        return (
            <main className="organic-section flex min-h-screen items-center justify-center px-4 pt-24">
                <div className="section-shell max-w-xl rounded-[3rem] px-8 py-12 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/70 shadow-md">
                        <CartIcon size={40} className="text-stone-400" />
                    </div>
                    <h1 className="mb-2 text-3xl font-black text-gray-900">{t.cart.emptyTitle}</h1>
                    <p className="mb-8 text-stone-600">{t.cart.emptyDesc}</p>
                    <Link
                        href="/catalog"
                        className="inline-flex rounded-[1.4rem] bg-emerald-700 px-8 py-3.5 font-black text-white shadow-[0_18px_30px_rgba(31,157,104,0.24)] transition-all hover:-translate-y-0.5 hover:bg-emerald-800"
                    >
                        {t.cart.goToCatalog}
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pb-20 pt-24">
            <section className="organic-section px-3 py-8 md:px-5">
                <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-4 py-8 md:px-6 md:py-10">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/catalog" className="glass-panel rounded-xl p-2.5 text-gray-600 transition-all hover:bg-white/80 hover:text-gray-900">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-black leading-tight text-gray-900 md:text-4xl">{t.cart.title}</h1>
                                <p className="text-sm text-stone-500">{t.cart.itemsCount} {totalItems}</p>
                            </div>
                        </div>

                        <button onClick={handleClearCart} className="text-sm font-medium text-red-500 transition-all hover:text-red-600 hover:underline">
                            {t.cart.clearCart}
                        </button>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="space-y-4 lg:col-span-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="glass-panel-strong group flex items-center gap-4 rounded-[2rem] p-4 transition-all hover:shadow-lg md:gap-8 md:p-6">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,238,223,0.86))] p-2 md:h-28 md:w-28">
                                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                                    </div>

                                    <div className="min-w-0 flex-grow">
                                        <div className="mb-1 flex items-start justify-between">
                                            <h3 className="truncate pr-4 text-lg font-black leading-tight text-gray-900 transition-colors group-hover:text-emerald-700 md:text-xl">
                                                {item.name}
                                            </h3>
                                        </div>
                                        <div className="mb-4 flex items-center gap-2">
                                            <span className="rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-xs font-bold text-stone-600">
                                                {getBrandLabel(item)}
                                            </span>
                                            {getProductWeightLabel(item) && <span className="text-xs text-stone-400">{getProductWeightLabel(item)}</span>}
                                        </div>

                                        <div className="flex flex-wrap items-end justify-between gap-4">
                                            <div className="flex items-center rounded-xl bg-white/80 p-1">
                                                <button
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    disabled={item.quantity <= 1}
                                                    className={`rounded-lg p-2 transition-all ${
                                                        item.quantity <= 1 ? "cursor-not-allowed text-gray-300" : "text-gray-600 hover:bg-white hover:text-gray-900"
                                                    }`}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-10 text-center text-base font-bold text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => increaseQuantity(item.id)}
                                                    className="rounded-lg p-2 text-gray-600 transition-all hover:bg-white hover:text-gray-900"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xl font-black tracking-tight text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                                {item.quantity > 1 && <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">{formatPrice(item.price)} / шт.</p>}
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
                            <div className="section-shell sticky top-24 overflow-hidden rounded-[2.5rem] p-8">
                                <h2 className="mb-8 text-2xl font-black text-gray-900">{t.cart.summary}</h2>

                                <div className="mb-8 space-y-4">
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>{t.cart.items} ({totalItems})</span>
                                        <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>{t.cart.discount}</span>
                                        <span className="font-medium text-amber-600">- 0 ₸</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>{t.cart.delivery}</span>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{t.cart.free}</span>
                                    </div>
                                </div>

                                <div className="mb-8 border-t border-white/70 pt-6">
                                    <div className="flex items-end justify-between">
                                        <span className="pb-1 font-bold text-gray-900">{t.cart.total}</span>
                                        <span className="text-3xl font-black tracking-tight text-gray-900">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push("/checkout")}
                                    className="w-full rounded-[1.5rem] bg-emerald-700 py-4 font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_rgba(31,157,104,0.24)] transition-all hover:-translate-y-0.5 hover:bg-emerald-800"
                                >
                                    {t.cart.checkout}
                                </button>

                                <button
                                    onClick={() => router.push("/nutrition")}
                                    className="glass-panel mt-3 w-full rounded-[1.5rem] py-4 font-black uppercase tracking-[0.18em] text-gray-900 transition-all hover:bg-white/80"
                                >
                                    КБЖУ корзины
                                </button>

                                <p className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    {t.cart.secure}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
