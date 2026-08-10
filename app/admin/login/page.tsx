'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Sonner Toast

import { loginSchema, LoginFormValues } from '@/lib/validations/auth';
import { useLogin } from '@/hooks/use-login';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

export default function AdminLoginPage() {
    const router = useRouter();
    const loginMutation = useLogin();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema) as any,
        defaultValues: {
            email: '',
            password: '',
            rememberMe: true,
        },
    });

    const onSubmit = (values: LoginFormValues) => {
        loginMutation.mutate(values, {
            onSuccess: (data) => {
                // Sonner Success Toast
                toast.success(data.message || 'Login successful');
                router.push('/admin/dashboard');
            },
            onError: (error: any) => {
                // Sonner Error Toast
                console.error('Login Error:', error);
                toast.error(
                    error?.response?.data?.message || 'Login is failed. Please check your credentials.',
                );
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <Card className="w-full max-w-md shadow-md bg-white">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Admin Login</CardTitle>
                    <CardDescription>
                        Please enter your email and password to access the admin dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="admin@gmail.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                            Remember me for 7 days
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full bg-black text-white hover:bg-slate-800"
                            >
                                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                            </Button>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}