'use client';

import { AuthProvider } from '../context/AuthContext';
import { SoundProvider } from '../context/SoundContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SoundProvider>
                {children}
            </SoundProvider>
        </AuthProvider>
    );
}
