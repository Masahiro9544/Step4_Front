'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SoundToggle from '@/components/merelax/SoundToggle';


// Components
const MenuButton = ({ title, subtitle, color, onClick, emoji }: { title: string, subtitle: string, color: string, onClick: () => void, emoji: string }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full p-6 rounded-3xl shadow-lg ${color} text-left flex items-center justify-between group overflow-hidden relative`}
    >
        <div className="z-10">
            <h3 className="text-2xl font-bold mb-1">{title}</h3>
            <p className="opacity-90">{subtitle}</p>
        </div>
        <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300 z-10">
            {emoji}
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
);

export default function EyeTrackingMenuPage() {
    const router = useRouter();


    return (
        <div className="min-h-screen bg-[#0D1117] relative flex flex-col p-4">
            <header className="flex justify-between items-center mb-8">
                <button onClick={() => router.push('/merelax')} className="text-2xl text-white bg-white/10 backdrop-blur-sm rounded-full w-12 h-12 hover:bg-white/20 transition">✕</button>
                <SoundToggle className="text-white bg-white/10 hover:bg-white/20" />
            </header>

            <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-white drop-shadow-glow">めの たいそう</h1>
                    <p className="text-gray-300">どっちの たいそうを する？</p>
                </div>

                <div className="grid grid-cols-1 gap-6 w-full">
                    {/* Rocket (Smooth Pursuit) */}
                    <MenuButton
                        title="ロケット"
                        subtitle="ゆっくり おいかけよう"
                        color="bg-[#F5A623] text-white"
                        emoji="🚀"
                        onClick={() => {

                            router.push('/merelax/eye-tracking/rocket');
                        }}
                    />

                    {/* Jump (Saccade) */}
                    <MenuButton
                        title="あっち こっち"
                        subtitle="すばやく みつけよう"
                        color="bg-[#2ECC71] text-white"
                        emoji="👀"
                        onClick={() => {

                            router.push('/merelax/eye-tracking/jump');
                        }}
                    />
                </div>
            </main>
        </div>
    );
}
