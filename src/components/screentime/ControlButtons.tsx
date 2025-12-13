export const dynamic = 'force-dynamic';

import React from 'react';
import { motion } from 'framer-motion';

interface ControlButtonsProps {
    isActive: boolean;
    isPaused: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onRecord: () => void;
    isLoading: boolean;
}

export default function ControlButtons({ isActive, isPaused, onStart, onPause, onReset, onRecord, isLoading }: ControlButtonsProps) {
    if (isActive || isPaused) {
        // タイマー開始後 → 「ストップ」「リセット」「きろく」の3つのボタン
        return (
            <div className="flex gap-3 w-full max-w-sm px-4">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onPause}
                    disabled={isLoading}
                    className="flex-1 py-7 text-white text-2xl font-black rounded-2xl shadow-lg hover:opacity-90 disabled:opacity-50 flex flex-col items-center justify-center gap-2 transition-opacity min-h-[110px]"
                    style={{ backgroundColor: '#FF9EC4' }}
                >
                    <span className="text-4xl">■</span>
                    <span>ストップ</span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    disabled={isLoading}
                    className="flex-1 py-7 text-white text-2xl font-black rounded-2xl shadow-lg hover:opacity-90 disabled:opacity-50 flex flex-col items-center justify-center gap-2 transition-opacity min-h-[110px]"
                    style={{ backgroundColor: '#999' }}
                >
                    <span className="text-4xl">↺</span>
                    <span>リセット</span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onRecord}
                    disabled={isLoading}
                    className="flex-1 py-7 text-2xl font-black rounded-2xl shadow-lg hover:opacity-90 disabled:opacity-50 flex flex-col items-center justify-center gap-2 transition-opacity min-h-[110px]"
                    style={{ backgroundColor: '#FFD83B', color: '#333' }}
                >
                    <span className="text-4xl">✓</span>
                    <span>きろく</span>
                </motion.button>
            </div>
        );
    }

    // 初期状態 → 「はじめる」ボタンのみ
    return (
        <div className="flex gap-4 w-full max-w-sm px-4">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                disabled={isLoading}
                className="w-full py-8 text-white text-3xl font-black rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-4 transition-opacity min-h-[100px]"
                style={{ backgroundColor: '#00A0E9' }}
            >
                <span className="text-4xl">▶</span>
                <span>はじめる</span>
            </motion.button>
        </div>
    );
}
