"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Timer, RefreshCw, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function VerifyPage() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const inputRefs = useRef([]);
    const router = useRouter();
    const { verifySMS } = useAuth();

    // Timer Logic
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto focus next
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        if (newCode.every((char) => char !== "") && !isLoading && !isSuccess) {
            setTimeout(() => {
                void handleSubmit(undefined, newCode);
            }, 0);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(data)) return;

        const newCode = [...code];
        data.split("").forEach((char, i) => {
            if (i < 6) newCode[i] = char;
        });
        setCode(newCode);

        const focusIndex = data.length < 6 ? data.length : 5;
        if (inputRefs.current[focusIndex]) {
            inputRefs.current[focusIndex].focus();
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setIsResending(true);
        // Mock resend delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTimer(60);
        setIsResending(false);
        setError("");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
    };

    const handleSubmit = async (e, submittedCode = code) => {
        if (e) e.preventDefault();
        const fullCode = submittedCode.join("");
        if (fullCode.length !== 6) return;

        setIsLoading(true);
        setError("");

        // Simulate network
        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = verifySMS(fullCode);
        setIsLoading(false);

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/onboarding");
            }, 1000);
        } else {
            setError(result.error);
            // Shake effect or clear
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0].focus();
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]"
            >
                {/* Back button */}
                <Link href="/register">
                    <div className="inline-flex mb-8 p-3 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all cursor-pointer">
                        <ArrowLeft size={20} />
                    </div>
                </Link>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-500/10 text-green-600 mb-6 relative">
                        {isSuccess ?
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={40} /></motion.div> :
                            <ShieldCheck size={40} />
                        }
                    </div>
                    <h1 className="text-3xl font-heading font-black text-gray-900 mb-2">Verification</h1>
                    <p className="text-gray-500 font-medium">
                        We sent a code to your phone. <br />
                        Enter the 6-digit code below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between gap-3">
                        {code.map((char, i) => (
                            <motion.input
                                key={i}
                                ref={el => inputRefs.current[i] = el}
                                type="text"
                                maxLength={1}
                                value={char}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                onPaste={handlePaste}
                                disabled={isLoading || isSuccess}
                                className={`w-full h-16 text-center text-2xl font-black rounded-2xl border transition-all ${error ? 'border-red-500 bg-red-50 text-red-600 focus:ring-red-500/20' :
                                        char ? 'border-green-500 bg-green-50 text-green-600 focus:ring-green-500/20' :
                                            'border-gray-200 bg-white/50 focus:border-green-500 focus:ring-green-500/10'
                                    } focus:outline-none focus:ring-4`}
                                animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                            />
                        ))}
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center justify-center gap-2 text-red-500 font-bold text-sm"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={isLoading || isSuccess || code.some(c => !c)}
                            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-xl active:scale-[0.98]"
                        >
                            {isLoading ? "Verifying..." : "Confirm Code"}
                        </button>

                        <div className="text-center">
                            {timer > 0 ? (
                                <div className="flex items-center justify-center gap-2 text-gray-400 font-bold text-sm">
                                    <Timer size={14} />
                                    <span>Resend code in {timer}s</span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-green-600 hover:text-green-700 font-black text-sm inline-flex items-center gap-2 group"
                                >
                                    <RefreshCw size={14} className={`group-hover:rotate-180 transition-transform duration-500 ${isResending ? 'animate-spin' : ''}`} />
                                    Resend Code
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                <p className="mt-12 text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-relaxed">
                    By confirming, you agree to <br /> our premium service terms
                </p>
            </motion.div>
        </main>
    );
}
