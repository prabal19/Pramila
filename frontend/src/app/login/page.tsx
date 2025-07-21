
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/actions/auth';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await loginUser(values);
    if (result.success && result.user) {
      login(result.user);
      toast({
        title: 'Successful login',
        description: `Welcome back, ${result.user.firstName}!`,
      });
      router.push('/');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.message,
      });
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-400px)] flex-col items-center justify-center bg-white py-12 px-4">
      <div className="mx-auto w-full max-w-sm text-center">
        <h1 className="text-5xl font-headline" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Login
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign up here.
          </Link>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 space-y-10 text-left">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="email" className="bg-transparent border-0 border-b border-input rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
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
                  <FormLabel className="text-sm font-medium text-muted-foreground">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} autoComplete="current-password" className="bg-transparent border-0 border-b border-input rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mt-12">
              <Button type="submit" className="rounded-none px-10 tracking-widest font-semibold" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
              </Button>
              <Link href="/forgot-password">
                <span className="text-sm text-muted-foreground underline-offset-4 hover:underline cursor-pointer">
                  Forgot your password?
                </span>
              </Link>
            </div>
          </form>
        </Form>
        <div className="mt-12">
          <Link href="/">
            <span className="text-sm text-muted-foreground underline-offset-4 hover:underline cursor-pointer">
              Return to Store
            </span>
          </Link>
        </div>
        <p className="mt-10 text-xs text-gray-400">
          This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
        </p>
      </div>
    </div>
  );
}
