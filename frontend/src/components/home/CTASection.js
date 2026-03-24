"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";

const CTASection = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden bg-[#00A082] rounded-[3rem] p-10 md:p-20 text-center shadow-2xl">
                    {/* Background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFC220] opacity-20 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 max-w-2xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {t.home.ctaTitle}
                        </h2>
                        <p className="text-white/90 text-xl mb-10 font-medium">
                            {t.home.ctaSubtitle}
                        </p>

                        <Link href="/catalog" className="inline-block">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-[#00A082] px-10 py-5 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                            >
                                {t.home.ctaButton}
                                <ArrowRight className="w-6 h-6" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
