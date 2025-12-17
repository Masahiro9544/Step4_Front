'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(() => import('@/components/ui/AnimatedBackground'), {
    ssr: false,
});

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register, loginEmail } = useAuth();
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('パスワードは6文字以上で入力してください');
            return;
        }

        if (password !== confirmPassword) {
            setError('パスワードが一致しません');
            return;
        }

        setLoading(true);
        try {
            // 登録処理
            await register(email, password);

            // 登録成功後、自動的にログイン処理を実行
            const data = await loginEmail(email, password);

            // 認証コード画面に遷移
            const verifyUrl = `/verify?session_id=${data.session_id}&code=${data.verification_code}`;
            router.push(verifyUrl);
        } catch (err: any) {
            setError(err.response?.data?.detail || '登録に失敗しました。もう一度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#F6F9FB' }}>
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-md w-full"
            >
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2 className="text-4xl font-bold text-center mb-2" style={{ color: '#00A0E9' }}>
                            新規会員登録
                        </h2>
                        <p className="text-center text-gray-600 mb-8">めめめをはじめよう！</p>
                    </motion.div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label htmlFor="email-address" className="block text-sm font-bold mb-2" style={{ color: '#00A0E9' }}>
                                メールアドレス
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-lg"
                                style={{ borderColor: '#E0E0E0' }}
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label htmlFor="password" className="block text-sm font-bold mb-2" style={{ color: '#00A0E9' }}>
                                パスワード
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-lg"
                                style={{ borderColor: '#E0E0E0' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label htmlFor="confirm-password" className="block text-sm font-bold mb-2" style={{ color: '#00A0E9' }}>
                                パスワード（確認）
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-lg"
                                style={{ borderColor: '#E0E0E0' }}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 px-6 rounded-xl text-white text-lg font-bold shadow-lg transition-all ${
                                    loading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:shadow-xl active:scale-95'
                                }`}
                                style={{ backgroundColor: '#00A0E9' }}
                            >
                                {loading ? '登録中...' : '登録'}
                            </button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 text-center"
                    >
                        <button
                            onClick={() => router.push('/')}
                            className="text-sm font-medium transition-colors"
                            style={{ color: '#00A0E9' }}
                        >
                            すでにアカウントをお持ちの方はこちら
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
