"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext({
    wishlistItems: [],
    addToWishlist: () => {},
    removeFromWishlist: () => {},
    toggleWishlist: () => {},
    isInWishlist: () => false,
});

const LEGACY_KEY = "wishlistItems";

const getWishlistStorageKey = (userId) => `wishlistItems:${userId || "guest"}`;

const normalizeWishlistItems = (items = []) => {
    const byId = new Map();

    items.forEach((item) => {
        if (item?.id && !byId.has(item.id)) {
            byId.set(item.id, item);
        }
    });

    return Array.from(byId.values());
};

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const storageKey = useMemo(() => getWishlistStorageKey(user?.id), [user?.id]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const rawWishlist = localStorage.getItem(storageKey) || localStorage.getItem(LEGACY_KEY);
            const parsedWishlist = rawWishlist ? JSON.parse(rawWishlist) : [];
            setWishlistItems(normalizeWishlistItems(parsedWishlist));
        } catch (error) {
            console.error("Failed to parse wishlist items from localStorage:", error);
            setWishlistItems([]);
        } finally {
            setIsInitialized(true);
        }
    }, [storageKey]);

    useEffect(() => {
        if (!isInitialized || typeof window === "undefined") return;

        localStorage.setItem(storageKey, JSON.stringify(normalizeWishlistItems(wishlistItems)));
    }, [isInitialized, storageKey, wishlistItems]);

    const isInWishlist = (productId) => wishlistItems.some((item) => item.id === productId);

    const addToWishlist = (product) => {
        setWishlistItems((prevItems) => {
            if (prevItems.some((item) => item.id === product.id)) {
                return prevItems;
            }

            return [...prevItems, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    return useContext(WishlistContext);
};
