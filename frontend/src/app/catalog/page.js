"use client";
/* eslint-disable @next/next/no-img-element */
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Filter, Minus, Plus, Search, ShoppingCart, Sparkles, Star, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useAI } from "../../context/AIContext";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import * as productService from "@/services/product.service";

const ALL = "Все товары";
const promos = [
    { key: "meat", title: "Ужин без суеты", text: "Мясо, полуфабрикаты и быстрые ужины на каждый день.", cls: "from-emerald-200/80 to-amber-100", cat: "Мясо и рыба" },
    { key: "milk", title: "Завтрак на каждый день", text: "Молочные продукты, выпечка и свежее пополнение холодильника.", cls: "from-amber-200/80 to-rose-100", cat: "Молочные продукты" },
];

function Promo({ item, onPick }) {
    return (
        <motion.button whileHover={{ y: -6 }} onClick={() => onPick(item.cat)} className="section-shell group relative w-full overflow-hidden rounded-[2.4rem] p-7 text-left">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.cls} opacity-75`} />
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/30 blur-3xl transition-transform group-hover:scale-125" />
            <div className="relative z-10">
                <div className="glass-panel mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-stone-700">
                    <Sparkles size={12} className="text-amber-500" /> подборка
                </div>
                <h3 className="text-2xl font-black tracking-[-0.04em] text-gray-900">{item.title}</h3>
                <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-stone-600">{item.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-[1.1rem] bg-gray-900 px-5 py-3 text-sm font-black text-white">
                    Открыть <ArrowRight size={16} />
                </span>
            </div>
        </motion.button>
    );
}

function CatalogPageContent() {
    const searchParams = useSearchParams();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const { trackCategory } = useAI();
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [category, setCategory] = useState(ALL);
    const [query, setQuery] = useState("");
    const [brands, setBrands] = useState([]);
    const [range, setRange] = useState({ min: 0, max: 20000 });
    const [sort, setSort] = useState("popular");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [qty, setQty] = useState(1);
    const searchInputRef = useRef(null);

    const focusSearchInput = useCallback(() => {
        if (!searchInputRef.current) return;
        searchInputRef.current.focus();
        searchInputRef.current.select();
    }, []);

    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) setCategory(cat);
    }, [searchParams]);

    useEffect(() => {
        const handleFocusSearch = () => {
            requestAnimationFrame(() => {
                focusSearchInput();
            });
        };

        window.addEventListener("catalog:focus-search", handleFocusSearch);
        return () => window.removeEventListener("catalog:focus-search", handleFocusSearch);
    }, [focusSearchInput]);

    useEffect(() => {
        if (searchParams.get("focusSearch") !== "1") return undefined;

        const timer = window.setTimeout(() => {
            focusSearchInput();
        }, 120);

        return () => window.clearTimeout(timer);
    }, [focusSearchInput, searchParams]);

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                const response = await productService.getProducts({ page: 1, limit: 200 });
                if (!isMounted) return;
                setProducts(Array.isArray(response?.data) ? response.data : []);
            } catch (error) {
                if (!isMounted) return;
                showToast(error?.message || "Не удалось загрузить каталог");
                setProducts([]);
            } finally {
                if (isMounted) {
                    setLoaded(true);
                }
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, [showToast]);

    const categories = useMemo(() => [ALL, ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);
    const uniqueBrands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))], [products]);

    const filtered = useMemo(() => {
        let list = [...products];
        if (category !== ALL) list = list.filter((p) => p.category === category);
        if (query.trim()) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
        list = list.filter((p) => p.price >= range.min && p.price <= range.max);
        if (brands.length) list = list.filter((p) => brands.includes(p.brand));
        if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
        else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
        else list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        return list;
    }, [brands, category, products, query, range.max, range.min, sort]);

    const heroes = filtered.slice(0, 3);
    const strip = filtered.slice(0, 5);
    const feed = useMemo(() => {
        const out = [];
        filtered.forEach((p, i) => {
            out.push({ t: "p", p });
            if (i === 3) out.push({ t: "promo", p: promos[0] });
            if (i === 10) out.push({ t: "promo", p: promos[1] });
        });
        return out;
    }, [filtered]);

    const pickCategory = (next) => {
        setCategory(next);
        setQuery("");
        if (next !== ALL) trackCategory(next);
    };
    const clearAll = () => {
        setCategory(ALL);
        setQuery("");
        setBrands([]);
        setRange({ min: 0, max: 20000 });
        setSort("popular");
    };
    const toggleBrand = (brand) => setBrands((cur) => (cur.includes(brand) ? cur.filter((b) => b !== brand) : [...cur, brand]));
    const quickAdd = () => {
        for (let i = 0; i < qty; i += 1) addToCart(selected);
        showToast("Товар добавлен в корзину", { label: "В корзину", href: "/cart" });
        setSelected(null);
    };

    if (!loaded) {
        return (
            <div className="organic-section flex min-h-screen items-center justify-center px-4">
                <div className="section-shell flex flex-col items-center gap-4 rounded-[2rem] px-10 py-10">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" />
                    <p className="font-medium text-stone-600">Загрузка каталога...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-20 pt-24">
            <section className="organic-section px-3 py-8 md:px-5">
                <div className="section-shell mx-auto max-w-[1480px] overflow-hidden rounded-[3rem] px-4 py-6 md:px-8 md:py-8">
                    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="relative overflow-hidden rounded-[2.6rem] bg-[linear-gradient(135deg,rgba(255,252,245,0.96),rgba(250,244,231,0.86))] px-6 py-8 md:px-8 md:py-10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,183,51,0.16),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(31,157,104,0.14),transparent_28%)]" />
                            <div className="relative z-10">
                                <div className="glass-panel mb-6 inline-flex items-center gap-3 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-stone-700">
                                    <Sparkles size={12} className="text-amber-500" /> fresh selection
                                </div>
                                <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.05em] text-gray-900 md:text-7xl">
                                    Каталог,
                                    <br />
                                    который продаёт
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-stone-600 md:text-xl">
                                    Подборки на каждый день, быстрый поиск по категориям и живая витрина вместо скучного списка.
                                </p>
                                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                    <div className="group relative flex-grow sm:max-w-md">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 transition-colors group-hover:text-emerald-700" size={18} />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Искать продукты, бренды и любимые позиции..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className="glass-panel w-full rounded-full py-4 pl-12 pr-5 text-sm font-medium text-gray-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <button onClick={() => setFiltersOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-4 text-sm font-black text-white shadow-[0_18px_30px_rgba(31,157,104,0.22)] transition-all hover:-translate-y-0.5 hover:bg-emerald-800">
                                        <Filter size={18} /> Все фильтры
                                    </button>
                                </div>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    {["Мясо и рыба", "Молочные продукты", "Фрукты и овощи", "Бакалея"].map((chip) => (
                                        <button key={chip} onClick={() => pickCategory(chip)} className="glass-panel rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-stone-600 transition-all hover:bg-white hover:text-emerald-700">
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                            {heroes.map((p) => (
                                <motion.button key={p.id} whileHover={{ y: -4 }} onClick={() => { setSelected(p); setQty(1); }} className="section-shell relative overflow-hidden rounded-[2rem] p-5 text-left">
                                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,157,104,0.12),rgba(247,183,51,0.10))]" />
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,238,223,0.86))] p-4">
                                            <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">{p.category}</p>
                                            <h3 className="mt-2 line-clamp-2 text-lg font-black text-gray-900">{p.name}</h3>
                                            <div className="mt-3 flex items-center gap-2 text-sm font-bold text-stone-500">
                                                <Star size={14} className="fill-yellow-400 text-yellow-400" /><span>{p.rating || "4.8"}</span><span className="text-stone-300">•</span><span>{p.brand}</span>
                                            </div>
                                            <p className="mt-3 text-xl font-black text-emerald-700">{formatPrice(p.price)}</p>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="organic-section px-3 pb-6 md:px-5">
                <div className="mx-auto max-w-[1480px]">
                    <div className="z-30 mb-5 rounded-[1.6rem] border border-white/60 bg-[linear-gradient(180deg,rgba(252,248,239,0.94),rgba(248,243,231,0.88))] px-3 py-3 backdrop-blur-xl md:sticky md:top-20 md:-mx-3 md:rounded-[2rem] md:px-4 md:py-4 xl:mx-0">
                        <div className="flex flex-col gap-3 md:gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
                            {categories.map((item) => (
                                <button key={item} onClick={() => pickCategory(item)} className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-black transition-all sm:px-5 sm:py-3 sm:text-sm ${category === item ? "bg-gray-900 text-white shadow-lg" : "glass-panel text-gray-600 hover:text-gray-900"}`}>
                                    {item}
                                </button>
                            ))}
                        </div>
                        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
                            {[["popular", "Популярные"], ["price-asc", "Сначала дешевле"], ["price-desc", "Сначала дороже"]].map(([id, label]) => (
                                <button key={id} onClick={() => setSort(id)} className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] transition-all sm:text-xs sm:tracking-[0.18em] ${sort === id ? "bg-emerald-700 text-white shadow-[0_14px_22px_rgba(31,157,104,0.22)]" : "glass-panel text-stone-500 hover:text-gray-900"}`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        </div>
                    </div>

                    <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="section-shell rounded-[2.2rem] px-6 py-5">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">сейчас в фокусе</p>
                            <div className="mt-3 flex flex-wrap items-center gap-4">
                                <h2 className="text-3xl font-black tracking-[-0.04em] text-gray-900">{category === ALL ? "Вся витрина магазина" : category}</h2>
                                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">{filtered.length} товаров</span>
                            </div>
                            <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-stone-600">Каталог собран как витрина бренда: большой верх, быстрые сценарии, промо-вставки и живая сетка с акцентами.</p>
                        </div>
                        <div className="section-shell rounded-[2.2rem] px-6 py-5">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">быстрые бренды</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {uniqueBrands.slice(0, 8).map((brand) => (
                                    <button key={brand} onClick={() => toggleBrand(brand)} className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${brands.includes(brand) ? "bg-amber-100 text-amber-900" : "glass-panel text-stone-600 hover:text-gray-900"}`}>
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {strip.length > 0 && (
                        <div className="mb-8 overflow-x-auto no-scrollbar">
                            <div className="flex gap-4 pb-2">
                                {strip.map((p) => (
                                    <button key={`strip-${p.id}`} onClick={() => { setSelected(p); setQty(1); }} className="glass-panel flex min-w-[260px] items-center gap-4 rounded-[1.8rem] p-4 text-left transition-all hover:bg-white">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,238,223,0.86))] p-3">
                                            <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="line-clamp-1 text-sm font-black text-gray-900">{p.name}</p>
                                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-400">{p.brand}</p>
                                            <p className="mt-2 text-lg font-black text-emerald-700">{formatPrice(p.price)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {feed.map((item, i) => item.t === "promo" ? (
                            <div key={`promo-${item.p.key}-${i}`} className="xl:col-span-2">
                                <Promo item={item.p} onPick={pickCategory} />
                            </div>
                        ) : (
                            <div
                                key={item.p.id}
                                className={`${
                                    i % 9 === 0
                                        ? "md:col-span-2 xl:col-span-2"
                                        : i % 7 === 0
                                            ? "xl:translate-y-4"
                                            : ""
                                }`}
                            >
                                <ProductCard
                                    product={item.p}
                                    compact={!(i % 9 === 0)}
                                    onClick={() => { setSelected(item.p); setQty(1); }}
                                />
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="glass-panel-strong mt-8 rounded-[2rem] border border-dashed border-white/70 py-20 text-center text-gray-500">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/70"><Search size={24} className="text-gray-400" /></div>
                            <p className="text-xl font-medium text-gray-900">Товары не найдены</p>
                            <p className="mb-6 mt-2 text-sm text-gray-500">Попробуйте изменить категорию, цену или выбрать другой бренд.</p>
                            <button onClick={clearAll} className="font-semibold text-emerald-700 hover:underline">Сбросить все фильтры</button>
                        </div>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {filtersOpen && (
                    <div className="fixed inset-0 z-[70] flex justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="section-shell relative h-full w-full max-w-sm overflow-y-auto rounded-l-[2rem] shadow-2xl">
                            <div className="flex items-center justify-between border-b border-white/70 p-6">
                                <h2 className="text-xl font-bold text-gray-900">Фильтры каталога</h2>
                                <button onClick={() => setFiltersOpen(false)} className="glass-panel rounded-full p-2 text-gray-500 transition-colors hover:bg-white"><X size={24} /></button>
                            </div>
                            <div className="space-y-8 p-6 pb-32">
                                <div>
                                    <h3 className="mb-4 text-sm font-bold text-gray-900">Цена ({range.min} - {range.max} ₸)</h3>
                                    <div className="flex gap-4">
                                        <input type="number" value={range.min} onChange={(e) => setRange((c) => ({ ...c, min: Number(e.target.value) }))} className="w-full rounded-lg border border-white/70 bg-white/70 px-4 py-2 text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                                        <span className="self-center text-gray-400">-</span>
                                        <input type="number" value={range.max} onChange={(e) => setRange((c) => ({ ...c, max: Number(e.target.value) }))} className="w-full rounded-lg border border-white/70 bg-white/70 px-4 py-2 text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="mb-4 text-sm font-bold text-gray-900">Бренды</h3>
                                    <div className="custom-scrollbar max-h-56 space-y-3 overflow-y-auto pr-2">
                                        {uniqueBrands.map((brand) => (
                                            <label key={brand} className="group flex cursor-pointer items-center justify-between">
                                                <span className={`text-sm transition-colors ${brands.includes(brand) ? "font-medium text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}>{brand}</span>
                                                <input type="checkbox" checked={brands.includes(brand)} onChange={() => toggleBrand(brand)} className="h-5 w-5 accent-[#00A082]" />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full border-t border-white/70 bg-[rgba(253,249,241,0.86)] p-6 backdrop-blur-xl">
                                <div className="flex gap-4">
                                    <button className="flex-1 rounded-xl bg-white/70 py-3 font-medium text-gray-500 transition-colors hover:text-gray-900" onClick={clearAll}>Сбросить</button>
                                    <button className="flex-[2] rounded-xl bg-emerald-700 py-3 font-bold text-white shadow-lg shadow-emerald-700/20 transition-colors hover:bg-emerald-800" onClick={() => setFiltersOpen(false)}>Показать ({filtered.length})</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="section-shell relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] shadow-2xl md:flex-row">
                            <button onClick={() => setSelected(null)} className="glass-panel absolute right-4 top-4 z-10 rounded-full p-2 text-gray-900 transition-colors hover:bg-white"><X size={20} /></button>
                            <div className="relative flex h-64 w-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,238,223,0.86))] p-8 md:h-auto md:w-1/2">
                                <img src={selected.image} alt={selected.name} className="h-full w-full object-contain" />
                            </div>
                            <div className="flex w-full flex-col overflow-y-auto p-6 md:w-1/2 md:p-10">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="rounded bg-emerald-700/10 px-2 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">{selected.category}</span>
                                    <span className="text-gray-300">•</span><span className="text-sm text-gray-500">{selected.brand}</span>
                                </div>
                                <h2 className="mb-2 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">{selected.name}</h2>
                                <div className="mb-6 flex items-center gap-2">
                                    <div className="flex">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} className={s <= Math.round(selected.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}</div>
                                    <span className="ml-1 font-medium text-gray-900">{selected.rating}</span>
                                </div>
                                <div className="mb-8 space-y-4 rounded-2xl bg-white/70 p-4">
                                    <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-sm text-gray-500">Производитель</span><span className="text-sm font-medium text-gray-900">{selected.brand}</span></div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2"><span className="text-sm text-gray-500">Страна</span><span className="text-sm font-medium text-gray-900">{selected.country}</span></div>
                                </div>
                                <div className="mt-auto">
                                    <div className="mb-6 flex items-end gap-3"><span className="text-4xl font-bold text-gray-900">{formatPrice(selected.price)}</span></div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center rounded-xl bg-white/80 px-2">
                                            <button onClick={() => setQty((c) => Math.max(1, c - 1))} className="p-3 text-gray-500 transition-colors hover:text-gray-900"><Minus size={18} /></button>
                                            <span className="w-8 text-center font-bold text-gray-900">{qty}</span>
                                            <button onClick={() => setQty((c) => c + 1)} className="p-3 text-gray-500 transition-colors hover:text-gray-900"><Plus size={18} /></button>
                                        </div>
                                        <button onClick={quickAdd} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 font-bold text-white shadow-lg shadow-emerald-700/20 transition-colors duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl">
                                            <ShoppingCart size={20} /><span>В корзину — {formatPrice(selected.price * qty)}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function CatalogPage() {
    return (
        <Suspense fallback={<div className="organic-section flex min-h-screen items-center justify-center px-4 pt-24 text-emerald-700">Загрузка...</div>}>
            <CatalogPageContent />
        </Suspense>
    );
}
