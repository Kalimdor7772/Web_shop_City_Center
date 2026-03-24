"use client";
import React from 'react';
import { t } from '@/lib/i18n';
import { Zap, Shield, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {t.info.about.title}
                    </h1>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                        {t.info.about.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
                    <div>
                        <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white/10">CITY CENTER</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {t.info.about.desc}
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {t.info.about.trustDesc}
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-neon-green/10 rounded-2xl flex items-center justify-center text-neon-green mb-6">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t.info.about.mission}</h3>
                        <p className="text-gray-500">{t.info.about.missionDesc}</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-neon-blue/10 rounded-2xl flex items-center justify-center text-neon-blue mb-6">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{t.info.about.trust}</h3>
                        <p className="text-gray-500">{t.info.about.trustDesc}</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-neon-purple/10 rounded-2xl flex items-center justify-center text-neon-purple mb-6">
                            <Heart size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Love & Care</h3>
                        <p className="text-gray-500">{t.home.trust.careDesc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
