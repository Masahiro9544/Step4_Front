'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FooterProps {
    activeTab: 'home' | 'merelax' | 'record';
}

export default function Footer({ activeTab }: FooterProps) {
    const router = useRouter();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50"
             style={{
                 background: 'linear-gradient(180deg, #FFFFFF 0%, #E3F2FD 100%)',
                 borderTop: '4px solid #00A0E9',
                 boxShadow: '0 -4px 20px rgba(0, 160, 233, 0.15)'
             }}>
            <div className="max-w-md mx-auto px-4 py-3 flex justify-around items-center">
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/home')}
                    className="flex flex-col items-center transition-all min-w-[85px] min-h-[75px] justify-center rounded-2xl p-2"
                    style={activeTab === 'home' ? {
                        color: '#00A0E9',
                        background: 'linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)',
                        boxShadow: '0 3px 10px rgba(0, 160, 233, 0.2)'
                    } : { color: '#999' }}
                >
                    <div className="relative w-12 h-12 mb-1">
                        <Image src="/images/icon/house.png" alt="ホーム" fill className="object-contain" />
                    </div>
                    <span className={`text-sm ${activeTab === 'home' ? 'font-extrabold' : 'font-bold'}`}>ホーム</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/merelax')}
                    className="flex flex-col items-center transition-all min-w-[85px] min-h-[75px] justify-center rounded-2xl p-2"
                    style={activeTab === 'merelax' ? {
                        color: '#00A0E9',
                        background: 'linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)',
                        boxShadow: '0 3px 10px rgba(0, 160, 233, 0.2)'
                    } : { color: '#999' }}
                >
                    <div className="relative w-12 h-12 mb-1">
                        <Image src="/images/icon/eyes.png" alt="めリラ" fill className="object-contain" />
                    </div>
                    <span className={`text-sm ${activeTab === 'merelax' ? 'font-extrabold' : 'font-bold'}`}>めリラ</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/record')}
                    className="flex flex-col items-center transition-all min-w-[85px] min-h-[75px] justify-center rounded-2xl p-2"
                    style={activeTab === 'record' ? {
                        color: '#00A0E9',
                        background: 'linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)',
                        boxShadow: '0 3px 10px rgba(0, 160, 233, 0.2)'
                    } : { color: '#999' }}
                >
                    <div className="relative w-12 h-12 mb-1">
                        <Image src="/images/icon/statistics.png" alt="きろく" fill className="object-contain" />
                    </div>
                    <span className={`text-sm ${activeTab === 'record' ? 'font-extrabold' : 'font-bold'}`}>きろく</span>
                </motion.button>
            </div>
        </nav>
    );
}
