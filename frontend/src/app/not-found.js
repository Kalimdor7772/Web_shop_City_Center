"use client";
import Link from 'next/link';
import { Home } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-6xl font-black text-white mb-4">404</h1>
                <h2 className="text-2xl font-bold text-white mb-4">{t.system.notFoundTitle}</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">{t.system.notFoundDesc}</p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-neon-green text-black font-bold rounded-xl hover:bg-white transition-colors"
                >
                    <Home size={20} />
                    {t.system.home}
                </Link>
            </div>
        </div>
    );
}
