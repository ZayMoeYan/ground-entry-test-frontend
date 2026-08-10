import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface FetchGroundEntriesParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    township?: string;
}

export const useGroundEntries = (params: FetchGroundEntriesParams) => {
    return useQuery({
        queryKey: ['ground-entries', params],
        queryFn: async () => {
            const response = await apiClient.get('/ground-entries', { params });
            return response.data; // Expects { data: [...], meta: { page, limit, totalPages, totalCount } }
        },
    });
};

export function useGroundEntry(id: string) {
    return useQuery({
        queryKey: ['ground-entry', id],
        queryFn: async () => {
            const response = await apiClient.get(`/ground-entries/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export const useUpdateGroundEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await apiClient.patch(`/ground-entries/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            // to invalidate the ground entries query to refetch the updated data
            queryClient.invalidateQueries({ queryKey: ['ground-entries'] });
            queryClient.invalidateQueries({ queryKey: ['ground-entry'] });
        },
    });
};

export const useDeleteGroundEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await apiClient.delete(`/ground-entries/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ground-entries'] });
        },
    });
};

export const downloadCsvExport = async (township?: string) => {
    const response = await apiClient.get('/ground-entries/export/csv', {
        params: township ? { township } : {},
        responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ground_entries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};