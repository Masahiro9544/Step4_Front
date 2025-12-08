'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CloudBackground() {
    const [cloudImage, setCloudImage] = useState<string>('');

    useEffect(() => {
        // 画像生成の制限により、現在はウサギ雲のみを使用
        // 本来は ['cloud_rabbit.png', 'cloud_whale.png', ...] からランダム選択
        const clouds = [
            '/images/character/cloud_rabbit.png',
            '/images/character/cloud_rabbit.png', // プレースホルダーとして重複
        ];
        const randomCloud = clouds[Math.floor(Math.random() * clouds.length)];
        setCloudImage(randomCloud);
    }, []);

    if (!cloudImage) return null;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <AnimatePresence>
                <motion.div
                    key={cloudImage}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* 背景画像 */}
                    <img
                        src={cloudImage}
                        alt="Cloud Art"
                        className="w-full h-full object-cover"
                    />

                    {/* 窓枠のオーバーレイ効果（CSSで簡易的に強調） */}
                    <div className="absolute inset-0 border-[20px] border-white/80 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-200/20 pointer-events-none"></div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
