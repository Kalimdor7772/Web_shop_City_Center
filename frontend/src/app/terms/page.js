"use client";
import React from 'react';
import { t } from '@/lib/i18n';
import { FileText } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        {t.info.terms.title}
                    </h1>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white">
                            <FileText size={24} />
                        </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                        {t.info.terms.desc}
                    </p>
                </div>
            </div>
        </div>
    );
}
