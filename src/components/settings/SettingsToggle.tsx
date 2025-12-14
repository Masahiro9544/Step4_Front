import React from 'react';
import { motion } from 'framer-motion';

interface SettingsToggleProps {
    label: string;
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
}

export default function SettingsToggle({ label, enabled, onToggle }: SettingsToggleProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
                <span className="text-2xl">🔊</span>
                <span className="font-bold text-gray-800">{label}</span>
            </div>

            <button
                onClick={() => onToggle(!enabled)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-merelax-primary' : 'bg-gray-200'
                    }`}
            >
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md ${enabled ? 'left-7' : 'left-1'
                        }`}
                />
            </button>
        </div>
    );
}
