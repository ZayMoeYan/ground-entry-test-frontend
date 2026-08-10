import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { GroundEntryFormValues } from '@/lib/validations/ground-entry';

export const useCreateGroundEntry = () => {
    return useMutation({
        mutationFn: async (values: GroundEntryFormValues) => {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (key === 'groundImage') {
                    if (value && value instanceof FileList && value.length > 0) {
                        formData.append('groundImage', value[0]);
                    }
                } else if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, value.toString());
                }
            });

            const response = await apiClient.post('/ground-entries', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        },
    });
};