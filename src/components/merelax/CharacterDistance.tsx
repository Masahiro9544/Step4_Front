'use client';

import { motion } from 'framer-motion';

interface CharacterDistanceProps {
    isCompleted: boolean;
}

export default function CharacterDistance({ isCompleted }: CharacterDistanceProps) {
    return (
        <motion.div
            className="absolute bottom-2 right-2 w-36 h-36 md:bottom-4 md:right-4 md:w-48 md:h-48 z-20 pointer-events-none"
            animate={{
                y: [0, -5, 0],
                scale: isCompleted ? 1.1 : [1, 1.02, 1]
            }}
            transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                scale: isCompleted ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
        >
            {/* 遠くを見ている（通常時） */}
            <motion.img
                src="/images/character/character_away.png"
                alt="Character Looking Away"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl filter brightness-90"
                initial={{ opacity: 1 }}
                animate={{ opacity: isCompleted ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            />

            {/* こっちを見て喜ぶ（完了時） */}
            <motion.img
                src="/images/character/character_happy.png"
                alt="Character Happy"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: isCompleted ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            />
        </motion.div>
    );
}
