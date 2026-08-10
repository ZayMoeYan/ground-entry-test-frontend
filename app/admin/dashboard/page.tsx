'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useGroundEntries, downloadCsvExport } from '@/hooks/use-ground-entries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, Search, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { TownshipCombobox } from '@/components/common/township-combo-box';

export default function AdminDashboardPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('all');
    const [township, setTownship] = useState<string>('all');

    // Data Fetching Query
    const { data, isLoading, isError, refetch } = useGroundEntries({
        page,
        limit,
        search: search || undefined,
        status: status === 'all' ? undefined : status,
        township: township === 'all' ? undefined : township,
    });

    const entries = data?.data || [];
    const meta = data?.meta || { totalPages: 1, totalCount: 0 };

    // CSV Export Trigger
    const handleCsvExport = async () => {
        try {
            await downloadCsvExport(township === 'all' ? undefined : township);
            toast.success('CSV Export is successful. Check your downloads folder.');
        } catch {
            toast.error('CSV Export failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Dashboard Top Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Admin Ground Entries Dashboard</h1>
                        <p className="text-sm text-slate-500">
                            Total Data {meta.totalCount} | Page {page} of {meta.totalPages || 1}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => refetch()} className="gap-2">
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </Button>
                        <Button onClick={handleCsvExport} className="bg-black text-white hover:bg-slate-800 gap-2">
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                    </div>
                </div>

                {/* Filters Section */}
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search location, name, phone..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1); // Reset to first page on search change
                                }}
                                className="pl-9"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-start md:items-center">
                            {/* Township Filter */}
                            <TownshipCombobox
                                value={township === 'all' ? '' : township}
                                onChange={(val) => {
                                    setTownship(val || 'all');
                                    setPage(1);
                                }}
                            />

                            {/* Status Filter */}
                            <Select
                                value={status}
                                onValueChange={(val) => {
                                    setStatus(val);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Online">Online</SelectItem>
                                    <SelectItem value="Offline">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="border-b bg-slate-50/50 py-3">
                        <CardTitle className="text-base font-semibold text-slate-700">
                            Ground Entries List
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500">Loading entries...</div>
                        ) : isError ? (
                            <div className="p-8 text-center text-red-500">Error loading data. Access denied or server error.</div>
                        ) : entries.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No records found.</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Township & Ward</TableHead>
                                        <TableHead>Property / Price</TableHead>
                                        <TableHead>Contact Person</TableHead>
                                        <TableHead>Data Entry By</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entries.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium text-slate-900">{item.township}</div>
                                                <div className="text-xs text-slate-500">{item.locationWardStreet || '-'}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-slate-800">{item.price || 'N/A'}</div>
                                                <div className="text-xs text-slate-500">{item.propertyType}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{item.contactName}</div>
                                                <div className="text-xs text-slate-500">{item.phoneNumber}</div>
                                            </TableCell>
                                            <TableCell className="text-sm">{item.dataEntryName}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        item.status === 'Online'
                                                            ? 'default'
                                                            : item.status === 'Offline'
                                                                ? 'secondary'
                                                                : 'outline'
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/ground-entries/${item.id}`}>
                                                        View Details
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between p-4 border-t bg-slate-50/50">
                        <span className="text-sm text-slate-600">
                            Page {page} of {meta.totalPages || 1}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                                disabled={page >= meta.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Card>

            </div>

        </div>
    );
}