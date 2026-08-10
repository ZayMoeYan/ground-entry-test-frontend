import { Navbar } from '@/components/common/navbar';
import { SampleDataGuide } from '@/components/common/sample-data-guide';
import React from 'react';

export default function GroundEntryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <Navbar variant='public' />
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 mt-8">
                        <SampleDataGuide />
                    </div>

                    <div className="lg:col-span-8">
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
}