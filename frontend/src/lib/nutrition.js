const CATEGORY_PROFILES = {
    "Фрукты": { calories: 52, protein: 0.7, fat: 0.2, carbs: 13, servingGrams: 1000, basis: "1 кг" },
    "Овощи": { calories: 32, protein: 1.4, fat: 0.3, carbs: 6, servingGrams: 1000, basis: "1 кг" },
    "Молочные продукты": { calories: 72, protein: 3.9, fat: 3.8, carbs: 4.7, servingGrams: 900, basis: "1 упаковка" },
    "Хлеб и выпечка": { calories: 265, protein: 7.3, fat: 3.2, carbs: 52, servingGrams: 400, basis: "1 упаковка" },
    "Мясо и рыба": { calories: 185, protein: 18, fat: 12, carbs: 0, servingGrams: 700, basis: "1 упаковка" }
};

const PRODUCT_PROFILES = [
    { terms: ["молоко"], values: { calories: 60, protein: 3.2, fat: 3.2, carbs: 4.7, servingGrams: 900, basis: "1 бутылка" } },
    { terms: ["кефир"], values: { calories: 53, protein: 3, fat: 2.5, carbs: 4, servingGrams: 900, basis: "1 бутылка" } },
    { terms: ["йогурт", "активиа"], values: { calories: 85, protein: 4.2, fat: 3, carbs: 10.5, servingGrams: 140, basis: "1 упаковка" } },
    { terms: ["творог"], values: { calories: 121, protein: 16, fat: 5, carbs: 3, servingGrams: 180, basis: "1 упаковка" } },
    { terms: ["сыр"], values: { calories: 340, protein: 23, fat: 27, carbs: 1.5, servingGrams: 180, basis: "1 упаковка" } },
    { terms: ["масло"], values: { calories: 748, protein: 0.6, fat: 82, carbs: 1, servingGrams: 180, basis: "1 упаковка" } },
    { terms: ["куриное", "курица", "филе", "голень"], values: { calories: 165, protein: 22, fat: 8, carbs: 0, servingGrams: 900, basis: "1 упаковка" } },
    { terms: ["говядина", "стейк", "фарш"], values: { calories: 220, protein: 18, fat: 17, carbs: 0, servingGrams: 800, basis: "1 упаковка" } },
    { terms: ["семга", "форель", "рыба", "скумбрия", "сельдь"], values: { calories: 190, protein: 20, fat: 12, carbs: 0, servingGrams: 500, basis: "1 упаковка" } },
    { terms: ["хлеб", "лаваш", "батон"], values: { calories: 255, protein: 8, fat: 2.5, carbs: 50, servingGrams: 400, basis: "1 упаковка" } },
    { terms: ["круассан"], values: { calories: 406, protein: 8.2, fat: 21, carbs: 45, servingGrams: 70, basis: "1 шт" } },
    { terms: ["шоколад"], values: { calories: 535, protein: 6, fat: 31, carbs: 55, servingGrams: 85, basis: "1 плитка" } },
    { terms: ["конфеты"], values: { calories: 410, protein: 3.8, fat: 12, carbs: 72, servingGrams: 200, basis: "1 упаковка" } },
    { terms: ["печенье"], values: { calories: 450, protein: 6.5, fat: 15, carbs: 72, servingGrams: 180, basis: "1 упаковка" } },
    { terms: ["яблок"], values: { calories: 47, protein: 0.4, fat: 0.4, carbs: 9.8, servingGrams: 1000, basis: "1 кг" } },
    { terms: ["банан"], values: { calories: 89, protein: 1.1, fat: 0.3, carbs: 23, servingGrams: 1000, basis: "1 кг" } },
    { terms: ["виноград"], values: { calories: 67, protein: 0.6, fat: 0.4, carbs: 17, servingGrams: 1000, basis: "1 кг" } },
    { terms: ["груша"], values: { calories: 57, protein: 0.4, fat: 0.1, carbs: 15, servingGrams: 1000, basis: "1 кг" } },
    { terms: ["томат", "помид"], values: { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, servingGrams: 1000, basis: "1 кг" } },
    { terms: ["огур"], values: { calories: 15, protein: 0.8, fat: 0.1, carbs: 2.8, servingGrams: 1000, basis: "1 кг" } },
    { terms: ["картофель"], values: { calories: 77, protein: 2, fat: 0.1, carbs: 17, servingGrams: 1000, basis: "1 кг" } },
    { terms: ["морковь"], values: { calories: 41, protein: 0.9, fat: 0.2, carbs: 10, servingGrams: 1000, basis: "1 кг" } },
    { terms: ["капуста", "брокколи"], values: { calories: 31, protein: 2.5, fat: 0.3, carbs: 5.2, servingGrams: 1000, basis: "1 кг" } }
];

const roundMacro = (value) => Math.round(value * 10) / 10;

const scaleNutrition = (profile, grams) => {
    const factor = grams / 100;

    return {
        calories: roundMacro(profile.calories * factor),
        protein: roundMacro(profile.protein * factor),
        fat: roundMacro(profile.fat * factor),
        carbs: roundMacro(profile.carbs * factor)
    };
};

export const getNutritionProfile = (product) => {
    const name = `${product?.name || ""} ${product?.description || ""}`.toLowerCase();
    const category = product?.category || "";

    const directMatch = PRODUCT_PROFILES.find((profile) =>
        profile.terms.some((term) => name.includes(term))
    );

    if (directMatch) {
        return {
            ...directMatch.values,
            source: "estimate_by_product"
        };
    }

    const categoryMatch = CATEGORY_PROFILES[category];
    if (categoryMatch) {
        return {
            ...categoryMatch,
            source: "estimate_by_category"
        };
    }

    return {
        calories: 120,
        protein: 4,
        fat: 4,
        carbs: 12,
        servingGrams: 300,
        basis: "1 упаковка",
        source: "fallback"
    };
};

export const getNutritionEstimate = (product) => {
    const dbNutrition = product?.nutrition;
    if (dbNutrition?.calories != null && dbNutrition?.protein != null && dbNutrition?.fat != null && dbNutrition?.carbs != null) {
        const servingGrams = dbNutrition.servingGrams || 100;
        const factor = servingGrams / 100;

        return {
            per100g: {
                calories: dbNutrition.calories,
                protein: dbNutrition.protein,
                fat: dbNutrition.fat,
                carbs: dbNutrition.carbs
            },
            perUnit: {
                calories: roundMacro(dbNutrition.calories * factor),
                protein: roundMacro(dbNutrition.protein * factor),
                fat: roundMacro(dbNutrition.fat * factor),
                carbs: roundMacro(dbNutrition.carbs * factor)
            },
            servingGrams,
            basis: dbNutrition.basis || "1 упаковка",
            source: "database"
        };
    }

    const profile = getNutritionProfile(product);
    const perUnit = scaleNutrition(profile, profile.servingGrams);

    return {
        per100g: {
            calories: profile.calories,
            protein: profile.protein,
            fat: profile.fat,
            carbs: profile.carbs
        },
        perUnit,
        servingGrams: profile.servingGrams,
        basis: profile.basis,
        source: profile.source
    };
};

export const calculateCartNutrition = (items) => {
    const lineItems = (items || []).map((item) => {
        const nutrition = getNutritionEstimate(item);

        return {
            ...item,
            nutrition,
            totals: {
                calories: roundMacro(nutrition.perUnit.calories * item.quantity),
                protein: roundMacro(nutrition.perUnit.protein * item.quantity),
                fat: roundMacro(nutrition.perUnit.fat * item.quantity),
                carbs: roundMacro(nutrition.perUnit.carbs * item.quantity)
            }
        };
    });

    const summary = lineItems.reduce((acc, item) => ({
        calories: roundMacro(acc.calories + item.totals.calories),
        protein: roundMacro(acc.protein + item.totals.protein),
        fat: roundMacro(acc.fat + item.totals.fat),
        carbs: roundMacro(acc.carbs + item.totals.carbs)
    }), {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
    });

    return {
        items: lineItems,
        summary
    };
};
