import React from 'react';
import { Phone } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function PhoneInput({ value, onChange, error, label, disabled }) {
    // Custom formatted input logic without external libraries
    const handlePhoneChange = (e) => {
        let input = e.target.value.replace(/\D/g, '');

        if (input.startsWith('7')) {
            input = input.substring(1);
        }

        // Limit to 10 digits
        input = input.substring(0, 10);

        let formatted = '';
        if (input.length > 0) {
            formatted = '+7 ';
            if (input.length > 0) formatted += '(' + input.substring(0, 3);
            if (input.length >= 3) formatted += ') ' + input.substring(3, 6);
            if (input.length >= 6) formatted += '-' + input.substring(6, 8);
            if (input.length >= 8) formatted += '-' + input.substring(8, 10);
        }

        // Allow clearing
        if (input.length === 0 && e.nativeEvent.inputType === 'deleteContentBackward') {
            onChange({ target: { name: 'phone', value: '' } });
            return;
        }

        onChange({ target: { name: 'phone', value: formatted } });
    };

    return (
        <div className="relative group">
            <div className="absolute top-5 left-4 text-gray-400 pointer-events-none z-10">
                <Phone size={18} />
            </div>
            <input
                type="tel"
                name="phone"
                value={value}
                onChange={handlePhoneChange}
                disabled={disabled}
                className={`block w-full pl-12 pr-4 pt-5 pb-2 text-gray-900 bg-white/50 border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm ${error
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-200 focus:ring-green-500/20 focus:border-green-500'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder=" "
                maxLength={18}
            />
            <label
                className={`absolute text-sm duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-12 font-bold tracking-wide pointer-events-none ${error ? 'text-red-500' : 'text-gray-500 peer-focus:text-green-600'
                    }`}
            >
                {label || t.forms.phone}
            </label>
            {error && <p className="text-red-500 text-xs mt-1 ml-4 absolute">{error}</p>}
        </div>
    );
}
