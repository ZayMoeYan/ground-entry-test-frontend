import { useMutation } from '@tanstack/react-query';
import { apiClient, setAccessToken } from '@/lib/api-client';
import { LoginFormValues } from '@/lib/validations/auth';

export const useLogin = () => {
    return useMutation({
        mutationFn: async (values: LoginFormValues) => {
            // Backend: POST /auth/login
            const response = await apiClient.post('/auth/login', values);
            return response.data;
        },
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
        },
    });
};