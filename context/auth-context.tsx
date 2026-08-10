'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient, setAccessToken } from '@/lib/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL + '/api'
    : 'http://localhost:3000/api';

interface AuthContextType {
    user: any;
    isLoading: boolean;
    setUser: (user: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data } = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                setAccessToken(data.accessToken);


                const profileRes = await apiClient.get('/auth/me');
                setUser(profileRes.data);

            } catch (error) {
                setAccessToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (e) {
            console.error('Logout error', e);
        } finally {
            setAccessToken(null);
            setUser(null);
            if (typeof window !== 'undefined') {
                window.location.href = '/admin/login';
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
            {isLoading ? (
                <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        <span className="text-sm font-medium text-slate-600">Initializing Session...</span>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};