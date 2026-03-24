import React from 'react';
import { t } from '@/lib/i18n';

export default function AddressForm({ formData, onChange, errors }) {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.forms.street} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={onChange}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all ${errors.street ? 'border-red-500' : 'border-gray-200'
                            }`}
                        placeholder={t.forms.street}
                    />
                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.forms.house} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="house"
                        value={formData.house}
                        onChange={onChange}
                        className={`w-full bg-white border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all ${errors.house ? 'border-red-500' : 'border-gray-200'
                            }`}
                        placeholder="No."
                    />
                    {errors.house && <p className="text-red-500 text-sm mt-1">{errors.house}</p>}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.forms.apt}</label>
                    <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={onChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all"
                        placeholder="-"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.forms.entrance}</label>
                    <input
                        type="text"
                        name="entrance"
                        value={formData.entrance}
                        onChange={onChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all"
                        placeholder="-"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.forms.floor}</label>
                    <input
                        type="text"
                        name="floor"
                        value={formData.floor}
                        onChange={onChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all"
                        placeholder="-"
                    />
                </div>
            </div>

            {/* Comment */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.forms.comment}</label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={onChange}
                    rows="2"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all resize-none"
                    placeholder={t.forms.commentPlaceholder}
                />
            </div>
        </div>
    );
}
