"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { t } from "@/lib/i18n";

const products = [
    { key: "apple", emoji: "\uD83C\uDF4E", bg: "bg-red-100", color: "text-red-600" },
    { key: "banana", emoji: "\uD83C\uDF4C", bg: "bg-yellow-100", color: "text-yellow-700" },
    { key: "orange", emoji: "\uD83C\uDF4A", bg: "bg-orange-100", color: "text-orange-600" },
    { key: "cherry", emoji: "\uD83C\uDF52", bg: "bg-pink-100", color: "text-pink-600" },
];

const createItem = (id) => {
    const product = products[Math.floor(Math.random() * products.length)];
    return {
        id,
        name: product.name,
        emoji: product.emoji,
        bg: product.bg,
        color: product.color,
        x: 10 + Math.random() * 80,
        y: 0,
        speed: 0.8 + Math.random() * 0.8,
    };
};

export default function ProductGame() {
    const boardRef = useRef(null);
    const [items, setItems] = useState([]);
    const [score, setScore] = useState(0);
    const [basketX, setBasketX] = useState(50);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying) return undefined;
        const spawn = setInterval(() => {
            setItems((prev) => [...prev, createItem(Date.now())].slice(-10));
        }, 1400);

        return () => clearInterval(spawn);
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) return undefined;

        const tick = setInterval(() => {
            setItems((prev) =>
                prev
                    .map((item) => ({ ...item, y: item.y + item.speed }))
                    .filter((item) => {
                        if (item.y >= 84) {
                            const distance = Math.abs(item.x - basketX);
                            if (distance < 18) {
                                setScore((prevScore) => prevScore + 1);
                                return false;
                            }
                        }
                        return item.y < 108;
                    })
            );
        }, 35);

        return () => clearInterval(tick);
    }, [basketX, isPlaying]);

    const handleReset = () => {
        setScore(0);
        setItems([]);
        setIsPlaying(true);
    };

    const handlePointerMove = (event) => {
        const rect = boardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        setBasketX(Math.max(8, Math.min(92, x)));
    };

    return (
        <section className="organic-section px-3 py-10 md:px-5">
            <div className="section-shell mx-auto max-w-7xl rounded-[3rem] px-6 py-10 md:px-8 md:py-12">
                <div className="mb-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
                    <div className="max-w-xl">
                        <span className="mb-4 inline-flex items-center justify-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                            {t.home.game.badge}
                        </span>
                        <h2 className="font-heading text-4xl font-black text-gray-900 md:text-5xl">
                            {t.home.game.title}
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-stone-600">
                            {t.home.game.description}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="rounded-3xl bg-emerald-700 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
                        >
                            {t.home.game.reset}
                        </button>
                        <button
                            onClick={() => setIsPlaying((prev) => !prev)}
                            className="glass-panel rounded-3xl px-6 py-3 font-semibold text-gray-900 transition"
                        >
                            {isPlaying ? t.home.game.pause : t.home.game.resume}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[420px_1fr]">
                    <div className="glass-panel-strong relative overflow-hidden rounded-[2rem]">
                        <div
                            ref={boardRef}
                            onPointerMove={handlePointerMove}
                            onPointerLeave={() => setBasketX(50)}
                            className="relative h-[420px] overflow-hidden bg-[linear-gradient(180deg,#14553f_0%,#0f3e30_45%,#102f27_100%)]"
                        >
                            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent" />
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.15 }}
                                    className={`absolute flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-2xl shadow-black/25 ${item.bg}`}
                                    style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translateX(-50%)" }}
                                >
                                    <span>{item.emoji}</span>
                                </motion.div>
                            ))}

                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 to-transparent" />
                            <div
                                className="absolute bottom-6 left-1/2 flex h-24 w-48 items-center justify-center rounded-full border-4 border-white bg-emerald-500/95 text-lg font-bold text-white shadow-2xl shadow-emerald-900/30"
                                style={{ transform: `translateX(calc(${basketX}% - 50%))` }}
                            >
                        <span>{"\uD83E\uDDFA"} {t.home.game.basket}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-panel-strong rounded-[2rem] p-6">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.24em] text-stone-400">{t.home.game.scoreLabel}</p>
                                    <p className="text-5xl font-bold text-gray-900">{score}</p>
                                </div>
                                <div className="rounded-3xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white">
                                    {isPlaying ? t.home.game.playing : t.home.game.paused}
                                </div>
                            </div>
                            <p className="leading-relaxed text-stone-600">
                                {t.home.game.info}
                            </p>
                        </div>

                        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#1c2f28_0%,#0d211b_100%)] p-6 text-white shadow-xl">
                            <h3 className="mb-4 text-2xl font-semibold">{t.home.game.productsTitle}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {products.map((product) => (
                                    <div key={product.key} className="flex items-center gap-4 rounded-3xl bg-white/10 p-4">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${product.bg}`}>{product.emoji}</div>
                                        <div>
                                            <p className="font-semibold">{t.home.game.products[product.key]}</p>
                                            <p className="text-sm text-slate-300">{t.home.game.catchFast}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel-strong rounded-[2rem] p-6">
                            <p className="mb-2 font-semibold text-gray-900">{t.home.game.howToPlay.title}</p>
                            <ul className="list-disc list-inside space-y-2 text-stone-600">
                                <li>{t.home.game.howToPlay.step1}</li>
                                <li>{t.home.game.howToPlay.step2}</li>
                                <li>{t.home.game.howToPlay.step3}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
