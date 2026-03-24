
// --- Configuration ---
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

// --- Categories for Home Page ---
export const categories = Object.keys(CATALOG_STRUCTURE).map((name) => ({
    name
}));

// --- Data Generation Helper ---
// We use a seeded random generator (simple LCG) to ensure ids and prices are stable across reloads
let seed = 12345;
function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

const generateProducts = () => {
    const products = [];
    let idCounter = 1;

    const PRODUCT_BASES = {
        "Фрукты и овощи": {
            "Фрукты": ["Яблоки", "Бананы", "Груши", "Апельсины", "Мандарины", "Лимон", "Киви"],
            "Овощи": ["Картофель", "Морковь", "Лук", "Томаты", "Огурцы", "Капуста", "Перец"],
            "Зелень": ["Петрушка", "Укроп", "Кинза", "Лук зеленый", "Салат"],
            "Ягоды": ["Клубника", "Малина", "Смородина", "Черешня", "Виноград"],
            "Экзотика": ["Манго", "Авокадо", "Ананас", "Кокос", "Папайя"]
        },
        "Мясо и рыба": {
            "Птица": ["Курица", "Филе грудки", "Голень", "Крылышки", "Утка"],
            "Говядина": ["Фарш говяжий", "Стейк Рибай", "Гуляш", "Ребра"],
            "Свинина": ["Вырезка", "Шейка", "Фарш домашний"],
            "Рыба": ["Семга", "Форель", "Скумбрия", "Сельдь", "Минтай"],
            "Морепродукты": ["Креветки", "Мидии", "Кальмары"],
            "Полуфабрикаты": ["Пельмени", "Вареники", "Котлеты", "Наггетсы"]
        },
        "Молочные продукты": {
            "Молоко": ["Молоко 2.5%", "Молоко 3.2%", "Молоко топленое"],
            "Сыр": ["Сыр Российский", "Сыр Гауда", "Сыр Моцарелла", "Творожный сыр"],
            "Йогурт": ["Йогурт питьевой", "Йогурт греческий", "Данон"],
            "Кисломолочные": ["Кефир", "Ряженка", "Сметана 15%", "Сметана 20%"],
            "Масло и сливки": ["Масло сливочное 82%", "Масло 72%", "Сливки 10%", "Сливки 33%"],
            "Яйца": ["Яйца C1", "Яйца C0", "Яйца перепелиные"]
        },
        "Хлеб и выпечка": {
            "Хлеб": ["Хлеб белый", "Хлеб бородинский", "Батон нарезной"],
            "Сладкая выпечка": ["Круассан", "Ватрушка", "Кекс"],
            "Лаваш и лепешки": ["Лепешка тандырная", "Лаваш тонкий"],
            "Торты": ["Торт Наполеон", "Торт Медовик", "Пирожное"]
        },
        "Напитки": {
            "Вода": ["Вода без газа", "Вода газированная", "Минеральная вода"],
            "Соки": ["Сок Яблочный", "Сок Апельсиновый", "Нектар Мультифрукт"],
            "Газировка": ["Кола", "Лимонад", "Тархун"],
            "Чай и кофе": ["Чай черный", "Чай зеленый", "Кофе растворимый", "Кофе в зернах"],
            "Энергетики": ["Энергетик Classic", "Энергетик Berry"]
        },
        "Бакалея": {
            "Крупы": ["Рис", "Гречка", "Овсянка", "Пшено"],
            "Макароны": ["Спагетти", "Рожки", "Перья"],
            "Масло": ["Масло подсолнечное", "Масло оливковое"],
            "Консервы": ["Горошек", "Кукуруза", "Тушенка", "Шпроты"],
            "Специи": ["Соль", "Сахар", "Перец черный", "Паприка"],
            "Снеки": ["Чипсы", "Сухарики", "Орешки"]
        },
        "Бытовая химия": {
            "Стирка": ["Порошок автомат", "Гель для стирки", "Кондиционер"],
            "Уборка": ["Средство для пола", "Спрей для окон", "Хлорка"],
            "Для посуды": ["Гель для посуды", "Таблетки для ПММ", "Губки"],
            "Освежители": ["Освежитель воздуха", "Ароматизатор"]
        },
        "Личная гигиена": {
            "Уход за волосами": ["Шампунь", "Бальзам", "Маска для волос"],
            "Уход за телом": ["Гель для душа", "Мыло жидкое", "Мыло кусковое"],
            "Зубная паста": ["Зубная паста", "Ополаскиватель", "Зубная щетка"],
            "Гигиена": ["Ватные диски", "Ватные палочки", "Салфетки"]
        }
    };

    const CATEGORY_IMAGES = {
        "Фрукты и овощи": {
            "Фрукты": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800", // Fresh fruit mix
            "Овощи": "https://images.unsplash.com/photo-1596525143048-5246231bd77f?auto=format&fit=crop&q=80&w=800", // Tomatoes/Veg
            "Зелень": "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&q=80&w=800", // Greenery
            "Ягоды": "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=800", // Berries
            "Экзотика": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800" // Exotic
        },
        "Мясо и рыба": {
            "Птица": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=800", // Chicken
            "Говядина": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800", // Meat red
            "Свинина": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800", // Meat red
            "Рыба": "https://images.unsplash.com/photo-1534939561126-855f8665b53e?auto=format&fit=crop&q=80&w=800", // Fish
            "Морепродукты": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=800", // Seafood
            "Полуфабрикаты": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=800" // Dumplings/Generic
        },
        "Молочные продукты": {
            "Молоко": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800", // Milk bottle
            "Сыр": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=800", // Cheese
            "Йогурт": "https://images.unsplash.com/photo-1528751041120-61a607a32c43?auto=format&fit=crop&q=80&w=800", // Yogurt
            "Кисломолочные": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800", // Dairy
            "Масло и сливки": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800", // Butter
            "Яйца": "https://images.unsplash.com/photo-1582722878654-02d6daf2980b?auto=format&fit=crop&q=80&w=800" // Eggs
        },
        "Хлеб и выпечка": {
            "Хлеб": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800", // Bread
            "Сладкая выпечка": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800", // Pastry
            "Лаваш и лепешки": "https://images.unsplash.com/photo-1573145460596-f94dd07fb02a?auto=format&fit=crop&q=80&w=800", // Flatbread
            "Торты": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800" // Cake
        },
        "Напитки": {
            "Вода": "https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&q=80&w=800", // Water
            "Соки": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800", // Juice
            "Газировка": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800", // Cola
            "Чай и кофе": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800", // Tea/Coffee
            "Энергетики": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=800" // Energy
        },
        "Бакалея": {
            "Крупы": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800", // Rice/Grains
            "Макароны": "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800", // Pasta
            "Масло": "https://images.unsplash.com/photo-1621857916515-585a2105151a?auto=format&fit=crop&q=80&w=800", // Oil
            "Консервы": "https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&q=80&w=800", // Cans
            "Специи": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800", // Spices
            "Снеки": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800" // Chips
        },
        "Бытовая химия": {
            "Стирка": "https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&q=80&w=800", // Laundry
            "Уборка": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800", // Cleaning
            "Для посуды": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800", // Dish soap
            "Освежители": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800" // Spray
        },
        "Личная гигиена": {
            "Уход за волосами": "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=800", // Shampoo
            "Уход за телом": "https://images.unsplash.com/photo-1556228720-1957be83f802?auto=format&fit=crop&q=80&w=800", // Body wash
            "Зубная паста": "https://images.unsplash.com/photo-1559599189-fe84fea4eb8b?auto=format&fit=crop&q=80&w=800", // Toothbrush
            "Гигиена": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800" // Pads/Cotton
        }
    };

    const ADJECTIVES = ["Свежий", "Отборный", "Премиум", "Классический", "Домашний", "Натуральный"];

    const FOOD_CATEGORIES = ["Фрукты и овощи", "Мясо и рыба", "Молочные продукты", "Хлеб и выпечка", "Напитки", "Бакалея"];
    const COUNTRIES_FOOD = ["Казахстан", "Россия", "Узбекистан", "Кыргызстан", "Беларусь"];
    const COUNTRIES_NON_FOOD = ["Казахстан", "Россия", "Турция", "Германия", "Польша", "Франция", "Италия"];

    const BRANDS_BY_COUNTRY = {
        "Казахстан": ["Рахат", "Баян Сулу", "Адал", "FoodMaster", "Зенченко", "Кублей", "Алматинский продукт", "Ак-Сай", "Цесна", "Арзан", "Султан"],
        "Россия": ["Макфа", "Простоквашино", "Мираторг", "Увелка", "Яшкино", "Алейка", "Добрый", "Чистая Линия", "Слобода"],
        "Беларусь": ["Савушкин", "Брест-Литовск", "Санта Бремор", "Беллакт"],
        "Узбекистан": ["Солнечный", "Ташкентские сладости", "Garden House"],
        "Кыргызстан": ["Шоро", "Бишкек-Нан", "Куликовский"],
        "Турция": ["ABC", "Duru", "Evyap", "Bingo", "Sleepy", "Papia"],
        "Германия": ["Nivea", "Persil", "Henkel", "Schwarzkopf", "Frosch", "Vernel", "Fa"],
        "Франция": ["L'Oreal", "Garnier", "Danone", "Tefal"],
        "Италия": ["Barilla", "Lavazza", "Felce Azzurra"],
        "Польша": ["Eveline", "Ziaja", "Bella"]
    };

    const GENERIC_BRANDS = ["LocalChoice", "EcoProduct", "BestValue"];

    Object.keys(CATALOG_STRUCTURE).forEach(category => {
        const subcategories = CATALOG_STRUCTURE[category].filter(s => s !== "Все");

        subcategories.forEach(sub => {
            const items = PRODUCT_BASES[category]?.[sub] || ["Товар"];
            // Generate 15 items per subcategory
            for (let i = 0; i < 15; i++) {
                const baseName = items[Math.floor(random() * items.length)];
                const adj = ADJECTIVES[Math.floor(random() * ADJECTIVES.length)];

                let basePrice = 200;
                if (category === "Мясо и рыба") basePrice = 1500;
                if (category === "Бытовая химия") basePrice = 800;
                if (category === "Напитки") basePrice = 300;
                if (category === "Личная гигиена") basePrice = 600;

                const price = Math.floor((basePrice + random() * 1000) / 10) * 10;

                const weightVal = random();
                let weight = weightVal > 0.6 ? "1 кг" : "500 г";
                if (category === "Напитки" || category === "Бытовая химия" || category === "Личная гигиена") {
                    weight = weightVal > 0.5 ? "1 л" : "500 мл";
                }
                if (baseName.includes("шт") || sub === "Экзотика" || sub === "Торты") {
                    weight = "1 шт";
                }

                // Country & Brand Logic
                const isFood = FOOD_CATEGORIES.includes(category);
                const allowedCountries = isFood ? COUNTRIES_FOOD : COUNTRIES_NON_FOOD;
                const country = allowedCountries[Math.floor(random() * allowedCountries.length)];

                const allowedBrands = BRANDS_BY_COUNTRY[country] || GENERIC_BRANDS;
                const brand = allowedBrands[Math.floor(random() * allowedBrands.length)];

                // Deterministic Subcategory Image
                const subImage = CATEGORY_IMAGES[category]?.[sub] || CATEGORY_IMAGES[category]?.[Object.keys(CATEGORY_IMAGES[category])[0]];

                products.push({
                    id: idCounter++,
                    name: `${baseName} ${adj}`,
                    category,
                    subcategory: sub,
                    price,
                    brand,
                    country,
                    rating: (3.8 + random() * 1.2).toFixed(1),
                    image: subImage,
                    weight
                });
            }
        });
    });

    return products;
}

export const products = generateProducts();
