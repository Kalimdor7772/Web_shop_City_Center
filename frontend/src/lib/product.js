const LIQUID_TERMS = [
    "молоко",
    "кефир",
    "айран",
    "ряженка",
    "снежок",
    "сливки",
    "сметана",
    "йогурт",
    "actimel"
];

const formatMetricAmount = (value, unit) => {
    if (!value) return null;

    if (value >= 1000 && value % 1000 === 0) {
        return `${value / 1000} ${unit === "ml" ? "л" : "кг"}`;
    }

    return `${value} ${unit === "ml" ? "мл" : "г"}`;
};

export const getProductWeightLabel = (product) => {
    if (!product) return null;
    if (product.weight) return product.weight;

    const grams = Number(product.nutrition?.servingGrams || 0);
    const basis = String(product.nutrition?.basis || "").toLowerCase();
    const text = `${product.name || ""} ${product.description || ""}`.toLowerCase();

    if (basis.includes("шт")) {
        return "1 шт";
    }

    if (!grams) {
        if (basis.includes("кг")) return "1 кг";
        if (basis.includes("л")) return "1 л";
        return null;
    }

    const isLiquid = basis.includes("бутыл")
        || basis.includes("мл")
        || basis.includes("л")
        || LIQUID_TERMS.some((term) => text.includes(term));

    return formatMetricAmount(grams, isLiquid ? "ml" : "g");
};
