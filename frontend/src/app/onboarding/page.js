"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Bell,
    ArrowRight,
    Check,
    Building2,
    Navigation,
    Truck,
    Tag,
    ChevronRight,
    Map
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const KAZAKHSTAN_CITIES = [
    "Алматы", "Астана", "Шымкент", "Караганда", "Актобе",
    "Тараз", "Павлодар", "Усть-Каменогорск", "Семей", "Атырау",
    "Костанай", "Кызылорда", "Уральск", "Петропавловск", "Актау",
    "Темиртау", "Туркестан", "Кокшетау", "Талдыкорган", "Экибастуз", "Рудный"
];

export default function OnboardingPage() {
    const { user, completeOnboarding } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        city: "Алматы",
        street: "",
        house: "",
        apartment: "",
        entrance: "",
        floor: "",
        comment: "",
        preferences: {
            delivery: "standard",
            notifications: true,
            promotions: true
        }
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleFinish = async () => {
        setIsLoading(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = completeOnboarding(profileData);
        setIsLoading(false);

        if (result.success) {
            router.push("/profile");
        }
    };

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] -ml-96 -mb-96" />

            {/* Stepper Header */}
            <div className="w-full max-w-2xl mb-12">
                <div className="flex items-center justify-between px-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2 relative">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= s ? 'bg-gray-900 text-white shadow-xl shadow-black/10' : 'bg-white text-gray-300 border border-gray-100'
                                }`}>
                                {step > s ? <Check size={18} strokeWidth={3} /> : <span className="text-sm font-black">{s}</span>}
                            </div>
                            {s < 3 && (
                                <div className={`absolute left-[calc(100%+0.5rem)] top-5 w-[calc(25vw-3rem)] h-[2px] rounded-full hidden sm:block ${step > s ? 'bg-gray-900' : 'bg-gray-100'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-2xl">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/70 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-16 border border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] text-center"
                        >
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-2xl shadow-green-500/20 mb-8 rotate-6">
                                <Truck size={40} className="-rotate-6" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-6 tracking-tight">
                                Добро пожаловать, <span className="text-green-600">{user?.firstName || 'друг'}!</span>
                            </h1>
                            <p className="text-xl text-gray-500 font-medium mb-12 max-w-md mx-auto leading-relaxed">
                                Мы рады видеть вас в нашем премиальном магазине. Давайте настроим ваш профиль для быстрой доставки.
                            </p>
                            <button
                                onClick={nextStep}
                                className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl group active:scale-[0.98]"
                            >
                                Продолжить
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/70 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-12 border border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-green-50 text-green-600 rounded-3xl">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Адрес доставки</h2>
                                    <p className="text-gray-500 font-medium">Куда привозить ваши заказы?</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Город</label>
                                    <div className="relative group">
                                        <select
                                            value={profileData.city}
                                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 appearance-none focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all cursor-pointer"
                                        >
                                            {KAZAKHSTAN_CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        <Map className="absolute right-5 top-5 text-gray-300 group-focus-within:text-green-500 transition-colors pointer-events-none" size={20} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Улица</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Название улицы"
                                        value={profileData.street}
                                        onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Дом</label>
                                        <input
                                            type="text"
                                            required
                                            value={profileData.house}
                                            onChange={(e) => setProfileData({ ...profileData, house: e.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Кв. / Офис</label>
                                        <input
                                            type="text"
                                            value={profileData.apartment}
                                            onChange={(e) => setProfileData({ ...profileData, apartment: e.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        placeholder="Подъезд"
                                        value={profileData.entrance}
                                        onChange={(e) => setProfileData({ ...profileData, entrance: e.target.value })}
                                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all"
                                    />
                                    <input
                                        placeholder="Этаж"
                                        value={profileData.floor}
                                        onChange={(e) => setProfileData({ ...profileData, floor: e.target.value })}
                                        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-12">
                                <button
                                    onClick={prevStep}
                                    className="flex-1 py-5 border border-gray-100 font-black text-gray-400 rounded-3xl hover:bg-gray-50 hover:text-gray-900 transition-all"
                                >
                                    Назад
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!profileData.street || !profileData.house}
                                    className="flex-[2] py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-black disabled:bg-gray-100 disabled:text-gray-300 transition-all shadow-xl active:scale-[0.98]"
                                >
                                    Продолжить
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/70 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-12 border border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]"
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-green-50 text-green-600 rounded-3xl">
                                    <Bell size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Персонализация</h2>
                                    <p className="text-gray-500 font-medium">Настройте уведомления и предпочтения</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${profileData.preferences.notifications ? 'bg-green-50/50 border-green-500/20 shadow-lg shadow-green-500/5' : 'bg-gray-50/50 border-gray-100'
                                    }`}
                                    onClick={() => setProfileData({
                                        ...profileData,
                                        preferences: { ...profileData.preferences, notifications: !profileData.preferences.notifications }
                                    })}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${profileData.preferences.notifications ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            <Bell size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">Статус заказов</p>
                                            <p className="text-xs text-gray-500 font-medium">PUSH-уведомления о доставке</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-all ${profileData.preferences.notifications ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${profileData.preferences.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>

                                <div className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${profileData.preferences.promotions ? 'bg-green-50/50 border-green-500/20 shadow-lg shadow-green-500/5' : 'bg-gray-50/50 border-gray-100'
                                    }`}
                                    onClick={() => setProfileData({
                                        ...profileData,
                                        preferences: { ...profileData.preferences, promotions: !profileData.preferences.promotions }
                                    })}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${profileData.preferences.promotions ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            <Tag size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">Акции и скидки</p>
                                            <p className="text-xs text-gray-500 font-medium">Персональные предложения и кэшбэк</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-all ${profileData.preferences.promotions ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${profileData.preferences.promotions ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100 mt-8">
                                    <div className="flex items-center gap-4 p-6 bg-gray-900 rounded-[2.5rem] text-white">
                                        <div className="p-4 bg-white/10 rounded-2xl">
                                            <Truck size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black">Быстрая доставка</p>
                                            <p className="text-xs text-white/60 font-medium">Бесплатно при заказе от 5 000 ₸</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-12">
                                <button
                                    onClick={prevStep}
                                    className="flex-1 py-5 border border-gray-100 font-black text-gray-400 rounded-3xl hover:bg-gray-50 hover:text-gray-900 transition-all"
                                >
                                    Назад
                                </button>
                                <button
                                    onClick={handleFinish}
                                    disabled={isLoading}
                                    className="flex-[2] py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black rounded-3xl hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Сохранение...' : 'Завершить'}
                                    {!isLoading && <ChevronRight size={18} />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
