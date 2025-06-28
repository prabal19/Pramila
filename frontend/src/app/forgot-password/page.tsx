'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetOtp, verifyPasswordResetOtp, resetPassword } from '@/actions/auth';

type Step = 'enter-email' | 'verify-otp' | 'reset-password';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

const passwordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('enter-email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleSendOtp = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    const result = await sendPasswordResetOtp(values.email);
    setIsLoading(false);
    if (result.success) {
      toast({ title: 'OTP Sent', description: result.message });
      setEmail(values.email);
      setStep('verify-otp');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
        toast({ variant: 'destructive', title: 'Invalid OTP', description: 'Please enter a 6-digit OTP.' });
        return;
    }
    setIsLoading(true);
    const result = await verifyPasswordResetOtp(email, otp);
    setIsLoading(false);
    if (result.success) {
      toast({ title: 'OTP Verified' });
      setStep('reset-password');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const handleResetPassword = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    const result = await resetPassword({ email, otp, password: values.password });
    setIsLoading(false);
    if (result.success) {
      toast({ title: 'Success!', description: 'Your password has been reset. Please log in.' });
      router.push('/login');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const renderEnterEmailStep = () => (
    <>
      <h1 className="text-5xl font-headline" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Reset your password
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        We will send you an email with an OTP to reset your password.
      </p>
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="mt-12 space-y-10 text-left">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-transparent border-0 border-b border-input rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center mt-12">
            <Button type="submit" className="rounded-none px-10 tracking-widest font-semibold" disabled={isLoading}>
              {isLoading ? 'SENDING...' : 'VERIFY EMAIL ADDRESS'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );

  const renderVerifyOtpStep = () => (
    <>
      <h1 className="text-5xl font-headline" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Enter OTP
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Enter the 6-digit code sent to <span className="font-bold">{email}</span>.
      </p>
      <div className="mt-12 space-y-10 text-left flex flex-col items-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Button onClick={handleVerifyOtp} className="rounded-none px-10 tracking-widest font-semibold w-full sm:w-auto" disabled={isLoading || otp.length < 6}>
            {isLoading ? 'VERIFYING...' : 'VERIFY'}
          </Button>
          <Button onClick={() => handleSendOtp({ email })} variant="outline" className="rounded-none px-10 tracking-widest font-semibold w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? 'RESENDING...' : 'RESEND OTP'}
          </Button>
        </div>
      </div>
    </>
  );

  const renderResetPasswordStep = () => (
     <>
      <h1 className="text-5xl font-headline" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Set New Password
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Create a new, strong password for your account.
      </p>
       <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="mt-12 space-y-10 text-left">
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="bg-transparent border-0 border-b border-input rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="bg-transparent border-0 border-b border-input rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center mt-12">
            <Button type="submit" className="rounded-none px-10 tracking-widest font-semibold" disabled={isLoading}>
              {isLoading ? 'SAVING...' : 'CHANGE MY PASSWORD'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );

  const renderStep = () => {
    switch (step) {
      case 'enter-email': return renderEnterEmailStep();
      case 'verify-otp': return renderVerifyOtpStep();
      case 'reset-password': return renderResetPasswordStep();
      default: return renderEnterEmailStep();
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-400px)] flex-col items-center justify-center bg-white py-12 px-4">
      <div className="mx-auto w-full max-w-sm text-center">
        {renderStep()}
        <div className="mt-12">
          <Link href="/login">
            <span className="text-sm text-muted-foreground underline-offset-4 hover:underline cursor-pointer">
              Cancel
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
