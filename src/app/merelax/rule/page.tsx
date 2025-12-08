'use client';

import { useRouter } from 'next/navigation';
import SoundToggle from '@/components/merelax/SoundToggle';

export default function RulePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-merelax-rule text-white relative flex flex-col items-center">
            <header className="w-full p-4 flex justify-between items-center z-10">
                <button onClick={() => router.back()} className="text-3xl p-2">✕</button>
                <SoundToggle />
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg w-full">
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30">
                    <h1 className="text-4xl font-bold mb-8 drop-shadow-md">20-20-20<br />ルール</h1>

                    <div className="space-y-8 text-lg font-medium">
                        <div className="bg-white/90 text-merelax-rule rounded-xl p-6 shadow-md transform -rotate-1">
                            <span className="text-3xl font-bold block mb-2">20分</span>
                            画面を見たら
                        </div>

                        <div className="bg-white/90 text-merelax-rule rounded-xl p-6 shadow-md transform rotate-1">
                            <span className="text-3xl font-bold block mb-2">20秒</span>
                            目を休めて
                        </div>

                        <div className="bg-white/90 text-merelax-rule rounded-xl p-6 shadow-md transform -rotate-1">
                            <span className="text-3xl font-bold block mb-2">20フィート</span>
                            （約6メートル）<br />先を見よう
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-xl font-bold opacity-90 drop-shadow-sm">
                    目をしかり休めようね！
                </p>
            </div>
        </div>
    );
}
