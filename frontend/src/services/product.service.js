import fetchAPI from './api';

export const getProducts = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await fetchAPI(`/products?${query}`);
};

export const getProductById = async (id) => {
    return await fetchAPI(`/products/${id}`);
};

export const getCategories = async () => {
    return await fetchAPI('/categories');
};
