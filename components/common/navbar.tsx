'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

import { Button } from '@/components/ui/button';
import {
    Building2,
    LogOut,
    ShieldCheck,
    FileText,
    CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
    variant?: 'public' | 'admin';
    adminName?: string;
}

export function Navbar({ variant = 'public', adminName = 'Admin User' }: NavbarProps) {
    const router = useRouter();

    // Admin Logout Logic
    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
            toast.success('Successfully logged out');
        } catch {
            toast.info('Logged out');
        } finally {
            router.push('/admin/login');
        }
    };

    // 1. Admin Dashboard Navbar
    if (variant === 'admin') {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-slate-900 text-white shadow-sm">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* Brand & Admin Badge */}
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg hover:opacity-90 transition">
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <span>Ground Entry</span>
                        </Link>
                        <span className="bg-slate-800 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Admin Portal
                        </span>
                    </div>

                    {/* User Profile & Logout Button */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2.5 border-r border-slate-700 pr-4">
                            <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-semibold text-xs border border-slate-600">
                                {adminName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-200">{adminName}</span>
                        </div>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleLogout}
                            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </Button>
                    </div>

                </div>
            </header>
        );
    }

    // 2. Public Form Navbar
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Brand Name */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-800 hover:opacity-90 transition">
                    <div className="bg-slate-900 p-2 rounded-lg text-white">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <span>Ground Entry System</span>
                </Link>

                {/* Public Info Badges */}
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200 font-medium">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>Public Data Entry</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>System Online</span>
                    </div>
                </div>

            </div>
        </header>
    );
}