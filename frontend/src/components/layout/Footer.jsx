import Link from "next/link";
import { CreditCard, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-20 rounded-t-[3rem] bg-gray-900 pb-10 pt-20 text-gray-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-8">
                <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-black tracking-tighter text-white">
                                CITY<span className="text-green-500">CENTER</span>
                            </span>
                        </Link>
                        <p className="max-w-xs text-sm font-medium leading-relaxed">
                            Свежие продукты, удобный выбор и быстрая доставка каждый день.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink href="#" icon={Instagram} />
                            <SocialLink href="#" icon={Facebook} />
                            <SocialLink href="#" icon={Twitter} />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 text-lg font-black text-white">Навигация</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><FooterLink href="/catalog">Каталог</FooterLink></li>
                            <li><FooterLink href="/deals">Акции</FooterLink></li>
                            <li><FooterLink href="/profile">Профиль</FooterLink></li>
                            <li><FooterLink href="/cart">Корзина</FooterLink></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-lg font-black text-white">Контакты</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-green-500" />
                                <span>+7 (777) 123-45-67</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-green-500" />
                                <span>support@citycenter.kz</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="shrink-0 text-green-500" />
                                <span>Алматы, пр. Аль-Фараби, 77/7</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 text-lg font-black text-white">Оплата</h4>
                        <div className="mb-6 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                                <span className="font-black text-white">Kaspi.kz</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                                <CreditCard size={16} />
                                <span className="font-black text-white">Visa/MC</span>
                            </div>
                        </div>
                        <p className="text-xs font-medium opacity-50">
                            Принимаем Kaspi QR, банковские карты и онлайн-оплату.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row md:text-left">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                        © {new Date().getFullYear()} CITY CENTER. Все права защищены.
                    </p>
                    <div className="flex gap-6 text-xs font-bold opacity-60">
                        <Link href="#" className="transition-colors hover:text-white">Политика конфиденциальности</Link>
                        <Link href="#" className="transition-colors hover:text-white">Условия использования</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon }) {
    return (
        <a
            href={href}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-green-500 hover:text-white"
        >
            <Icon size={18} />
        </a>
    );
}

function FooterLink({ href, children }) {
    return (
        <Link
            href={href}
            className="block transition-all duration-300 hover:pl-2 hover:text-green-400"
        >
            {children}
        </Link>
    );
}
