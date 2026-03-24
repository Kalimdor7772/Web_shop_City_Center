"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    CreditCard,
    MapPin,
    Package,
    ShoppingBag,
    Truck,
    User,
} from "lucide-react";
import { useOrder } from "../../../context/OrderContext";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { t } from "@/lib/i18n";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { getOrderById } = useOrder();
    const { isAuthenticated, isInitialized } = useAuth();
    const { addToCart } = useCart();

    const orderId = decodeURIComponent(params.id);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push("/login");
            return;
        }

        if (isInitialized) {
            const loadOrder = async () => {
                const foundOrder = await getOrderById(orderId);
                setOrder(foundOrder ?? null);
                setLoading(false);
            };

            void loadOrder();
        }
    }, [getOrderById, isAuthenticated, isInitialized, orderId, router]);

    const formatPrice = (price) => new Intl.NumberFormat("ru-RU").format(Math.round(price)) + " ₸";

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="h-12 w-12 rounded-full border-4 border-green-100 border-t-green-600"
                />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-6">
                <div className="w-full max-w-lg rounded-[4rem] border border-white bg-white/60 p-16 text-center shadow-xl backdrop-blur-3xl">
                    <Package size={64} className="mx-auto mb-6 text-gray-200" />
                    <h1 className="mb-2 text-3xl font-black text-gray-900">{t.orders.detail.notFound}</h1>
                    <p className="mb-10 font-medium text-gray-500">{t.orders.detail.notFoundDesc}</p>
                    <Link href="/profile">
                        <button className="w-full rounded-2xl bg-gray-900 py-5 font-black text-white transition-all hover:bg-black">
                            {t.orders.detail.toProfile}
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const isDelivered = order.status === "DELIVERED" || order.status === "Доставлен";
    const isPaid = order.payment === "kaspi" || order.paymentMethod === "kaspi";
    const itemCountLabel = order.items.length === 1 ? "товар" : order.items.length < 5 ? "товара" : "товаров";

    const steps = [
        { label: t.orders.detail.timeline.accepted, icon: CheckCircle2, status: "completed" },
        { label: t.orders.detail.timeline.packing, icon: Package, status: isDelivered ? "completed" : "active" },
        { label: t.orders.detail.timeline.shipping, icon: Truck, status: isDelivered ? "completed" : "pending" },
        { label: t.orders.detail.timeline.delivered, icon: ShoppingBag, status: isDelivered ? "completed" : "pending" },
    ];

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#F8F9FA] px-4 pb-24 pt-32 sm:px-8">
            <div className="absolute left-0 top-0 -ml-64 -mt-64 h-[600px] w-[600px] rounded-full bg-green-500/5 blur-[120px]" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div>
                        <Link
                            href="/profile"
                            className="group mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 transition-all hover:text-gray-900"
                        >
                            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                            {t.orders.detail.back}
                        </Link>
                        <h1 className="flex items-center gap-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                            {t.orders.detail.title} {order.id}
                        </h1>
                        <p className="mt-2 flex items-center gap-2 font-bold text-gray-400">
                            <Clock size={16} />
                            {t.orders.placed} {formatDate(order.date)}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span
                            className={`rounded-2xl border px-4 py-2 text-xs font-black uppercase tracking-widest ${
                                isDelivered
                                    ? "border-green-100 bg-green-50 text-green-600"
                                    : "border-yellow-100 bg-yellow-50 text-yellow-600"
                            }`}
                        >
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="mb-12 rounded-[3rem] border border-white bg-white/60 p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] backdrop-blur-3xl">
                    <div className="relative mx-auto flex max-w-4xl items-center justify-between px-4">
                        <div className="absolute left-12 right-12 top-7 -z-10 h-1 overflow-hidden rounded-full bg-gray-100">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: isDelivered ? "100%" : "33%" }}
                                className="h-full bg-green-500"
                            />
                        </div>

                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center gap-4">
                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border-4 transition-all duration-500 ${
                                        step.status === "completed"
                                            ? "border-green-100 bg-green-500 text-white shadow-lg shadow-green-500/20"
                                            : step.status === "active"
                                                ? "border-green-500 bg-white text-green-600 shadow-xl"
                                                : "border-gray-50 bg-white text-gray-200"
                                    }`}
                                >
                                    <step.icon size={24} />
                                </div>
                                <span
                                    className={`text-[10px] font-black uppercase tracking-widest ${
                                        step.status === "pending" ? "text-gray-300" : "text-gray-900"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <div className="overflow-hidden rounded-[3rem] border border-white bg-white/60 shadow-sm backdrop-blur-3xl">
                            <div className="flex items-center justify-between border-b border-gray-50/50 p-10">
                                <h3 className="flex items-center gap-3 text-2xl font-black text-gray-900">
                                    <ShoppingBag size={24} className="text-green-500" />
                                    {t.orders.detail.items}
                                </h3>
                                <span className="text-sm font-bold text-gray-400">
                                    {order.items.length} {itemCountLabel}
                                </span>
                            </div>
                            <div className="space-y-8 p-10">
                                {order.items.map((item, index) => (
                                    <div key={index} className="group flex items-center gap-8">
                                        <div className="h-24 w-24 shrink-0 rounded-[2.5rem] border border-gray-100 bg-gray-50 p-4 transition-transform group-hover:scale-105">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate text-lg font-black text-gray-900">{item.name}</h4>
                                            <p className="text-sm font-bold text-gray-400">{item.weight || "1 шт"}</p>
                                            <p className="mt-2 inline-flex rounded-xl border border-gray-100 px-3 py-1 text-xs font-black text-gray-500">
                                                {formatPrice(item.price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4 border-t border-gray-100 bg-gray-50/50 p-10">
                                <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-gray-400">
                                    <span>{t.orders.detail.summary}</span>
                                    <span className="text-gray-900">{formatPrice(order.totalPrice)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-gray-400">
                                    <span>{t.cart.delivery}</span>
                                    <span className="text-green-600">{t.cart.free}</span>
                                </div>
                                <div className="my-4 h-px bg-gray-200" />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">{t.orders.detail.totalPay}</span>
                                    <span className="text-4xl font-black text-gray-900">{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-10 rounded-[3rem] border border-white bg-white/60 p-10 shadow-sm backdrop-blur-3xl">
                            <section>
                                <h4 className="mb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {t.orders.detail.delivery}
                                </h4>
                                <div className="flex gap-4">
                                    <div className="h-fit rounded-2xl bg-green-50 p-4 text-green-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-lg font-black text-gray-900">{order.address?.city || "-"}</p>
                                        <p className="text-sm font-medium leading-relaxed text-gray-500">
                                            {order.address ? `${order.address.street}, ${order.address.house}` : t.orders.detail.notFoundDesc}
                                        </p>
                                    </div>
                                </div>
                                {order.comment && (
                                    <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">{t.forms.comment}</p>
                                        <p className="text-sm font-medium italic text-gray-600">&quot;{order.comment}&quot;</p>
                                    </div>
                                )}
                            </section>

                            <div className="h-px bg-gray-100" />

                            <section>
                                <h4 className="mb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {t.orders.detail.client}
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="rounded-2xl bg-gray-50 p-4 text-gray-400">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">{order.customer?.name || "-"}</p>
                                        <p className="text-sm font-bold text-gray-400">{order.customer?.phone || ""}</p>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-gray-100" />

                            <section>
                                <h4 className="mb-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {t.orders.detail.payment}
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="rounded-2xl bg-gray-50 p-4 text-gray-400">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">
                                            {isPaid ? "Kaspi.kz (QR)" : order.payment || order.paymentMethod || t.checkout.cash}
                                        </p>
                                        <p className="text-xs font-bold text-green-600">{t.status.paid}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <button
                            onClick={() => {
                                order.items.forEach((item) => addToCart(item));
                                router.push("/cart");
                            }}
                            className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-gray-900 p-6 text-lg font-black text-white shadow-2xl transition-all hover:bg-black active:scale-[0.98]"
                        >
                            <ShoppingBag size={20} />
                            {t.orders.detail.repeat}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
