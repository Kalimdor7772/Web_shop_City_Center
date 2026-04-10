"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X, Heart, Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { t, localeNames, supportedLocales } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { locale, setLocale } = useLanguage();
    const { theme, mounted, setTheme } = useTheme();
    const activeTheme = mounted ? theme : "system";
    const { totalItems } = useCart();
    const { wishlistItems } = useWishlist();
    const { user, isAuthenticated, logout, isInitialized } = useAuth(); // Added isInitialized

    return (
        <nav className="fixed top-0 left-0 z-50 w-full px-3 py-3 md:px-5">
            <div className="glass-panel-strong mx-auto flex max-w-7xl items-center justify-between rounded-[2rem] border border-white/40 px-4 py-3 shadow-[0_18px_60px_rgba(111,85,36,0.14)] transition-all duration-300 md:px-6">
                <Link href="/" className="group flex items-center gap-1 text-2xl font-bold tracking-[0.22em] text-gray-900">
                    CITY<span className="font-black text-emerald-700 transition-colors group-hover:text-amber-500">CENTER</span>
                </Link>

                <div className="hidden items-center gap-3 rounded-full border border-white/50 bg-white/45 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] md:flex">
                    <Link href="/catalog" className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-white/80 hover:text-emerald-700">{t.nav.catalog}</Link>
                    <Link href="/deals" className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-white/80 hover:text-emerald-700">{t.nav.deals}</Link>
                    <Link href="/ai" className="rounded-full bg-[linear-gradient(135deg,rgba(31,157,104,0.16),rgba(247,183,51,0.2))] px-4 py-2 text-sm font-bold text-emerald-800 hover:shadow-[0_10px_24px_rgba(31,157,104,0.16)]">{t.nav.ai}</Link>
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    <button className="glass-panel flex h-11 w-11 items-center justify-center rounded-full text-gray-600 hover:-translate-y-0.5 hover:text-emerald-700" data-cursor="magnetic">
                        <Search size={20} />
                    </button>
                    <div className="glass-panel flex items-center gap-2 rounded-full px-2 py-1">
                        {supportedLocales.map((localeKey) => (
                            <button
                                key={localeKey}
                                type="button"
                                onClick={() => setLocale(localeKey)}
                                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${locale === localeKey ? 'bg-emerald-700 text-white shadow-[0_10px_24px_rgba(31,157,104,0.24)]' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}
                            >
                                {localeNames[localeKey]}
                            </button>
                        ))}
                    </div>
                    <div className="glass-panel flex items-center gap-1 rounded-full p-1">
                        {themeOptions.map(({ value, icon: Icon, label }) => (
                            <button
                                key={value}
                                type="button"
                                aria-label={`Switch to ${label.toLowerCase()} theme`}
                                onClick={() => setTheme(value)}
                                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                                    activeTheme === value
                                        ? "bg-emerald-700 text-white shadow-[0_10px_24px_rgba(31,157,104,0.24)]"
                                        : "text-gray-500 hover:bg-white hover:text-gray-900"
                                }`}
                            >
                                <Icon size={18} />
                            </button>
                        ))}
                    </div>

                    {!isInitialized ? (
                        <div className="h-10 w-24 animate-pulse rounded-full bg-white/60" />
                    ) : isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-gray-600 transition-colors hover:text-emerald-700 focus:outline-none"
                            >
                                <span className="text-sm font-semibold">
                                    {user?.role === 'GUEST' ? t.nav.guest : (user?.firstName || user?.name || 'User')}
                                </span>
                                <div className="rounded-full bg-white/80 p-1.5">
                                    <User size={18} />
                                </div>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="glass-panel-strong absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-[1.75rem] py-1"
                                    >
                                        <div className="border-b border-amber-100/80 px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.name || 'User')}
                                            </p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="block px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-white/80 hover:text-gray-900"
                                        >
                                            {t.nav.profile}
                                        </Link>
                                        <Link
                                            href="/orders"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="block px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-white/80 hover:text-gray-900"
                                        >
                                            {t.orders.title || 'Orders'}
                                        </Link>
                                        <div className="my-1 h-px bg-amber-100/80"></div>
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                logout();
                                            }}
                                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50/80"
                                        >
                                            {t.nav.logout}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/login" className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 font-medium text-gray-600 hover:text-emerald-700">
                            <User size={20} />
                            <span>{t.nav.login}</span>
                        </Link>
                    )}

                    <Link href="/wishlist" className="glass-panel group relative rounded-full p-2 text-gray-600 transition-colors hover:text-red-500">
                        <Heart size={20} className="group-hover:scale-110 transition-transform" />
                        {wishlistItems.length > 0 && (
                            <span className="absolute right-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white/80">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>

                    <Link href="/cart" className="glass-panel group relative rounded-full p-2 text-gray-600 transition-colors hover:text-emerald-700">
                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                        {totalItems > 0 && (
                            <span className="absolute right-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white shadow-sm ring-2 ring-white/80">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>

                <button className="glass-panel rounded-full p-2 text-gray-900 transition-colors md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-panel-strong mx-3 mt-3 overflow-hidden rounded-[2rem] md:hidden"
                    >
                        <div className="container mx-auto flex flex-col gap-4 px-6 py-6">
                            <Link href="/catalog" onClick={() => setIsOpen(false)} className="border-b border-amber-100/80 py-2 text-lg font-medium text-gray-800">{t.nav.catalog}</Link>
                            <Link href="/deals" onClick={() => setIsOpen(false)} className="border-b border-amber-100/80 py-2 text-lg font-medium text-emerald-700">{t.nav.deals}</Link>
                            <Link href="/ai" onClick={() => setIsOpen(false)} className="border-b border-amber-100/80 py-2 text-lg font-medium text-gray-800">{t.nav.ai}</Link>
                            <div className="flex gap-4 mt-2">
                                <Link href="/cart" onClick={() => setIsOpen(false)} className="flex-1 rounded-2xl bg-emerald-700 py-3 text-center font-bold text-white shadow-[0_12px_24px_rgba(31,157,104,0.24)]">
                                    {t.nav.cart} ({totalItems})
                                </Link>
                                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex-1 rounded-2xl bg-white/80 py-3 text-center font-bold text-gray-900">
                                    {t.nav.profile}
                                </Link>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {supportedLocales.map((localeKey) => (
                                    <button
                                        type="button"
                                        key={localeKey}
                                        onClick={() => setLocale(localeKey)}
                                        className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${locale === localeKey ? 'border-emerald-700 bg-emerald-50 text-emerald-700' : 'border-amber-100 bg-white/70 text-gray-600 hover:border-amber-200 hover:bg-white'}`}
                                    >
                                        {localeNames[localeKey]}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-2 flex gap-2">
                                {themeOptions.map(({ value, icon: Icon, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        aria-label={`Switch to ${label.toLowerCase()} theme`}
                                        onClick={() => setTheme(value)}
                                        className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl px-3 font-semibold transition ${
                                            activeTheme === value
                                                ? "bg-emerald-700 text-white"
                                                : "bg-white/70 text-gray-700"
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
