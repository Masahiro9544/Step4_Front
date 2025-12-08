'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';

export default function VerifyPage() {
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
            setError('Invalid session. Please login again.');
            return;
        }
        try {
            await verifyCode(sessionId, code);
        } catch (err: any) {
            setError('Verification failed. Invalid code or expired.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Enter Verification Code
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {demoCode ? `The code is: ${demoCode}` : 'Please check your screen/email for the code.'}
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="code" className="sr-only">Code</label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Verify
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
