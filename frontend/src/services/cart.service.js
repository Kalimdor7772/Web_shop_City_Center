import fetchAPI from './api';

export const syncCart = async (items) => {
    return await fetchAPI('/cart/sync', {
        method: 'POST',
        body: JSON.stringify({ items }),
    });
};

export const getCart = async () => {
    return await fetchAPI('/cart');
};
