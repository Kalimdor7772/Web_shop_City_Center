"use client";
import React from "react";
import { Clock, Truck, ShieldCheck, Heart } from "lucide-react";
import { t } from "@/lib/i18n";

const benefits = [
    {
        icon: <Clock className="w-8 h-8 text-[#00A082]" />,
        title: t.home.trust.delivery15,
        desc: t.home.trust.delivery15Desc
    },
    {
        icon: <Truck className="w-8 h-8 text-[#FFC220]" />,
        title: t.home.trust.freeDelivery,
        desc: t.home.trust.freeDeliveryDesc
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
        title: t.home.trust.quality,
        desc: t.home.trust.qualityDesc
    },
    {
        icon: <Heart className="w-8 h-8 text-red-500" />,
        title: t.home.trust.care,
        desc: t.home.trust.careDesc
    }
];

const TrustSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-6 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100">
                            <div className="mb-4 p-4 bg-white rounded-full shadow-sm">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
