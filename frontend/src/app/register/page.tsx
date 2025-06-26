
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
import { registerUser } from '@/actions/auth';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await registerUser(values);
    if (result.success) {
      toast({
        title: 'Success!',
        description: 'You have successfully signed up.',
      });
      router.push('/login');
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result.message,
      });
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-400px)] flex-col items-center justify-center bg-white py-12 px-4">
      <div className="mx-auto w-full max-w-sm text-center">
        <h1 className="text-5xl font-headline" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Create Account
        </h1>
         <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 space-y-8 text-left">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-500">First Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-500">Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-500">Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
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
                  <FormLabel className="text-sm font-medium text-gray-500">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-start mt-12">
               <Button type="submit" className="rounded-none px-10 tracking-widest font-semibold" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'CREATING...' : 'CREATE'}
              </Button>
            </div>
          </form>
        </Form>
         <div className="mt-12">
          <Link href="/login">
            <span className="text-sm text-muted-foreground underline-offset-4 hover:underline cursor-pointer">
              Return to Login
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
