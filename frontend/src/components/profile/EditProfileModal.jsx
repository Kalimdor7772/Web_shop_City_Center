"use client";

import React, { useState } from "react";
import { X, User, Phone, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "../PhoneInput";
import { t } from '@/lib/i18n';

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target ? e.target.value : e;
        setFormData(prev => ({ ...prev, phone: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.firstName.trim()) {
            setError(t.auth.errors.required);
            setLoading(false);
            return;
        }

        try {
            const result = await onSave(formData);
            if (result.success) {
                onClose();
            } else {
                setError(result.error || t.profile.error);
            }
        } catch (err) {
            setError(t.profile.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 sm:p-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.profile.editProfile}</h2>
                                    <p className="text-gray-500 font-medium text-sm mt-1">{t.profile.updateData}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-2xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-4">{t.profile.firstName}</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder={t.profile.firstName}
                                                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-transparent focus:border-green-500 focus:bg-white rounded-2xl text-gray-900 font-bold transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-4">{t.profile.lastName}</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder={t.profile.lastName}
                                                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-transparent focus:border-green-500 focus:bg-white rounded-2xl text-gray-900 font-bold transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-4">{t.profile.phone}</label>
                                    <PhoneInput
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        placeholder={t.profile.phone}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 size={24} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            {t.profile.saveChanges}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
