"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useOrder } from "../../context/OrderContext";
import { CheckCircle, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { t } from "@/lib/i18n";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const { orders } = useOrder();
    const orderId = searchParams.get("id");
    const order = useMemo(() => (orderId ? orders.find((item) => item.id === orderId) ?? null : null), [orderId, orders]);

    if (!orderId) {
        return <div className="organic-section flex min-h-screen items-center justify-center px-4 pt-24 text-gray-900">{t.success.notFound}</div>;
    }

    if (!order) {
        return <div className="organic-section flex min-h-screen items-center justify-center px-4 pt-24 text-emerald-700">{t.success.loading}</div>;
    }

    return (
        <main className="min-h-screen pb-20 pt-24">
            <section className="organic-section px-3 py-8 md:px-5">
                <div className="mx-auto max-w-2xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-shell rounded-[3rem] p-8 text-center md:p-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100"
                        >
                            <CheckCircle size={48} className="text-emerald-700" />
                        </motion.div>

                        <h1 className="mb-2 text-3xl font-black text-gray-900 md:text-4xl">{t.success.title}</h1>
                        <p className="mb-8 font-medium text-stone-600">
                            {t.success.subtitle} <span className="font-mono font-bold text-gray-900">{order.id}</span> {t.success.placed}
                        </p>

                        <div className="glass-panel-strong mb-8 rounded-[2rem] p-6 text-left">
                            <h3 className="mb-4 border-b border-white/70 pb-2 font-bold text-gray-900">{t.success.summary}</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <span className="text-stone-500">{t.success.customer}</span>
                                    <span className="font-medium text-gray-900">{order.customer?.name || "-"}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-stone-500">{t.success.method}</span>
                                    <span className="font-medium text-gray-900">{t.success.courier}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-stone-500">{t.success.address}</span>
                                    <span className="max-w-[220px] text-right font-medium text-gray-900">
                                        {order.address ? `${order.address.city}, ${order.address.street}, ${order.address.house}` : order.delivery?.address || "-"}
                                    </span>
                                </div>
                                <div className="mt-2 flex justify-between border-t border-white/70 pt-3">
                                    <span className="text-base font-bold text-gray-900">{t.success.total}</span>
                                    <span className="text-lg font-extrabold text-emerald-700">{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 md:flex-row">
                            <Link href="/catalog" className="inline-flex items-center justify-center gap-2 rounded-[1.4rem] bg-emerald-700 px-8 py-3.5 font-black text-white shadow-[0_18px_30px_rgba(31,157,104,0.24)] transition-all hover:-translate-y-0.5 hover:bg-emerald-800">
                                <ShoppingBag size={20} />
                                {t.success.continue}
                            </Link>
                            <Link href="/profile" className="glass-panel inline-flex items-center justify-center gap-2 rounded-[1.4rem] px-8 py-3.5 font-black text-gray-900 transition-all hover:bg-white/80">
                                <User size={20} />
                                {t.success.profile}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="organic-section flex min-h-screen items-center justify-center px-4 pt-24 text-emerald-700">Загрузка...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
