"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Package } from "lucide-react";
import { useOrder } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { t } from "@/lib/i18n";

export default function OrdersPage() {
    const router = useRouter();
    const { orders } = useOrder();
    const { isAuthenticated, isInitialized } = useAuth();

    const formatPrice = (price) => {
        return (
            new Intl.NumberFormat("ru-RU", {
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(Math.round(price)).replace(/\u00A0/g, " ") + " ₸"
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, isInitialized, router]);

    if (!isInitialized || !isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#050505] px-4 pb-20 pt-24 md:px-6">
            <div className="container mx-auto max-w-4xl">
                <h1 className="mb-8 text-3xl font-extrabold text-white md:text-5xl">{t.orders.title}</h1>

                {orders.length === 0 ? (
                    <div className="rounded-3xl border border-white/5 bg-[#0a0a0a] py-20 text-center">
                        <Package size={64} className="mx-auto mb-6 text-gray-700" />
                        <h2 className="mb-4 text-2xl font-bold text-white">{t.orders.emptyTitle}</h2>
                        <p className="mb-8 text-gray-500">{t.orders.emptyDesc}</p>
                        <Link href="/catalog">
                            <div className="inline-block cursor-pointer rounded-xl bg-neon-blue px-8 py-3 font-bold text-black shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-colors hover:bg-white">
                                {t.profile.toCatalog}
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="group rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 transition-all hover:border-neon-blue/30"
                            >
                                <div className="mb-4 flex flex-col justify-between gap-4 border-b border-white/5 pb-4 md:flex-row md:items-center">
                                    <div>
                                        <div className="mb-1 flex items-center gap-3">
                                            <span className="font-mono text-lg font-bold text-neon-blue">{order.id}</span>
                                            <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-bold uppercase text-green-500">
                                                {t.orders.status[order.status?.toLowerCase()] || order.status || t.orders.status.completed}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar size={14} />
                                            {formatDate(order.date)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white">{formatPrice(order.totalPrice)}</div>
                                        <div className="text-sm text-gray-400">
                                            {order.items.length} {t.orders.itemsCount}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                                    {order.items.slice(0, 5).map((item, index) => (
                                        <div key={`${item.id || item.name}-${index}`} className="relative h-16 w-16 shrink-0 rounded-lg bg-white p-1">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                                            <span className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-600 bg-gray-800 text-[10px] text-white">
                                                {item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                    {order.items.length > 5 && (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-gray-400">
                                            +{order.items.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
