'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';

function AuthCallbackContent() {
    const searchParams = useSearchParams();
    const { handleLineCallback } = useAuth();
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (code && state) {
            handleLineCallback(code, state)
                .catch((err) => {
                    console.error(err);
                    setStatus('Login failed. Please try again.');
                });
        } else {
            setStatus('Invalid callback parameters.');
        }
    }, [searchParams, handleLineCallback]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">{status}</h2>
                <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
