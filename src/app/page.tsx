'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(() => import('@/components/ui/AnimatedBackground'), {
    ssr: false,
});

export default function LoginPage() {
    const [email, setEmail] = useState('demo@example.com');
    const [password, setPassword] = useState('demo123');
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

    const handleLineLogin = async () => {
        await loginLine();
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center" style={{ backgroundColor: '#F6F9FB' }}>
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md px-6">
                {/* ロゴ・タイトル */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-6xl font-bold mb-3" style={{ color: '#00A0E9' }}>
                        めめめ
                    </h1>
                    <p className="text-lg font-bold text-gray-600">目のげんきをまもろう</p>
                </motion.div>

                {/* ログインフォーム */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
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
                        onClick={handleLineLogin}
                        className="w-full flex items-center justify-center font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 relative"
                        style={{
                            backgroundColor: '#06C755',
                            color: '#FFFFFF'
                        }}
                    >
                        {/* LINEアイコン - 左側 */}
                        <div
                            className="absolute left-4 flex items-center justify-center rounded-lg p-2"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                                    fill="white"
                                />
                            </svg>
                        </div>

                        {/* テキスト - 中央 */}
                        <span className="text-lg font-bold">
                            LINEでログイン
                        </span>
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
                    transition={{ duration: 0.3 }}
                    className="text-center text-sm text-gray-500 mt-6"
                >
                    お子さまの目の健康を守るアプリ
                </motion.p>
            </div>
        </div>
    );
}
