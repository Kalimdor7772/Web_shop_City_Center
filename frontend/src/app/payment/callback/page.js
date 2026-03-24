"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useOrder } from "../../../context/OrderContext";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { kaspiService } from "../../../utils/kaspi.service";
import { clearDraftOrder, getDraftOrder } from "../../../utils/paymentDraft";

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black text-white">Обработка платежа...</div>}>
            <PaymentCallbackHandler />
        </Suspense>
    );
}

function PaymentCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const { createOrder } = useOrder();
    const { isAuthenticated, updateProfile, user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        const processPayment = async () => {
            const paymentId = searchParams.get("paymentId");
            const resultStatus = searchParams.get("status");
            const draftRef = searchParams.get("ref");

            if (!paymentId) {
                router.replace("/checkout");
                return;
            }

            if (resultStatus === "failed") {
                showToast("Оплата была отменена или не прошла");
                router.replace("/checkout?error=payment_failed");
                return;
            }

            try {
                const paymentCheck = await kaspiService.checkPaymentStatus(paymentId);

                if (paymentCheck.status !== "SUCCESS") {
                    showToast("Статус платежа не подтвержден");
                    router.replace("/checkout?error=payment_verification_failed");
                    return;
                }

                const transaction = kaspiService.getTransaction(paymentId);
                const recoveredDraftRef = draftRef || transaction?.orderId || null;
                const draftOrder = getDraftOrder(recoveredDraftRef) || getDraftOrder();

                if (!draftOrder) {
                    console.error("Draft order not found");
                    router.replace("/checkout?error=session_expired");
                    return;
                }

                const result = await createOrder(draftOrder);
                clearDraftOrder(draftOrder.id);

                if (!result.success || !result.order?.id) {
                    showToast(result.error || "Не удалось сохранить заказ");
                    router.replace("/checkout?error=order_create_failed");
                    return;
                }

                if (isAuthenticated && draftOrder.saveToProfile && draftOrder.address) {
                    const currentProfile = user?.profile || {};
                    const currentAddresses = Array.isArray(currentProfile.addresses) ? currentProfile.addresses : [];
                    const nextAddresses = currentAddresses.some((address) =>
                        address?.city === draftOrder.address.city &&
                        address?.street === draftOrder.address.street &&
                        address?.house === draftOrder.address.house &&
                        (address?.apartment || "") === (draftOrder.address.apartment || "")
                    )
                        ? currentAddresses
                        : [...currentAddresses, draftOrder.address];

                    await updateProfile({
                        phone: draftOrder.customer?.phone || user?.phone || undefined,
                        profile: {
                            ...currentProfile,
                            ...draftOrder.address,
                            addresses: nextAddresses,
                        },
                    });
                }

                clearCart();
                showToast("Оплата прошла успешно");
                router.replace(`/order-success?id=${encodeURIComponent(result.order.id)}`);
            } catch (error) {
                console.error("Payment processing error:", error);
                showToast("Ошибка обработки платежа");
                router.replace("/checkout?error=processing_error");
            }
        };

        void processPayment();
    }, [clearCart, createOrder, isAuthenticated, router, searchParams, showToast, updateProfile, user]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050505]">
            <div className="text-center">
                <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-neon-blue border-t-transparent" />
                <h2 className="text-xl font-medium text-white">Проверяем платеж...</h2>
                <p className="mt-2 text-gray-500">Пожалуйста, не закрывайте страницу</p>
            </div>
        </div>
    );
}
