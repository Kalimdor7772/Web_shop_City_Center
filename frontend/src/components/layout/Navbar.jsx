"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { t } from "@/lib/i18n";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { totalItems } = useCart();
    const { wishlistItems } = useWishlist();
    const { user, isAuthenticated, logout, isInitialized } = useAuth(); // Added isInitialized

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold font-heading text-gray-900 tracking-wider flex items-center gap-1 group">
                    CITY<span className="text-green-600 group-hover:text-green-700 transition-colors">CENTER</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-medium">
                    <Link href="/catalog" className="text-gray-600 hover:text-green-600 transition-colors">{t.nav.catalog}</Link>
                    <Link href="/deals" className="text-gray-600 hover:text-green-600 transition-colors">{t.nav.deals}</Link>
                    <Link href="/ai" className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500 hover:opacity-80 transition-opacity font-bold">{t.nav.ai}</Link>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <button className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer p-2 hover:bg-gray-100 rounded-full">
                        <Search size={20} />
                    </button>

                    {!isInitialized ? (
                        // Loading skeleton for auth section
                        <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-full" />
                    ) : isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors focus:outline-none"
                            >
                                <span className="text-sm font-semibold">
                                    {user?.role === 'GUEST' ? t.nav.guest : (user?.firstName || user?.name || 'User')}
                                </span>
                                <div className="bg-gray-100 p-1.5 rounded-full">
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
                                        className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-1 z-50"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.name || 'User')}
                                            </p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                        >
                                            {t.nav.profile}
                                        </Link>
                                        <Link
                                            href="/orders"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                        >
                                            {t.profile.orderHistory}
                                        </Link>
                                        <div className="h-px bg-gray-50 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                logout();
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                                        >
                                            {t.nav.logout}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/login" className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2 font-medium px-4 py-2 rounded-full hover:bg-gray-50">
                            <User size={20} />
                            <span>{t.nav.login}</span>
                        </Link>
                    )}

                    {/* Wishlist Indicator */}
                    <Link href="/wishlist" className="relative text-gray-600 hover:text-red-500 transition-colors cursor-pointer p-2 hover:bg-red-50 rounded-full group">
                        <Heart size={20} className="group-hover:scale-110 transition-transform" />
                        {wishlistItems.length > 0 && (
                            <span className="absolute top-1 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>

                    {/* Cart Indicator */}
                    <Link href="/cart" className="relative text-gray-600 hover:text-green-600 transition-colors cursor-pointer p-2 hover:bg-green-600/10 rounded-full group">
                        <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-0 bg-green-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
                    >
                        <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                            <Link href="/catalog" onClick={() => setIsOpen(false)} className="text-lg text-gray-800 font-medium py-2 border-b border-gray-50">{t.nav.catalog}</Link>
                            <Link href="/deals" onClick={() => setIsOpen(false)} className="text-lg text-green-600 font-medium py-2 border-b border-gray-50">{t.nav.deals}</Link>
                            <Link href="/ai" onClick={() => setIsOpen(false)} className="text-lg text-gray-800 font-medium py-2 border-b border-gray-50">{t.nav.ai}</Link>
                            <div className="flex gap-4 mt-2">
                                <Link href="/cart" onClick={() => setIsOpen(false)} className="flex-1 bg-green-600 text-white text-center py-3 rounded-xl font-bold">
                                    {t.nav.cart} ({totalItems})
                                </Link>
                                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex-1 bg-gray-100 text-gray-900 text-center py-3 rounded-xl font-bold">
                                    {t.nav.profile}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
