import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const numericField = z
    .preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
        z.number({ error: 'Must be a valid number' }).optional()
    );

export const groundEntrySchema = z.object({
    // 1. Map / Location Data
    latitudeLongitude: z.string().optional(),
    googleMapLink: z.string().optional(),
    status: z.string().min(1, 'Status is required'),
    locationWardStreet: z.string().optional(),
    township: z.string().min(1, 'Township is required'),

    // 2. Financial & Dimensions
    width: numericField,
    length: numericField,
    acreage: numericField,
    price: z.string().optional(),
    pricePerAcre: numericField,
    pricePerSqFt: numericField,

    // 3. Property Details
    transactionType: z.string().optional(),
    ownership: z.string().optional(),
    roadWidth: z.string().optional(),
    propertyType: z.string().min(1, 'Property Type is required'),
    landCondition: z.string().optional(),
    otherPropertyDetail: z.string().optional(),

    // 4. Contact & Source Info
    dataSource: z.string().min(1, 'Data Source is required'),
    contactName: z.string().min(1, 'Name is required'),
    phoneNumber: z.string().min(1, 'Phone Number is required'),
    secondPhone: z.string().optional(),
    percentage: z.string().optional(),
    dataEntryName: z.string().min(1, 'Data Entry Name is required'),

    // 5. Entry Date, Rating & Review
    entryDate: z.string().optional(),
    reviewRating: z.coerce.number().min(1).max(5).optional(),
    reviewReason: z.string().optional(),
    remark: z.string().optional(),

    // File Upload Validation
    groundImage: z
        .any()
        .optional()
        .refine((files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE, 'Only files up to 5MB are allowed.')
        .refine(
            (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
            'JPG, PNG or WEBP files are only accepted.'
        ),
});

export type GroundEntryFormValues = z.infer<typeof groundEntrySchema>;