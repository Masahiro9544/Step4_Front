'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CharacterBlinkProps {
    isBlinking?: boolean;
}

export default function CharacterBlink({ isBlinking = false }: CharacterBlinkProps) {

    return (
        <motion.div
            className="relative w-56 h-56"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* 通常顔 (目が開いている) - isBlinkingがfalseの時表示 */}
            <motion.img
                src="/images/character/character_normal.png"
                alt="Character Open"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
                animate={{ opacity: isBlinking ? 0 : 1 }}
                transition={{ duration: 0 }}
            />

            {/* まばたき顔 (目が閉じている) - isBlinkingがtrueの時表示 */}
            <motion.img
                src="/images/character/character_blink.png"
                alt="Character Closed"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
                animate={{ opacity: isBlinking ? 1 : 0 }}
                transition={{ duration: 0 }}
            />
        </motion.div>
    );
}
