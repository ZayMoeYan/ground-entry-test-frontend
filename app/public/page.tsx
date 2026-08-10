'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useCreateGroundEntry } from '@/hooks/use-create-ground-entry';
import { groundEntrySchema, GroundEntryFormValues } from '@/lib/validations/ground-entry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    MapPin,
    Building2,
    DollarSign,
    PhoneCall,
    FileText,
    Star,
    Loader2,
    UploadCloud,
    SendHorizontal,
} from 'lucide-react';
import { TownshipCombobox } from '@/components/common/township-combo-box';
import { useEffect } from 'react';

export default function GroundEntryPage() {
    const createMutation = useCreateGroundEntry();

    const form = useForm<GroundEntryFormValues>({
        resolver: zodResolver(groundEntrySchema) as any,
        defaultValues: {
            // Basic Text & Select Defaults
            status: '',
            township: '',
            propertyType: '',
            dataSource: '',
            transactionType: '',
            ownership: '',
            dataEntryName: '',
            contactName: '',
            phoneNumber: '',
            secondPhone: '',
            percentage: '',
            latitudeLongitude: '',
            googleMapLink: '',
            locationWardStreet: '',
            price: '',
            roadWidth: '',
            landCondition: '',
            otherPropertyDetail: '',
            entryDate: '',
            reviewReason: '',
            remark: '',
            groundImage: undefined,

            width: undefined,
            length: undefined,
            acreage: undefined,
            pricePerAcre: undefined,
            pricePerSqFt: undefined,
            reviewRating: undefined,
        },
    });

    const watchPrice = form.watch('price');
    const watchWidth = form.watch('width');
    const watchLength = form.watch('length');
    const watchAcreage = form.watch('acreage');

    // Auto-calculate Price Per Acre & Price Per SqFt
    useEffect(() => {
        if (!watchPrice) return;

        const cleanedPriceStr = String(watchPrice).replace(/,/g, '');
        const match = cleanedPriceStr.match(/[\d.]+/);
        const numericPrice = match ? parseFloat(match[0]) : NaN;

        if (isNaN(numericPrice) || numericPrice <= 0) return;

        // 1. Calculate Price Per Acre
        if (watchAcreage && watchAcreage > 0) {
            const calculatedPricePerAcre = Number((numericPrice / watchAcreage).toFixed(2));
            form.setValue('pricePerAcre', calculatedPricePerAcre, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }

        // 2. Calculate Price Per SqFt (Width x Length)
        if (watchWidth && watchLength && watchWidth > 0 && watchLength > 0) {
            const areaSqFt = watchWidth * watchLength;
            const calculatedPricePerSqFt = Number((numericPrice / areaSqFt).toFixed(2));
            form.setValue('pricePerSqFt', calculatedPricePerSqFt, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [watchPrice, watchWidth, watchLength, watchAcreage, form]);

    const onSubmit = (values: GroundEntryFormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                toast.success('Ground Entry Data submitted successfully.');
                form.reset();
            },
            onError: (error: any) => {
                toast.error(
                    error?.response?.data?.message || 'Data submission failed. Please try again.'
                );
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <Card className="shadow-md border-slate-200">
                    <CardHeader className="border-b bg-white rounded-t-lg">
                        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Building2 className="w-6 h-6 text-blue-600" />
                            New Ground Entry Data
                        </CardTitle>
                        <CardDescription>
                            Submit detailed ground survey and property transaction information.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 bg-white">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                {/* 1. Location & Map Data */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2 text-slate-800">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-semibold">1. Map / Location Data</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="latitudeLongitude"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Latitude, Longitude</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="16.12345,96.12345" {...field} value={field.value ?? ''} />
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
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Online">Online</SelectItem>
                                                            <SelectItem value="Offline">Offline</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="locationWardStreet"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location / Ward / Street</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="House No, Ward, Street or Landmark" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

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
                                    </div>
                                </div>

                                {/* 2. Dimensions & Price */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2 text-slate-800">
                                        <DollarSign className="w-5 h-5 text-emerald-600" />
                                        <h3 className="text-lg font-semibold">2. Financial & Dimensions</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                            placeholder="e.g. 40"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                                                            placeholder="e.g. 60"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                                                    <FormLabel>အကျယ်အဝန်း (ဧက)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="any"
                                                            placeholder="e.g. 0.055"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price Label</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 6800L, 250k" {...field} value={field.value ?? ''} />
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
                                                            placeholder="Price Per Acre"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                                                            placeholder="Price Per SqFt"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* 3. Property Details & Image Upload */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2 text-slate-800">
                                        <Building2 className="w-5 h-5 text-indigo-600" />
                                        <h3 className="text-lg font-semibold">3. Property Details & Image</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="transactionType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>အမျိုးအစား / Transaction</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Transaction" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="For Sale">For Sale</SelectItem>
                                                            <SelectItem value="For Rent">For Rent</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="ownership"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ပိုင်ဆိုင်မှု / Ownership</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select ownership" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Grant">Grant (ဂရန်)</SelectItem>
                                                            <SelectItem value="Permit">Permit (ပါမစ်)</SelectItem>
                                                            <SelectItem value="Ancestral">Ancestral (ဘိုးဘွားပိုင်)</SelectItem>
                                                            <SelectItem value="Contract">Contract (ဂရန်မြေကွက်)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="roadWidth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>လမ်းအကျယ် / Road Width</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 20 ft, 30 ft" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="propertyType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Property Type *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select property type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Land">Land (မြေကွက်)</SelectItem>
                                                            <SelectItem value="House">House + Land (လုံးချင်း)</SelectItem>
                                                            <SelectItem value="Condo">Condo / Apartment</SelectItem>
                                                            <SelectItem value="Commercial">Commercial (စီးပွားရေး)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
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
                                                        <Input placeholder="e.g. Vacant Land, Fenced" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="groundImage"
                                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-1.5">
                                                        <UploadCloud className="w-4 h-4 text-slate-500" />
                                                        Ground Image
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/webp"
                                                            onChange={(e) => onChange(e.target.files)}
                                                            {...fieldProps}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Added Field: otherPropertyDetail */}
                                    <FormField
                                        control={form.control}
                                        name="otherPropertyDetail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Other Property Details</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Additional details regarding building condition, electricity, water connection, etc."
                                                        rows={2}
                                                        {...field}
                                                        value={field.value ?? ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* 4. Contact & Data Source Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2 text-slate-800">
                                        <PhoneCall className="w-5 h-5 text-amber-600" />
                                        <h3 className="text-lg font-semibold">4. Contact & Data Source Info</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dataSource"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Data Source *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Data Source" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Facebook Marketplace">Facebook Marketplace</SelectItem>
                                                            <SelectItem value="Facebook Post">Facebook Post</SelectItem>
                                                            <SelectItem value="Agent">Agent Direct</SelectItem>
                                                            <SelectItem value="Property Website">Property Website</SelectItem>
                                                            <SelectItem value="Field Survey">Field Survey</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="contactName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contact Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Owner/Agent Name" {...field} value={field.value ?? ''} />
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
                                                    <FormLabel>Phone Number *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="09xxxxxxxxx" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Added Field: secondPhone */}
                                        <FormField
                                            control={form.control}
                                            name="secondPhone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Second Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="09xxxxxxxxx (Optional)" {...field} value={field.value ?? ''} />
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
                                                    <FormLabel>Data Entry Person *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Your Name" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Added Field: percentage */}
                                        <FormField
                                            control={form.control}
                                            name="percentage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Data Completeness (%)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 80%" {...field} value={field.value ?? ''} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* 5. Review & Remarks */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b pb-2 text-slate-800">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                        <h3 className="text-lg font-semibold">5. Review & Remarks</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Entry Date */}
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

                                        {/* Added Field: reviewRating */}
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
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="reviewReason"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Review Reason</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Why is this entry good or urgent?" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="remark"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Additional Remarks</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Any additional notes or instructions..." rows={3} {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4 border-t flex justify-end">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={createMutation.isPending}
                                        className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                    >
                                        {createMutation.isPending ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SendHorizontal className="w-5 h-5" />
                                                <span>Submit Ground Entry</span>
                                            </>
                                        )}
                                    </Button>
                                </div>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}