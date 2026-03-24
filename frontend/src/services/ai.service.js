/**
 * AI Service for handling smart shopping interactions
 * Now integrated with Product Catalog
 */

import { products, categories } from "../lib/data";

const SYSTEM_PROMPT = `
You are the AI Smart Assistant for CITY CENTER, a futuristic online supermarket.
Your goal is to help users find products, manage their cart, and answer service questions.

Capabilities:
- Search: Find products by name or category.
- Cart: Add items, show cart.
- Support: Delivery, Payment, Orders.

Tone: Helpful, concise, emoji-friendly.
`;

export const aiService = {
    /**
     * Sends a message to the AI and gets a structured response
     * @param {string} message User message
     * @returns {Promise<object>} Structured response { text, type, data, quickActions }
     */
    async sendMessage(message) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

        // Helper for safe string comparison
        const safeLower = (value) =>
            typeof value === "string" ? value.toLowerCase() : "";

        // Defensive check for input
        if (!message || typeof message !== "string" || !message.trim()) {
            return {
                text: "Пожалуйста, напишите сообщение 🙂",
                type: 'text'
            };
        }

        const lowerMsg = safeLower(message);

        // --- 1. INTENT: SEARCH & RECOMMENDATIONS ---

        let foundProducts = [];

        // Defensive Category Search
        const categoryMatch = categories.find(c => lowerMsg.includes(safeLower(c.name)));

        if (categoryMatch) {
            foundProducts = products.filter(p => p.category === categoryMatch.id).slice(0, 5);
        } else {
            // General Keyword Search
            const keywords = lowerMsg.split(' ').filter(w => w.length > 2);
            foundProducts = products.filter(p =>
                keywords.some(k =>
                    safeLower(p.name).includes(k) ||
                    safeLower(p.description).includes(k) ||
                    safeLower(p.manufacturer).includes(k)
                )
            ).slice(0, 5);
        }

        if (foundProducts.length > 0) {
            return {
                text: `Вот что я нашел по вашему запросу:`,
                type: 'products',
                data: foundProducts,
                quickActions: [
                    { label: "Еще товары", action: "more_products" },
                    { label: "В корзину", action: "open_cart" }
                ]
            };
        }

        // --- 2. INTENT: CART ACTIONS ---
        if (lowerMsg.includes("корзин") || lowerMsg.includes("cart")) {
            if (lowerMsg.includes("add") || lowerMsg.includes("добав")) {
                return {
                    text: "Чтобы добавить товар, просто нажмите кнопку '+' на карточке товара. Хотите я покажу популярные товары?",
                    type: 'text',
                    quickActions: [{ label: "Показать популярное", action: "show_popular" }]
                };
            }
            return {
                text: "Перехожу в корзину...",
                type: 'action',
                data: { action: 'open_cart' }
            };
        }

        // --- 3. INTENT: DELIVERY & PAYMENT ---
        if (lowerMsg.includes("доставк") || lowerMsg.includes("привезут")) {
            return {
                text: "Мы доставляем по Алматы, Астане и Шымкенту! 🚚\n\n• Экспресс: 30 минут\n• Стандарт: 2 часа",
                type: 'text',
                quickActions: [
                    { label: "Статус заказа", action: "check_order" },
                    { label: "Помощь", action: "help" }
                ]
            };
        }

        if (lowerMsg.includes("оплат") || lowerMsg.includes("kaspi") || lowerMsg.includes("каспи")) {
            return {
                text: "Оплатить можно:\n• Kaspi QR 🔴\n• Картой 💳\n• Наличными 💵",
                type: 'text',
                quickActions: [{ label: "В каталог", action: "open_catalog" }]
            };
        }

        // --- 4. INTENT: GREETING & FALLBACK ---
        if (lowerMsg.includes("привет") || lowerMsg.includes("здравствуй")) {
            return {
                text: "Здравствуйте! 👋 Я могу помочь вам найти продукты или оформить заказ. Что будем искать сегодня?",
                type: 'text',
                quickActions: [
                    { label: "Молоко", action: "search_milk" },
                    { label: "Хлеб", action: "search_bread" },
                    { label: "Фрукты", action: "search_fruits" }
                ]
            };
        }

        // Fallback
        return {
            text: "Я пока учусь и не совсем понял. Попробуйте написать название товара, например 'Молоко' или 'Шоколад'.",
            type: 'text',
            quickActions: [
                { label: "Популярное", action: "show_popular" },
                { label: "Каталог", action: "open_catalog" }
            ]
        };
    }
};
