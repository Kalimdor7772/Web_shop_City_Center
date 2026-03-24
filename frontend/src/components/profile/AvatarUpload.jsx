"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { t } from '@/lib/i18n';

export default function AvatarUpload({ currentAvatar, initials, onAvatarChange, isEditing }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            alert("Пожалуйста, загрузите изображение"); // Ideally use a proper toast notification system if available
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("Размер изображения должен быть меньше 2МБ");
            return;
        }

        setIsLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            onAvatarChange(reader.result);
            setIsLoading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="relative group">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative"
            >
                <div
                    className="w-32 h-32 rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-green-500/20 bg-gradient-to-br from-green-400 to-emerald-600 p-1 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => isEditing && fileInputRef.current?.click()}
                >
                    <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-white flex items-center justify-center relative z-10">
                        {isLoading ? (
                            <Loader2 className="animate-spin text-green-500" size={32} />
                        ) : currentAvatar ? (
                            <img
                                src={currentAvatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl font-black text-green-600 select-none">
                                {initials}
                            </span>
                        )}

                        {/* Hover Overlay for Edit Mode */}
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isHovered ? 1 : 0 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white"
                            >
                                <Camera size={24} className="mb-1" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t.profile.upload}</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Edit Badge */}
                {isEditing && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-900 z-20 pointer-events-none"
                    >
                        <ImageIcon size={18} className="text-green-600" />
                    </motion.div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={!isEditing}
                />
            </motion.div>
        </div>
    );
}
