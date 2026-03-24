"use client";
import React from 'react';
import { t } from '@/lib/i18n';
import { Lock } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        {t.info.privacy.title}
                    </h1>
                </div>

                <div className="space-y-6 text-gray-400 leading-relaxed">
                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                        <p className="mb-4">{t.info.privacy.desc}</p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Lock size={20} className="text-neon-green" />
                            {t.info.privacy.security}
                        </h3>
                        <p>{t.info.privacy.securityDesc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
