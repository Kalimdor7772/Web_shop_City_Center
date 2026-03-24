
"use client";

import React, { useState, useEffect } from "react";
import {
    BarChart3,
    MessageSquare,
    TrendingUp,
    Users,
    ArrowUpRight,
    Bot,
    ShoppingBag,
    History,
    RefreshCcw
} from "lucide-react";

export default function AIAdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai/stats');
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error("Failed to fetch ai stats", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        const initialFetch = setTimeout(() => {
            void fetchStats();
        }, 0);
        const interval = setInterval(fetchStats, 10000); // Auto refresh every 10s
        return () => {
            clearTimeout(initialFetch);
            clearInterval(interval);
        };
    }, []);

    if (loading && !stats) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Bot className="w-12 h-12 text-violet-600 animate-bounce" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Загрузка аналитики...</p>
                </div>
            </div>
        );
    }

    const conversionRate = stats?.totalMessages
        ? ((stats.conversions / stats.totalMessages) * 100).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-24 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
                                <BarChart3 size={24} />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">AI Seller <span className="text-violet-600">Analytics</span></h1>
                        </div>
                        <p className="text-gray-500 font-bold ml-1">Мониторинг эффективности виртуального продавца</p>
                    </div>

                    <button
                        onClick={fetchStats}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-black text-sm text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                        Обновить данные
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Всего сообщений"
                        value={stats?.totalMessages || 0}
                        icon={MessageSquare}
                        color="text-blue-600"
                        bg="bg-blue-50"
                    />
                    <StatCard
                        title="Рекомендаций"
                        value={stats?.recommendationsGiven || 0}
                        icon={TrendingUp}
                        color="text-fuchsia-600"
                        bg="bg-fuchsia-50"
                    />
                    <StatCard
                        title="Конверсии"
                        value={stats?.conversions || 0}
                        icon={ShoppingBag}
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                    />
                    <StatCard
                        title="Конверсия %"
                        value={`${conversionRate}%`}
                        icon={Users}
                        color="text-violet-600"
                        bg="bg-violet-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Intents Breakdown */}
                    <div className="lg:col-span-1 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Популярные запросы</h3>
                            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(stats?.intents || {}).sort((a, b) => b[1] - a[1]).map(([key, val]) => (
                                <div key={key} className="group">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-wider">{key}</span>
                                        <span className="text-sm font-black text-gray-900">{val}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-violet-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(val / (stats?.totalMessages || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {Object.keys(stats?.intents || {}).length === 0 && (
                                <p className="text-center py-10 text-gray-400 font-bold italic">Запросов пока нет</p>
                            )}
                        </div>
                    </div>

                    {/* Live Activity Logs */}
                    <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8 flex flex-col h-[600px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight italic">Live <span className="text-violet-600">Activity</span></h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">В реальном времени</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {(stats?.recentLogs || []).map((log) => (
                                <div key={log.id} className="p-4 rounded-3xl bg-gray-50/50 border border-gray-100 flex gap-4 items-start hover:bg-white hover:shadow-md transition-all">
                                    <div className={`mt-1 p-2 rounded-xl flex-shrink-0
                                        ${log.type === 'user' ? 'bg-gray-900 text-white' :
                                            log.type === 'ai' ? 'bg-violet-600 text-white' :
                                                'bg-green-100 text-green-600'}`}
                                    >
                                        {log.type === 'user' ? <MessageSquare size={14} /> :
                                            log.type === 'ai' ? <Bot size={14} /> :
                                                <ShoppingBag size={14} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                                {log.type === 'user' ? 'Пользователь' :
                                                    log.type === 'ai' ? 'Помощник' : 'Событие'}
                                            </span>
                                            <span className="text-[10px] font-black text-gray-300">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-700 leading-relaxed truncate md:whitespace-normal">
                                            {log.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(stats?.recentLogs || []).length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                    <History size={48} />
                                    <p className="font-black italic uppercase tracking-widest text-sm">История событий пуста</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
    return (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className={`w-14 h-14 rounded-3xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <h4 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h4>
        </div>
    );
}
