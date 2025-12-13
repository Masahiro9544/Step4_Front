export const dynamic = 'force-dynamic';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CharacterMessageProps {
    message: string;
}

export default function CharacterMessage({ message }: CharacterMessageProps) {
    return (
        <div className="flex flex-col items-center justify-center py-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white rounded-2xl p-4 shadow-lg mb-4 max-w-xs text-center border-2 border-merelax-primary"
            >
                <p className="text-lg font-bold text-gray-800">{message}</p>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white"></div>
                <div className="absolute -bottom-[14px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-merelax-primary -z-10"></div>
            </motion.div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative w-32 h-32"
            >
                <Image
                    src="/images/character/character_normal.png"
                    alt="犬のキャラクター"
                    fill
                    className="object-contain drop-shadow-xl"
                />
            </motion.div>
        </div>
    );
}
