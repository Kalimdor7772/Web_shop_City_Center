"use client";
import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function CheckoutErrorPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 flex items-center justify-center">
            <div className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-xl max-w-lg text-center">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                    <AlertCircle size={48} />
                </div>

                <h1 className="text-2xl font-black text-gray-900 mb-4">{t.error.checkoutTitle}</h1>
                <p className="text-gray-500 mb-8">{t.error.checkoutDesc}</p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/checkout"
                        className="w-full py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={20} />
                        {t.error.retry}
                    </Link>
                    <Link
                        href="/"
                        className="w-full py-3.5 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        {t.error.return}
                    </Link>
                </div>
            </div>
        </div>
    );
}
