import React from 'react';
import { useRouter } from 'next/navigation';

interface FooterProps {
    activeTab: 'home' | 'merelax' | 'record';
}

export default function Footer({ activeTab }: FooterProps) {
    const router = useRouter();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 z-50" style={{ borderColor: '#00A0E9' }}>
            <div className="max-w-md mx-auto px-4 py-4 flex justify-around items-center">
                <button
                    onClick={() => router.push('/home')}
                    className="flex flex-col items-center transition-colors min-w-[80px] min-h-[80px] justify-center"
                    style={{ color: activeTab === 'home' ? '#00A0E9' : '#999' }}
                >
                    <span className="text-3xl mb-1">🏠</span>
                    <span className={`text-base font-bold ${activeTab === 'home' ? '' : 'text-gray-400'}`}>ホーム</span>
                </button>
                <button
                    onClick={() => router.push('/merelax')}
                    className="flex flex-col items-center transition-colors min-w-[80px] min-h-[80px] justify-center"
                    style={{ color: activeTab === 'merelax' ? '#00A0E9' : '#999' }}
                >
                    <span className="text-3xl mb-1">💪</span>
                    <span className={`text-base font-bold ${activeTab === 'merelax' ? '' : 'text-gray-400'}`}>たいそう</span>
                </button>
                <button
                    onClick={() => router.push('/record')}
                    className="flex flex-col items-center transition-colors min-w-[80px] min-h-[80px] justify-center"
                    style={{ color: activeTab === 'record' ? '#00A0E9' : '#999' }}
                >
                    <span className="text-3xl mb-1">📊</span>
                    <span className={`text-base font-bold ${activeTab === 'record' ? '' : 'text-gray-400'}`}>きろく</span>
                </button>
            </div>
        </nav>
    );
}
