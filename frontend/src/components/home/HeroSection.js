"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { t } from "@/lib/i18n";

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-50 py-12 md:py-20">
            {/* Background Gradient Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "4s" }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-left"
                >
                    <div className="inline-block px-4 py-2 bg-white rounded-full mb-6 shadow-sm border border-gray-100">
                        <span className="text-green-600 font-semibold text-sm tracking-wide flex items-center gap-2">
                            {t.home.deliveryBadge}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold font-heading text-gray-900 leading-tight mb-6">
                        {t.home.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-lg leading-relaxed font-medium">
                        {t.home.heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/catalog" className="group flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-green-600/30 transform hover:-translate-y-1">
                            <ShoppingBag className="w-6 h-6" />
                            {t.home.shopNow}
                        </Link>
                        <Link href="/deals" className="group flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-md  border border-gray-100 transform hover:-translate-y-1">
                            {t.home.deals}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>

                {/* Right Illustration/Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-[400px] md:h-[500px] flex items-center justify-center hidden md:flex"
                >
                    {/* Abstract Phone/App visuals using CSS Shapes */}
                    <div className="relative w-80 h-[520px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden transform rotate-[-6deg] hover:rotate-[0deg] transition-all duration-500">
                        <div className="absolute top-0 left-0 w-full h-full bg-gray-50 flex flex-col pt-12 px-4 shadow-inner">
                            {/* Mock UI Header */}
                            <div className="flex justify-between items-center mb-6 px-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                <div className="w-24 h-4 rounded-full bg-gray-200"></div>
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                            </div>
                            {/* Mock UI Cards */}
                            <div className="space-y-4">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    className="h-32 rounded-2xl bg-green-50 border-2 border-green-100 relative flex items-center justify-center font-bold text-green-600"
                                >
                                    🍏 Fresh
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                                    className="h-24 rounded-2xl bg-yellow-50 border-2 border-yellow-100 relative flex items-center justify-center font-bold text-yellow-600"
                                >
                                    🍞 Bakery
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, -12, 0] }}
                                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                                    className="h-24 rounded-2xl bg-gray-100 border-2 border-gray-200 relative flex items-center justify-center font-bold text-gray-400"
                                >
                                    🍓 Berries
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Floating "stickers" or badges */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute top-20 right-0 lg:-right-8 bg-white p-4 rounded-2xl shadow-xl z-20 transform rotate-12 border border-blue-50"
                    >
                        <span className="text-4xl">🥑</span>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
                        className="absolute bottom-32 -left-4 lg:-left-12 bg-white p-4 rounded-2xl shadow-xl z-20 transform -rotate-12 border border-green-50"
                    >
                        <span className="text-4xl">🍕</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
