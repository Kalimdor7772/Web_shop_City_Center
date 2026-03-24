import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { CITIES } from '../utils/cities';
import { t } from '@/lib/i18n';

export default function CitySelect({ value, onChange, error }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-4">
                {t.forms.city} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                    name="city"
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-14 pr-10 py-4 bg-gray-50/50 border appearance-none rounded-2xl text-gray-900 font-bold transition-all outline-none cursor-pointer ${error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-transparent focus:border-green-500 focus:bg-white'
                        }`}
                >
                    <option value="">{t.forms.selectCity}</option>
                    {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
            {error && <p className="text-red-500 text-xs font-bold ml-4 mt-1">{error}</p>}
        </div>
    );
}
