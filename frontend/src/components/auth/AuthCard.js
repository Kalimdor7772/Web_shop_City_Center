"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { User, Mail, Lock, LogIn, ArrowRight, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import CustomPhoneInput from "../PhoneInput";
import { t } from "@/lib/i18n";

const FloatingInput = ({ label, id, type, value, onChange, disabled, error, icon: Icon }) => (
    <div className="relative group">
        <div className="relative">
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder=" "
                className={`block w-full px-4 pt-5 pb-2 text-gray-900 bg-white/40 border rounded-2xl appearance-none focus:outline-none focus:ring-4 transition-all duration-300 backdrop-blur-md peer ${error
                    ? 'border-red-500/50 focus:ring-red-500/10 focus:border-red-500'
                    : 'border-white/50 focus:ring-green-500/10 focus:border-green-500 hover:border-white/80'
                    } ${Icon ? 'pl-11' : ''}`}
            />
            {Icon && (
                <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${error ? 'text-red-400' : 'text-gray-400 peer-focus:text-green-600'
                    }`} />
            )}
            <label
                htmlFor={id}
                className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 font-bold tracking-wide pointer-events-none transition-all ${error ? 'text-red-500' : 'text-gray-400 peer-focus:text-green-600'
                    } ${Icon ? 'peer-placeholder-shown:left-11' : ''}`}
            >
                {label}
            </label>
        </div>
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-1 mt-1.5 ml-1 text-red-500 text-[10px] font-bold uppercase tracking-wider"
                >
                    <AlertCircle size={10} />
                    {error}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const AuthCard = ({ initialView = "login" }) => {
    const [view, setView] = useState(initialView);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const cardRef = useRef(null);

    // 3D Tilt Effect Logic (Refined)
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Login Form State
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    // Registration Form State
    const [registerData, setRegisterData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (view === 'login') {
            if (!loginData.email) newErrors.email = t.auth.errors.required;
            if (!loginData.password) newErrors.password = t.auth.errors.required;
        } else {
            if (!registerData.email) newErrors.email = t.auth.errors.required;
            if (!registerData.password) newErrors.password = t.auth.errors.passwordRequired;
            else if (registerData.password.length < 6) newErrors.password = t.auth.errors.minChar;

            if (registerData.password !== registerData.confirmPassword) {
                newErrors.confirmPassword = t.auth.errors.mismatch;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        let result;
        if (view === 'register') {
            result = await register({
                email: registerData.email,
                firstName: registerData.firstName,
                lastName: registerData.lastName,
                password: registerData.password
            });
        } else {
            result = await login(loginData.email, loginData.password);
        }

        setIsLoading(false);

        if (result.success) {
            if (result.needsVerification) {
                router.push("/verify");
            } else if (result.needsOnboarding) {
                router.push("/onboarding");
            } else {
                router.push("/profile");
            }
        } else {
            setErrors({ general: result.error });
        }
    };

    const canSubmit = () => {
        if (isLoading) return false;
        if (view === 'login') {
            return loginData.email && loginData.password;
        } else {
            return registerData.email &&
                registerData.firstName &&
                registerData.password &&
                registerData.password.length >= 6 &&
                registerData.password === registerData.confirmPassword;
        }
    };

    return (
        <div
            className="w-full max-w-[440px] perspective-2000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                ref={cardRef}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-white/60 p-10"
            >
                {/* Visual Flair */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div style={{ transform: "translateZ(50px)" }}>
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30 mb-6 rotate-3"
                        >
                            <Sparkles className="w-10 h-10" />
                        </motion.div>
                        <h2 className="text-4xl font-heading font-black text-gray-900 mb-2 tracking-tight">
                            {view === "login" ? t.auth.welcome : t.auth.signUp}
                        </h2>
                        <p className="text-gray-500 font-medium">
                            {view === "login"
                                ? t.auth.experienceFuture
                                : t.auth.startJourney}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {view === "login" ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-5"
                                >
                                    <FloatingInput
                                        id="email"
                                        label={t.auth.phoneOrEmail}
                                        type="text"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        disabled={isLoading}
                                        error={errors.email}
                                        icon={User}
                                    />
                                    <FloatingInput
                                        id="password"
                                        label={t.auth.passwordLabel}
                                        type="password"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        disabled={isLoading}
                                        error={errors.password}
                                        icon={Lock}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-5"
                                >
                                    <FloatingInput
                                        id="reg-email"
                                        label={t.auth.emailLabel || "Email"}
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        disabled={isLoading}
                                        error={errors.email}
                                        icon={Mail}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FloatingInput
                                            id="firstName"
                                            label={t.auth.firstNameLabel}
                                            type="text"
                                            value={registerData.firstName}
                                            onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                                            disabled={isLoading}
                                            icon={User}
                                        />
                                        <FloatingInput
                                            id="lastName"
                                            label={t.auth.lastNameLabel}
                                            type="text"
                                            value={registerData.lastName}
                                            onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <FloatingInput
                                        id="password"
                                        label={t.auth.createPassword}
                                        type="password"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        disabled={isLoading}
                                        error={errors.password}
                                        icon={Lock}
                                    />
                                    <FloatingInput
                                        id="confirmPassword"
                                        label={t.auth.confirmPassword}
                                        type="password"
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                        disabled={isLoading}
                                        error={errors.confirmPassword}
                                        icon={CheckCircle2}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {errors.general && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3"
                            >
                                <AlertCircle className="shrink-0" size={18} />
                                {errors.general}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={!canSubmit()}
                            whileHover={canSubmit() ? { scale: 1.02, translateY: -2 } : {}}
                            whileTap={canSubmit() ? { scale: 0.98 } : {}}
                            className={`w-full py-5 rounded-[1.25rem] font-black text-lg tracking-tight shadow-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${canSubmit()
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-500/40'
                                : 'bg-gray-100 text-gray-400 grayscale cursor-not-allowed shadow-none'
                                }`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>{view === "login" ? t.auth.submit : t.auth.registerSubmit}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                setView(view === "login" ? "register" : "login");
                                setErrors({});
                            }}
                            className="text-gray-500 hover:text-green-600 transition-colors font-bold text-sm"
                        >
                            {view === "login" ? t.auth.noAccount + " " + t.auth.createAccount : t.auth.haveAccount + " " + t.auth.signIn}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthCard;
