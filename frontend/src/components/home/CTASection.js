"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";

export default function CTASection() {
    return (
        <section className="organic-section px-3 py-10 md:px-5">
            <div className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-[3rem] bg-[linear-gradient(135deg,#147a54_0%,#1f9d68_45%,#f0b53c_130%)] p-10 text-center text-white shadow-[0_30px_90px_rgba(31,157,104,0.26)] md:p-20">
                    <div className="absolute right-[-8%] top-[-12%] h-72 w-72 rounded-full bg-white/12 blur-3xl" />
                    <div className="absolute bottom-[-18%] left-[-8%] h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 mx-auto max-w-2xl"
                    >
                        <h2 className="text-4xl font-black leading-tight md:text-5xl">
                            {t.home.ctaTitle}
                        </h2>
                        <p className="mt-6 text-xl font-medium text-white/88">
                            {t.home.ctaSubtitle}
                        </p>

                        <Link href="/catalog" className="inline-block">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-10 flex items-center gap-3 rounded-[1.5rem] bg-white px-10 py-5 text-xl font-bold text-emerald-800 shadow-[0_18px_40px_rgba(255,255,255,0.2)]"
                            >
                                {t.home.ctaButton}
                                <ArrowRight className="h-6 w-6" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
