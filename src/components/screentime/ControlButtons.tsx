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
    if (isActive) {
        // タイマー動作中 → 「ストップ」「リセット」ボタン
        return (
            <div className="flex gap-2 sm:gap-3 md:gap-4 w-full max-w-sm px-3 sm:px-4">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onPause}
                    disabled={isLoading}
                    className="flex-1 py-6 sm:py-7 md:py-8 text-white text-2xl sm:text-3xl font-black rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 transition-opacity min-h-[80px] sm:min-h-[90px] md:min-h-[100px]"
                    style={{ backgroundColor: '#FF9EC4' }}
                >
                    <span className="text-3xl sm:text-4xl">■</span>
                    <span>ストップ</span>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    disabled={isLoading}
                    className="flex-1 py-6 sm:py-7 md:py-8 text-white text-2xl sm:text-3xl font-black rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 transition-opacity min-h-[80px] sm:min-h-[90px] md:min-h-[100px]"
                    style={{ backgroundColor: '#999' }}
                >
                    <span className="text-3xl sm:text-4xl">↺</span>
                    <span>リセット</span>
                </motion.button>
            </div>
        );
    }

    if (isPaused) {
        // ストップ中 → 「スタート」「リセット」「きろく」ボタン
        return (
            <div className="flex flex-col gap-3 sm:gap-4 w-full px-3 sm:px-4 items-center">
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={onStart}
                    disabled={isLoading}
                    className="py-8 sm:py-9 md:py-10 text-white text-3xl sm:text-4xl font-black rounded-[32px] disabled:opacity-50 flex items-center justify-center gap-3 sm:gap-4 transition-all min-h-[100px] sm:min-h-[110px] md:min-h-[120px]"
                    style={{
                        width: '70%',
                        maxWidth: '350px',
                        background: 'linear-gradient(180deg, #4DC4FF 0%, #00A0E9 100%)',
                        boxShadow: '0 4px 10px rgba(0, 160, 233, 0.15), inset 0 -3px 10px rgba(0, 0, 0, 0.1), inset 0 3px 10px rgba(255, 255, 255, 0.5)',
                        fontFamily: '"M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN", sans-serif'
                    }}
                >
                    <span className="text-4xl sm:text-5xl">▶</span>
                    <span>スタート</span>
                </motion.button>
                <div className="flex gap-2 sm:gap-3 md:gap-4 w-full">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onReset}
                        disabled={isLoading}
                        className="flex-1 py-6 sm:py-7 md:py-8 text-white text-2xl sm:text-3xl font-black rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 transition-opacity min-h-[80px] sm:min-h-[90px] md:min-h-[100px]"
                        style={{ backgroundColor: '#999' }}
                    >
                        <span className="text-3xl sm:text-4xl">↺</span>
                        <span>リセット</span>
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onRecord}
                        disabled={isLoading}
                        className="flex-1 py-6 sm:py-7 md:py-8 text-white text-2xl sm:text-3xl font-black rounded-2xl shadow-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 transition-opacity min-h-[80px] sm:min-h-[90px] md:min-h-[100px]"
                        style={{ backgroundColor: '#FFD83B', color: '#333' }}
                    >
                        <span className="text-3xl sm:text-4xl">✓</span>
                        <span>きろく</span>
                    </motion.button>
                </div>
            </div>
        );
    }

    // 初期状態 → 「スタート」ボタンのみ
    return (
        <div className="flex gap-3 sm:gap-4 w-full px-3 sm:px-4 justify-center">
            <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.02 }}
                onClick={onStart}
                disabled={isLoading}
                className="py-8 sm:py-9 md:py-10 text-white text-3xl sm:text-4xl font-black rounded-[32px] disabled:opacity-50 flex items-center justify-center gap-3 sm:gap-4 transition-all min-h-[100px] sm:min-h-[110px] md:min-h-[120px]"
                style={{
                    width: '70%',
                    maxWidth: '350px',
                    background: 'linear-gradient(180deg, #4DC4FF 0%, #00A0E9 100%)',
                    boxShadow: '0 4px 10px rgba(0, 160, 233, 0.15), inset 0 -3px 10px rgba(0, 0, 0, 0.1), inset 0 3px 10px rgba(255, 255, 255, 0.5)',
                    fontFamily: '"M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN", sans-serif'
                }}
            >
                <span className="text-4xl sm:text-5xl">▶</span>
                <span>スタート</span>
            </motion.button>
        </div>
    );
}
