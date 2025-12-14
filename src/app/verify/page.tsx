'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(() => import('@/components/ui/AnimatedBackground'), {
    ssr: false,
});

function VerifyContent() {
    const [code, setCode] = useState('');
    const { verifyCode } = useAuth();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const demoCode = searchParams.get('code'); // For demo convenience
    const [error, setError] = useState('');

    useEffect(() => {
        if (demoCode) {
            setCode(demoCode);
        }
    }, [demoCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId) {
            setError('セッションが無効です。もう一度ログインしてください。');
            return;
        }
        try {
            console.log('Verifying code:', code, 'for session:', sessionId);
            await verifyCode(sessionId, code);
        } catch (err: any) {
            console.error('Verification error:', err);
            setError('認証に失敗しました。コードが正しいか確認してください。');
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center" style={{ backgroundColor: '#F6F9FB' }}>
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md px-6">
                {/* タイトル */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mb-8"
                >
                    <div className="text-6xl mb-4">🔐</div>
                    <h1 className="text-4xl font-bold mb-3" style={{ color: '#00A0E9' }}>
                        認証コード
                    </h1>
                    <p className="text-base font-bold text-gray-600">
                        {demoCode ? `コード: ${demoCode}` : 'メールに送られたコードを入力してください'}
                    </p>
                </motion.div>

                {/* 認証フォーム */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl shadow-lg p-8"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="code" className="block text-sm font-bold text-gray-700 mb-3 text-center">
                                6桁のコードを入力
                            </label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                maxLength={6}
                                className="w-full px-4 py-5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#00A0E9] transition-colors text-center text-4xl tracking-widest font-bold"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center font-bold"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={code.length !== 6}
                            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg ${
                                code.length === 6
                                    ? 'hover:shadow-xl active:scale-95'
                                    : 'opacity-50 cursor-not-allowed'
                            }`}
                            style={{ backgroundColor: '#00A0E9' }}
                        >
                            認証する
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 mb-2">コードが届いていませんか？</p>
                        <button
                            type="button"
                            className="text-sm font-bold hover:underline"
                            style={{ color: '#00A0E9' }}
                            onClick={() => {
                                // TODO: コード再送信機能
                                alert('コードを再送信しました');
                            }}
                        >
                            コードを再送信する
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 text-center"
                >
                    <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100">
                        <p className="text-sm font-bold" style={{ color: '#00A0E9' }}>
                            💡 コードは10分間有効です
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F6F9FB' }}>
                <div className="animate-bounce text-2xl font-bold" style={{ color: '#00A0E9' }}>●</div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
