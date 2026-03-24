import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categoriesData = [
    {
        name: "Фрукты",
        image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=1000"
    },
    {
        name: "Овощи",
        image: "https://images.unsplash.com/photo-1597362868123-a55d39003f86?auto=format&fit=crop&q=80&w=1000"
    },
    {
        name: "Молочные продукты",
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1000"
    },
    {
        name: "Хлеб и выпечка",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000"
    },
    {
        name: "Мясо и рыба",
        image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=1000"
    }
];

const manufacturersData = [
    { name: "FoodMaster", country: "Kazakhstan" },
    { name: "Адал", country: "Kazakhstan" },
    { name: "Айналайын", country: "Kazakhstan" },
    { name: "Рахат", country: "Kazakhstan" },
    { name: "Баян Сулу", country: "Kazakhstan" },
    { name: "Зенченко", country: "Kazakhstan" },
    { name: "Кублей", country: "Kazakhstan" },
    { name: "Алель Агро", country: "Kazakhstan" },
    { name: "Простоквашино", country: "Russia" },
    { name: "Домик в деревне", country: "Russia" },
    { name: "Макфа", country: "Russia" },
    { name: "Мираторг", country: "Russia" },
    { name: "Danone", country: "France" },
    { name: "Hochland", country: "Germany" },
    { name: "Local Farmer", country: "Kazakhstan" }
];

const nutritionProfiles = [
    { terms: ["молоко"], values: { calories: 60, protein: 3.2, fat: 3.2, carbs: 4.7, servingGrams: 900, nutritionBasis: "1 бутылка" } },
    { terms: ["кефир"], values: { calories: 53, protein: 3, fat: 2.5, carbs: 4, servingGrams: 900, nutritionBasis: "1 бутылка" } },
    { terms: ["йогурт", "активиа"], values: { calories: 85, protein: 4.2, fat: 3, carbs: 10.5, servingGrams: 140, nutritionBasis: "1 упаковка" } },
    { terms: ["творог"], values: { calories: 121, protein: 16, fat: 5, carbs: 3, servingGrams: 180, nutritionBasis: "1 упаковка" } },
    { terms: ["сыр"], values: { calories: 340, protein: 23, fat: 27, carbs: 1.5, servingGrams: 180, nutritionBasis: "1 упаковка" } },
    { terms: ["масло"], values: { calories: 748, protein: 0.6, fat: 82, carbs: 1, servingGrams: 180, nutritionBasis: "1 упаковка" } },
    { terms: ["хлеб", "батон", "лаваш", "багет"], values: { calories: 255, protein: 8, fat: 2.5, carbs: 50, servingGrams: 400, nutritionBasis: "1 упаковка" } },
    { terms: ["круассан"], values: { calories: 406, protein: 8.2, fat: 21, carbs: 45, servingGrams: 70, nutritionBasis: "1 шт" } },
    { terms: ["печенье"], values: { calories: 450, protein: 6.5, fat: 15, carbs: 72, servingGrams: 180, nutritionBasis: "1 упаковка" } },
    { terms: ["шоколад"], values: { calories: 535, protein: 6, fat: 31, carbs: 55, servingGrams: 85, nutritionBasis: "1 плитка" } },
    { terms: ["конфеты", "карамель", "вафли", "зефир"], values: { calories: 410, protein: 4, fat: 12, carbs: 72, servingGrams: 180, nutritionBasis: "1 упаковка" } },
    { terms: ["макароны", "спагетти", "лапша"], values: { calories: 340, protein: 11, fat: 1.3, carbs: 72, servingGrams: 450, nutritionBasis: "1 упаковка" } },
    { terms: ["мука"], values: { calories: 334, protein: 10.3, fat: 1.1, carbs: 68.9, servingGrams: 1000, nutritionBasis: "1 упаковка" } },
    { terms: ["яблок"], values: { calories: 47, protein: 0.4, fat: 0.4, carbs: 9.8, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["банан"], values: { calories: 89, protein: 1.1, fat: 0.3, carbs: 23, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["апельсин", "мандарин", "лимон"], values: { calories: 43, protein: 0.9, fat: 0.2, carbs: 9.3, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["груш"], values: { calories: 57, protein: 0.4, fat: 0.1, carbs: 15, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["виноград"], values: { calories: 67, protein: 0.6, fat: 0.4, carbs: 17, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["картофель"], values: { calories: 77, protein: 2, fat: 0.1, carbs: 17, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["томат", "помид"], values: { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["огур"], values: { calories: 15, protein: 0.8, fat: 0.1, carbs: 2.8, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["лук"], values: { calories: 40, protein: 1.1, fat: 0.1, carbs: 9.3, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["морковь"], values: { calories: 41, protein: 0.9, fat: 0.2, carbs: 10, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["капуста", "брокколи"], values: { calories: 31, protein: 2.5, fat: 0.3, carbs: 5.2, servingGrams: 1000, nutritionBasis: "1 кг" } },
    { terms: ["филе", "куриное", "курица", "бедро", "крылышки"], values: { calories: 165, protein: 22, fat: 8, carbs: 0, servingGrams: 900, nutritionBasis: "1 упаковка" } },
    { terms: ["говядина", "стейк", "фарш"], values: { calories: 220, protein: 18, fat: 17, carbs: 0, servingGrams: 800, nutritionBasis: "1 упаковка" } },
    { terms: ["бекон", "колбас"], values: { calories: 310, protein: 14, fat: 27, carbs: 2, servingGrams: 300, nutritionBasis: "1 упаковка" } },
    { terms: ["пельмени", "манты", "котлет"], values: { calories: 255, protein: 11, fat: 12, carbs: 24, servingGrams: 700, nutritionBasis: "1 упаковка" } },
    { terms: ["тушенка", "тушеная", "икра"], values: { calories: 240, protein: 15, fat: 18, carbs: 3, servingGrams: 325, nutritionBasis: "1 банка" } },
    { terms: ["форель", "семга", "рыба", "минтай", "хек", "сельд"], values: { calories: 185, protein: 20, fat: 11, carbs: 0, servingGrams: 500, nutritionBasis: "1 упаковка" } },
    { terms: ["кревет"], values: { calories: 99, protein: 24, fat: 0.3, carbs: 0.2, servingGrams: 500, nutritionBasis: "1 упаковка" } }
];

const categoryNutritionFallback = {
    "Фрукты": { calories: 52, protein: 0.7, fat: 0.2, carbs: 13, servingGrams: 1000, nutritionBasis: "1 кг" },
    "Овощи": { calories: 32, protein: 1.4, fat: 0.3, carbs: 6, servingGrams: 1000, nutritionBasis: "1 кг" },
    "Молочные продукты": { calories: 72, protein: 3.9, fat: 3.8, carbs: 4.7, servingGrams: 900, nutritionBasis: "1 упаковка" },
    "Хлеб и выпечка": { calories: 265, protein: 7.3, fat: 3.2, carbs: 52, servingGrams: 400, nutritionBasis: "1 упаковка" },
    "Мясо и рыба": { calories: 185, protein: 18, fat: 12, carbs: 0, servingGrams: 700, nutritionBasis: "1 упаковка" }
};

function inferNutrition(product) {
    const text = `${product.name || ""} ${product.description || ""}`.toLowerCase();
    const directMatch = nutritionProfiles.find((profile) => profile.terms.some((term) => text.includes(term)));

    if (directMatch) {
        return directMatch.values;
    }

    return categoryNutritionFallback[product.categoryName] || {
        calories: 120,
        protein: 4,
        fat: 4,
        carbs: 12,
        servingGrams: 300,
        nutritionBasis: "1 упаковка"
    };
}

const productsData = [
    {
        name: "Яблоки Апорт",
        description: "Легендарный алматинский сорт яблок с плотной сладкой мякотью.",
        price: 690,
        stock: 90,
        images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Фрукты",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Бананы Эквадор",
        description: "Спелые бананы для завтраков, смузи и детских перекусов.",
        price: 799,
        stock: 150,
        images: ["https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Фрукты",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Апельсины Навел",
        aliases: ["Апельсины Navels"],
        description: "Сочные апельсины с ярким вкусом и тонкой кожурой.",
        price: 949,
        stock: 80,
        images: ["https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Фрукты",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Груша Конференция",
        description: "Сладкая десертная груша, подходящая для свежей подачи.",
        price: 1190,
        stock: 60,
        images: ["https://images.unsplash.com/photo-1514756331096-242f3100f167?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Фрукты",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Лимоны",
        description: "Кисло-ароматные лимоны для чая, десертов и маринадов.",
        price: 890,
        stock: 70,
        images: ["https://images.unsplash.com/photo-1568569350062-ebbf3ad17500?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Фрукты",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Мандарины",
        description: "Сладкие мандарины без косточек для зимнего стола.",
        price: 1290,
        stock: 110,
        images: ["https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Фрукты",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Картофель молодой",
        description: "Казахстанский картофель для запекания, супов и гарниров.",
        price: 229,
        stock: 450,
        images: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Овощи",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Томаты розовые",
        description: "Мясистые томаты с насыщенным сладковатым вкусом.",
        price: 1150,
        stock: 95,
        images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Овощи",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Огурцы тепличные",
        description: "Хрустящие длинноплодные огурцы для салатов и закусок.",
        price: 920,
        stock: 85,
        images: ["https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Овощи",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Лук репчатый",
        description: "Отборный лук для горячих блюд, супов и зажарки.",
        price: 199,
        stock: 400,
        images: ["https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Овощи",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Морковь мытая",
        description: "Сладкая морковь с ровным калибром и чистой кожицей.",
        price: 329,
        stock: 320,
        images: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Овощи",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Капуста белокочанная",
        description: "Плотные кочаны для салатов, тушения и домашних заготовок.",
        price: 215,
        stock: 210,
        images: ["https://images.unsplash.com/photo-1591584382817-386ebbc5140e?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Овощи",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Молоко Adal 3.2%",
        description: "Пастеризованное молоко для каш, кофе и ежедневного потребления.",
        price: 610,
        stock: 180,
        images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Молочные продукты",
        manufacturerName: "Адал"
    },
    {
        name: "Кефир FoodMaster 2.5%",
        description: "Классический кефир с мягкой кисломолочной закваской.",
        price: 525,
        stock: 160,
        images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Молочные продукты",
        manufacturerName: "FoodMaster"
    },
    {
        name: "Йогурт FoodMaster греческий",
        description: "Густой йогурт без лишней сладости для завтраков и десертов.",
        price: 799,
        stock: 90,
        images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Молочные продукты",
        manufacturerName: "FoodMaster"
    },
    {
        name: "Молоко Айналайын 2.5%",
        description: "Ультрапастеризованное молоко для домашнего запаса.",
        price: 565,
        stock: 140,
        images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Молочные продукты",
        manufacturerName: "Айналайын"
    },
    {
        name: "Творог Простоквашино 5%",
        description: "Классический творог для сырников, завтраков и выпечки.",
        price: 925,
        stock: 85,
        images: ["https://images.unsplash.com/photo-1554998171-89445e31c52b?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Молочные продукты",
        manufacturerName: "Простоквашино"
    },
    {
        name: "Сметана Домик в деревне 20%",
        description: "Густая сметана для борща, выпечки и горячих блюд.",
        price: 675,
        stock: 120,
        images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Молочные продукты",
        manufacturerName: "Домик в деревне"
    },
    {
        name: "Йогурт Danone Активиа",
        aliases: ["Йогурт Danone Activia"],
        description: "Питьевой йогурт для быстрого перекуса в дороге или офисе.",
        price: 409,
        stock: 130,
        images: ["https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Молочные продукты",
        manufacturerName: "Danone"
    },
    {
        name: "Сыр Hochland сливочный",
        description: "Плавленый сыр в ломтиках для сэндвичей и тостов.",
        price: 790,
        stock: 145,
        images: ["https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Молочные продукты",
        manufacturerName: "Hochland"
    },
    {
        name: "Масло сливочное Зенченко 82.5%",
        aliases: ["Масло Зенченко 82.5%"],
        description: "Сливочное масло с высокой жирностью для выпечки и завтраков.",
        price: 1490,
        stock: 75,
        images: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Молочные продукты",
        manufacturerName: "Зенченко"
    },
    {
        name: "Батон Нарезной",
        aliases: ["Батон нарезной"],
        description: "Мягкий пшеничный хлеб на каждый день.",
        price: 210,
        stock: 190,
        images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Хлеб и выпечка",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Багет французский",
        description: "Хрустящий багет для сэндвичей, закусок и сервировки.",
        price: 390,
        stock: 80,
        images: ["https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Хлеб и выпечка",
        manufacturerName: "Local Farmer"
    },
    {
        name: "Шоколад Рахат Казахстан",
        aliases: ["Шоколад Казахстан"],
        description: "Фирменный молочный шоколад, хорошо знакомый покупателям в Казахстане.",
        price: 469,
        stock: 260,
        images: ["https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Хлеб и выпечка",
        manufacturerName: "Рахат"
    },
    {
        name: "Конфеты Рахат Мишка на Севере",
        aliases: ["Мишка на севере"],
        description: "Популярные шоколадные конфеты для подарка и домашнего чаепития.",
        price: 2890,
        stock: 70,
        images: ["https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Хлеб и выпечка",
        manufacturerName: "Рахат"
    },
    {
        name: "Конфеты Баян Сулу ассорти",
        description: "Набор шоколадных конфет от одного из крупнейших кондитеров Казахстана.",
        price: 3190,
        stock: 55,
        images: ["https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Хлеб и выпечка",
        manufacturerName: "Баян Сулу"
    },
    {
        name: "Печенье Баян Сулу",
        description: "Рассыпчатое печенье к чаю и семейным перекусам.",
        price: 690,
        stock: 110,
        images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Хлеб и выпечка",
        manufacturerName: "Баян Сулу"
    },
    {
        name: "Макароны Макфа Перья",
        aliases: ["Макароны Макфа перья"],
        description: "Паста из твердых сортов пшеницы для быстрых домашних блюд.",
        price: 525,
        stock: 200,
        images: ["https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Хлеб и выпечка",
        manufacturerName: "Макфа"
    },
    {
        name: "Филе Куриное Алель",
        aliases: ["Филе куриное Алель"],
        description: "Охлажденное куриное филе для запекания, жарки и диетических блюд.",
        price: 2590,
        stock: 65,
        images: ["https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Мясо и рыба",
        manufacturerName: "Алель Агро"
    },
    {
        name: "Голень куриная Алель",
        description: "Охлажденная куриная голень для духовки и гриля.",
        price: 1890,
        stock: 75,
        images: ["https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Мясо и рыба",
        manufacturerName: "Алель Агро"
    },
    {
        name: "Фарш Говяжий Мираторг",
        aliases: ["Фарш говяжий Мираторг"],
        description: "Готовый фарш для котлет, пасты и домашних соусов.",
        price: 3350,
        stock: 45,
        images: ["https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Мясо и рыба",
        manufacturerName: "Мираторг"
    },
    {
        name: "Стейк Рибай Мираторг",
        aliases: ["Стейк рибай Мираторг"],
        description: "Премиальный стейк для домашнего гриля и особого ужина.",
        price: 8750,
        stock: 24,
        images: ["https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Мясо и рыба",
        manufacturerName: "Мираторг"
    },
    {
        name: "Тушенка Говяжья Кублей",
        aliases: ["Тушенка говяжья Кублей"],
        description: "Мясные консервы для походов, запаса и быстрых горячих блюд.",
        price: 1190,
        stock: 130,
        images: ["https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Мясо и рыба",
        manufacturerName: "Кублей"
    },
    {
        name: "Скумбрия холодного копчения",
        description: "Готовая рыба с плотной текстурой для закусок и сервировки.",
        price: 2290,
        stock: 42,
        images: ["https://images.unsplash.com/photo-1534939561126-855f8665b53e?auto=format&fit=crop&q=80&w=1200"],
        categoryName: "Мясо и рыба",
        manufacturerName: "Local Farmer"
    }
];

productsData.push(
    ...[
        { name: "Виноград белый", description: "Сладкий столовый виноград без выраженной кислинки.", price: 1490, stock: 60, images: ["https://images.unsplash.com/photo-1515778767554-7a5239f72c54?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Виноград черный", description: "Плотные ягоды винограда для десертов и сырной тарелки.", price: 1590, stock: 55, images: ["https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Киви", description: "Спелый киви с освежающим кисло-сладким вкусом.", price: 1390, stock: 70, images: ["https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Гранат", description: "Спелый гранат с насыщенным вкусом и крупными зернами.", price: 1290, stock: 65, images: ["https://images.unsplash.com/photo-1541344999736-83eca272f6fc?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Хурма", description: "Мягкая сладкая хурма для осеннего ассортимента.", price: 1190, stock: 45, images: ["https://images.unsplash.com/photo-1603046891744-76e6300f4851?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Персики", description: "Ароматные персики с сочной мякотью.", price: 1790, stock: 50, images: ["https://images.unsplash.com/photo-1629828874514-3a97f0654f4e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Нектарины", description: "Гладкие сладкие нектарины для летнего меню.", price: 1850, stock: 45, images: ["https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Сливы", description: "Спелые сливы для перекуса, компотов и выпечки.", price: 1090, stock: 65, images: ["https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Абрикосы", description: "Сладкие абрикосы с ярким летним ароматом.", price: 1690, stock: 55, images: ["https://images.unsplash.com/photo-1595412017587-b7f32bd9a7f8?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Айва", description: "Плотная ароматная айва для варенья и запекания.", price: 990, stock: 30, images: ["https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Ананас", description: "Сладкий тропический ананас для свежей подачи.", price: 2190, stock: 25, images: ["https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Грейпфрут", description: "Освежающий цитрус с легкой благородной горчинкой.", price: 1150, stock: 40, images: ["https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Помело", description: "Крупный цитрус с нежной мякотью и мягким вкусом.", price: 1490, stock: 35, images: ["https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Черешня", description: "Сладкая черешня для сезонного летнего предложения.", price: 2890, stock: 25, images: ["https://images.unsplash.com/photo-1528821154947-1aa3d1b74941?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Вишня", description: "Кисло-сладкая вишня для выпечки и десертов.", price: 2390, stock: 25, images: ["https://images.unsplash.com/photo-1528821154947-1aa3d1b74941?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Клубника", description: "Ароматная клубника для десертов и завтраков.", price: 2490, stock: 30, images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Малина", description: "Нежная ягода для каш, десертов и напитков.", price: 2690, stock: 20, images: ["https://images.unsplash.com/photo-1577003833619-76bbd7f82948?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Голубика", description: "Популярная ягода для полезных перекусов и боулов.", price: 3290, stock: 18, images: ["https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Арбуз", description: "Сладкий арбуз для летнего ассортимента и семейных ужинов.", price: 390, stock: 80, images: ["https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },
        { name: "Дыня", description: "Сочная дыня с медовым ароматом.", price: 590, stock: 50, images: ["https://images.unsplash.com/photo-1571575173700-afb9492e6a50?auto=format&fit=crop&q=80&w=1200"], categoryName: "Фрукты", manufacturerName: "Local Farmer" },

        { name: "Свекла", description: "Свежая свекла для борща, салатов и запекания.", price: 230, stock: 210, images: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Кабачки", description: "Молодые кабачки для жарки, тушения и гриля.", price: 690, stock: 90, images: ["https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Баклажаны", description: "Плотные баклажаны для рагу, запекания и восточных блюд.", price: 820, stock: 75, images: ["https://images.unsplash.com/photo-1607305387299-a3d9611cd469?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Перец болгарский красный", description: "Сладкий красный перец для салатов и горячих блюд.", price: 1290, stock: 70, images: ["https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Перец болгарский желтый", description: "Сочный желтый перец для ярких блюд и гарниров.", price: 1290, stock: 60, images: ["https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Перец болгарский зеленый", description: "Хрустящий зеленый перец для жарки и салатов.", price: 1190, stock: 65, images: ["https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Чеснок", description: "Ароматный чеснок для маринадов, соусов и горячих блюд.", price: 1490, stock: 40, images: ["https://images.unsplash.com/photo-1615477550927-6ec2f1b1e454?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Имбирь", description: "Свежий корень имбиря для чая и азиатской кухни.", price: 1890, stock: 25, images: ["https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Редис", description: "Хрустящий редис для весенних салатов и закусок.", price: 690, stock: 55, images: ["https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Шампиньоны", description: "Свежие шампиньоны для супов, пасты и жарки.", price: 1350, stock: 65, images: ["https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Брокколи", description: "Соцветия брокколи для полезных гарниров и супов.", price: 1490, stock: 40, images: ["https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Цветная капуста", description: "Нежная цветная капуста для запекания и рагу.", price: 1190, stock: 45, images: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Сельдерей стеблевой", description: "Свежий сельдерей для салатов, соков и супов.", price: 990, stock: 35, images: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Капуста пекинская", description: "Легкая листовая капуста для свежих салатов.", price: 690, stock: 70, images: ["https://images.unsplash.com/photo-1591584382817-386ebbc5140e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Тыква", description: "Сладкая тыква для каш, супов и запекания.", price: 420, stock: 85, images: ["https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Салат Айсберг", description: "Хрустящий салат для бургеров и легких салатов.", price: 790, stock: 55, images: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Укроп", description: "Свежая зелень для супов, салатов и горячих блюд.", price: 250, stock: 120, images: ["https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Петрушка", description: "Ароматная петрушка для универсального использования на кухне.", price: 250, stock: 120, images: ["https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Кинза", description: "Свежая кинза для восточных блюд и маринадов.", price: 260, stock: 90, images: ["https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },
        { name: "Лук зеленый", description: "Свежий зеленый лук для окрошки, салатов и подачи.", price: 230, stock: 100, images: ["https://images.unsplash.com/photo-1628773822503-930a7eaecf80?auto=format&fit=crop&q=80&w=1200"], categoryName: "Овощи", manufacturerName: "Local Farmer" },

        { name: "Молоко Адал 2.5%", description: "Ежедневное молоко для кофе, каш и домашней кухни.", price: 590, stock: 200, images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Адал" },
        { name: "Кефир Адал 2.5%", description: "Классический кефир от казахстанского производителя Адал.", price: 515, stock: 150, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Адал" },
        { name: "Сметана Адал 15%", description: "Нежная сметана для супов, соусов и выпечки.", price: 620, stock: 120, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Адал" },
        { name: "Творог Адал 9%", description: "Рассыпчатый творог для сырников и полезного завтрака.", price: 880, stock: 85, images: ["https://images.unsplash.com/photo-1554998171-89445e31c52b?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Адал" },
        { name: "Ряженка Адал 4%", description: "Традиционная ряженка с мягким карамельным вкусом.", price: 540, stock: 90, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Адал" },
        { name: "Айран Адал", description: "Освежающий айран для лета и восточной кухни.", price: 430, stock: 110, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Адал" },
        { name: "Молоко FoodMaster 3.2%", description: "Пастеризованное молоко FoodMaster на каждый день.", price: 605, stock: 170, images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "FoodMaster" },
        { name: "Сметана FoodMaster 20%", description: "Густая сметана для горячих блюд и домашней выпечки.", price: 670, stock: 115, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "FoodMaster" },
        { name: "Творог FoodMaster 5%", description: "Классический творог для здорового питания и завтраков.", price: 860, stock: 95, images: ["https://images.unsplash.com/photo-1554998171-89445e31c52b?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "FoodMaster" },
        { name: "Йогурт FoodMaster натуральный", description: "Натуральный йогурт без ярких добавок для боулов и десертов.", price: 520, stock: 105, images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "FoodMaster" },
        { name: "Айран FoodMaster", description: "Популярный айран для обеда и летних перекусов.", price: 420, stock: 125, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "FoodMaster" },
        { name: "Снежок FoodMaster", description: "Сладкий кисломолочный напиток для детей и семейного стола.", price: 390, stock: 85, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "FoodMaster" },
        { name: "Молоко Айналайын 3.2%", description: "Более насыщенное молоко с высоким процентом жирности.", price: 610, stock: 140, images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Айналайын" },
        { name: "Кефир Айналайын 2.5%", description: "Кефир для повседневного потребления и домашней кухни.", price: 495, stock: 100, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Айналайын" },
        { name: "Сливки Домик в деревне 10%", description: "Питьевые сливки для кофе, соусов и супов.", price: 710, stock: 70, images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Домик в деревне" },
        { name: "Молоко Домик в деревне 3.2%", description: "Классическое молоко для семьи и домашней выпечки.", price: 620, stock: 90, images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Домик в деревне" },
        { name: "Кефир Простоквашино 2.5%", description: "Популярный кефир в удобной повседневной упаковке.", price: 520, stock: 95, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Простоквашино" },
        { name: "Сметана Простоквашино 15%", description: "Сметана для борща, вареников и домашних соусов.", price: 640, stock: 80, images: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Простоквашино" },
        { name: "Творожок Danone", description: "Нежный творожный десерт для быстрого перекуса.", price: 450, stock: 110, images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Danone" },
        { name: "Actimel Danone клубника", description: "Кисломолочный напиток в маленькой бутылочке.", price: 390, stock: 140, images: ["https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Danone" },
        { name: "Растишка Danone клубника-банан", description: "Детский йогурт с мягким фруктовым вкусом.", price: 430, stock: 85, images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Danone" },
        { name: "Сыр Hochland творожный", description: "Творожный сыр для завтраков, роллов и бутербродов.", price: 990, stock: 90, images: ["https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Hochland" },
        { name: "Сыр Hochland чизбургер", description: "Ломтики сыра для бургеров и горячих сэндвичей.", price: 840, stock: 75, images: ["https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Hochland" },
        { name: "Масло Зенченко 72.5%", description: "Сливочное масло для повседневного использования.", price: 1320, stock: 70, images: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Зенченко" },
        { name: "Творог Зенченко домашний", description: "Домашний творог для сырников и выпечки.", price: 940, stock: 60, images: ["https://images.unsplash.com/photo-1554998171-89445e31c52b?auto=format&fit=crop&q=80&w=1200"], categoryName: "Молочные продукты", manufacturerName: "Зенченко" },

        { name: "Лаваш тонкий", description: "Тонкий лаваш для рулетов, шаурмы и горячих закусок.", price: 320, stock: 120, images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Local Farmer" },
        { name: "Чиабатта", description: "Воздушная чиабатта для сэндвичей и закусок.", price: 420, stock: 70, images: ["https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Local Farmer" },
        { name: "Булочки для бургеров", description: "Мягкие булочки с кунжутом для домашних бургеров.", price: 520, stock: 65, images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Local Farmer" },
        { name: "Самса с говядиной", description: "Сытная выпечка в восточном стиле.", price: 450, stock: 45, images: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Local Farmer" },
        { name: "Круассан миндальный", description: "Сдобный круассан с миндальной начинкой.", price: 390, stock: 40, images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Local Farmer" },
        { name: "Печенье овсяное", description: "Домашнее овсяное печенье к чаю и кофе.", price: 560, stock: 85, images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Local Farmer" },
        { name: "Пряники классические", description: "Мягкие пряники для чаепития и перекуса.", price: 490, stock: 70, images: ["https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Local Farmer" },
        { name: "Сушки ванильные", description: "Традиционные сушки для семейного чаепития.", price: 360, stock: 95, images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Local Farmer" },
        { name: "Шоколад Рахат темный", description: "Темный шоколад от казахстанского бренда Рахат.", price: 510, stock: 160, images: ["https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Рахат" },
        { name: "Шоколад Рахат молочный с фундуком", description: "Молочный шоколад с орехами для повседневного десерта.", price: 560, stock: 150, images: ["https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Рахат" },
        { name: "Конфеты Рахат Белочка", description: "Шоколадные конфеты с ореховой начинкой.", price: 2990, stock: 60, images: ["https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Рахат" },
        { name: "Карамель Рахат ассорти", description: "Фруктовая карамель для домашнего сладкого запаса.", price: 1290, stock: 70, images: ["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Рахат" },
        { name: "Вафли Рахат шоколадные", description: "Хрустящие вафли в шоколадной глазури.", price: 790, stock: 80, images: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Рахат" },
        { name: "Шоколад Баян Сулу молочный", description: "Молочный шоколад от известного бренда Баян Сулу.", price: 450, stock: 110, images: ["https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Баян Сулу" },
        { name: "Зефир Баян Сулу ванильный", description: "Нежный зефир для легкого десерта.", price: 890, stock: 75, images: ["https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Баян Сулу" },
        { name: "Вафли Баян Сулу", description: "Слоистые вафли с классической сладкой начинкой.", price: 690, stock: 85, images: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Баян Сулу" },
        { name: "Спагетти Макфа", description: "Классические спагетти из твердых сортов пшеницы.", price: 540, stock: 140, images: ["https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Макфа" },
        { name: "Макароны Макфа рожки", description: "Популярная форма пасты для детских и семейных блюд.", price: 520, stock: 130, images: ["https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Макфа" },
        { name: "Лапша Макфа длинная", description: "Паста для супов и горячих гарниров.", price: 510, stock: 125, images: ["https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Макфа" },
        { name: "Мука Макфа пшеничная", description: "Пшеничная мука для выпечки хлеба, пирогов и блинов.", price: 680, stock: 95, images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200"], categoryName: "Хлеб и выпечка", manufacturerName: "Макфа" },

        { name: "Крылышки куриные Алель", description: "Охлажденные куриные крылышки для гриля и запекания.", price: 1790, stock: 70, images: ["https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Алель Агро" },
        { name: "Бедро куриное Алель", description: "Сочное куриное бедро для запекания и тушения.", price: 1990, stock: 65, images: ["https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Алель Агро" },
        { name: "Фарш куриный Алель", description: "Легкий куриный фарш для котлет и запеканок.", price: 1650, stock: 55, images: ["https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Алель Агро" },
        { name: "Филе бедра Алель", description: "Филе бедра для сочных горячих блюд и шашлыка.", price: 2290, stock: 50, images: ["https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Алель Агро" },
        { name: "Колбаски Мираторг для жарки", description: "Колбаски для быстрого ужина на сковороде или гриле.", price: 2490, stock: 45, images: ["https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Мираторг" },
        { name: "Бекон Мираторг", description: "Ломтики бекона для завтраков, пасты и бургеров.", price: 1890, stock: 40, images: ["https://images.unsplash.com/photo-1529692236671-f1dc83a17771?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Мираторг" },
        { name: "Стриплойн Мираторг", description: "Премиальный стейк для ценителей говядины.", price: 7990, stock: 18, images: ["https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Мираторг" },
        { name: "Тушенка Кублей халяль", description: "Мясные консервы в халяль-линейке.", price: 1250, stock: 95, images: ["https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Кублей" },
        { name: "Говядина тушеная Кублей премиум", description: "Консервы из говядины для запаса и быстрых блюд.", price: 1390, stock: 90, images: ["https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Кублей" },
        { name: "Конина тушеная Кублей", description: "Консервы из конины в традиционном для региона формате.", price: 1490, stock: 70, images: ["https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Кублей" },
        { name: "Форель охлажденная", description: "Свежая форель для запекания и стейков.", price: 4390, stock: 28, images: ["https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" },
        { name: "Семга стейк", description: "Стейки семги для духовки и гриля.", price: 5190, stock: 24, images: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" },
        { name: "Минтай филе", description: "Замороженное филе минтая для повседневных блюд.", price: 1790, stock: 55, images: ["https://images.unsplash.com/photo-1534939561126-855f8665b53e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" },
        { name: "Хек тушка", description: "Рыба для жарки, запекания и домашних ужинов.", price: 1690, stock: 50, images: ["https://images.unsplash.com/photo-1534939561126-855f8665b53e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" },
        { name: "Сельдь слабосоленая", description: "Готовая сельдь для закусок и праздничного стола.", price: 1250, stock: 60, images: ["https://images.unsplash.com/photo-1534939561126-855f8665b53e?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" },
        { name: "Икра мойвы", description: "Популярная закуска для бутербродов и канапе.", price: 990, stock: 55, images: ["https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" },
        { name: "Креветки очищенные", description: "Очищенные креветки для пасты, салатов и wok-блюд.", price: 3490, stock: 38, images: ["https://images.unsplash.com/photo-1565680018434-b513d7c1d4af?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" },
        { name: "Пельмени говяжьи", description: "Классические пельмени для быстрого семейного ужина.", price: 2290, stock: 70, images: ["https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" },
        { name: "Манты с говядиной", description: "Крупные манты для традиционного домашнего стола.", price: 2590, stock: 50, images: ["https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" },
        { name: "Котлеты домашние", description: "Полуфабрикаты для быстрого приготовления на ужин.", price: 2190, stock: 55, images: ["https://images.unsplash.com/photo-1529692236671-f1dc83a17771?auto=format&fit=crop&q=80&w=1200"], categoryName: "Мясо и рыба", manufacturerName: "Local Farmer" }
    ]
);

async function upsertCategory(category) {
    return prisma.category.upsert({
        where: { name: category.name },
        update: { image: category.image },
        create: category
    });
}

async function upsertManufacturer(manufacturer) {
    return prisma.manufacturer.upsert({
        where: { name: manufacturer.name },
        update: { country: manufacturer.country },
        create: manufacturer
    });
}

async function upsertProduct(product, categoryId, manufacturerId) {
    const nutrition = inferNutrition(product);
    const existingProduct = await prisma.product.findFirst({
        where: {
            OR: [
                { name: product.name },
                ...((product.aliases || []).map((alias) => ({ name: alias })))
            ]
        }
    });

    if (existingProduct) {
        return prisma.product.update({
            where: { id: existingProduct.id },
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                images: product.images,
                calories: nutrition.calories,
                protein: nutrition.protein,
                fat: nutrition.fat,
                carbs: nutrition.carbs,
                servingGrams: nutrition.servingGrams,
                nutritionBasis: nutrition.nutritionBasis,
                categoryId,
                manufacturerId
            }
        });
    }

    return prisma.product.create({
        data: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images,
            calories: nutrition.calories,
            protein: nutrition.protein,
            fat: nutrition.fat,
            carbs: nutrition.carbs,
            servingGrams: nutrition.servingGrams,
            nutritionBasis: nutrition.nutritionBasis,
            categoryId,
            manufacturerId
        }
    });
}

async function seedUsers() {
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash("admin123", salt);
    const userPass = await bcrypt.hash("user123", salt);

    await prisma.user.upsert({
        where: { email: "admin@citycenter.com" },
        update: {},
        create: {
            email: "admin@citycenter.com",
            firstName: "Admin",
            lastName: "User",
            password: adminPass,
            role: "ADMIN"
        }
    });

    await prisma.user.upsert({
        where: { email: "user@citycenter.com" },
        update: {},
        create: {
            email: "user@citycenter.com",
            firstName: "User",
            lastName: "Test",
            password: userPass,
            role: "USER"
        }
    });
}

async function main() {
    console.log("Seeding categories...");
    const categoryMap = {};

    for (const category of categoriesData) {
        const savedCategory = await upsertCategory(category);
        categoryMap[category.name] = savedCategory.id;
        console.log(`- Category: ${category.name}`);
    }

    console.log("Seeding manufacturers...");
    const manufacturerMap = {};

    for (const manufacturer of manufacturersData) {
        const savedManufacturer = await upsertManufacturer(manufacturer);
        manufacturerMap[manufacturer.name] = savedManufacturer.id;
        console.log(`- Manufacturer: ${manufacturer.name}`);
    }

    console.log("Seeding products...");
    for (const product of productsData) {
        const categoryId = categoryMap[product.categoryName];
        const manufacturerId = manufacturerMap[product.manufacturerName];

        if (!categoryId || !manufacturerId) {
            console.warn(`- Skip product ${product.name}: missing category or manufacturer`);
            continue;
        }

        await upsertProduct(product, categoryId, manufacturerId);
        console.log(`- Product: ${product.name}`);
    }

    const seededProductNames = productsData.map((product) => product.name);
    const cleanupResult = await prisma.product.deleteMany({
        where: {
            name: { notIn: seededProductNames },
            orderItems: { none: {} },
            cartItems: { none: {} },
            reviews: { none: {} },
            favoritedBy: { none: {} }
        }
    });

    if (cleanupResult.count > 0) {
        console.log(`- Removed obsolete demo products: ${cleanupResult.count}`);
    }

    console.log("Seeding system users...");
    await seedUsers();

    console.log("Seed completed successfully");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
