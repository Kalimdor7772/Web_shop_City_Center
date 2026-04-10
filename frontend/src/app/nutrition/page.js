"use client";

import Link from "next/link";
import { ArrowLeft, BarChart3, Beef, Droplets, Flame, Wheat } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { calculateCartNutrition } from "@/lib/nutrition";
import { formatPrice } from "@/lib/utils";

const SummaryCard = ({ icon: Icon, label, value, accent }) => (
    <div className="glass-panel-strong rounded-[2rem] p-5">
        <div className={`mb-4 inline-flex rounded-[1.25rem] p-3 ${accent}`}>
            <Icon size={20} />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">{label}</p>
        <p className="mt-2 text-3xl font-black text-gray-900">{value}</p>
    </div>
);

export default function NutritionPage() {
    const { cartItems, totalPrice, totalItems } = useCart();
    const nutrition = calculateCartNutrition(cartItems);

    if (cartItems.length === 0) {
        return (
            <main className="organic-section min-h-screen px-4 pt-24">
                <div className="mx-auto max-w-2xl">
                    <div className="section-shell rounded-[3rem] p-10 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                            <BarChart3 size={36} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900">КБЖУ корзины</h1>
                        <p className="mt-3 text-stone-600">
                            Корзина пока пустая. Добавьте товары, и я покажу ориентировочные калории, белки, жиры и углеводы по всей покупке.
                        </p>
                        <div className="mt-8 flex justify-center gap-3">
                            <Link href="/cart" className="glass-panel rounded-[1.4rem] px-6 py-3 font-black text-gray-900 transition-colors hover:bg-white/80">
                                Перейти в корзину
                            </Link>
                            <Link href="/catalog" className="rounded-[1.4rem] bg-emerald-700 px-6 py-3 font-black text-white transition-colors hover:bg-emerald-800">
                                Открыть каталог
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pb-20 pt-24">
            <section className="organic-section px-3 py-8 md:px-5">
                <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-4 py-8 md:px-6 md:py-10">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <Link href="/cart" className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-stone-400 transition-colors hover:text-gray-900">
                                <ArrowLeft size={16} />
                                Назад в корзину
                            </Link>
                            <h1 className="text-4xl font-black tracking-tight text-gray-900">КБЖУ корзины</h1>
                            <p className="mt-2 max-w-3xl text-stone-600">
                                Это ориентировочный расчёт по товарам в корзине. Для части позиций используются усреднённые значения по категории или типу продукта.
                            </p>
                        </div>

                        <div className="glass-panel rounded-[2rem] px-6 py-4">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Итого по корзине</p>
                            <div className="mt-2 flex items-baseline gap-3">
                                <span className="text-3xl font-black text-gray-900">{formatPrice(totalPrice)}</span>
                                <span className="text-sm font-bold text-stone-400">{totalItems} шт.</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard icon={Flame} label="Калории" value={`${nutrition.summary.calories} ккал`} accent="bg-orange-50 text-orange-500" />
                        <SummaryCard icon={Beef} label="Белки" value={`${nutrition.summary.protein} г`} accent="bg-rose-50 text-rose-500" />
                        <SummaryCard icon={Droplets} label="Жиры" value={`${nutrition.summary.fat} г`} accent="bg-blue-50 text-blue-500" />
                        <SummaryCard icon={Wheat} label="Углеводы" value={`${nutrition.summary.carbs} г`} accent="bg-amber-50 text-amber-500" />
                    </div>

                    <div className="section-shell mt-8 overflow-hidden rounded-[2.5rem] p-0">
                        <div className="border-b border-white/70 px-6 py-5">
                            <h2 className="text-2xl font-black text-gray-900">Разбор по товарам</h2>
                            <p className="mt-1 text-sm text-stone-600">Расчёт идёт по предполагаемому весу или упаковке каждой позиции.</p>
                        </div>

                        <div className="divide-y divide-white/70">
                            {nutrition.items.map((item) => (
                                <div key={item.id} className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(110px,1fr))] lg:items-center">
                                    <div>
                                        <p className="text-lg font-black text-gray-900">{item.name}</p>
                                        <p className="mt-1 text-sm text-stone-600">
                                            {item.quantity} x {item.nutrition.basis} • {item.nutrition.source === "database" ? "данные из каталога" : "оценка по каталогу"}
                                        </p>
                                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                                            {item.nutrition.servingGrams} г или мл на единицу
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">Ккал</p>
                                        <p className="mt-1 text-lg font-black text-gray-900">{item.totals.calories}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">Белки</p>
                                        <p className="mt-1 text-lg font-black text-gray-900">{item.totals.protein} г</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">Жиры</p>
                                        <p className="mt-1 text-lg font-black text-gray-900">{item.totals.fat} г</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-400">Углеводы</p>
                                        <p className="mt-1 text-lg font-black text-gray-900">{item.totals.carbs} г</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
