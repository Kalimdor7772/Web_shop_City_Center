"use client";
import React from "react";
import { Clock, Heart, ShieldCheck, Truck } from "lucide-react";
import { t } from "@/lib/i18n";

const benefits = [
    {
        icon: <Clock className="h-8 w-8 text-emerald-700" />,
        title: t.home.trust.delivery15,
        desc: t.home.trust.delivery15Desc
    },
    {
        icon: <Truck className="h-8 w-8 text-amber-600" />,
        title: t.home.trust.freeDelivery,
        desc: t.home.trust.freeDeliveryDesc
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-sky-600" />,
        title: t.home.trust.quality,
        desc: t.home.trust.qualityDesc
    },
    {
        icon: <Heart className="h-8 w-8 text-rose-500" />,
        title: t.home.trust.care,
        desc: t.home.trust.careDesc
    }
];

export default function TrustSection() {
    return (
        <section className="organic-section px-3 py-10 md:px-5">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {benefits.map((item) => (
                    <div key={item.title} className="glass-panel-strong rounded-[2rem] p-6">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/80 shadow-sm">
                            {item.icon}
                        </div>
                        <h3 className="mb-2 text-lg font-black text-gray-900">{item.title}</h3>
                        <p className="leading-relaxed text-stone-600">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
