'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, FileText, MapPin, Layers, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const TEST_DATA = {
    socialMedia: {
        rawPost: `FOR SALE - Hlaing Township vacant land\n\nLand size: 40 ft x 60 ft\nAsking price: 6,800 Lakh\nRoad: 20 ft wide\nOwnership: Grant\nLocation: Ward 12, Insein Road, Hlaing Township\nContact: U Myo Thant\nPhone: 09 420 123 456\nSecond phone: 09 450 987 654\nStatus: Online\n\nData completeness stated by source: 100%`,
        fields: [
            { label: 'Land size', value: '40 ft x 60 ft' },
            { label: 'Asking price', value: '6,800 Lakh' },
            { label: 'Road', value: '20 ft wide' },
            { label: 'Ownership', value: 'Grant' },
            { label: 'Location', value: 'Ward 12, Insein Road, Hlaing Township' },
            { label: 'Contact', value: 'U Myo Thant' },
            { label: 'Phone', value: '09 420 123 456' },
            { label: 'Second phone', value: '09 450 987 654' },
            { label: 'Status', value: 'Online' },
        ],
    },
    mapLocation: [
        { label: 'Latitude,Longitude', value: '16.8661,96.1589' },
        { label: 'Google Map Link', value: 'https://maps.google.com/?q=16.8661,96.1589' },
        { label: 'Township', value: 'Hlaing Township' },
        { label: 'Ward / Street', value: 'Ward 12, Insein Road' },
    ],
    otherDetails: [
        { label: 'Property Type', value: 'Land' },
        { label: 'Transaction', value: 'For Sale' },
        { label: 'Land Condition', value: 'Vacant Land' },
        { label: 'Acreage', value: '0.0551' },
        { label: 'Source', value: 'Facebook Marketplace' },
        { label: 'Entry Date', value: '2026-08-08' },
    ],
};

export function SampleDataGuide() {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        toast.success(`Copied to clipboard`);
        setTimeout(() => setCopiedText(null), 2000);
    };

    const handleDownloadSampleImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // Sky Background
            ctx.fillStyle = '#e0f2fe';
            ctx.fillRect(0, 0, 800, 350);

            // Ground Grass
            ctx.fillStyle = '#86efac';
            ctx.fillRect(0, 350, 800, 150);

            // Fence / Fence lines
            ctx.strokeStyle = '#a1a1aa';
            ctx.lineWidth = 4;
            for (let x = 50; x < 750; x += 60) {
                ctx.beginPath();
                ctx.moveTo(x, 280);
                ctx.lineTo(x, 380);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(30, 310);
            ctx.lineTo(770, 310);
            ctx.moveTo(30, 350);
            ctx.lineTo(770, 350);
            ctx.stroke();

            // Simple Buildings
            ctx.fillStyle = '#93c5fd';
            ctx.fillRect(100, 150, 120, 150);
            ctx.fillRect(580, 180, 100, 120);

            // "INTERVIEW TEST" Badge Banner
            ctx.fillStyle = '#2563eb';
            ctx.fillRect(30, 30, 180, 36);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText('INTERVIEW TEST', 50, 53);

            // Text Label
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 22px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Ground Land Plot - Hlaing Township', 400, 240);

            // Trigger Download
            const link = document.createElement('a');
            link.download = 'ground-1786353950492-714772725.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            toast.success('Sample Image downloaded!');
        }
    };

    return (
        <Card className="border-slate-200 shadow-sm text-slate-800 text-sm sticky top-6">
            <CardHeader className="pb-4 border-b bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-slate-900">Provided Test Data</CardTitle>
                <CardDescription className="text-xs text-slate-600">
                    This is the data already collected from social media, maps, and other platforms. The candidate does not need to search for anything.
                </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-6">

                {/* Rule Warning Box */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs leading-relaxed">
                    <p className="font-semibold text-amber-950 mb-0.5 flex items-center gap-1.5">
                        Candidate rule:
                    </p>
                    Enter only the information provided here. Do not invent missing data. Use the sample image for the Ground Image field.
                </div>

                {/* 1. Social Media Listing */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-600" />
                        1. Social Media Listing
                    </h3>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed relative group">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-slate-700"
                            onClick={() => handleCopy(TEST_DATA.socialMedia.rawPost)}
                            title="Copy full text"
                        >
                            {copiedText === TEST_DATA.socialMedia.rawPost ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                        </Button>
                        {TEST_DATA.socialMedia.rawPost}
                    </div>
                </div>

                {/* 2. Map / Location Data */}
                <div className="space-y-3 pt-2 border-t">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-600" />
                        2. Map / Location Data
                    </h3>

                    <div className="space-y-2">
                        {TEST_DATA.mapLocation.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                <span className="text-slate-500 font-medium">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 truncate max-w-55">
                                        {item.value}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(item.value)}
                                        className="text-slate-400 hover:text-slate-700 p-1"
                                    >
                                        {copiedText === item.value ? (
                                            <Check className="w-3 h-3 text-emerald-600" />
                                        ) : (
                                            <Copy className="w-3 h-3" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Other Details */}
                <div className="space-y-3 pt-2 border-t">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Layers className="w-4 h-4 text-slate-600" />
                        3. Other Details
                    </h3>

                    <div className="space-y-2">
                        {TEST_DATA.otherDetails.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                <span className="text-slate-500 font-medium">{item.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900">{item.value}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(item.value)}
                                        className="text-slate-400 hover:text-slate-700 p-1"
                                    >
                                        {copiedText === item.value ? (
                                            <Check className="w-3 h-3 text-emerald-600" />
                                        ) : (
                                            <Copy className="w-3 h-3" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Ground Image */}
                <div className="space-y-3 pt-2 border-t">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-slate-600" />
                        4. Ground Image
                    </h3>

                    <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-28 h-20 bg-sky-200 border rounded flex flex-col justify-between p-1.5 shrink-0 relative overflow-hidden">
                            <span className="bg-blue-600 text-white text-[8px] font-bold px-1 py-0.5 rounded w-fit">
                                INTERVIEW TEST
                            </span>
                            <div className="w-full h-8 bg-green-300 rounded-t-sm" />
                        </div>

                        <div className="space-y-2 text-center sm:text-left">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleDownloadSampleImage}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs h-8 gap-1.5 font-semibold"
                            >
                                Download Sample Image
                            </Button>
                            <p className="text-[11px] text-slate-500 leading-tight">
                                Upload this file into the Ground Image field.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Objectives */}
                <div className="pt-4 border-t space-y-3">
                    <h4 className="text-xs font-bold text-slate-700">Test Objective</h4>
                    <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-[11px]">
                            Accuracy
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-[11px]">
                            Field Matching
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-[11px]">
                            Map Data
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-[11px]">
                            Image Upload
                        </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                        Complete the form, review your entry, then download the submission JSON and send it to the interviewer.
                    </p>
                </div>

            </CardContent>
        </Card>
    );
}