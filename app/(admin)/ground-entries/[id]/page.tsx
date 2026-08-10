'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils';
import { useGroundEntry, useUpdateGroundEntry, useDeleteGroundEntry } from '@/hooks/use-ground-entries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
    ArrowLeft,
    Pencil,
    Trash2,
    Save,
    X,
    MapPin,
    DollarSign,
    Building2,
    UserCheck,
    Star,
    Loader2,
    ExternalLink,
    Image as ImageIcon,
    Clock,
} from 'lucide-react';
import { TownshipCombobox } from '@/components/common/township-combo-box';

export default function GroundEntryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [isEditing, setIsEditing] = useState(false);

    // Data Fetching & Mutations
    const { data: entry, isLoading, isError } = useGroundEntry(id);
    const updateMutation = useUpdateGroundEntry();
    const deleteMutation = useDeleteGroundEntry();

    const form = useForm({
        defaultValues: {
            status: 'Active',
            township: '',
            locationWardStreet: '',
            latitudeLongitude: '',
            googleMapLink: '',

            width: undefined as number | undefined,
            length: undefined as number | undefined,
            acreage: undefined as number | undefined,
            price: '',
            pricePerAcre: undefined as number | undefined,
            pricePerSqFt: undefined as number | undefined,
            roadWidth: '',

            transactionType: '',
            ownership: '',
            propertyType: '',
            landCondition: '',
            otherPropertyDetail: '',

            dataSource: '',
            contactName: '',
            phoneNumber: '',
            secondPhone: '',
            percentage: '',
            dataEntryName: '',

            groundImageUrl: '',
            entryDate: '',
            reviewRating: undefined as number | undefined,
            reviewReason: '',
            remark: '',
        },
    });

    useEffect(() => {
        if (entry) {
            form.reset({
                status: entry.status || 'Active',
                township: entry.township || '',
                locationWardStreet: entry.locationWardStreet || '',
                latitudeLongitude: entry.latitudeLongitude || '',
                googleMapLink: entry.googleMapLink || '',

                width: entry.width ?? undefined,
                length: entry.length ?? undefined,
                acreage: entry.acreage ?? undefined,
                price: entry.price || '',
                pricePerAcre: entry.pricePerAcre ?? undefined,
                pricePerSqFt: entry.pricePerSqFt ?? undefined,
                roadWidth: entry.roadWidth || '',

                transactionType: entry.transactionType || '',
                ownership: entry.ownership || '',
                propertyType: entry.propertyType || '',
                landCondition: entry.landCondition || '',
                otherPropertyDetail: entry.otherPropertyDetail || '',

                dataSource: entry.dataSource || '',
                contactName: entry.contactName || '',
                phoneNumber: entry.phoneNumber || '',
                secondPhone: entry.secondPhone || '',
                percentage: entry.percentage || '',
                dataEntryName: entry.dataEntryName || '',

                groundImageUrl: entry.groundImageUrl || '',
                entryDate: entry.entryDate ? new Date(entry.entryDate).toISOString().split('T')[0] : '',
                reviewRating: entry.reviewRating ?? undefined,
                reviewReason: entry.reviewReason || '',
                remark: entry.remark || '',
            });
        }
    }, [entry, form]);

    // Handle Form Save
    const onSave = (values: any) => {
        const formattedData = {
            ...values,
            width: values.width ? Number(values.width) : null,
            length: values.length ? Number(values.length) : null,
            acreage: values.acreage ? Number(values.acreage) : null,
            pricePerAcre: values.pricePerAcre ? Number(values.pricePerAcre) : null,
            pricePerSqFt: values.pricePerSqFt ? Number(values.pricePerSqFt) : null,
            reviewRating: values.reviewRating ? Number(values.reviewRating) : null,
            entryDate: values.entryDate ? new Date(values.entryDate).toISOString() : null,
        };

        updateMutation.mutate(
            { id, data: formattedData },
            {
                onSuccess: () => {
                    toast.success('All changes have been saved successfully.');
                    setIsEditing(false);
                },
                onError: (err: any) => {
                    toast.error(err?.response?.data?.message || 'Update operation failed.');
                },
            }
        );
    };

    // Handle Delete
    const handleDelete = () => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Data has been deleted successfully.');
                router.push('/admin/dashboard');
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || 'Delete operation failed.');
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError || !entry) {
        return (
            <div className="p-8 text-center space-y-4">
                <p className="text-red-500 font-semibold">Data not found or an error has occurred.</p>
                <Button onClick={() => router.back()} variant="outline">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Action Bar Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-10">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            title="Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-slate-900">Ground Entry Detail</h1>
                                <Badge
                                    variant={
                                        entry.status === 'Active'
                                            ? 'default'
                                            : entry.status === 'Pending'
                                                ? 'secondary'
                                                : 'outline'
                                    }
                                >
                                    {entry.status}
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500">ID: {entry.id}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {!isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="gap-2 border-slate-300"
                                >
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                    <span>Edit Info</span>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="gap-2">
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Once you delete this Ground Entry Data, it cannot be recovered.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDelete}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        form.reset();
                                        setIsEditing(false);
                                    }}
                                    className="gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </Button>

                                <Button
                                    onClick={form.handleSubmit(onSave)}
                                    disabled={updateMutation.isPending}
                                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {updateMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Save Changes</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content Form / Card Sections */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">

                        {/* 1. Location & Status */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b bg-slate-50/50 py-3">
                                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    1. Location & Status Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="township"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>မြို့နယ် (Township) *</FormLabel>
                                                    <FormControl>
                                                        <TownshipCombobox
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="locationWardStreet"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel>Location / Ward / Street</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="latitudeLongitude"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Latitude, Longitude</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="16.12345, 96.12345" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="googleMapLink"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Google Map Link</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://maps.google.com/..." {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Status *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Active">Active</SelectItem>
                                                            <SelectItem value="Pending">Pending</SelectItem>
                                                            <SelectItem value="Draft">Draft</SelectItem>
                                                            <SelectItem value="Archived">Archived</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                        <InfoItem label="Township" value={entry.township} />
                                        <InfoItem label="Location / Ward / Street" value={entry.locationWardStreet} />
                                        <InfoItem label="Lat, Long" value={entry.latitudeLongitude} />
                                        <InfoItem label="Status" value={entry.status} />
                                        <div>
                                            <span className="text-xs text-slate-500 block font-medium">Google Map Link</span>
                                            {entry.googleMapLink ? (
                                                <a
                                                    href={entry.googleMapLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium mt-1"
                                                >
                                                    Open Map <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 mt-1 block">-</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 2. Dimensions & Pricing */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b bg-slate-50/50 py-3">
                                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                    2. Dimensions & Financial Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price Label (e.g. 6800L, 250k)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="width"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Width (ft)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="length"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Length (ft)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="acreage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Acreage (ဧက)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pricePerAcre"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price Per Acre</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pricePerSqFt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price Per SqFt</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="roadWidth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Road Width (e.g. 20 ft)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                        <InfoItem label="Total Price" value={entry.price} highlight />
                                        <InfoItem
                                            label="Dimensions (W × L)"
                                            value={entry.width && entry.length ? `${entry.width} ft × ${entry.length} ft` : '-'}
                                        />
                                        <InfoItem label="Acreage (ဧက)" value={entry.acreage ? `${entry.acreage} Acre` : '-'} />
                                        <InfoItem label="Price Per Acre" value={entry.pricePerAcre} />
                                        <InfoItem label="Price Per SqFt" value={entry.pricePerSqFt} />
                                        <InfoItem label="Road Width (လမ်းအကျယ်)" value={entry.roadWidth} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 3. Property Information */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b bg-slate-50/50 py-3">
                                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-indigo-600" />
                                    3. Property & Ownership Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="propertyType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Property Type (e.g. Land)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="transactionType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Transaction Type (e.g. For Sale)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="ownership"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ownership (e.g. Grant)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="landCondition"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Land Condition</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="otherPropertyDetail"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2 lg:col-span-4">
                                                    <FormLabel>Other Property Details</FormLabel>
                                                    <FormControl>
                                                        <Textarea rows={2} {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                                        <InfoItem label="Property Type" value={entry.propertyType} />
                                        <InfoItem label="Transaction Type" value={entry.transactionType} />
                                        <InfoItem label="Ownership" value={entry.ownership} />
                                        <InfoItem label="Land Condition" value={entry.landCondition} />
                                        <div className="sm:col-span-2 lg:col-span-4">
                                            <InfoItem label="Other Property Details" value={entry.otherPropertyDetail} />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 4. Contact Person & Data Source */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b bg-slate-50/50 py-3">
                                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-amber-600" />
                                    4. Contact Person & Source Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="contactName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contact Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="secondPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Second Phone</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dataSource"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Data Source</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dataEntryName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Data Entry Person</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="percentage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Data Completeness (%)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 85%" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                                        <InfoItem label="Contact Name" value={entry.contactName} />
                                        <InfoItem label="Phone Number" value={entry.phoneNumber} />
                                        <InfoItem label="Second Phone" value={entry.secondPhone} />
                                        <InfoItem label="Data Source" value={entry.dataSource} />
                                        <InfoItem label="Data Entry By" value={entry.dataEntryName} />
                                        <InfoItem label="Completeness Percentage" value={entry.percentage} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 5. Reviews, Media & Remarks */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="border-b bg-slate-50/50 py-3">
                                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-purple-600" />
                                    5. Review, Media & Remarks
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="entryDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Entry Date</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="reviewRating"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                        Review Rating (1-5 Stars)
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                                                        value={field.value ? String(field.value) : ''}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Rating" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="5">⭐⭐⭐⭐⭐ (5 Stars - Top Choice)</SelectItem>
                                                            <SelectItem value="4">⭐⭐⭐⭐ (4 Stars - Good)</SelectItem>
                                                            <SelectItem value="3">⭐⭐⭐ (3 Stars - Average)</SelectItem>
                                                            <SelectItem value="2">⭐⭐ (2 Stars - Below Average)</SelectItem>
                                                            <SelectItem value="1">⭐ (1 Star - Low)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="groundImageUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Image URL / Path</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://..." {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="reviewReason"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-3">
                                                    <FormLabel>Review Reason (Why is this entry good/urgent?)</FormLabel>
                                                    <FormControl>
                                                        <Textarea rows={2} {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="remark"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-3">
                                                    <FormLabel>Additional Remarks</FormLabel>
                                                    <FormControl>
                                                        <Textarea rows={3} {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6 text-sm">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <InfoItem
                                                label="Entry Date"
                                                value={entry.entryDate ? new Date(entry.entryDate).toLocaleDateString() : '-'}
                                            />
                                            <div>
                                                <span className="text-xs text-slate-500 block font-medium">Rating</span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {entry.reviewRating ? (
                                                        Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < entry.reviewRating
                                                                    ? 'text-amber-500 fill-amber-500'
                                                                    : 'text-slate-300'
                                                                    }`}
                                                            />
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-500 block font-medium">Ground Image</span>
                                                {entry.groundImageUrl ? (
                                                    <a
                                                        href={getImageUrl(entry.groundImageUrl)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 hover:underline flex items-center gap-1 font-medium mt-1"
                                                    >
                                                        <ImageIcon className="w-3.5 h-3.5" /> View Uploaded Image
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 mt-1 block">No Image</span>
                                                )}
                                            </div>
                                        </div>

                                        <InfoItem label="Review Reason" value={entry.reviewReason} />
                                        <InfoItem label="Additional Remarks" value={entry.remark} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 6. System Timestamps Info */}
                        <Card className="border-slate-200 bg-slate-50/50 shadow-sm">
                            <CardContent className="p-4 flex flex-wrap justify-between text-xs text-slate-500 gap-2">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    Created: {new Date(entry.createdAt).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    Last Updated: {new Date(entry.updatedAt).toLocaleString()}
                                </span>
                            </CardContent>
                        </Card>

                    </form>
                </Form>

            </div>
        </div>
    );
}

// Display Helper Component for View Mode
function InfoItem({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value?: any;
    highlight?: boolean;
}) {
    return (
        <div>
            <span className="text-xs text-slate-500 block font-medium">{label}</span>
            <span
                className={`block mt-1 ${highlight ? 'font-bold text-emerald-600 text-base' : 'font-medium text-slate-800'
                    }`}
            >
                {value !== null && value !== undefined && value !== '' ? String(value) : '-'}
            </span>
        </div>
    );
}