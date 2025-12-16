'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function StartScreen({ onStart }) {
    return (
        <div className="flex flex-col items-center justify-between h-full py-8 text-center animate-fade-in relative z-10 w-full">
            <div className="mb-6 w-full flex flex-col items-center">

                {/* Chat Bubble - Moved ABOVE character */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative rounded-3xl p-5 max-w-sm text-center mb-[-10px] z-20"
                    style={{
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9E6 100%)',
                        boxShadow: '0 6px 20px rgba(0, 160, 233, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
                        border: '3px solid #00A0E9'
                    }}
                >
                    <p className="text-xl font-bold text-gray-800 leading-relaxed">
                        スマホとかおのきょりを<br />チェックするよ！
                    </p>
                    {/* 吹き出しの三角 */}
                    <div
                        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0"
                        style={{
                            borderLeft: '16px solid transparent',
                            borderRight: '16px solid transparent',
                            borderTop: '18px solid #00A0E9'
                        }}
                    ></div>
                    <div
                        className="absolute -bottom-[10px] left-1/2 transform -translate-x-1/2 w-0 h-0"
                        style={{
                            borderLeft: '12px solid transparent',
                            borderRight: '12px solid transparent',
                            borderTop: '14px solid #FFFFFF'
                        }}
                    ></div>
                </motion.div>

                {/* Character Image */}
                <div className="w-48 h-48 mx-auto mb-4 relative z-10">
                    <img
                        src="/images/character/character_happy.png"
                        alt="Character"
                        className="w-full h-full object-contain drop-shadow-xl"
                    />
                </div>

                <p className="text-gray-600 font-bold text-lg mt-2 bg-white/80 inline-block px-4 py-2 rounded-full shadow-sm backdrop-blur-sm border border-gray-100">
                    スマホにお顔を向けてね
                </p>
            </div>

            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="w-full max-w-sm py-8 text-white text-3xl font-black rounded-2xl shadow-xl hover:opacity-90 flex items-center justify-center gap-4 transition-opacity min-h-[100px]"
                style={{ backgroundColor: '#00A0E9' }}
            >
                <span className="text-4xl">▶</span>
                <span>そくていかいし</span>
            </motion.button>
        </div>
    );
}
