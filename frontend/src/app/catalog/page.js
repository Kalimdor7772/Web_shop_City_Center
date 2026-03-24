"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { useAI } from "../../context/AIContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Filter, Star, Search, ChevronRight, X, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CATALOG_STRUCTURE } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import * as productService from "@/services/product.service";

export default function CatalogPage() {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { showToast } = useToast();
    const { trackCategory } = useAI();
    const [products, setProducts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // UI State
    const [activeCategory, setActiveCategory] = useState("Все товары");
    const [activeSubcategory, setActiveSubcategory] = useState("Все");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalQuantity, setModalQuantity] = useState(1);

    // Filter States
    const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [weightFilter, setWeightFilter] = useState("all");

    // Initialize data from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getProducts({ limit: 100 });
                if (response.success) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchProducts();
    }, []);

    const uniqueBrands = useMemo(() => {
        if (!isLoaded || !products.length) return [];
        return [...new Set(products.map(p => p.brand).filter(Boolean))];
    }, [products, isLoaded]);

    const filteredProducts = useMemo(() => {
        if (!isLoaded) return [];
        let filtered = products;

        if (activeCategory !== "Все товары") {
            filtered = filtered.filter(p => p.category === activeCategory);
            if (activeSubcategory !== "Все") {
                filtered = filtered.filter(p => p.subcategory === activeSubcategory);
            }
        }

        if (searchQuery) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brand));
        }

        return filtered;
    }, [products, isLoaded, activeCategory, activeSubcategory, searchQuery, priceRange, selectedBrands]);

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setActiveSubcategory("Все");
        setSearchQuery("");
        if (cat !== "Все товары") {
            trackCategory(cat);
        }
    };

    const toggleBrand = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(prev => prev.filter(b => b !== brand));
        } else {
            setSelectedBrands(prev => [...prev, brand]);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setActiveSubcategory("Все");
        setPriceRange({ min: 0, max: 20000 });
        setSelectedBrands([]);
        setWeightFilter("all");
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setModalQuantity(1);
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#00A082] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Загрузка каталога...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 pt-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-heading font-extrabold mb-2 tracking-tight text-gray-900"
                        >
                            Каталог <span className="text-[#00A082]">Товаров</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 text-lg max-w-2xl font-light"
                        >
                            {activeCategory === "Все товары" ? "Поиск по всему каталогу" : activeCategory}
                        </motion.p>
                    </div>

                    <div className="flex w-full xl:w-auto gap-3 items-center">
                        <div className="relative group flex-grow md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#00A082] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={activeCategory === "Все товары" ? "Поиск везде..." : `Поиск в категории...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-full py-3 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:border-[#00A082] focus:ring-1 focus:ring-[#00A082] transition-all placeholder:text-gray-400 shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all border shadow-sm font-medium text-sm ${isFilterOpen || selectedBrands.length > 0 || weightFilter !== "all"
                                ? "bg-[#00A082]/10 border-[#00A082] text-[#00A082]"
                                : "bg-white text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <Filter size={18} />
                            <span className="hidden sm:inline">Фильтр</span>
                        </button>
                    </div>
                </div>

                {/* Category Navigation */}
                <div className="sticky top-20 z-30 bg-gray-50/95 backdrop-blur-xl py-4 -mx-4 px-4 md:mx-0 md:px-0 mb-6 border-b border-gray-200/50">
                    <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
                        <button
                            onClick={() => handleCategoryChange("Все товары")}
                            className={`px-6 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium text-sm md:text-base ${activeCategory === "Все товары"
                                ? "bg-gray-900 text-white shadow-lg"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900 shadow-sm"
                                }`}
                        >
                            Все товары
                        </button>
                        {Object.keys(CATALOG_STRUCTURE).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-6 py-2.5 rounded-xl whitespace-nowrap transition-all font-medium text-sm md:text-base ${activeCategory === cat
                                    ? "bg-[#00A082] text-white shadow-[#00A082]/30 shadow-lg"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900 shadow-sm"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {activeCategory !== "Все товары" && CATALOG_STRUCTURE[activeCategory] && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex overflow-x-auto gap-2 mt-4 no-scrollbar pb-1"
                            >
                                {CATALOG_STRUCTURE[activeCategory].map((sub) => (
                                    <button
                                        key={sub}
                                        onClick={() => setActiveSubcategory(sub)}
                                        className={`px-4 py-1.5 rounded-lg whitespace-nowrap transition-all text-sm border ${activeSubcategory === sub
                                            ? "border-[#bc13fe] text-[#bc13fe] bg-[#bc13fe]/5"
                                            : "border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => openProductModal(product)}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200 mt-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <p className="text-xl font-medium text-gray-900">Товары не найдены</p>
                        <p className="text-sm text-gray-500 mt-2 mb-6">Попробуйте изменить параметры поиска</p>
                        <button onClick={handleClearFilters} className="text-[#00A082] font-semibold hover:underline">
                            Сбросить все фильтры
                        </button>
                    </div>
                )}

                {/* Filter Modal */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <div className="fixed inset-0 z-50 flex justify-end">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsFilterOpen(false)}
                                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="relative w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto"
                            >
                                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900">Фильтры</h2>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={24} className="text-gray-500" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-8">
                                    {/* Price Range */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-4">Цена ({priceRange.min} - {priceRange.max} ₸)</h3>
                                        <div className="flex gap-4">
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(p => ({ ...p, min: Number(e.target.value) }))}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-[#00A082] focus:ring-1 focus:ring-[#00A082] outline-none"
                                            />
                                            <span className="text-gray-400 self-center">-</span>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(p => ({ ...p, max: Number(e.target.value) }))}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-[#00A082] focus:ring-1 focus:ring-[#00A082] outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Brands */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-4">Бренд</h3>
                                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {uniqueBrands.map((brand) => (
                                                <label key={brand} className="flex items-center justify-between cursor-pointer group">
                                                    <span className={`transition-colors text-sm ${selectedBrands.includes(brand) ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>{brand}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBrands.includes(brand)}
                                                        onChange={() => toggleBrand(brand)}
                                                        className="w-5 h-5 accent-[#00A082]"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-gray-100">
                                    <div className="flex gap-4">
                                        <button
                                            className="flex-1 py-3 text-gray-500 hover:text-gray-900 transition-colors font-medium bg-gray-100/50 rounded-xl"
                                            onClick={handleClearFilters}
                                        >
                                            Сбросить
                                        </button>
                                        <button
                                            className="flex-[2] bg-[#00A082] text-white font-bold py-3 rounded-xl hover:bg-[#008f73] transition-colors shadow-lg shadow-[#00A082]/20"
                                            onClick={() => setIsFilterOpen(false)}
                                        >
                                            Показать ({filteredProducts.length})
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Product Quick View Modal */}
                <AnimatePresence>
                    {selectedProduct && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedProduct(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                            >
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/50 hover:bg-white text-gray-900 transition-colors shadow-sm backdrop-blur"
                                >
                                    <X size={20} />
                                </button>

                                {/* Image Section */}
                                <div className="w-full md:w-1/2 relative bg-gray-50 h-64 md:h-auto flex items-center justify-center p-8">
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </div>

                                {/* Info Section */}
                                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="text-[#00A082] text-xs font-bold uppercase tracking-wider bg-[#00A082]/10 px-2 py-1 rounded">{selectedProduct.category}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-500 text-sm">{selectedProduct.subcategory}</span>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2 leading-tight">
                                        {selectedProduct.name}
                                    </h2>

                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(st => (
                                                <Star key={st} size={16} className={`${st <= Math.round(selectedProduct.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                            ))}
                                        </div>
                                        <span className="text-gray-900 font-medium ml-1">{selectedProduct.rating}</span>
                                    </div>

                                    <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-2xl">
                                        <div className="flex justify-between border-b border-gray-200 pb-2">
                                            <span className="text-gray-500 text-sm">Производитель</span>
                                            <span className="text-gray-900 font-medium text-sm">{selectedProduct.brand}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-200 pb-2">
                                            <span className="text-gray-500 text-sm">Страна</span>
                                            <span className="text-gray-900 font-medium text-sm">{selectedProduct.country}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-end gap-3 mb-6">
                                            <span className="text-4xl font-bold text-gray-900">{formatPrice(selectedProduct.price)}</span>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex items-center bg-gray-100 rounded-xl px-2">
                                                <button
                                                    onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                                                    className="p-3 text-gray-500 hover:text-gray-900 transition-colors"
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-gray-900">{modalQuantity}</span>
                                                <button
                                                    onClick={() => setModalQuantity(q => q + 1)}
                                                    className="p-3 text-gray-500 hover:text-gray-900 transition-colors"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    for (let i = 0; i < modalQuantity; i++) {
                                                        addToCart(selectedProduct);
                                                    }
                                                    showToast("Товар добавлен в корзину", { label: "В корзину", href: "/cart" });
                                                    setSelectedProduct(null);
                                                }}
                                                className="flex-1 bg-[#00A082] text-white font-bold py-3.5 rounded-xl hover:bg-[#008f73] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#00A082]/20 hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
                                                <ShoppingCart size={20} />
                                                <span>В корзину — {formatPrice(selectedProduct.price * modalQuantity)}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
