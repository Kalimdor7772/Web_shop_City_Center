"use client";

import Link from "next/link";
import { CreditCard, Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Twitter } from "lucide-react";
import { t } from "@/lib/i18n";

export default function Footer() {
    return (
        <footer className="mt-20 px-3 pb-6 pt-10 text-gray-500 md:px-5">
            <div className="glass-panel-strong mx-auto max-w-7xl rounded-[3rem] border border-white/40 px-4 pb-10 pt-16 sm:px-8">
                <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-black tracking-[0.18em] text-gray-900">
                                CITY<span className="text-emerald-700">CENTER</span>
                            </span>
                        </Link>
                        <p className="max-w-xs text-sm font-medium leading-relaxed">
                            {t.footer.brandDesc}
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={Instagram} />
                            <SocialLink icon={Facebook} />
                            <SocialLink icon={Twitter} />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 text-lg font-black text-gray-900">{t.footer.nav}</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><FooterLink href="/catalog">{t.nav.catalog}</FooterLink></li>
                            <li><FooterLink href="/deals">{t.nav.deals}</FooterLink></li>
                            <li><FooterLink href="/profile">{t.nav.profile}</FooterLink></li>
                            <li><FooterLink href="/cart">{t.nav.cart}</FooterLink></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-lg font-black text-gray-900">{t.footer.contacts}</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-emerald-700" />
                                <span>{t.info.contacts.phoneValue}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-emerald-700" />
                                <span>{t.info.contacts.emailValue}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="shrink-0 text-emerald-700" />
                                <span>{t.info.contacts.addressValue}</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-lg font-black text-gray-900">{t.footer.payment}</h4>
                        <div className="mb-6 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 rounded-2xl border border-amber-100 bg-white/70 px-4 py-2 shadow-sm">
                                <span className="font-black text-gray-900">Kaspi.kz</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl border border-amber-100 bg-white/70 px-4 py-2 shadow-sm">
                                <CreditCard size={16} />
                                <span className="font-black text-gray-900">Visa/MC</span>
                            </div>
                        </div>
                        <p className="text-xs font-medium opacity-70">
                            {t.footer.paymentDesc}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-700">
                            <ShieldCheck size={16} />
                            <span>{t.footer.secure}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-amber-100/80 pt-8 text-center md:flex-row md:text-left">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                        © {new Date().getFullYear()} CITY CENTER. {t.footer.rights}
                    </p>
                    <div className="flex gap-6 text-xs font-bold opacity-60">
                        <Link href="/privacy" className="transition-colors hover:text-gray-900">{t.footer.privacy}</Link>
                        <Link href="/terms" className="transition-colors hover:text-gray-900">{t.footer.terms}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon: Icon }) {
    return (
        <div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-100 bg-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:text-white"
        >
            <Icon size={18} />
        </div>
    );
}

function FooterLink({ href, children }) {
    return (
        <Link
            href={href}
            className="block transition-all duration-300 hover:pl-2 hover:text-emerald-700"
        >
            {children}
        </Link>
    );
}
