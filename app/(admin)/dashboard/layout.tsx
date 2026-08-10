import { Navbar } from "@/components/common/navbar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto space-y-6 p-6">
                {children}
            </div>
        </div>
    );
}