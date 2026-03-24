import fetchAPI from "./api";

export const getAdminOrders = async () => {
    return await fetchAPI("/orders/admin/all");
};

export const getAdminOrderById = async (id) => {
    return await fetchAPI(`/orders/admin/${id}`);
};

export const updateAdminOrderStatus = async (id, status) => {
    return await fetchAPI(`/orders/admin/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
    });
};
