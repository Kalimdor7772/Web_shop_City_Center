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
    const { cartItems, totalPrice, clearCart, totalItems } = useCart();
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
        if (!isAuthenticated || !formData.saveToProfile) {
            return { success: true, skipped: true };
        }

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

    if (!isInitialized) {
        return null;
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
                <div className="text-center bg-white/60 backdrop-blur-3xl p-16 rounded-[4rem] border border-white shadow-xl max-w-lg w-full">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <ShoppingBag size={48} className="text-gray-300" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">{t.cart.emptyTitle}</h1>
                    <p className="text-gray-500 font-medium mb-10">{t.cart.emptyDesc}</p>
                    <Link href="/catalog">
                        <button className="w-full py-6 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                            {t.cart.goToCatalog}
                        </button>
                    </Link>
                </div>
            </div>
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
        <main className="min-h-screen bg-[#F8F9FA] pt-32 pb-24 px-4 sm:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] -ml-96 -mb-96" />

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-6 mb-12">
                    <button
                        onClick={() => router.back()}
                        className="p-4 rounded-[1.5rem] bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all border border-white shadow-sm"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">{t.checkout.title}</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">{t.checkout.subtitle}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10">
                        <section className="bg-white/60 backdrop-blur-3xl rounded-[3rem] border border-white p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                                    <MapPin size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900">{t.checkout.addressTitle}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                {availableAddresses.map((address, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAddressSelect(address, idx - 1)}
                                        className={`text-left p-6 rounded-[2rem] border transition-all duration-300 relative group ${(idx - 1) === selectedAddressIndex
                                            ? "bg-gray-900 border-gray-900 text-white shadow-2xl shadow-black/20"
                                            : "bg-white/50 border-gray-100 text-gray-600 hover:border-green-500/30"
                                            }`}
                                    >
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${(idx - 1) === selectedAddressIndex ? "text-green-400" : "text-gray-400"}`}>
                                            {address.label || `Адрес ${idx}`}
                                        </p>
                                        <p className="font-black text-lg mb-1 truncate">{address.city}</p>
                                        <p className={`font-medium text-sm ${(idx - 1) === selectedAddressIndex ? "text-white/60" : "text-gray-400"} truncate`}>
                                            {address.street}, {address.house}
                                        </p>
                                        {(idx - 1) === selectedAddressIndex && (
                                            <div className="absolute top-6 right-6">
                                                <CheckCircle2 size={18} className="text-green-400" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                                            Имя получателя
                                        </label>
                                        <input
                                            value={formData.name}
                                            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300"
                                            placeholder="Имя и фамилия"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                                            Телефон
                                        </label>
                                        <input
                                            value={formData.phone}
                                            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300"
                                            placeholder="+7 777 123 45 67"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                                            Город
                                        </label>
                                        <input
                                            value={formData.city}
                                            onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300"
                                            placeholder="Алматы"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                                            Улица
                                        </label>
                                        <input
                                            value={formData.street}
                                            onChange={(event) => setFormData({ ...formData, street: event.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300"
                                            placeholder="Улица или проспект"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                                            Дом
                                        </label>
                                        <input
                                            value={formData.house}
                                            onChange={(event) => setFormData({ ...formData, house: event.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300"
                                            placeholder="Дом"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                                            Квартира
                                        </label>
                                        <input
                                            value={formData.apartment}
                                            onChange={(event) => setFormData({ ...formData, apartment: event.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300"
                                            placeholder="Квартира или офис"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t.checkout.entrance}</label>
                                        <input
                                            value={formData.entrance}
                                            onChange={(event) => setFormData({ ...formData, entrance: event.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300"
                                            placeholder="—"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t.checkout.floor}</label>
                                        <input
                                            value={formData.floor}
                                            onChange={(event) => setFormData({ ...formData, floor: event.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300"
                                            placeholder="—"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t.checkout.comment}</label>
                                    <div className="relative">
                                        <textarea
                                            value={formData.comment}
                                            onChange={(event) => setFormData({ ...formData, comment: event.target.value })}
                                            rows={2}
                                            className="w-full p-5 pl-14 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300"
                                            placeholder={t.checkout.commentPlaceholder}
                                        />
                                        <MessageSquare size={20} className="absolute left-5 top-6 text-gray-300" />
                                    </div>
                                </div>

                                {isAuthenticated && selectedAddressIndex === -1 && (
                                    <div
                                        className="flex items-center gap-3 pl-2 cursor-pointer group"
                                        onClick={() => setFormData({ ...formData, saveToProfile: !formData.saveToProfile })}
                                    >
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.saveToProfile
                                            ? "bg-green-500 border-green-500 text-white"
                                            : "border-gray-200 text-transparent group-hover:border-green-500/50"
                                            }`}
                                        >
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 group-hover:text-green-600 transition-colors">
                                            {t.checkout.saveAddress}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="bg-white/60 backdrop-blur-3xl rounded-[3rem] border border-white p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                                    <CreditCard size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900">{t.checkout.paymentMethod}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => setFormData({ ...formData, paymentMethod: "kaspi" })}
                                    className={`relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all group ${formData.paymentMethod === "kaspi"
                                        ? "bg-[#E21E26] border-[#E21E26] text-white shadow-2xl shadow-red-500/20"
                                        : "bg-white border-gray-100 text-gray-400 hover:border-red-500/20"
                                        }`}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${formData.paymentMethod === "kaspi" ? "text-white/60" : "text-gray-300"}`}>{t.checkout.recommended}</span>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${formData.paymentMethod === "kaspi" ? "bg-white text-[#E21E26]" : "bg-red-50 text-[#E21E26]"}`}>
                                        <span className="text-2xl font-black">K</span>
                                    </div>
                                    <p className="font-black text-xl">Kaspi.kz</p>
                                    <p className={`text-xs font-bold mt-1 ${formData.paymentMethod === "kaspi" ? "text-white/60" : "text-gray-400"}`}>{t.checkout.fastQr}</p>
                                </button>

                                <button
                                    onClick={() => setFormData({ ...formData, paymentMethod: "cash" })}
                                    className={`relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all ${formData.paymentMethod === "cash"
                                        ? "bg-gray-900 border-gray-900 text-white shadow-2xl shadow-black/20"
                                        : "bg-white border-gray-100 text-gray-400 hover:border-gray-900/20"
                                        }`}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${formData.paymentMethod === "cash" ? "text-white/60" : "text-gray-300"}`}>{t.checkout.onDelivery}</span>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${formData.paymentMethod === "cash" ? "bg-white/10 text-white" : "bg-gray-50 text-gray-400"}`}>
                                        <ShoppingBag size={24} />
                                    </div>
                                    <p className="font-black text-xl">{t.checkout.cash}</p>
                                    <p className={`text-xs font-bold mt-1 ${formData.paymentMethod === "cash" ? "text-white/60" : "text-gray-400"}`}>{t.checkout.payCourier}</p>
                                </button>
                            </div>
                        </section>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-black/30 overflow-hidden relative">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]" />

                                <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                                    <Truck size={24} className="text-green-400" />
                                    {t.checkout.summaryTitle}
                                </h3>

                                <div className="space-y-6 mb-12">
                                    <div className="flex justify-between items-center text-white/50 font-bold uppercase tracking-widest text-[10px]">
                                        <span>{t.cart.items}</span>
                                        <span className="text-white text-sm">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white/50 font-bold uppercase tracking-widest text-[10px]">
                                        <span>{t.cart.delivery}</span>
                                        <span className="text-green-400 text-sm">{t.cart.free}</span>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="font-black text-white/60">{t.checkout.toPay}</span>
                                        <span className="text-4xl font-black text-white">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || isCheckoutInvalid}
                                    className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3 ${
                                        isSubmitting || isCheckoutInvalid
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-green-500 text-gray-900 hover:bg-green-400 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/20"
                                    }`}
                                >
                                    {isSubmitting ? t.checkout.processing : t.checkout.confirm}
                                    {!isSubmitting && <ChevronRight size={20} />}
                                </button>

                                <p className="mt-8 text-center text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                                    {t.checkout.ssl}
                                </p>
                            </div>

                            <div className="bg-white/60 backdrop-blur-3xl rounded-[2rem] border border-white p-6 flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900">{t.checkout.support}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.checkout.freeCall}</p>
                                </div>
                                <span className="ml-auto font-black text-gray-900">9999</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
