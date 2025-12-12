'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginEmail, loginLine } = useAuth();
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        console.log('Login attempt with:', email);
        try {
            const data = await loginEmail(email, password);
            console.log('Login response:', data);
            // data contains session_id, verification_code (demo), etc.
            // Navigate to verify page with session_id
            // In a real app, we might not pass code in URL, but for demo:
            const verifyUrl = `/verify?session_id=${data.session_id}&code=${data.verification_code}`;
            console.log('Navigating to:', verifyUrl);
            router.push(verifyUrl);
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'ログインに失敗しました。メールアドレスとパスワードを確認してください。';
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center" style={{ backgroundColor: '#F6F9FB' }}>
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md px-6">
                {/* ロゴ・タイトル */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-6xl font-bold mb-3" style={{ color: '#00A0E9' }}>
                        めとれ
                    </h1>
                    <p className="text-lg font-bold text-gray-600">目のげんきをまもろう</p>
                </motion.div>

                {/* ログインフォーム */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-lg p-8"
                >
                    <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#00A0E9' }}>
                        ログイン
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-bold text-gray-700 mb-2">
                                メールアドレス
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#00A0E9] transition-colors text-base"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                                パスワード
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#00A0E9] transition-colors text-base"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            className="w-full text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-lg"
                            style={{ backgroundColor: '#00A0E9' }}
                        >
                            メールでログイン
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-bold">または</span>
                        </div>
                    </div>

                    <button
                        onClick={loginLine}
                        className="w-full flex items-center justify-center text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-lg"
                        style={{ backgroundColor: '#00C300' }}
                    >
                        <span className="text-2xl mr-3">💬</span>
                        LINEでログイン
                    </button>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/signup')}
                            className="font-bold text-base hover:underline"
                            style={{ color: '#00A0E9' }}
                        >
                            アカウントをお持ちでない方はこちら
                        </button>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-center text-sm text-gray-500 mt-6"
                >
                    お子さまの目の健康を守るアプリ
                </motion.p>
            </div>
        </div>
    );
}
