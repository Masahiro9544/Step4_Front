'use client';

import React from 'react';

import { useSound } from '@/hooks/useSound';

interface SoundToggleProps {
    className?: string;
}

export default function SoundToggle({ className = '' }: SoundToggleProps) {
    const { soundEnabled, toggleSound } = useSound();

    return (
        <button
            onClick={toggleSound}
            className={`flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-3 rounded-full text-merelax-primary font-bold shadow-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 border-2 border-merelax-primary/20 ${className}`}
            aria-label="音声切り替え"
        >
            {soundEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-merelax-primary">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
            )}
            <span className="text-sm font-bold">おと {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>
    );
}
