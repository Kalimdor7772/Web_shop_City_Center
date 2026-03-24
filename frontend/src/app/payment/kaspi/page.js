"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle, QrCode, XCircle } from "lucide-react";
import { kaspiService } from "../../../utils/kaspi.service";

export default function KaspiPaymentPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white">Загрузка...</div>}>
            <KaspiPaymentContent />
        </Suspense>
    );
}

function KaspiPaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState("LOADING");
    const [timeLeft, setTimeLeft] = useState(900);

    const paymentId = searchParams.get("id");
    const amount = searchParams.get("amount");
    const ref = searchParams.get("ref");
    const isInvalidPayment = !paymentId || !amount;

    useEffect(() => {
        if (isInvalidPayment) return;

        kaspiService
            .checkPaymentStatus(paymentId)
            .then(() => setStatus("READY"))
            .catch(() => setStatus("INVALID"));

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isInvalidPayment, paymentId]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSimulateAction = (action) => {
        setStatus("PROCESSING");
        kaspiService.updatePaymentStatus(paymentId, action === "SUCCESS" ? "SUCCESS" : "FAILED");

        setTimeout(() => {
            router.push(`/payment/callback?status=${action === "SUCCESS" ? "success" : "failed"}&paymentId=${paymentId}&ref=${ref}`);
        }, 1000);
    };

    if (isInvalidPayment || status === "INVALID") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
                    <h1 className="mb-2 text-xl font-bold text-gray-800">Ошибка платежа</h1>
                    <p className="mb-6 text-gray-500">Неверные параметры транзакции.</p>
                    <button
                        onClick={() => router.push("/checkout")}
                        className="w-full rounded-xl bg-gray-200 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-300"
                    >
                        Вернуться к оформлению
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#f2f2f2] font-sans">
            <div className="flex justify-center border-b bg-white p-4 shadow-sm">
                <div className="text-2xl font-bold tracking-tight text-red-600">Kaspi.kz</div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl">
                    <div className="border-b border-gray-100 p-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                            🏪
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">City Center Market</h2>
                        <p className="text-sm text-gray-500">Заказ {ref}</p>
                    </div>

                    <div className="bg-gray-50 p-8 text-center">
                        <p className="mb-1 text-sm text-gray-500">К оплате</p>
                        <div className="text-4xl font-extrabold text-gray-900">
                            {parseInt(amount, 10).toLocaleString("ru-RU")} ₸
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-4 p-6">
                        {status === "PROCESSING" ? (
                            <div className="flex h-48 w-48 items-center justify-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-red-600" />
                            </div>
                        ) : (
                            <div className="group relative flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-gray-200 bg-white">
                                <QrCode size={120} className="text-gray-800" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                                    <span className="px-2 text-center text-xs text-gray-500">
                                        Сканируйте QR в приложении Kaspi.kz
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Время на оплату</p>
                            <p className={`text-lg font-bold font-mono ${timeLeft < 60 ? "text-red-500" : "text-gray-800"}`}>
                                {formatTime(timeLeft)}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-yellow-100 bg-yellow-50 p-4">
                        <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-wider text-yellow-700">
                            Режим эмуляции
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleSimulateAction("SUCCESS")}
                                disabled={status !== "READY"}
                                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                            >
                                <CheckCircle size={16} />
                                Оплатить
                            </button>
                            <button
                                onClick={() => handleSimulateAction("FAILED")}
                                disabled={status !== "READY"}
                                className="flex items-center justify-center gap-2 rounded-xl bg-red-100 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-200 disabled:opacity-50"
                            >
                                <XCircle size={16} />
                                Отменить
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 max-w-xs text-center text-xs text-gray-400">
                    Это демонстрационная страница. Реальные деньги не списываются.
                </p>
            </div>
        </div>
    );
}
