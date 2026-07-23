export const CATALOG_STRUCTURE = {
    "Фрукты и овощи": ["Все", "Фрукты", "Овощи", "Зелень", "Ягоды", "Экзотика"],
    "Мясо и рыба": ["Все", "Птица", "Говядина", "Свинина", "Рыба", "Морепродукты", "Полуфабрикаты"],
    "Молочные продукты": ["Все", "Молоко", "Сыр", "Йогурт", "Кисломолочные", "Масло и сливки", "Яйца"],
    "Хлеб и выпечка": ["Все", "Хлеб", "Сладкая выпечка", "Лаваш и лепешки", "Торты"],
    "Напитки": ["Все", "Вода", "Соки", "Газировка", "Чай и кофе", "Энергетики"],
    "Бакалея": ["Все", "Крупы", "Макароны", "Масло", "Консервы", "Специи", "Снеки"],
    "Бытовая химия": ["Все", "Стирка", "Уборка", "Для посуды", "Освежители"],
    "Личная гигиена": ["Все", "Уход за волосами", "Уход за телом", "Зубная паста", "Гигиена"]
};

export const HOME_CATEGORY_CONFIG = [
    { id: 1, translationKey: "produce", category: "Фрукты и овощи", accent: "from-emerald-200/70 to-lime-100", textColor: "text-emerald-800" },
    { id: 2, translationKey: "bakery", category: "Хлеб и выпечка", accent: "from-amber-200/80 to-orange-100", textColor: "text-amber-800" },
    { id: 3, translationKey: "dairy", category: "Молочные продукты", accent: "from-sky-200/80 to-cyan-100", textColor: "text-sky-800" },
    { id: 4, translationKey: "meat", category: "Мясо и рыба", subcategory: "Птица", accent: "from-rose-200/80 to-orange-100", textColor: "text-rose-800" },
    { id: 5, translationKey: "seafood", category: "Мясо и рыба", subcategory: "Рыба", accent: "from-indigo-200/80 to-sky-100", textColor: "text-indigo-800" },
    { id: 6, translationKey: "grocery", category: "Бакалея", accent: "from-orange-200/80 to-yellow-100", textColor: "text-orange-800" },
    { id: 7, translationKey: "coffee", category: "Напитки", subcategory: "Чай и кофе", accent: "from-stone-200/80 to-amber-100", textColor: "text-stone-800" },
    { id: 8, translationKey: "sweets", category: "Хлеб и выпечка", subcategory: "Торты", accent: "from-pink-200/80 to-rose-100", textColor: "text-pink-800" },
];

export const QUICK_CATEGORY_CHIPS = [
    "Мясо и рыба",
    "Молочные продукты",
    "Фрукты и овощи",
    "Бакалея"
];

export const catalogCategories = Object.keys(CATALOG_STRUCTURE).map((name) => ({
    name,
    subcategories: CATALOG_STRUCTURE[name].filter((item) => item !== "Все")
}));
