"use client";
import React from "react";
import { X, CheckCircle } from "lucide-react";
import LinkComponent from "next/link"; // Renamed to avoid usage conflict if needed, or just use NextLink

import { useToast } from "../../context/ToastContext";

const Toast = () => {
    const { toast, hideToast } = useToast();
    if (!toast) return null;

    return (
        <div
            className="fixed bottom-6 right-6 z-[100] transition-all duration-300 ease-out transform translate-y-0 opacity-100"
        >
            <div className="flex items-center gap-3 bg-[#0a0a0a]/90 backdrop-blur-md border border-neon-blue/50 text-white px-4 py-3 rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.2)] min-w-[300px]">
                <div className="text-neon-blue">
                    <CheckCircle size={20} />
                </div>

                <div className="flex-1 mr-4">
                    <p className="text-sm font-medium">{toast?.message}</p>
                </div>

                {toast?.action?.href && (
                    <LinkComponent
                        href={toast.action.href}
                        onClick={hideToast}
                        className="text-xs font-bold text-neon-blue hover:text-white transition-colors uppercase tracking-wider mr-2"
                    >
                        {toast.action.label}
                    </LinkComponent>
                )}

                <button
                    onClick={hideToast}
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
