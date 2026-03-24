export const validateName = (name) => {
    if (!name || !name.trim()) return "Введите ФИО";
    if (name.trim().length < 2) return "Минимум 2 буквы";
    return null;
};

export const validatePhone = (phone) => {
    if (!phone || !phone.trim()) return "Введите номер телефона";
    // Check for full mask completion: +7 (XXX) XXX-XX-XX
    // Clean string length should be 11 (7 + 10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 11) return "Введите номер полностью";
    return null;
};

export const validateRequired = (value, fieldName = "Поле") => {
    if (!value || !value.toString().trim()) {
        return `${fieldName} обязательно для заполнения`;
    }
    return null;
};

export const validateAddress = (address) => {
    const errors = {};
    if (!address.city) errors.city = "Выберите город";
    if (!address.street?.trim()) errors.street = "Укажите улицу";
    if (!address.house?.trim()) errors.house = "Укажите дом";
    return errors;
};
