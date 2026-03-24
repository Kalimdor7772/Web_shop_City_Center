"use client";
import React from 'react';
import { t } from '@/lib/i18n';
import { RefreshCcw, CheckCircle } from 'lucide-react';

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {t.info.returns.title}
                    </h1>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                        {t.info.returns.subtitle}
                    </p>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[2rem] mb-8">
                    <p className="text-lg text-gray-300 leading-relaxed mb-8">
                        {t.info.returns.desc}
                    </p>

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <RefreshCcw className="text-neon-blue" />
                        {t.info.returns.rules}
                    </h3>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-4">
                            <CheckCircle size={24} className="text-green-500 shrink-0" />
                            <span className="text-gray-400">{t.info.returns.rule1}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <CheckCircle size={24} className="text-green-500 shrink-0" />
                            <span className="text-gray-400">{t.info.returns.rule2}</span>
                        </li>
                    </ul>
                </div>

                <div className="text-center">
                    <p className="text-gray-500">{t.info.returns.contact}</p>
                </div>
            </div>
        </div>
    );
}
