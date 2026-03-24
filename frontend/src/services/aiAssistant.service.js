
import { products } from "@/lib/data";

/**
 * Enhanced Rule-based mapping for complementary products.
 * Maps: Keyword in Product Name -> Array of related Keywords (or Category names)
 */
const RELATED_MAP = {
    // Dairy
    "Молоко": ["Печенье", "Хлеб", "Кофе", "Хлопья"],
    "Кефир": ["Булочка", "Хлеб"],
    "Творог": ["Сметана", "Ягоды", "Мед"],
    "Сыр": ["Вино", "Крекеры", "Виноград", "Паста"],
    "Йогурт": ["Мюсли", "Ягоды", "Банан"],
    "Масло": ["Хлеб", "Икра"],

    // Bakery
    "Хлеб": ["Масло", "Сыр", "Колбаса", "Молоко"],
    "Батон": ["Джем", "Масло"],
    "Круассан": ["Кофе", "Чай"],
    "Торт": ["Чай", "Кофе", "Свечи"],

    // Meat & Fish
    "Мясо": ["Приправа", "Соус", "Овощи", "Вино"],
    "Курица": ["Картофель", "Рис", "Карри", "Специи"],
    "Стейк": ["Розмарин", "Вино красное", "Соус барбекю"],
    "Рыба": ["Лимон", "Рис", "Вино белое", "Зелень"],
    "Сосиски": ["Кетчуп", "Горчица", "Хлеб", "Макароны"],
    "Пельмени": ["Сметана", "Уксус", "Перец"],

    // Grocery
    "Паста": ["Сыр", "Томаты", "Соус песто"],
    "Макароны": ["Сыр", "Кетчуп", "Тушенка"],
    "Рис": ["Соевый соус", "Рыба", "Курица"],
    "Гречка": ["Молоко", "Тушенка", "Грибы"],
    "Чипсы": ["Пиво", "Кола", "Соус"],

    // Drinks
    "Кофе": ["Молоко", "Сливки", "Шоколад", "Печенье"],
    "Чай": ["Лимон", "Печенье", "Конфеты", "Мед"],
    "Вино": ["Сыр", "Фрукты", "Шоколад"],
    "Пиво": ["Чипсы", "Рыба сушеная", "Орешки"],

    // Fruits & Veg
    "Картофель": ["Лук", "Масло", "Укроп"],
    "Огурцы": ["Помидоры", "Сметана", "Зелень"],
    "Яблоки": ["Корица", "Мед"],

    // Hygiene
    "Шампунь": ["Бальзам", "Гель для душа"],
    "Зубная паста": ["Зубная щетка", "Ополаскиватель"]
};

/**
 * Persuasive pitches for categories or products.
 */
const PRODUCT_PITCHES = {
    "Молочные продукты": "фермерская свежесть в каждом глотке",
    "Мясо и рыба": "идеальный выбор для сытного ужина",
    "Хлеб и выпечка": "только из печи, невероятно ароматное",
    "Фрукты и овощи": "заряд витаминов для всей семьи",
    "Напитки": "чтобы освежиться и взбодриться",
    "Бакалея": "база для ваших кулинарных шедевров",
    "Бытовая химия": "для безупречной чистоты дома",
    "Личная гигиена": "забота о себе каждый день"
};

/**
 * Generates a response based on user input with "AI Seller" logic.
 */
export const generateResponse = (text, context = {}) => {
    if (typeof text !== "string") return "Извините, я не совсем понял. Попробуйте написать текстом!";

    const lower = text.toLowerCase().trim();

    // Help / Features
    if (lower.includes("что ты умеешь") || lower.includes("помощь") || lower.includes("привет")) {
        return "Привет! 👋 Я ваш умный помощник. Я слежу за тем, чтобы вы ничего не забыли. Например, если возьмете пельмени, я напомню про сметану!";
    }

    // Breakfast Intent
    if (lower.includes("завтрак")) {
        return "На завтрак отлично подойдут наши фермерские яйца, свежий творог или круассаны. Посмотрите в разделе 'Молочные продукты' и 'Выпечка'.";
    }

    // Healthy Intent
    if (lower.includes("здоров") || lower.includes("пп") || lower.includes("диета")) {
        return "Здоровый выбор! Рекомендую свежие овощи, зелень и индейку. А еще у нас отличный выбор рыбы.";
    }

    // Meat Accompaniment
    if (lower.includes("к мясу") || lower.includes("гарнир")) {
        return "К мясу советую взять овощи для гриля, картофель или свежую зелень. И обязательно хороший соус!";
    }

    // Search logic (simple)
    const foundProduct = products.find(p => lower.includes(p.name.toLowerCase()));
    if (foundProduct) {
        return `Нашел! ${foundProduct.name} сейчас в наличии. ${PRODUCT_PITCHES[foundProduct.category] ? `Это ${PRODUCT_PITCHES[foundProduct.category]}.` : ""} Добавить в корзину?`;
    }

    // Default Fallback
    const fallbacks = [
        "Отличный вопрос! Я бы посоветовал заглянуть в раздел 'Акции' — там сегодня много интересного.",
        "Я пока учусь, но могу подсказать, что с этим товаром часто берут другие покупатели.",
        "Если вы ищете что-то конкретное, попробуйте назвать категорию, например 'Молоко' или 'Фрукты'.",
        "Всегда рад помочь! Кстати, вы видели наши новые десерты? 🍰"
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

/**
 * Returns product recommendations based on a reference product.
 * @param product The product just added or viewed
 * @param excludeIds IDs to exclude (e.g. products already in cart)
 * @param preferenceMap Optional map of category counts from localStorage { "Dairy": 5, ... }
 */
export const getRecommendations = (product, excludeIds = [], preferenceMap = {}) => {
    if (!product || !products) return [];

    let relatedKeywords = [];

    // 1. Direct Keyword Match from Map
    for (const key in RELATED_MAP) {
        if (product.name.toLowerCase().includes(key.toLowerCase())) {
            relatedKeywords = RELATED_MAP[key];
            break;
        }
    }

    // 2. Filter Candidates
    let candidates = products.filter(p => {
        if (p.id === product.id) return false;
        if (excludeIds.includes(p.id)) return false;

        // Strategy A: Match defined related keywords
        if (relatedKeywords.length > 0) {
            return relatedKeywords.some(kw =>
                p.name.toLowerCase().includes(kw.toLowerCase()) ||
                p.subcategory.toLowerCase().includes(kw.toLowerCase())
            );
        }

        // Strategy B: Same category fallback
        return p.category === product.category;
    });

    // 3. Apply Boost from Preferences (Simple Weighting)
    // If user buys a lot from this category, boost items from it slightly? 
    // Actually, for "cross-sell" we might want COMPLEMENTARY categories, but for now let's prioritize
    // well-rated items that match the user's preferred categories if we have generic candidates.

    candidates = candidates.sort((a, b) => {
        const scoreA = (preferenceMap[a.category] || 0) + parseFloat(a.rating);
        const scoreB = (preferenceMap[b.category] || 0) + parseFloat(b.rating);
        return scoreB - scoreA; // Descending
    });

    // Return top 3
    return candidates.slice(0, 3);
};

export const getPopularProducts = (count = 3) => {
    return products.filter(p => parseFloat(p.rating) >= 4.5).sort(() => 0.5 - Math.random()).slice(0, count);
};

/**
 * Get message for auto-triggers.
 */
export const getAutoMessage = (type, data = {}) => {
    const messages = {
        idle: [
            "Если сомневаетесь, берите классику — свежий хлеб и молоко у нас всегда отличные! 🍞🥛",
            "Может, что-нибудь к чаю? У нас прекрасный выбор сладостей.",
            "Не забудьте проверить раздел бытовой химии, чтобы два раза не бегать!"
        ],
        empty_cart: [
            "Корзина скучает... Давайте положим туда что-нибудь вкусное? 😋",
            "С чего начнем сегодня? Может, свежие фрукты?"
        ],
        cart_almost_ready: [
            "Отличный набор! Может, добавить шоколадку для настроения? 🍫",
            "Почти всё собрали! Не забыли про пакеты или салфетки?",
            "Выглядит аппетитно! Кстати, у нас сейчас скидки на напитки."
        ],
        product_added: [ // Generic fallback if no specific logic
            "Отличный выбор! 👍",
            "Прекрасно! Что-нибудь еще?",
            "Добавлено! Продолжаем?"
        ]
    };

    const pool = messages[type] || messages["product_added"];
    return pool[Math.floor(Math.random() * pool.length)];
};
