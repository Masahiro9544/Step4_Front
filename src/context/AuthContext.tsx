export const dynamic = 'force-dynamic';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../utils/axios';
import { useRouter } from 'next/navigation';

interface User {
    parent_id: number;
    email: string;
    line_id?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginEmail: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string) => Promise<any>;
    verifyCode: (sessionId: string, code: string) => Promise<void>;
    loginLine: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('access_token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    // If 401, interceptor should have handled refresh or redirect
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const loginEmail = async (email: string, password: string) => {
        // Initial login to get verification code
        const { data } = await api.post('/auth/login', { email, password });
        return data; // Returns session_id, verification_code (for display)
    };

    const register = async (email: string, password: string) => {
        const { data } = await api.post('/auth/register', { email, password });
        return data;
    };

    const verifyCode = async (sessionId: string, code: string) => {
        const { data } = await api.post('/auth/verify-code', {
            session_id: sessionId,
            verification_code: code,
        });

        // Save tokens
        // Access token: 30 mins (1/48 days), Refresh token: 7 days
        Cookies.set('access_token', data.access_token, { expires: 1 / 48 });
        Cookies.set('refresh_token', data.refresh_token, { expires: 7 });

        setUser(data.user);

        // Prefetch the home page for faster navigation
        router.prefetch('/home');
        router.push('/home');
    };

    const loginLine = async () => {
        try {
            const { data } = await api.get('/auth/line/login');
            window.location.href = data.url;
        } catch (error) {
            console.error("LINE Login init failed", error);
        }
    };

    const logout = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginEmail, register, verifyCode, loginLine, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
