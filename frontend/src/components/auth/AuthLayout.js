"use client";

import React from "react";
import AuthCard from "./AuthCard";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";

const FloatingElement = ({ className, delay }) => (
    <motion.div
        className={`absolute rounded-full blur-3xl opacity-40 mix-blend-multiply ${className}`}
        animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut",
        }}
    />
);

const AuthLayout = ({ initialView }) => {
    return (
        <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden relative">
            {/* Background elements visible on both mobile/desktop but subtle */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <FloatingElement className="bg-green-300 w-96 h-96 -top-20 -left-20" delay={0} />
                <FloatingElement className="bg-blue-300 w-96 h-96 top-40 right-10" delay={2} />
                <FloatingElement className="bg-yellow-200 w-80 h-80 bottom-0 left-1/4" delay={4} />
            </div>

            {/* Left Side - Visual & Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center z-10 p-12">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl relative"
                >
                    {/* Glass Decor Background */}
                    <div className="absolute -inset-10 bg-white/30 backdrop-blur-2xl rounded-[3rem] -z-10 shadow-2xl border border-white/40" />

                    <div className="mb-8 flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                            <ShoppingBag className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
                            CITY<span className="text-green-600">CENTER</span>
                        </span>
                    </div>

                    <h1 className="text-6xl font-extrabold font-heading text-gray-900 mb-8 leading-[1.1]">
                        {t.auth.layout.title} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-500">Future</span> {t.auth.layout.subtitle}
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium">
                        {t.auth.layout.desc}
                    </p>

                    <div className="mt-12 flex gap-6">
                        <div className="flex -space-x-4 overflow-hidden p-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm items-center">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                            ))}
                            <span className="pl-6 pr-4 text-sm font-bold text-gray-700">+10k Users</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-20 overflow-y-auto">
                {/* Mobile Header / Back Link */}
                <div className="absolute top-6 left-6 z-30">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors group px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold">{t.auth.back}</span>
                    </Link>
                </div>

                <div className="w-full max-w-[440px] my-auto">
                    {/* Mobile Branding */}
                    <div className="lg:hidden flex flex-col items-center mb-8">
                        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 mb-4">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold font-heading text-gray-900">
                            {t.auth.welcome}
                        </h2>
                    </div>

                    <AuthCard initialView={initialView} />

                    {/* Footer Links */}
                    <div className="mt-8 text-center pb-8 lg:pb-0">
                        <p className="text-xs text-gray-400 font-medium">
                            {t.auth.terms} <span className="underline cursor-pointer hover:text-gray-600">{t.auth.termsLink}</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
