'use client';

import { Navbar } from '@/components/common/navbar';
import { AuthProvider } from '@/context/auth-context';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-slate-100">
                <Navbar variant='admin' adminName='Admin' />
                <main>{children}</main>
            </div>
        </AuthProvider>
    );
}