"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Button = ({ children, className, variant = "primary", size = "md", ...props }) => {
    const variants = {
        primary: "bg-neon-blue text-black font-bold hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.7)] transition-all duration-300",
        secondary: "glass text-white hover:bg-white/10",
        outline: "border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn("rounded-full flex items-center justify-center gap-2 cursor-pointer", variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
