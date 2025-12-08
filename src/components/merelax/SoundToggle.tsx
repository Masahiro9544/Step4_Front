'use client';

import { useSound } from '@/hooks/useSound';

interface SoundToggleProps {
    className?: string;
}

export default function SoundToggle({ className = '' }: SoundToggleProps) {
    const { soundEnabled, toggleSound } = useSound();

    return (
        <button
            onClick={toggleSound}
            className={`bg-white/20 p-2 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition ${className}`}
            aria-label="音声切り替え"
        >
            {soundEnabled ? '🔊' : '🔇'}
        </button>
    );
}
