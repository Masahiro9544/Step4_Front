import React from 'react';
import { motion } from 'framer-motion';

interface TimerDisplayProps {
    seconds: number;
    alertLevel: number;
}

export default function TimerDisplay({ seconds, alertLevel }: TimerDisplayProps) {
    const getFormatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return { minutes, secs };
    };

    const { minutes, secs } = getFormatTime(seconds);

    const getColors = (level: number) => {
        switch (level) {
            case 2: return { bg: '#FFE6E6', border: '#FF9EC4', text: '#FF6B9D' }; // Alert (ピンク系)
            case 1: return { bg: '#FFF9E6', border: '#FFD83B', text: '#FFA500' }; // Warning (イエロー系)
            default: return { bg: '#FFFFFF', border: '#00A0E9', text: '#00A0E9' }; // Normal (Zoffブルー)
        }
    };

    const colors = getColors(alertLevel);

    return (
        <div
            className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 shadow-xl transition-colors duration-500 w-full max-w-2xl"
            style={{
                backgroundColor: colors.bg,
                borderWidth: '3px',
                borderStyle: 'solid',
                borderColor: colors.border,
                borderRadius: '32px',
                fontFamily: '"Rounded Mplus 1c", "M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "メイリオ", Meiryo, sans-serif'
            }}
        >
            <div className="text-gray-500 font-bold mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">つかっている じかん</div>
            <div className="flex items-baseline font-black tracking-tighter flex-wrap justify-center gap-x-2 sm:gap-x-4" style={{ color: colors.text }}>
                <div className="flex items-baseline">
                    <span style={{ fontSize: '48px' }}>{minutes}</span>
                    <span style={{ fontSize: '16px' }} className="ml-1 sm:ml-2 md:ml-3">ふん</span>
                </div>
                <div className="flex items-baseline">
                    <span style={{ fontSize: '48px' }}>{String(secs).padStart(2, '0')}</span>
                    <span style={{ fontSize: '16px' }} className="ml-1 sm:ml-2 md:ml-3">びょう</span>
                </div>
            </div>
        </div>
    );
}
