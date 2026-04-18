import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../utils/prisma.js";

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

const FREE_DELIVERY_THRESHOLD = 15000;

const SALES_SYSTEM_PROMPT = `
Вы - дружелюбный, вежливый и понятный AI-консультант онлайн-супермаркета City Center в Казахстане.

Правила:
1. Отвечайте только на русском языке.
2. Не выдумывайте товары и цены. Используйте только товары из переданного каталога.
3. Помогайте выбрать продукты, собрать корзину и довести клиента до оформления заказа.
4. Отвечайте вежливо и ясно, даже если пользователь спрашивает просто про магазин, часы работы, доставку или контакты.
5. Если пользователь просит подборку, соберите её по бюджету, количеству дней, числу людей и цели покупки.
6. Если известны корзина, прошлые заказы, профиль и предпочтения пользователя, учитывайте их.
7. Если корзина близка к бесплатной доставке, мягко предложите добрать полезные товары.
8. Если спрашивают про КБЖУ, напоминайте про страницу /nutrition.
9. Старайтесь выдавать JSON-объект, но если вы даёте обычный текстовый ответ, возвращайте поле reply с текстом, остальное можно оставить пустым.
10. Если вы предлагаете конкретный товар, используйте действие add_to_cart:<productId> для добавления товара в корзину.
11. Желательный формат:
{
  "reply": "текст ответа",
  "emotion": "idle" | "thinking" | "happy" | "advising",
  "recommendedProductIds": ["id1", "id2"],
  "actions": [{"label":"Открыть корзину","action":"navigate:/cart"}, {"label":"Добавить в корзину","action":"add_to_cart:123"}]
}
`;

const GOAL_PRESETS = {
    breakfast: {
        label: "завтрак",
        triggers: ["завтрак", "утро", "к чаю", "на утро"],
        terms: ["молоко", "йогурт", "творог", "сыр", "хлеб", "круассан", "банан", "яблоко"],
        reply: "Собрал практичный набор для завтрака: молочные продукты, что-то к чаю и фрукты для быстрого перекуса.",
    },
    dinner: {
        label: "ужин",
        triggers: ["ужин", "обед", "к мясу", "гарнир"],
        terms: ["куриное", "говядина", "картофель", "томаты", "огурцы", "зелень", "рис"],
        reply: "Под ужин лучше взять белок, гарнир и свежие овощи. Ниже подобрал сбалансированный вариант.",
    },
    week: {
        label: "корзина на неделю",
        triggers: ["на неделю", "корзина на неделю", "семье на неделю"],
        terms: ["молоко", "йогурт", "хлеб", "яблоко", "банан", "картофель", "огурцы", "томаты", "куриное", "говядина"],
        reply: "Собрал базовую корзину на неделю: продукты на завтрак, горячие блюда и повседневные овощи с фруктами.",
    },
    healthy: {
        label: "полезная корзина",
        triggers: ["полез", "пп", "здоров", "диет", "кбжу"],
        terms: ["творог", "йогурт", "огурцы", "томаты", "яблоко", "банан", "форель", "куриное"],
        reply: "Для полезной корзины я делаю акцент на белок, овощи, фрукты и удобные продукты для легких приемов пищи.",
    },
    budget: {
        label: "бюджетная корзина",
        triggers: ["дешев", "эконом", "бюджет", "недорого"],
        terms: ["хлеб", "молоко", "картофель", "морковь", "яблоко", "куриное", "йогурт"],
        reply: "Подобрал бюджетные, но полезные позиции, чтобы собрать корзину без лишних трат.",
    },
};

const COMPLEMENTARY_RULES = [
    { includes: ["молоко", "кефир", "йогурт"], suggestions: ["печенье", "хлеб", "банан"] },
    { includes: ["сыр"], suggestions: ["хлеб", "виноград", "томаты"] },
    { includes: ["куриное", "курица", "филе"], suggestions: ["картофель", "огурцы", "томаты", "рис"] },
    { includes: ["говядина", "стейк", "фарш"], suggestions: ["картофель", "овощи", "зелень"] },
    { includes: ["рыба", "семга", "форель"], suggestions: ["лимон", "зелень", "огурцы"] },
    { includes: ["шоколад", "печенье", "конфеты"], suggestions: ["чай", "кофе", "молоко"] },
];

const SHOPPING_PLAN_BUCKETS = [
    { key: "protein", label: "белок", terms: ["куриное", "курица", "филе", "говядина", "рыба", "семга", "форель", "творог", "яйц"] },
    { key: "dairy", label: "молочные продукты", terms: ["молоко", "кефир", "йогурт", "сыр", "творог"] },
    { key: "vegetables", label: "овощи", terms: ["огур", "томат", "помид", "картофель", "морковь", "капуста", "перец", "лук", "брокколи"] },
    { key: "fruits", label: "фрукты", terms: ["яблок", "банан", "груш", "апельсин", "мандарин", "клубник", "виноград", "голубик"] },
    { key: "bakery", label: "хлеб и выпечка", terms: ["хлеб", "лаваш", "батон", "круассан", "булочк"] },
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeProduct = (product) => ({
    id: String(product.id),
    name: product.name,
    description: product.description || "",
    price: Number(product.price),
    category: typeof product.category === "string" ? product.category : product.category?.name || "",
    brand: product.brand || product.manufacturer?.name || "",
    country: product.country || product.manufacturer?.country || "",
    image: product.image || product.images?.[0] || "",
    images: product.images || (product.image ? [product.image] : []),
    stock: product.stock ?? 0,
    calories: product.calories ?? null,
    protein: product.protein ?? null,
    fat: product.fat ?? null,
    carbs: product.carbs ?? null,
    weight: product.weight || product.servingGrams || null,
});

const uniqueProducts = (products, limit = 8) => {
    const seen = new Set();

    return products.filter((product) => {
        if (!product?.id || seen.has(product.id)) return false;
        seen.add(product.id);
        return true;
    }).slice(0, limit);
};

const uniqueActions = (actions = []) => {
    const seen = new Set();
    return actions.filter((action) => {
        const key = `${action.label}:${action.action}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).slice(0, 6);
};

const findProducts = (products, terms, limit = 8) => {
    const normalizedTerms = terms
        .map((term) => String(term || "").toLowerCase().trim())
        .filter((term) => term.length > 1);

    if (normalizedTerms.length === 0) return [];

    return products
        .map((product) => {
            const haystack = [
                product.name,
                product.description,
                product.category,
                product.brand,
                product.country,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const score = normalizedTerms.reduce((acc, term) => {
                if (haystack.includes(term)) return acc + 4;
                const regex = new RegExp(`\\b${escapeRegex(term)}`, "i");
                if (regex.test(haystack)) return acc + 2;
                return acc;
            }, 0);

            return { product, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
        .slice(0, limit)
        .map((entry) => entry.product);
};

const findBudgetProducts = (products, maxPrice, limit = 4) => products
    .filter((product) => product.price > 0 && product.price <= maxPrice)
    .sort((a, b) => b.price - a.price)
    .slice(0, limit);

const addFreeDeliveryNudge = (reply, cartTotal, products) => {
    const total = Number(cartTotal || 0);
    if (!total || total >= FREE_DELIVERY_THRESHOLD) return { reply, actions: [] };

    const diff = FREE_DELIVERY_THRESHOLD - total;
    if (diff > 4000) return { reply, actions: [] };

    const topUpProducts = findBudgetProducts(products, diff + 1000, 3);
    const topUpNames = topUpProducts.map((product) => product.name).join(", ");

    return {
        reply: `${reply}\n\nДо бесплатной доставки осталось ${diff} ₸.${topUpNames ? ` Можно добрать, например: ${topUpNames}.` : ""}`,
        actions: topUpProducts.length > 0
            ? [{ label: "Добрать до бесплатной доставки", action: "Что можно добавить до бесплатной доставки?" }]
            : [],
    };
};

const extractBudget = (message) => {
    const matched = String(message || "").match(/(\d{4,6})/);
    return matched ? Number(matched[1]) : null;
};

const extractDays = (message) => {
    const source = String(message || "").toLowerCase();
    if (source.includes("на неделю")) return 7;

    const match = source.match(/на\s+(\d+)\s*(дн|дня|дней|сут)/);
    return match ? Number(match[1]) : null;
};

const extractPeople = (message) => {
    const source = String(message || "").toLowerCase();
    const directMatch = source.match(/(?:для|на)\s+(\d+)\s*(чел|человек|персон|людей)/);
    if (directMatch) return Number(directMatch[1]);
    if (source.includes("для семьи")) return 3;
    return null;
};

const getComplementaryProducts = (products, cartItems) => {
    const cartText = cartItems.map((item) => item.name || "").join(" ").toLowerCase();
    const terms = COMPLEMENTARY_RULES
        .filter((rule) => rule.includes.some((value) => cartText.includes(value)))
        .flatMap((rule) => rule.suggestions);

    return uniqueProducts(findProducts(products, terms, 4), 4);
};

const summarizeUserContext = (userContext) => {
    if (!userContext) return null;

    const favoriteCategories = Object.entries(userContext.categoryStats || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category]) => category);

    return {
        firstName: userContext.firstName || "",
        city: userContext.profile?.city || "",
        orderCount: userContext.orderCount || 0,
        favoriteCategories,
        recentProductNames: userContext.recentProductNames || [],
    };
};

const detectGoal = (message) => {
    const source = String(message || "").toLowerCase();
    const entry = Object.entries(GOAL_PRESETS).find(([, preset]) =>
        preset.triggers.some((trigger) => source.includes(trigger))
    );

    return entry ? entry[0] : "week";
};

const pickCheapestProduct = (products, terms) => {
    const matches = findProducts(products, terms, 10);
    return matches.sort((a, b) => a.price - b.price)[0] || null;
};

const buildShoppingPlan = (products, message, userContext) => {
    const budget = extractBudget(message) || 18000;
    const days = extractDays(message) || 7;
    const people = extractPeople(message) || 2;
    const goal = detectGoal(message);

    const quantities = {
        protein: Math.max(1, Math.ceil((days / 2) * Math.max(1, people / 2))),
        dairy: Math.max(1, Math.ceil((days / 3) * people)),
        vegetables: Math.max(2, Math.ceil(days * Math.max(1, people / 2))),
        fruits: Math.max(2, Math.ceil(days * Math.max(1, people / 2))),
        bakery: Math.max(1, Math.ceil(days / 3)),
    };

    if (goal === "breakfast") {
        quantities.protein = Math.max(1, Math.ceil(days / 3));
        quantities.vegetables = 0;
    }

    if (goal === "healthy") {
        quantities.bakery = 1;
        quantities.vegetables += 2;
        quantities.fruits += 1;
    }

    const preferredTerms = summarizeUserContext(userContext)?.favoriteCategories || [];
    const selected = [];

    for (const bucket of SHOPPING_PLAN_BUCKETS) {
        const candidateTerms = [...bucket.terms, ...preferredTerms];
        const product = pickCheapestProduct(products, candidateTerms);
        if (!product) continue;

        const quantity = quantities[bucket.key] || 1;
        selected.push({
            ...product,
            quantity,
            lineTotal: quantity * product.price,
            bucket: bucket.label,
        });
    }

    let total = selected.reduce((sum, item) => sum + item.lineTotal, 0);

    if (total > budget) {
        selected.sort((a, b) => b.lineTotal - a.lineTotal);
        while (selected.length > 3 && total > budget) {
            const removed = selected.shift();
            total -= removed.lineTotal;
        }
    }

    const recommended = uniqueProducts(selected, 8);
    const lines = selected
        .map((item) => `${item.name} x${item.quantity} - ${item.lineTotal} ₸`)
        .join("\n");

    const goalLabel = GOAL_PRESETS[goal]?.label || "корзина";
    const budgetNote = total > budget
        ? `Я ужал подборку максимально близко к бюджету ${budget} ₸.`
        : `Итоговая оценка: около ${total} ₸ при бюджете ${budget} ₸.`;

    return {
        reply: `Собрал ${goalLabel} для ${people} ${people === 1 ? "человека" : "человек"} на ${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}.\n\n${lines}\n\n${budgetNote}`,
        emotion: "advising",
        recommendedProductIds: recommended.map((product) => product.id),
        actions: [
            { label: "Открыть каталог", action: "navigate:/catalog" },
            { label: "Открыть корзину", action: "navigate:/cart" },
            { label: "Перейти к оформлению", action: "navigate:/checkout" },
            { label: "Сделать полезнее", action: `Соберите полезную корзину на ${days} дней для ${people} человек` },
        ],
    };
};

const buildRuleBasedResponse = ({ type, userMessage, cart, products, preferences, userContext }) => {
    const message = String(userMessage || "").toLowerCase().trim();
    const cartItems = cart?.items || [];
    const cartTotal = Number(cart?.totalPrice || 0);
    const personalized = summarizeUserContext(userContext);
    const topPreferenceTerms = Object.entries(preferences || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category]) => category);

    if (type === "cart_cleared") {
        return {
            reply: "Корзина очищена. Могу быстро собрать новый набор под завтрак, ужин, полезную корзину или покупки на неделю.",
            emotion: "idle",
            recommendedProductIds: [],
            actions: [
                { label: "Что взять на завтрак?", action: "Что взять на завтрак?" },
                { label: "Корзина на неделю", action: "Соберите корзину на неделю" },
                { label: "Закупка на 3 дня для 2 человек", action: "Соберите корзину на 3 дня для 2 человек" },
            ],
        };
    }

    if (type === "product_added" && cartItems.length > 0) {
        const complements = getComplementaryProducts(products, cartItems);
        const { reply, actions } = addFreeDeliveryNudge(
            complements.length > 0
                ? `Хороший выбор. К этой покупке еще подойдут ${complements.map((product) => product.name).slice(0, 2).join(" и ")}.`
                : "Хороший выбор. Если хотите, я подскажу, что еще логично добавить к корзине.",
            cartTotal,
            products
        );

        return {
            reply,
            emotion: "advising",
            recommendedProductIds: complements.map((product) => product.id),
            actions: uniqueActions([
                ...actions,
                { label: "Открыть корзину", action: "navigate:/cart" },
                { label: "Перейти к оформлению", action: "navigate:/checkout" },
                { label: "Посчитать КБЖУ корзины", action: "navigate:/nutrition" },
            ]),
        };
    }

    if (!message || message.includes("привет") || message.includes("здравствуйте")) {
        const personalizedTail = personalized?.orderCount
            ? ` Вижу, что у вас уже было ${personalized.orderCount} заказов${personalized.favoriteCategories?.length ? ` и чаще всего вы выбираете ${personalized.favoriteCategories.join(", ")}.` : "."}`
            : "";

        return {
            reply: `Здравствуйте. Помогу подобрать продукты, собрать корзину и довести заказ до оформления.${personalizedTail} Могу собрать покупки по бюджету, на несколько дней или для семьи.`,
            emotion: "happy",
            recommendedProductIds: [],
            actions: [
                { label: "Корзина на неделю", action: "Соберите корзину на неделю" },
                { label: "На 3 дня для 2 человек", action: "Соберите корзину на 3 дня для 2 человек" },
                { label: "Бюджет 20000 ₸", action: "Соберите корзину на 20000 тенге" },
                { label: "Полезная корзина", action: "Подберите полезные продукты" },
            ],
        };
    }

    if (message.includes("кбжу") || message.includes("калор") || message.includes("белк") || message.includes("жир") || message.includes("углев")) {
        return {
            reply: "Для расчета КБЖУ по всей корзине удобнее открыть отдельную страницу аналитики. Там видно калории, белки, жиры и углеводы по каждому товару и по корзине в целом.",
            emotion: "advising",
            recommendedProductIds: [],
            actions: [
                { label: "Открыть КБЖУ корзины", action: "navigate:/nutrition" },
                { label: "Открыть корзину", action: "navigate:/cart" },
            ],
        };
    }

    if (message.includes("достав")) {
        return {
            reply: `Бесплатная доставка доступна от ${FREE_DELIVERY_THRESHOLD} ₸. Если хотите, я могу подсказать, чем удобно добрать корзину до порога.`,
            emotion: "happy",
            recommendedProductIds: [],
            actions: [
                { label: "Добрать до бесплатной доставки", action: "Что можно добавить до бесплатной доставки?" },
                { label: "Открыть корзину", action: "navigate:/cart" },
            ],
        };
    }

    if (message.includes("оплат") || message.includes("kaspi") || message.includes("карт")) {
        return {
            reply: "На оформлении заказа можно выбрать удобный способ оплаты и сразу перейти к завершению покупки. Если хотите, я направлю вас прямо к checkout.",
            emotion: "happy",
            recommendedProductIds: [],
            actions: [
                { label: "Перейти к оформлению", action: "navigate:/checkout" },
                { label: "Открыть корзину", action: "navigate:/cart" },
            ],
        };
    }

    if (
        message.includes("собери") ||
        message.includes("подбери") ||
        message.includes("на неделю") ||
        message.includes("на день") ||
        message.includes("на 3 дня") ||
        message.includes("для семьи") ||
        message.includes("для 2") ||
        message.includes("для 3") ||
        message.includes("бюджет")
    ) {
        return buildShoppingPlan(products, message, userContext);
    }

    const preset = Object.values(GOAL_PRESETS).find((item) =>
        item.triggers.some((trigger) => message.includes(trigger))
    );

    if (preset) {
        const matches = uniqueProducts(findProducts(products, preset.terms, 8), 8);
        return {
            reply: preset.reply,
            emotion: "advising",
            recommendedProductIds: matches.map((product) => product.id),
            actions: [
                { label: "Открыть каталог", action: "navigate:/catalog" },
                { label: "Открыть корзину", action: "navigate:/cart" },
                { label: "Собрать по бюджету", action: "Соберите корзину на 20000 тенге" },
            ],
        };
    }

    if (message.includes("замен") || message.includes("аналог")) {
        const matches = findProducts(products, message.split(/\s+/), 6);
        return {
            reply: "Подобрал похожие товары и аналоги из каталога. Если нужно, могу сузить выбор по цене, бренду или категории.",
            emotion: "advising",
            recommendedProductIds: matches.map((product) => product.id),
            actions: [
                { label: "Подешевле", action: "Покажите аналоги подешевле" },
                { label: "Открыть каталог", action: "navigate:/catalog" },
            ],
        };
    }

    const directMatches = uniqueProducts(findProducts(products, message.split(/\s+/), 8), 8);
    if (directMatches.length > 0) {
        const topProduct = directMatches[0];
        const { reply, actions } = addFreeDeliveryNudge(
            personalized?.favoriteCategories?.length
                ? `Нашел подходящие товары. С учетом ваших предпочтений по категориям ${personalized.favoriteCategories.join(", ")} это самые релевантные варианты.`
                : "Нашел подходящие товары по вашему запросу. Могу помочь сузить выбор по цене, бренду или назначению.",
            cartTotal,
            products
        );

        return {
            reply,
            emotion: "happy",
            recommendedProductIds: directMatches.map((product) => product.id),
            actions: uniqueActions([
                ...actions,
                topProduct && { label: `Добавить ${topProduct.name} в корзину`, action: `add_to_cart:${topProduct.id}` },
                { label: "Открыть каталог", action: "navigate:/catalog" },
                { label: "Открыть корзину", action: "navigate:/cart" },
            ].filter(Boolean)),
        };
    }

    const preferenceMatches = topPreferenceTerms.length > 0
        ? uniqueProducts(findProducts(products, topPreferenceTerms, 6), 6)
        : [];

    return {
        reply: personalized?.favoriteCategories?.length
            ? `Могу предложить подборку по вашим любимым категориям: ${personalized.favoriteCategories.join(", ")}. Также могу собрать завтрак, ужин, корзину на неделю или закупку по бюджету.`
            : "Могу подобрать завтрак, ужин, полезную корзину, корзину на неделю или собрать закупку под ваш бюджет и количество дней.",
        emotion: "idle",
        recommendedProductIds: preferenceMatches.map((product) => product.id),
        actions: [
            { label: "На 3 дня для 2 человек", action: "Соберите корзину на 3 дня для 2 человек" },
            { label: "Корзина на неделю", action: "Соберите корзину на неделю" },
            { label: "Бюджетная корзина", action: "Соберите корзину на 15000 тенге" },
            { label: "Полезная корзина", action: "Подберите полезные продукты" },
        ],
    };
};

const getTokenUser = async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return null;

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                profile: true,
                orders: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                    include: {
                        items: {
                            include: {
                                product: {
                                    select: {
                                        name: true,
                                        category: { select: { name: true } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) return null;

        const categoryStats = {};
        const recentProductNames = [];

        user.orders.forEach((order) => {
            order.items.forEach((item) => {
                const categoryName = item.product.category?.name;
                if (categoryName) {
                    categoryStats[categoryName] = (categoryStats[categoryName] || 0) + item.quantity;
                }
                recentProductNames.push(item.product.name);
            });
        });

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            profile: user.profile || {},
            orderCount: user.orders.length,
            categoryStats,
            recentProductNames: recentProductNames.slice(0, 10),
        };
    } catch {
        return null;
    }
};

const tryOpenAIResponse = async ({ userMessage, cart, products, preferences, userContext }) => {
    if (!genAI) return null;

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "text/plain",
        }
    });

    const userPrompt = JSON.stringify({
        userMessage,
        cart: {
            totalItems: cart.totalItems || 0,
            totalPrice: cart.totalPrice || 0,
            itemNames: (cart.items || []).map((item) => item.name),
        },
        preferences,
        userContext: summarizeUserContext(userContext),
        availableProducts: products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            brand: product.brand,
            calories: product.calories,
            protein: product.protein,
            fat: product.fat,
            carbs: product.carbs,
        })),
    });

    const result = await model.generateContent([
        { text: SALES_SYSTEM_PROMPT },
        { text: userPrompt },
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.warn("Gemini JSON parse failed, falling back to raw text reply", e);
        }
    }

    return {
        reply: responseText.trim(),
        emotion: "happy",
        recommendedProductIds: [],
        actions: [],
    };
};

export const chatWithAI = async (req, res) => {
    try {
        const body = req.body || {};

        const dbProducts = await prisma.product.findMany({
            include: { category: true, manufacturer: true },
            take: 200,
        });

        const products = (body.availableProducts?.length ? body.availableProducts : dbProducts).map(normalizeProduct);
        const userContext = await getTokenUser(req);

        let type = body.type || "user_message";
        let userMessage = "";
        let cart = { items: [], totalItems: 0, totalPrice: 0 };
        let preferences = body.payload?.preferences || body.preferences || {};

        if (body.userMessage || body.cart || body.availableProducts) {
            type = "user_message";
            userMessage = body.userMessage || "";
            cart = body.cart || cart;
        } else if (body.type === "user_message") {
            userMessage = body.payload?.message || "";
            cart = body.payload?.cartState || cart;
        } else if (body.type === "product_added") {
            const product = body.payload?.product;
            const cartState = body.payload?.cartState || {};
            userMessage = `Я добавил в корзину ${product?.name || "товар"}. Что еще подойдет к покупке?`;
            cart = {
                items: cartState.items || [],
                totalItems: cartState.totalItems || 0,
                totalPrice: cartState.totalPrice || 0,
            };
        } else if (body.type === "cart_cleared") {
            userMessage = "Корзина очищена";
        }

        let aiOutput;

        try {
            aiOutput = await tryOpenAIResponse({ userMessage, cart, products, preferences, userContext });
        } catch (error) {
            console.warn("Falling back to rule-based AI assistant:", error.message);
            aiOutput = null;
        }

        if (!aiOutput || !aiOutput.reply || 
            (typeof aiOutput.reply === 'string' && aiOutput.reply.includes('Cannot read'))) {
            aiOutput = buildRuleBasedResponse({ type, userMessage, cart, products, preferences, userContext });
        }

        const recommendedProducts = uniqueProducts(
            (aiOutput.recommendedProductIds || [])
                .map((id) => products.find((product) => String(product.id) === String(id)))
                .filter(Boolean),
            8
        );

        const deliveryNudge = addFreeDeliveryNudge(aiOutput.reply, Number(cart.totalPrice || 0), products);
        const finalReply = deliveryNudge.reply;
        const finalActions = uniqueActions([...(aiOutput.actions || []), ...deliveryNudge.actions]);

        res.status(200).json({
            reply: finalReply,
            text: finalReply,
            emotion: aiOutput.emotion || "idle",
            suggestions: recommendedProducts,
            recommendations: recommendedProducts,
            actions: finalActions,
        });
    } catch (error) {
        console.error("AI Seller API Error:", error);
        res.status(200).json({
            reply: "Сейчас не получилось быстро обработать запрос. Я все равно могу помочь подобрать товары, открыть корзину или направить к оформлению.",
            text: "Сейчас не получилось быстро обработать запрос. Я все равно могу помочь подобрать товары, открыть корзину или направить к оформлению.",
            emotion: "thinking",
            suggestions: [],
            recommendations: [],
            actions: [
                { label: "Открыть каталог", action: "navigate:/catalog" },
                { label: "Открыть корзину", action: "navigate:/cart" },
                { label: "КБЖУ корзины", action: "navigate:/nutrition" },
            ],
        });
    }
};
