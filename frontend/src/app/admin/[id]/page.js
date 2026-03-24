"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Package, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import * as adminService from "../../../services/admin.service";

const STATUS_LABELS = {
    PENDING: "Новый",
    PROCESSING: "В обработке",
    SHIPPED: "Отправлен",
    DELIVERED: "Доставлен",
    CANCELLED: "Отменен",
};

const STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const getStatusStyle = (status) => {
    switch (status) {
        case "PENDING":
            return "text-yellow-700 bg-yellow-100 border-yellow-200";
        case "PROCESSING":
            return "text-blue-700 bg-blue-100 border-blue-200";
        case "SHIPPED":
            return "text-purple-700 bg-purple-100 border-purple-200";
        case "DELIVERED":
            return "text-green-700 bg-green-100 border-green-200";
        case "CANCELLED":
            return "text-red-700 bg-red-100 border-red-200";
        default:
            return "text-gray-600 bg-gray-100 border-gray-200";
    }
};

export default function AdminOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated, isInitialized } = useAuth();
    const { showToast } = useToast();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const orderId = decodeURIComponent(params.id);

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        if (user?.role !== "ADMIN") {
            router.replace("/profile");
            return;
        }

        const loadOrder = async () => {
            setIsLoading(true);
            try {
                const response = await adminService.getAdminOrderById(orderId);
                if (response.success) {
                    setOrder(response.data);
                } else {
                    setOrder(null);
                }
            } catch (error) {
                console.error("Failed to load admin order:", error);
                setOrder(null);
            } finally {
                setIsLoading(false);
            }
        };

        void loadOrder();
    }, [isAuthenticated, isInitialized, orderId, router, user?.role]);

    const totalItems = useMemo(
        () => order?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        [order]
    );

    const updateStatus = async (status) => {
        if (!order) return;

        setIsSaving(true);
        try {
            const response = await adminService.updateAdminOrderStatus(order.id, status);
            if (response.success) {
                setOrder(response.data);
                showToast("Статус заказа обновлен");
            }
        } catch (error) {
            console.error("Failed to update order status:", error);
            showToast("Не удалось обновить статус");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isInitialized || !isAuthenticated || user?.role !== "ADMIN") {
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 mb-4">Заказ не найден</p>
                    <Link href="/admin" className="text-green-600 hover:underline">Вернуться в админку</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pt-12 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                        Назад
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                                <div>
                                    <h1 className="text-3xl font-black font-heading tracking-tight mb-2 text-gray-900">
                                        Заказ <span className="text-green-600 font-mono">{order.id}</span>
                                    </h1>
                                    <div className="text-gray-400 text-sm">
                                        {new Date(order.date).toLocaleString("ru-RU")}
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-xl border text-sm font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                    {STATUS_LABELS[order.status] || order.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 uppercase font-bold">Клиент</label>
                                    <p className="font-bold text-gray-900">{order.customer?.name || order.user?.email || "Без имени"}</p>
                                    <p className="text-sm text-gray-500">{order.customer?.phone || order.user?.phone || order.user?.email}</p>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-[10px] text-gray-400 uppercase font-bold">Доставка</label>
                                    <p className="font-medium text-sm leading-relaxed text-gray-700">
                                        {order.address
                                            ? `${order.address.city || ""}, ${order.address.street || ""}, ${order.address.house || ""}${order.address.apartment ? `, кв. ${order.address.apartment}` : ""}${order.address.entrance ? `, под. ${order.address.entrance}` : ""}${order.address.floor ? `, эт. ${order.address.floor}` : ""}`
                                            : "Адрес не указан"}
                                    </p>
                                    {order.comment && (
                                        <p className="text-xs text-gray-500 italic mt-1">&quot;{order.comment}&quot;</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold flex items-center gap-2 text-gray-900">
                                    <Package size={20} className="text-green-500" />
                                    Товары ({totalItems})
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div key={`${item.id}-${item.name}`} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl p-2 flex-shrink-0 border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-gray-900">{item.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                            <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                                <span className="font-bold text-gray-500">Итого</span>
                                <span className="text-2xl font-black text-gray-900">{formatPrice(order.totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sticky top-8 shadow-lg shadow-gray-200/50">
                            <h3 className="font-bold mb-6 text-lg text-gray-900">Действия</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase font-bold mb-2">Статус заказа</label>
                                    <select
                                        value={order.status}
                                        onChange={(event) => updateStatus(event.target.value)}
                                        disabled={isSaving}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 appearance-none focus:border-green-500 focus:outline-none transition-all font-medium cursor-pointer"
                                    >
                                        {STATUS_OPTIONS.map((status) => (
                                            <option key={status} value={status}>
                                                {STATUS_LABELS[status]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="h-px bg-gray-100 my-2" />

                                <button
                                    onClick={() => updateStatus("DELIVERED")}
                                    disabled={isSaving || order.status === "DELIVERED"}
                                    className="w-full py-3 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                                >
                                    <CheckCircle size={18} />
                                    Отметить доставленным
                                </button>

                                <button
                                    onClick={() => updateStatus("CANCELLED")}
                                    disabled={isSaving || order.status === "CANCELLED"}
                                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                                >
                                    <XCircle size={18} />
                                    Отменить заказ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
