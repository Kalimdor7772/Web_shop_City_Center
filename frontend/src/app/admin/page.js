"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import * as adminService from "../../services/admin.service";

const STATUS_LABELS = {
    PENDING: "Новый",
    PROCESSING: "В обработке",
    SHIPPED: "Отправлен",
    DELIVERED: "Доставлен",
    CANCELLED: "Отменен",
};

const STATUS_FILTERS = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const getStatusBadge = (status) => {
    switch (status) {
        case "PENDING":
            return "border-yellow-200 bg-yellow-100 text-yellow-700";
        case "PROCESSING":
            return "border-blue-200 bg-blue-100 text-blue-700";
        case "SHIPPED":
            return "border-purple-200 bg-purple-100 text-purple-700";
        case "DELIVERED":
            return "border-green-200 bg-green-100 text-green-700";
        case "CANCELLED":
            return "border-red-200 bg-red-100 text-red-700";
        default:
            return "border-gray-200 bg-gray-100 text-gray-600";
    }
};

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isInitialized } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isInitialized) return;

        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        if (user?.role !== "ADMIN") {
            router.replace("/profile");
            return;
        }

        const loadOrders = async () => {
            setIsLoading(true);
            try {
                const response = await adminService.getAdminOrders();
                if (response.success) {
                    setOrders(response.data || []);
                }
            } catch (error) {
                console.error("Failed to load admin orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadOrders();
    }, [isAuthenticated, isInitialized, router, user?.role]);

    const filteredOrders = useMemo(() => {
        if (filterStatus === "ALL") return orders;
        return orders.filter((order) => order.status === filterStatus);
    }, [filterStatus, orders]);

    if (!isInitialized || !isAuthenticated || user?.role !== "ADMIN") {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 text-gray-900 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
                                <Package size={20} className="text-green-600" />
                            </div>
                            Панель заказов
                        </h1>
                        <p className="ml-14 mt-1 text-gray-500">Управление заказами и статусами</p>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                        {STATUS_FILTERS.map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                    filterStatus === status
                                        ? "bg-gray-900 text-white shadow-md"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                {status === "ALL" ? "Все" : STATUS_LABELS[status]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
                    {filteredOrders.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                                <Package size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Заказов пока нет</h3>
                            <p className="text-gray-500">Когда появятся новые заказы, они отобразятся здесь.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                                        <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-500">Дата</th>
                                        <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-500">Клиент</th>
                                        <th className="p-6 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Сумма</th>
                                        <th className="p-6 text-center text-xs font-bold uppercase tracking-wider text-gray-500">Статус</th>
                                        <th className="p-6 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Действие</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="group transition-colors hover:bg-gray-50/80">
                                            <td className="p-6 font-mono font-bold text-gray-900">{order.id}</td>
                                            <td className="p-6 text-sm text-gray-500">
                                                {new Date(order.date).toLocaleDateString("ru-RU")}
                                                <span className="block text-xs text-gray-400">
                                                    {new Date(order.date).toLocaleTimeString("ru-RU", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold text-gray-900">
                                                    {order.customer?.name || order.user?.email || "Без имени"}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {order.customer?.phone || order.user?.phone || order.user?.email}
                                                </div>
                                            </td>
                                            <td className="p-6 text-right text-lg font-bold text-gray-900">
                                                {formatPrice(order.totalPrice)}
                                            </td>
                                            <td className="p-6 text-center">
                                                <span
                                                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(order.status)}`}
                                                >
                                                    {STATUS_LABELS[order.status] || order.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <Link
                                                    href={`/admin/${encodeURIComponent(order.id)}`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow"
                                                >
                                                    <Eye size={16} />
                                                    Открыть
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
