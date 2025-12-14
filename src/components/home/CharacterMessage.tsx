import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CharacterMessageProps {
    message: string;
    expression?: 'normal' | 'happy' | 'blink' | 'surprised';
    animation?: 'bounce' | 'wave' | 'nod' | 'none';
}

export default function CharacterMessage({
    message,
    expression = 'happy',
    animation = 'bounce'
}: CharacterMessageProps) {
    const [currentExpression, setCurrentExpression] = useState(expression);
    const [showBlink, setShowBlink] = useState(false);

    // ランダムな瞬きアニメーション
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setShowBlink(true);
                setTimeout(() => setShowBlink(false), 200);
            }
        }, 3000);
        return () => clearInterval(blinkInterval);
    }, []);

    // アニメーションのバリエーション
    const animations = {
        bounce: {
            y: [0, -15, 0],
            transition: {
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
            }
        },
        wave: {
            rotate: [0, 10, -10, 10, 0],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
            }
        },
        nod: {
            rotateX: [0, 15, 0],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
            }
        },
        none: {}
    };

    const characterImage = showBlink
        ? '/images/character/character_blink.png'
        : `/images/character/character_${currentExpression}.png`;

    return (
        <div className="flex flex-col items-center justify-center py-4 px-4">
            {/* キャラクター */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    ...animations[animation]
                }}
                className="relative w-40 h-40 mb-3"
            >
                <Image
                    src={characterImage}
                    alt="犬のマスコット"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </motion.div>

            {/* 吹き出し */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative rounded-3xl p-5 max-w-sm text-center"
                style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9E6 100%)',
                    boxShadow: '0 6px 20px rgba(0, 160, 233, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
                    border: '3px solid #00A0E9'
                }}
            >
                <p className="text-xl font-bold text-gray-800 leading-relaxed">
                    {message}
                </p>
                {/* 吹き出しの三角 */}
                <div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0"
                    style={{
                        borderLeft: '16px solid transparent',
                        borderRight: '16px solid transparent',
                        borderBottom: '18px solid #00A0E9'
                    }}
                ></div>
                <div
                    className="absolute -top-[10px] left-1/2 transform -translate-x-1/2 w-0 h-0"
                    style={{
                        borderLeft: '12px solid transparent',
                        borderRight: '12px solid transparent',
                        borderBottom: '14px solid #FFFFFF'
                    }}
                ></div>
            </motion.div>
        </div>
    );
}
