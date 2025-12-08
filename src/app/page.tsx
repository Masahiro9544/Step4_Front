'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginEmail, loginLine } = useAuth();
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await loginEmail(email, password);
            // data contains session_id, verification_code (demo), etc.
            // Navigate to verify page with session_id
            // In a real app, we might not pass code in URL, but for demo:
            router.push(`/verify?session_id=${data.session_id}&code=${data.verification_code}`);
        } catch (err: any) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in with Email
                        </button>
                    </div>
                </form>

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <button
                            type="button"
                            onClick={() => router.push('/signup')}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Don't have an account? Sign up
                        </button>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div>
                    <button
                        onClick={loginLine}
                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00C300] hover:bg-[#00b300] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C300]"
                    >
                        Sign in with LINE
                    </button>
                </div>
            </div>
        </div>
    );
}
