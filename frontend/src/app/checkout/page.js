"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, CreditCard, MapPin, MessageSquare, Phone, ShoppingBag, Truck } from "lucide-react";
import { t } from "@/lib/i18n";
import { useCart } from "../../context/CartContext";
import { useOrder } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import { kaspiService } from "../../utils/kaspi.service";
import { saveDraftOrder } from "../../utils/paymentDraft";

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, totalPrice, clearCart } = useCart();
    const { createOrder } = useOrder();
    const { user, isInitialized, isAuthenticated, updateProfile } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        city: "",
        street: "",
        house: "",
        apartment: "",
        entrance: "",
        floor: "",
        comment: "",
        paymentMethod: "kaspi",
        saveToProfile: false
    });
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isCheckoutInvalid =
        !formData.name.trim() ||
        !formData.phone.trim() ||
        !formData.city.trim() ||
        !formData.street.trim() ||
        !formData.house.trim();

    const addressPayload = {
        city: formData.city,
        street: formData.street,
        house: formData.house,
        apartment: formData.apartment,
        entrance: formData.entrance,
        floor: formData.floor,
    };

    useEffect(() => {
        if (isInitialized && user) {
            setFormData((prev) => ({
                ...prev,
                name: `${user.firstName} ${user.lastName || ""}`.trim(),
                phone: user.phone || "",
                city: user.profile?.city || "",
                street: user.profile?.street || "",
                house: user.profile?.house || "",
                apartment: user.profile?.apartment || "",
                entrance: user.profile?.entrance || "",
                floor: user.profile?.floor || "",
            }));
        }
    }, [isInitialized, user]);

    const formatPrice = (price) =>
        `${new Intl.NumberFormat("ru-RU", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Math.round(price)).replace(/\u00A0/g, " ")} ₸`;

    const persistCheckoutProfile = async () => {
        if (!isAuthenticated || !formData.saveToProfile) return { success: true, skipped: true };

        const currentProfile = user?.profile || {};
        const currentAddresses = Array.isArray(currentProfile.addresses) ? currentProfile.addresses : [];
        const nextAddresses = currentAddresses.some((address) =>
            address?.city === addressPayload.city &&
            address?.street === addressPayload.street &&
            address?.house === addressPayload.house &&
            (address?.apartment || "") === (addressPayload.apartment || "")
        )
            ? currentAddresses
            : [...currentAddresses, addressPayload];

        return await updateProfile({
            phone: formData.phone || user?.phone || undefined,
            profile: {
                ...currentProfile,
                ...addressPayload,
                addresses: nextAddresses
            }
        });
    };

    const handleAddressSelect = (address, index) => {
        setSelectedAddressIndex(index);
        setFormData((prev) => ({
            ...prev,
            city: address.city || "",
            street: address.street || "",
            house: address.house || "",
            apartment: address.apartment || "",
            entrance: address.entrance || "",
            floor: address.floor || "",
        }));
    };

    const handleSubmit = async () => {
        if (isCheckoutInvalid) {
            alert("Заполните имя, телефон и адрес доставки");
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            items: cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity
            })),
            customer: {
                name: formData.name,
                phone: formData.phone,
            },
            address: addressPayload,
            comment: formData.comment,
            paymentMethod: formData.paymentMethod,
            saveToProfile: formData.saveToProfile
        };

        if (formData.paymentMethod === "kaspi") {
            try {
                const draftId = `draft_${Date.now()}`;
                const draftOrder = { id: draftId, ...orderData, cartItems, totalPrice };
                saveDraftOrder(draftOrder);

                const payment = await kaspiService.createPayment(draftId, totalPrice);
                router.push(payment.redirectUrl);
            } catch (error) {
                console.error("Payment init error:", error);
                alert("Не удалось инициализировать оплату");
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        try {
            const result = await createOrder(orderData);
            if (result.success) {
                await persistCheckoutProfile();
                clearCart();
                router.push("/profile");
            } else {
                alert(result.error || "Не удалось создать заказ");
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isInitialized) return null;

    if (cartItems.length === 0) {
        return (
            <main className="organic-section flex min-h-screen items-center justify-center p-6 pt-24">
                <div className="section-shell max-w-lg rounded-[3rem] p-12 text-center">
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-white/70 shadow-inner">
                        <ShoppingBag size={48} className="text-stone-300" />
                    </div>
                    <h1 className="mb-4 text-4xl font-black text-gray-900">{t.cart.emptyTitle}</h1>
                    <p className="mb-10 font-medium text-stone-600">{t.cart.emptyDesc}</p>
                    <Link href="/catalog" className="inline-flex w-full items-center justify-center rounded-[1.6rem] bg-gray-900 py-5 font-black text-white transition-all hover:bg-black">
                        {t.cart.goToCatalog}
                    </Link>
                </div>
            </main>
        );
    }

    const availableAddresses = user?.profile
        ? [
            {
                city: user.profile.city,
                street: user.profile.street,
                house: user.profile.house,
                apartment: user.profile.apartment,
                floor: user.profile.floor,
                entrance: user.profile.entrance,
                label: "Основной"
            },
            ...(user.profile.addresses || [])
        ]
        : [];

    return (
        <main className="min-h-screen pb-24 pt-24">
            <section className="organic-section relative px-3 py-10 md:px-5">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex items-center gap-6">
                        <button onClick={() => router.back()} className="glass-panel rounded-[1.5rem] p-4 text-gray-500 transition-all hover:bg-white/80 hover:text-gray-900">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">{t.checkout.title}</h1>
                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-400">{t.checkout.subtitle}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        <div className="space-y-10 lg:col-span-2">
                            <section className="section-shell rounded-[3rem] p-10">
                                <div className="mb-10 flex items-center gap-4">
                                    <div className="rounded-[1.5rem] bg-green-50 p-4 text-green-600">
                                        <MapPin size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900">{t.checkout.addressTitle}</h2>
                                </div>

                                <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {availableAddresses.map((address, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAddressSelect(address, idx - 1)}
                                            className={`relative rounded-[2rem] border p-6 text-left transition-all duration-300 ${(idx - 1) === selectedAddressIndex
                                                ? "bg-gray-900 border-gray-900 text-white shadow-2xl shadow-black/20"
                                                : "glass-panel border-white/60 text-gray-600 hover:border-green-500/30"
                                                }`}
                                        >
                                            <p className={`mb-2 text-[10px] font-black uppercase tracking-[0.22em] ${(idx - 1) === selectedAddressIndex ? "text-green-400" : "text-stone-400"}`}>
                                                {address.label || `Адрес ${idx}`}
                                            </p>
                                            <p className="mb-1 truncate text-lg font-black">{address.city}</p>
                                            <p className={`truncate text-sm font-medium ${(idx - 1) === selectedAddressIndex ? "text-white/65" : "text-stone-500"}`}>
                                                {address.street}, {address.house}
                                            </p>
                                            {(idx - 1) === selectedAddressIndex && (
                                                <div className="absolute right-6 top-6">
                                                    <CheckCircle2 size={18} className="text-green-400" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <Field label="Имя получателя" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} placeholder="Имя и фамилия" />
                                        <Field label="Телефон" value={formData.phone} onChange={(value) => setFormData({ ...formData, phone: value })} placeholder="+7 777 123 45 67" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <Field label="Город" value={formData.city} onChange={(value) => setFormData({ ...formData, city: value })} placeholder="Алматы" />
                                        <Field className="md:col-span-2" label="Улица" value={formData.street} onChange={(value) => setFormData({ ...formData, street: value })} placeholder="Улица или проспект" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <Field label="Дом" value={formData.house} onChange={(value) => setFormData({ ...formData, house: value })} placeholder="Дом" />
                                        <Field label="Квартира" value={formData.apartment} onChange={(value) => setFormData({ ...formData, apartment: value })} placeholder="Квартира или офис" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Field label={t.checkout.entrance} value={formData.entrance} onChange={(value) => setFormData({ ...formData, entrance: value })} placeholder="—" />
                                        <Field label={t.checkout.floor} value={formData.floor} onChange={(value) => setFormData({ ...formData, floor: value })} placeholder="—" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="ml-2 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">{t.checkout.comment}</label>
                                        <div className="relative">
                                            <textarea
                                                value={formData.comment}
                                                onChange={(event) => setFormData({ ...formData, comment: event.target.value })}
                                                rows={2}
                                                className="w-full rounded-2xl border border-white/70 bg-white/80 p-5 pl-14 font-bold text-gray-900 transition-all placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-green-500/10"
                                                placeholder={t.checkout.commentPlaceholder}
                                            />
                                            <MessageSquare size={20} className="absolute left-5 top-6 text-stone-300" />
                                        </div>
                                    </div>

                                    {isAuthenticated && selectedAddressIndex === -1 && (
                                        <div className="group flex cursor-pointer items-center gap-3 pl-2" onClick={() => setFormData({ ...formData, saveToProfile: !formData.saveToProfile })}>
                                            <div className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all ${formData.saveToProfile
                                                ? "border-green-500 bg-green-500 text-white"
                                                : "border-gray-200 text-transparent group-hover:border-green-500/50"
                                                }`}>
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600 transition-colors group-hover:text-green-600">{t.checkout.saveAddress}</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="section-shell rounded-[3rem] p-10">
                                <div className="mb-10 flex items-center gap-4">
                                    <div className="rounded-[1.5rem] bg-green-50 p-4 text-green-600">
                                        <CreditCard size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900">{t.checkout.paymentMethod}</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <button
                                        onClick={() => setFormData({ ...formData, paymentMethod: "kaspi" })}
                                        className={`flex flex-col items-center justify-center rounded-[2.5rem] border-2 p-8 transition-all ${formData.paymentMethod === "kaspi"
                                            ? "border-[#E21E26] bg-[#E21E26] text-white shadow-2xl shadow-red-500/20"
                                            : "glass-panel border-white/70 text-gray-400 hover:border-red-500/20"
                                            }`}
                                    >
                                        <span className={`mb-4 text-[10px] font-black uppercase tracking-[0.2em] ${formData.paymentMethod === "kaspi" ? "text-white/65" : "text-stone-300"}`}>{t.checkout.recommended}</span>
                                        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${formData.paymentMethod === "kaspi" ? "bg-white text-[#E21E26]" : "bg-red-50 text-[#E21E26]"}`}>
                                            <span className="text-2xl font-black">K</span>
                                        </div>
                                        <p className="text-xl font-black">Kaspi.kz</p>
                                        <p className={`mt-1 text-xs font-bold ${formData.paymentMethod === "kaspi" ? "text-white/65" : "text-stone-400"}`}>{t.checkout.fastQr}</p>
                                    </button>

                                    <button
                                        onClick={() => setFormData({ ...formData, paymentMethod: "cash" })}
                                        className={`flex flex-col items-center justify-center rounded-[2.5rem] border-2 p-8 transition-all ${formData.paymentMethod === "cash"
                                            ? "border-gray-900 bg-gray-900 text-white shadow-2xl shadow-black/20"
                                            : "glass-panel border-white/70 text-gray-400 hover:border-gray-900/20"
                                            }`}
                                    >
                                        <span className={`mb-4 text-[10px] font-black uppercase tracking-[0.2em] ${formData.paymentMethod === "cash" ? "text-white/65" : "text-stone-300"}`}>{t.checkout.onDelivery}</span>
                                        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${formData.paymentMethod === "cash" ? "bg-white/10 text-white" : "bg-gray-50 text-gray-400"}`}>
                                            <ShoppingBag size={24} />
                                        </div>
                                        <p className="text-xl font-black">{t.checkout.cash}</p>
                                        <p className={`mt-1 text-xs font-bold ${formData.paymentMethod === "cash" ? "text-white/65" : "text-stone-400"}`}>{t.checkout.payCourier}</p>
                                    </button>
                                </div>
                            </section>
                        </div>

                        <aside className="lg:col-span-1">
                            <div className="sticky top-32 space-y-6">
                                <div className="overflow-hidden rounded-[3rem] bg-gray-900 p-10 text-white shadow-2xl shadow-black/30">
                                    <h3 className="mb-10 flex items-center gap-3 text-2xl font-black">
                                        <Truck size={24} className="text-green-400" />
                                        {t.checkout.summaryTitle}
                                    </h3>

                                    <div className="mb-12 space-y-6">
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">
                                            <span>{t.cart.items}</span>
                                            <span className="text-sm text-white">{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">
                                            <span>{t.cart.delivery}</span>
                                            <span className="text-sm text-green-400">{t.cart.free}</span>
                                        </div>
                                        <div className="h-px bg-white/10" />
                                        <div className="flex items-end justify-between pt-2">
                                            <span className="font-black text-white/60">{t.checkout.toPay}</span>
                                            <span className="text-4xl font-black text-white">{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || isCheckoutInvalid}
                                        className={`flex w-full items-center justify-center gap-3 rounded-[2rem] py-6 text-xl font-black transition-all ${
                                            isSubmitting || isCheckoutInvalid
                                                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                                : "bg-green-500 text-gray-900 shadow-xl shadow-green-500/20 hover:scale-[1.02] hover:bg-green-400 active:scale-[0.98]"
                                        }`}
                                    >
                                        {isSubmitting ? t.checkout.processing : t.checkout.confirm}
                                        {!isSubmitting && <ChevronRight size={20} />}
                                    </button>

                                    <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">{t.checkout.ssl}</p>
                                </div>

                                <div className="glass-panel-strong flex items-center gap-4 rounded-[2rem] p-6">
                                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-900">{t.checkout.support}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">{t.checkout.freeCall}</p>
                                    </div>
                                    <span className="ml-auto font-black text-gray-900">9999</span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}

function Field({ label, value, onChange, placeholder, className = "" }) {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className="ml-2 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">{label}</label>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-2xl border border-white/70 bg-white/80 p-5 font-bold text-gray-900 transition-all placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-green-500/10"
                placeholder={placeholder}
            />
        </div>
    );
}
