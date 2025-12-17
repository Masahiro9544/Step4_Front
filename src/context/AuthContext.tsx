import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../utils/axios';
import { useRouter } from 'next/navigation';

interface User {
    parent_id: number;
    email: string;
    line_id?: string;
}

interface Child {
    child_id: number;
    name: string;
    age?: number;
    grade?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    children: Child[];
    selectedChildId: number | null;
    selectChild: (childId: number) => Promise<void>;
    loginEmail: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string) => Promise<any>;
    verifyCode: (sessionId: string, code: string) => Promise<void>;
    loginLine: () => Promise<void>;
    handleLineCallback: (code: string, state: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
    const router = useRouter();

    const selectChild = async (childId: number) => {
        setSelectedChildId(childId);
        localStorage.setItem('selectedChildId', String(childId));

        if (user?.parent_id) {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000';
                await api.put(`${API_BASE}/api/settings/${user.parent_id}`, { child_id: childId });
            } catch (error) {
                console.error("Failed to persist selected child", error);
            }
        }
    };

    const fetchChildren = async (accessToken?: string) => {
        try {
            const config = accessToken ? {
                headers: { Authorization: `Bearer ${accessToken}` }
            } : {};
            const { data } = await api.get('/v1/auth/children', config);
            setChildrenList(data.children);

            // If only one child, auto-select
            if (data.children.length === 1) {
                selectChild(data.children[0].child_id);
                return data.children[0].child_id;
            }
            // Removed localStorage auto-restore to ensure ChildSelectorModal appears on login
            return null;
            return null;
        } catch (error) {
            console.error("Failed to fetch children", error);
            return null;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('access_token');
            if (token) {
                try {
                    const { data } = await api.get('/v1/auth/me');
                    setUser(data);

                    // Fetch children for this parent
                    await fetchChildren();
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
        const { data } = await api.post('/v1/auth/login', { email, password });
        return data; // Returns session_id, verification_code (for display)
    };

    const register = async (email: string, password: string) => {
        const { data } = await api.post('/v1/auth/register', { email, password });
        return data;
    };

    const verifyCode = async (sessionId: string, code: string) => {
        const { data } = await api.post('/v1/auth/verify-code', {
            session_id: sessionId,
            verification_code: code,
        });

        // Save tokens with path option to ensure they're available across the app
        // Access token: 30 mins (1/48 days), Refresh token: 7 days
        // SameSite: Lax for security while allowing navigation
        Cookies.set('access_token', data.access_token, {
            expires: 1 / 48,
            path: '/',
            sameSite: 'Lax'
        });
        Cookies.set('refresh_token', data.refresh_token, {
            expires: 7,
            path: '/',
            sameSite: 'Lax'
        });

        setUser(data.user);

        // Fetch children after successful login, passing the access_token directly
        await fetchChildren(data.access_token);

        // Use router.push to maintain client-side state
        router.push('/home');
    };

    const loginLine = async () => {
        try {
            const { data } = await api.get('/v1/auth/line/login');
            window.location.href = data.url;
        } catch (error) {
            console.error("LINE Login init failed", error);
        }
    };

    const handleLineCallback = async (code: string, state: string) => {
        const { data } = await api.post('v1/auth/line/callback', { code, state });

        // Save tokens with path option to ensure they're available across the app
        Cookies.set('access_token', data.access_token, {
            expires: 1 / 48,
            path: '/',
            sameSite: 'Lax'
        });
        Cookies.set('refresh_token', data.refresh_token, {
            expires: 7,
            path: '/',
            sameSite: 'Lax'
        });

        setUser(data.user);

        // Fetch children after successful login, passing the access_token directly
        await fetchChildren(data.access_token);

        // Use router.push to maintain client-side state
        router.push('/home');
    };

    const logout = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        localStorage.removeItem('selectedChildId');
        setUser(null);
        setChildrenList([]);
        setSelectedChildId(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            children: childrenList,
            selectedChildId,
            selectChild,
            loginEmail,
            register,
            verifyCode,
            loginLine,
            handleLineCallback,
            logout
        }}>
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
