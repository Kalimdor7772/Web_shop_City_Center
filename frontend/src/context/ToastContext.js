"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext({
    toast: null,
    showToast: () => { },
    hideToast: () => { }
});

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, action = null) => {
        setToast({ message, action, id: Date.now() });

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setToast(null);
        }, 3000);
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
