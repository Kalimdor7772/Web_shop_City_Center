"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import Link from "next/link";
import {
    User,
    Package,
    MapPin,
    LogOut,
    ChevronRight,
    Plus,
    Trash2,
    Edit2,
    CheckCircle2,
    ShoppingBag,
    Save,
    X,
    Phone,
    Mail,
    Calendar,
    Shield,
    Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddressModal from "../../components/profile/AddressModal";
import AvatarUpload from "../../components/profile/AvatarUpload";
import PhoneInput from "../../components/PhoneInput";
import { t } from '@/lib/i18n';

function buildEditForm(user) {
    return {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        avatar: user?.avatar || ""
    };
}

function TabButton({ id, icon: Icon, label, activeTab, onSelect }) {
    return (
        <button
            onClick={() => onSelect(id)}
            className={`w-full flex items-center gap-4 p-4 rounded-[1.25rem] transition-all duration-300 ${activeTab === id
                ? 'bg-gray-900 text-white shadow-xl shadow-black/10'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <Icon size={20} className={activeTab === id ? 'text-green-400' : ''} />
            <span className="font-bold">{label}</span>
            {activeTab === id && (
                <motion.div layoutId="activeTab" className="ml-auto">
                    <CheckCircle2 size={16} className="text-green-400" />
                </motion.div>
            )}
        </button>
    );
}

export default function ProfilePage() {
    const { user, logout, isAuthenticated, isInitialized, completeOnboarding, updateProfile } = useAuth();
    const { orders } = useOrder();
    const router = useRouter();
    const profile = user?.profile || {};
    const [activeTab, setActiveTab] = useState("personal"); // personal, orders, addresses
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressModalMode, setAddressModalMode] = useState("add"); // add, edit

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(() => buildEditForm(null));
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isInitialized, router]);


    const handleAvatarChange = (base64) => {
        setEditForm(prev => ({ ...prev, avatar: base64 }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!editForm.firstName.trim()) newErrors.firstName = t.auth.errors.required;
        if (!editForm.phone.trim()) newErrors.phone = t.auth.errors.phoneRequired;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateForm()) return;
        setIsSaving(true);

        // Simulate network delay for effect
        await new Promise(r => setTimeout(r, 600));

        const result = await updateProfile({
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            phone: editForm.phone,
            avatar: editForm.avatar
        });

        setIsSaving(false);
        if (result?.success) setIsEditing(false);
    };

    // Format helpers
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Math.round(price)).replace(/\u00A0/g, ' ') + " ₸";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Неизвестно";
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (!isInitialized || !isAuthenticated) return null;

    // Address Handlers
    const handleDeleteAddress = (index) => {
        const newAddresses = [...(profile.addresses || [])];
        newAddresses.splice(index, 1);
        completeOnboarding({ addresses: newAddresses });
    };

    const handleSaveAddress = async (addressData) => {
        let newAddresses = [...(profile.addresses || [])];
        if (addressModalMode === "edit" && editingAddress !== null) {
            if (editingAddress === "primary") {
                updateProfile({
                    profile: { ...profile, ...addressData }
                });
                return { success: true };
            } else {
                newAddresses[editingAddress] = addressData;
            }
        } else {
            newAddresses.push(addressData);
        }
        completeOnboarding({ addresses: newAddresses });
        return { success: true };
    };

    const openAddressModal = (mode, index = null) => {
        setAddressModalMode(mode);
        setEditingAddress(mode === "edit" ? index : null);
        setIsAddAddressModalOpen(true);
    };

    return (
        <main className="min-h-screen bg-[#F8F9FA] pt-32 pb-24 px-4 sm:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-12"
                >

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="mb-6">
                                    <AvatarUpload
                                        currentAvatar={isEditing ? editForm.avatar : user?.avatar}
                                        initials={(user?.firstName?.charAt(0) || "?").toUpperCase()}
                                        isEditing={isEditing}
                                        onAvatarChange={handleAvatarChange}
                                    />
                                </div>

                                <h2 className="text-xl font-black text-gray-900">
                                    {isEditing ? t.profile.editProfile : `${user?.firstName || ""} ${user?.lastName || ""}`}
                                </h2>
                                <p className="text-gray-400 font-bold text-sm tracking-tight">{user?.phone || ""}</p>
                            </div>

                            <nav className="space-y-2">
                                <TabButton id="personal" icon={User} label={t.profile.title} activeTab={activeTab} onSelect={setActiveTab} />
                                <TabButton id="orders" icon={Package} label={t.profile.myOrders} activeTab={activeTab} onSelect={setActiveTab} />
                                <TabButton id="addresses" icon={MapPin} label={t.profile.addresses} activeTab={activeTab} onSelect={setActiveTab} />

                                <div className="h-px bg-gray-100 my-4 mx-2" />

                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-4 p-4 rounded-[1.25rem] text-red-500 hover:bg-red-50 transition-all font-bold"
                                >
                                    <LogOut size={20} />
                                    <span>{t.profile.logout}</span>
                                </button>
                            </nav>
                        </div>

                        {/* Kaspi Ad */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-[#E21E26] to-[#B0171D] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-red-500/20 relative overflow-hidden group cursor-pointer"
                        >
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2">Kaspi Gold</h3>
                                <p className="text-white/70 font-medium text-sm mb-6">Получайте 10% кэшбэка при оплате через Kaspi QR</p>
                                <button className="px-6 py-3 bg-white text-red-600 rounded-2xl font-black text-sm shadow-xl">
                                    Подробнее
                                </button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        </motion.div>
                    </aside>

                    {/* Content Section */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {activeTab === "personal" && (
                                <motion.div
                                    key="personal"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-10 relative z-10">
                                            <h3 className="text-2xl font-black text-gray-900">{t.profile.personalInfo}</h3>
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => {
                                                        setEditForm(buildEditForm(user));
                                                        setIsEditing(true);
                                                    }}
                                                    className="flex items-center gap-2 text-green-600 font-black hover:text-green-700 transition-colors bg-green-50 px-4 py-2 rounded-xl"
                                                >
                                                    <Edit2 size={16} />
                                                    <span>{t.profile.change}</span>
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="p-3 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={isSaving}
                                                        className="flex items-center gap-2 bg-green-600 text-white font-black px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50"
                                                    >
                                                        {isSaving ? t.profile.saving : (
                                                            <>
                                                                <Save size={18} />
                                                                <span>{t.profile.save}</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            {/* First Name */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 flex items-center gap-2">
                                                    <User size={12} /> {t.profile.firstName}
                                                </label>
                                                {isEditing ? (
                                                    <div>
                                                        <input
                                                            value={editForm.firstName}
                                                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                                            className={`w-full p-4 bg-white border ${errors.firstName ? 'border-red-500' : 'border-gray-100'} rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                                                            placeholder={t.profile.firstName}
                                                        />
                                                        {errors.firstName && <p className="text-red-500 text-xs font-bold mt-1">{errors.firstName}</p>}
                                                    </div>
                                                ) : (
                                                    <p className="text-lg font-bold text-gray-900 border-b border-transparent py-4">{user?.firstName || "—"}</p>
                                                )}
                                            </div>

                                            {/* Last Name */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 flex items-center gap-2">
                                                    <User size={12} /> {t.profile.lastName}
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        value={editForm.lastName}
                                                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                                        className="w-full p-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                                        placeholder={t.profile.lastName}
                                                    />
                                                ) : (
                                                    <p className="text-lg font-bold text-gray-900 border-b border-transparent py-4">{user?.lastName || "—"}</p>
                                                )}
                                            </div>

                                            {/* Phone */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 flex items-center gap-2">
                                                    <Phone size={12} /> {t.profile.phone}
                                                </label>
                                                {isEditing ? (
                                                    <div>
                                                        <input
                                                            value={editForm.phone}
                                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                            className={`w-full p-4 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-100'} rounded-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                                                            placeholder="+7 (___) ___-__-__"
                                                        />
                                                        {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">{errors.phone}</p>}
                                                    </div>
                                                ) : (
                                                    <p className="text-lg font-bold text-gray-900 border-b border-transparent py-4">{user?.phone || "—"}</p>
                                                )}
                                            </div>

                                            {/* Email (Read Only) */}
                                            <div className="space-y-2 opacity-60 pointer-events-none grayscale">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 flex items-center gap-2">
                                                    <Mail size={12} /> {t.profile.email}
                                                </label>
                                                <p className="text-lg font-bold text-gray-900 border-b border-transparent py-4">
                                                    {user?.email || "Не указан"}
                                                </p>
                                            </div>

                                            {/* Registration Date */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 flex items-center gap-2">
                                                    <Calendar size={12} /> {t.profile.regDate}
                                                </label>
                                                <p className="text-lg font-bold text-gray-900 border-b border-transparent py-4">
                                                    {formatDate(user.createdAt)}
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 flex items-center gap-2">
                                                    <Shield size={12} /> {t.profile.status}
                                                </label>
                                                <div className="flex items-center gap-2 text-green-600 font-bold py-4">
                                                    <CheckCircle2 size={16} />
                                                    <span>{t.profile.premium}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {[
                                            { label: t.profile.totalOrders, val: orders.length, icon: Package, color: "bg-blue-50 text-blue-600" },
                                            { label: t.profile.favorites, val: "12", icon: ShoppingBag, color: "bg-pink-50 text-pink-600" },
                                            { label: t.profile.bonuses, val: "450 ₸", icon: CheckCircle2, color: "bg-yellow-50 text-yellow-600" }
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -5 }}
                                                className="bg-white/60 backdrop-blur-3xl rounded-[2rem] border border-white p-6 shadow-sm flex items-center gap-4 cursor-default"
                                            >
                                                <div className={`p-4 rounded-2xl ${stat.color}`}>
                                                    <stat.icon size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-xl font-black text-gray-900">{stat.val}</p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "orders" && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between px-4">
                                        <h3 className="text-2xl font-black text-gray-900">{t.profile.ordersHistory}</h3>
                                        <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">{orders.length} {t.orders.itemsCount}</span>
                                    </div>

                                    {orders.length === 0 ? (
                                        <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-20 text-center border border-white">
                                            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
                                            <h4 className="text-2xl font-black text-gray-900 mb-2">{t.profile.noOrders}</h4>
                                            <p className="text-gray-400 font-medium mb-10">{t.profile.noOrdersDesc}</p>
                                            <Link href="/catalog">
                                                <button className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all">
                                                    {t.profile.toCatalog}
                                                </button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {orders.map((order) => (
                                                <div key={order.id} className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 group">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xl font-black text-gray-900">{t.orders.orderNo}{order.id}</span>
                                                                <span className="text-xs font-black px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-400 font-bold border-l-2 border-gray-100 pl-3">
                                                                {t.orders.placed} {formatDate(order.date)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-black text-gray-900">{formatPrice(order.totalPrice)}</p>
                                                            <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">{order.items.length} {t.orders.itemsCount}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100/50">
                                                        <div className="flex -space-x-3">
                                                            {order.items.slice(0, 4).map((item, idx) => (
                                                                <div key={idx} className="w-12 h-12 rounded-2xl border-2 border-white bg-white/50 p-2 shadow-sm">
                                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                                </div>
                                                            ))}
                                                            {order.items.length > 4 && (
                                                                <div className="w-12 h-12 rounded-2xl border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-black shadow-sm">
                                                                    +{order.items.length - 4}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button className="flex items-center gap-2 text-gray-900 font-black text-sm group-hover:text-green-600 transition-colors">
                                                            {t.orders.details}
                                                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "addresses" && (
                                <motion.div
                                    key="addresses"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between px-4">
                                        <h3 className="text-2xl font-black text-gray-900">{t.checkout.addressTitle}</h3>
                                        <button
                                            onClick={() => openAddressModal("add")}
                                            className="px-6 py-3 bg-green-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                                        >
                                            <Plus size={18} />
                                            <span>{t.profile.addAddress}</span>
                                        </button>
                                    </div>

                                    {/* Primary Onboarding Address */}
                                    <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white p-8 shadow-sm relative group overflow-hidden">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-4 bg-green-500 text-white rounded-2xl shadow-xl shadow-green-500/20">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-green-600">{t.profile.primaryAddress}</p>
                                                <h4 className="text-lg font-black text-gray-900">{profile.city}</h4>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 font-bold text-lg mb-2">
                                            {t.forms.street} {profile.street}, {t.forms.house} {profile.house}
                                            {profile.apartment && `, ${t.forms.apt} ${profile.apartment}`}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                            <span>{t.forms.entrance}: {profile.entrance || "-"}</span>
                                            <span>{t.forms.floor}: {profile.floor || "-"}</span>
                                        </div>

                                        <div className="absolute top-8 right-8 flex gap-2">
                                            <button
                                                onClick={() => openAddressModal("edit", "primary")}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Supplementary Addresses could be mapped here */}
                                    {(profile.addresses || []).map((addr, idx) => (
                                        <div key={idx} className="bg-white/40 border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between hover:bg-white/60 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-gray-100 text-gray-400 rounded-2xl">
                                                    <Navigation size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900">{addr.city}</h4>
                                                    <p className="text-gray-500 font-bold">{addr.street}, {addr.house}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAddress(idx)}
                                                className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            <AddressModal
                isOpen={isAddAddressModalOpen}
                onClose={() => setIsAddAddressModalOpen(false)}
                address={editingAddress === "primary" ? profile : profile.addresses?.[editingAddress] ?? null}
                onSave={handleSaveAddress}
                mode={addressModalMode}
            />
        </main>
    );
}
