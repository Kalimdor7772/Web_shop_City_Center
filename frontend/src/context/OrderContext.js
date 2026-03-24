"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import * as orderService from "@/services/order.service";

const OrderContext = createContext({
    orders: [],
    fetchOrders: async () => { },
    createOrder: async () => ({ success: false }),
    addOrder: () => { },
    getOrderById: async () => undefined
});

export const OrderProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        if (!isAuthenticated || !user?.id) {
            setOrders([]);
            return;
        }
        setIsLoading(true);
        try {
            const response = await orderService.getMyOrders();
            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            if (error?.status !== 401) {
                console.error("Failed to fetch orders:", error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?.id]);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) {
            setOrders([]);
            return;
        }
        void fetchOrders();
    }, [fetchOrders, isAuthenticated, user?.id]);

    const createOrder = async (orderData) => {
        try {
            const response = await orderService.createOrder(orderData);
            if (response.success) {
                setOrders(prev => [response.data, ...prev]);
                return { success: true, order: response.data };
            }
            return { success: false, error: response.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const getOrderById = async (id) => {
        // First check local state
        const local = orders.find((order) => order.id === id);
        if (local) return local;

        // Then fetch from backend
        try {
            const response = await orderService.getOrderById(id);
            if (response.success) return response.data;
        } catch (error) {
            if (error?.status !== 401) {
                console.error("Failed to fetch order details:", error);
            }
        }
        return undefined;
    };

    const addOrder = (order) => {
        setOrders((prev) => [order, ...prev]);
    };

    return (
        <OrderContext.Provider value={{ orders, fetchOrders, createOrder, addOrder, getOrderById, isLoading }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrder must be used within an OrderProvider");
    }
    return context;
};
