'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-bg-main">
            {/* 雲1: ゆっくり右へ流れる */}
            <motion.div
                className="absolute top-10 left-[-20%] text-white/40 opacity-70"
                animate={{
                    x: ['0%', '150%'],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <svg width="200" height="120" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5,12c-0.2,0-0.3,0-0.5,0.1c-0.6-2.9-3.2-5.1-6.1-5.1c-2.7,0-5.1,1.8-5.9,4.4c-0.2,0-0.4-0.1-0.6-0.1C2.5,11.3,0.1,13.7,0.1,16.6 c0,3,2.4,5.4,5.4,5.4h13c2.5,0,4.5-2,4.5-4.5C23,14.5,21,12,18.5,12z" />
                </svg>
            </motion.div>

            {/* 雲2: ゆっくり左へ流れる（少し小さく） */}
            <motion.div
                className="absolute top-40 right-[-10%] text-white/50 opacity-60"
                animate={{
                    x: ['0%', '-150%'],
                }}
                transition={{
                    duration: 55,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <svg width="150" height="90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5,12c-0.2,0-0.3,0-0.5,0.1c-0.6-2.9-3.2-5.1-6.1-5.1c-2.7,0-5.1,1.8-5.9,4.4c-0.2,0-0.4-0.1-0.6-0.1C2.5,11.3,0.1,13.7,0.1,16.6 c0,3,2.4,5.4,5.4,5.4h13c2.5,0,4.5-2,4.5-4.5C23,14.5,21,12,18.5,12z" />
                </svg>
            </motion.div>

            {/* 光の玉: ふわふわ浮遊 */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-merelax-primary/10 rounded-full blur-3xl"
                animate={{
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-merelax-secondary/10 rounded-full blur-3xl"
                animate={{
                    y: [0, -40, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />
        </div>
    );
}
