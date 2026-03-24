"use client";
import React from 'react';
import { t } from '@/lib/i18n';
import { MapPin, Clock, CreditCard } from 'lucide-react';

export default function DeliveryPage() {
    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {t.info.delivery.title}
                    </h1>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                        {t.info.delivery.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
                        <MapPin size={40} className="text-neon-green mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">{t.info.delivery.zones}</h3>
                        <p className="text-gray-500 leading-relaxed">
                            {t.info.delivery.zonesDesc}
                        </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
                        <Clock size={40} className="text-neon-blue mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">{t.info.delivery.time}</h3>
                        <p className="text-gray-500 leading-relaxed">
                            {t.info.delivery.timeDesc}
                        </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-colors">
                        <CreditCard size={40} className="text-neon-purple mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">{t.info.delivery.payment}</h3>
                        <p className="text-gray-500 leading-relaxed">
                            {t.info.delivery.paymentDesc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
