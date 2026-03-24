"use client";
import React from 'react';
import { t } from '@/lib/i18n';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export default function ContactsPage() {
    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        {t.info.contacts.title}
                    </h1>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
                        {t.info.contacts.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0 text-white">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{t.info.contacts.office}</h3>
                                <p className="text-gray-500">{t.info.contacts.address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0 text-white">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{t.info.contacts.phone}</h3>
                                <p className="text-gray-500">+7 (777) 123-45-67</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0 text-white">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{t.info.contacts.email}</h3>
                                <p className="text-gray-500">support@citycenter.kz</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0 text-white">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{t.info.contacts.hours}</h3>
                                <p className="text-gray-500">{t.info.contacts.hoursDesc}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-3xl p-8 flex flex-col justify-between text-white">
                        <div>
                            <h3 className="text-3xl font-black mb-4">WhatsApp Support</h3>
                            <p className="opacity-90 leading-relaxed mb-8">
                                Напишите нам в WhatsApp для быстрого решения любых вопросов. Мы отвечаем в течение 5 минут.
                            </p>
                        </div>
                        <a href="#" className="flex items-center justify-center gap-3 bg-white text-green-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors">
                            <MessageCircle size={24} />
                            {t.info.contacts.whatsapp}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
