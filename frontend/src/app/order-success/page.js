"use client";
import React, { useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useOrder } from "../../context/OrderContext";
import { CheckCircle, ShoppingBag, ArrowRight, Home, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { t } from "@/lib/i18n";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const { orders } = useOrder();
    const orderId = searchParams.get("id");
    const order = useMemo(() => {
        if (!orderId) return null;
        return orders.find((item) => item.id === orderId) ?? null;
    }, [orderId, orders]);

    if (!orderId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <p className="text-gray-900 font-medium">{t.success.notFound}</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="animate-pulse text-green-600 font-medium">{t.success.loading}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 md:px-6">
            <div className="container mx-auto max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 text-center shadow-xl shadow-gray-200/50"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle size={48} className="text-green-600" />
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 mb-2">
                        {t.success.title}
                    </h1>
                    <p className="text-gray-500 mb-8 font-medium">
                        {t.success.subtitle}<span className="text-gray-900 font-bold font-mono">{order.id}</span> {t.success.placed}
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100">
                        <h3 className="text-gray-900 font-bold mb-4 border-b border-gray-200 pb-2">{t.success.summary}</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.success.customer}</span>
                                <span className="text-gray-900 font-medium">{order.customer?.name || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.success.method}</span>
                                <span className="text-gray-900 font-medium">{t.success.courier}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.success.address}</span>
                                <span className="text-gray-900 text-right max-w-[200px] font-medium">
                                    {order.address
                                        ? `${order.address.city}, ${order.address.street}, ${order.address.house}`
                                        : (order.delivery?.address || "-")}
                                </span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-gray-200 mt-2">
                                <span className="text-gray-900 font-bold text-base">{t.success.total}</span>
                                <span className="text-green-600 font-extrabold text-lg">{formatPrice(order.totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link href="/catalog" className="px-8 py-3.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transform hover:-translate-y-0.5">
                            <ShoppingBag size={20} />
                            {t.success.continue}
                        </Link>
                        <Link href="/profile" className="px-8 py-3.5 rounded-xl bg-gray-100 text-gray-900 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <User size={20} />
                            {t.success.profile}
                        </Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"><div className="animate-pulse text-green-600 font-medium">Загрузка...</div></div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
