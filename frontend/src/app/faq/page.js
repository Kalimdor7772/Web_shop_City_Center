"use client";
import React from 'react';
import { t } from '@/lib/i18n';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {t.info.faq.title}
                    </h1>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                        {t.info.faq.subtitle}
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                            <HelpCircle size={24} className="text-neon-green" />
                            {t.info.faq.q1}
                        </h3>
                        <p className="text-gray-500 leading-relaxed pl-9">
                            {t.info.faq.a1}
                        </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                            <HelpCircle size={24} className="text-neon-blue" />
                            {t.info.faq.q2}
                        </h3>
                        <p className="text-gray-500 leading-relaxed pl-9">
                            {t.info.faq.a2}
                        </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                            <HelpCircle size={24} className="text-neon-purple" />
                            {t.info.faq.q3}
                        </h3>
                        <p className="text-gray-500 leading-relaxed pl-9">
                            {t.info.faq.a3}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
