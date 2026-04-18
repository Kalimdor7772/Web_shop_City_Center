"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import * as cartService from "@/services/cart.service";

const CartContext = createContext({
    cartItems: [],
    addToCart: () => {},
    removeFromCart: () => {},
    increaseQuantity: () => {},
    decreaseQuantity: () => {},
    clearCart: () => {},
    totalPrice: 0,
    totalItems: 0,
});

const normalizeCartItems = (items = []) => {
    const mergedItems = new Map();

    items.forEach((item) => {
        const itemId = item?.id !== undefined && item?.id !== null ? String(item.id) : null;
        if (!itemId) return;

        const quantity = Math.max(1, Number(item.quantity) || 1);
        const existingItem = mergedItems.get(itemId);

        if (existingItem) {
            mergedItems.set(itemId, {
                ...existingItem,
                quantity: existingItem.quantity + quantity,
            });
            return;
        }

        mergedItems.set(itemId, {
            ...item,
            id: itemId,
            quantity,
        });
    });

    return Array.from(mergedItems.values());
};

const areCartItemsEqual = (left = [], right = []) => {
    if (left.length !== right.length) return false;

    return left.every((item, index) => {
        const nextItem = right[index];
        return (
            item.id === nextItem?.id &&
            item.quantity === nextItem?.quantity &&
            item.price === nextItem?.price &&
            item.name === nextItem?.name
        );
    });
};

export const CartProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const isSyncing = useRef(false);
    const hasLoadedBackendCart = useRef(false);
    const prevUserId = useRef(null);
    const cartItemsRef = useRef([]);

    useEffect(() => {
        cartItemsRef.current = cartItems;
    }, [cartItems]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            try {
                setCartItems(normalizeCartItems(JSON.parse(storedCart)));
            } catch (error) {
                console.error("Failed to parse cart items:", error);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (!isInitialized) return;

        const currentUserId = user?.id || null;

        if (prevUserId.current !== currentUserId) {
            hasLoadedBackendCart.current = false;

            if (!currentUserId) {
                setCartItems([]);
                localStorage.removeItem("cartItems");
            }
        }

        prevUserId.current = currentUserId;
    }, [isInitialized, user?.id]);

    useEffect(() => {
        const fetchBackendCart = async () => {
            if (isAuthenticated && isInitialized && user?.id && !hasLoadedBackendCart.current) {
                try {
                    const response = await cartService.getCart();
                    hasLoadedBackendCart.current = true;

                    if (response.success && response.data.length > 0) {
                        setCartItems(normalizeCartItems(response.data));
                    } else {
                        await cartService.syncCart(normalizeCartItems(cartItemsRef.current));
                    }
                } catch (error) {
                    hasLoadedBackendCart.current = true;
                    if (error?.status !== 401) {
                        console.error("Failed to fetch backend cart:", error);
                    }
                }
            }
        };

        void fetchBackendCart();
    }, [isAuthenticated, isInitialized, user?.id]);

    useEffect(() => {
        if (!isInitialized) return;

        const normalizedItems = normalizeCartItems(cartItems);

        if (!areCartItemsEqual(cartItems, normalizedItems)) {
            setCartItems(normalizedItems);
            return;
        }

        localStorage.setItem("cartItems", JSON.stringify(normalizedItems));

        const syncWithBackend = async () => {
            if (isAuthenticated && user?.id && hasLoadedBackendCart.current && !isSyncing.current) {
                isSyncing.current = true;
                try {
                    await cartService.syncCart(normalizedItems);
                } catch (error) {
                    console.warn("Cart sync failed:", error);
                } finally {
                    isSyncing.current = false;
                }
            }
        };

        void syncWithBackend();
    }, [cartItems, isAuthenticated, isInitialized, user?.id]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            let newItems;

            if (existingItem) {
                newItems = prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                newItems = normalizeCartItems([...prevItems, { ...product, quantity: 1 }]);
            }

            const newTotalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
            const newTotalPrice = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

            if (typeof window !== "undefined") {
                setTimeout(() => {
                    window.dispatchEvent(
                        new CustomEvent("cart:product_added", {
                            detail: {
                                product,
                                state: { totalItems: newTotalItems, totalPrice: newTotalPrice, items: newItems },
                            },
                        })
                    );
                }, 0);
            }

            return newItems;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const itemToRemove = prevItems.find((item) => item.id === productId);
            if (itemToRemove && typeof window !== "undefined") {
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("cart:product_removed", { detail: itemToRemove }));
                }, 0);
            }
            return prevItems.filter((item) => item.id !== productId);
        });
    };

    const increaseQuantity = (productId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const clearCart = () => {
        if (cartItems.length > 0 && typeof window !== "undefined") {
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("cart:cleared"));
            }, 0);
        }
        setCartItems([]);
    };

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const totalItems = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                totalPrice,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
