'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../../utils/axios';
import Cookies from 'js-cookie';

import { Suspense } from 'react';

function AuthCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (code) {
            // Exchange code for token
            api.post('/auth/line/callback', { code, state })
                .then(({ data }) => {
                    Cookies.set('access_token', data.access_token, { expires: 1 / 48 });
                    Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
                    router.push('/');
                })
                .catch((err) => {
                    console.error(err);
                    setStatus('Login failed. Please try again.');
                });
        } else {
            setStatus('Invalid callback parameters.');
        }
    }, [searchParams, router]);

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
