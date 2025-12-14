'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CharacterGreeting() {
    const [expression, setExpression] = useState<'normal' | 'happy' | 'surprised'>('normal');

    useEffect(() => {
        // ランダムな表情変化
        const changeExpression = () => {
            const rand = Math.random();
            if (rand < 0.6) {
                setExpression('normal');
            } else if (rand < 0.8) {
                setExpression('happy');
            } else {
                setExpression('surprised');
            }
        };

        const interval = setInterval(changeExpression, 3000);
        return () => clearInterval(interval);
    }, []);

    const getImageSrc = () => {
        switch (expression) {
            case 'happy': return '/images/character/character_happy.png';
            case 'surprised': return '/images/character/character_surprised.png';
            default: return '/images/character/character_normal.png';
        }
    };

    return (
        <motion.div
            className="w-32 h-32 relative"
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setExpression('happy')}
            onHoverEnd={() => setExpression('normal')}
        >
            <AnimatePresence mode="wait">
                <motion.img
                    key={expression}
                    src={getImageSrc()}
                    alt="Character Expression"
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                />
            </AnimatePresence>
        </motion.div>
    );
}
