'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';

function AuthCallbackContent() {
    const searchParams = useSearchParams();
    const { handleLineCallback } = useAuth();
    const [status, setStatus] = useState('Verifying...');
    const [processed, setProcessed] = useState(false);

    useEffect(() => {
        // Prevent duplicate execution
        if (processed) return;

        const code = searchParams.get('code');
        const state = searchParams.get('state');

        console.log('LINE callback params:', { code, state, hasCode: !!code, hasState: !!state });

        if (code && state) {
            setProcessed(true);
            handleLineCallback(code, state)
                .catch((err) => {
                    console.error('LINE callback error:', err);
                    if (err.response) {
                        console.error('Error response data:', err.response.data);
                        console.error('Error response status:', err.response.status);
                    }
                    setStatus('Login failed. Please try again.');
                    setProcessed(false);
                });
        } else {
            console.error('Missing callback parameters:', { code: !!code, state: !!state });
            setStatus('Invalid callback parameters.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to run only once

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
