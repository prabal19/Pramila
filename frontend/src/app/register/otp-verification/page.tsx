
'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyOtp, resendOtp } from '@/actions/auth';

function OtpVerificationComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { toast } = useToast();
  
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (!email || otp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please enter a valid 6-digit OTP.',
      });
      return;
    }
    
    setIsVerifying(true);
    const result = await verifyOtp(email, otp);
    setIsVerifying(false);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
      router.push('/login');
    } else {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: result.message,
      });
    }
  };
  
  const handleResend = async () => {
      if (!email) return;

      setIsResending(true);
      const result = await resendOtp(email);
      setIsResending(false);
      
      if (result.success) {
          toast({
              title: 'OTP Resent',
              description: result.message,
          });
      } else {
          toast({
              variant: 'destructive',
              title: 'Resend Failed',
              description: result.message,
          });
      }
  };

  if (!email) {
    return (
        <div className="text-center">
            <p className="text-destructive">No email address found. Please start the registration process again.</p>
            <Button asChild variant="link">
                <Link href="/register">Go to Register</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-sm text-center">
      <h1 className="text-5xl font-headline" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        OTP Verification
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
          <Button onClick={handleVerify} className="rounded-none px-10 tracking-widest font-semibold w-full sm:w-auto" disabled={isVerifying || otp.length < 6}>
            {isVerifying ? 'VERIFYING...' : 'VERIFY'}
          </Button>
           <Button onClick={handleResend} variant="outline" className="rounded-none px-10 tracking-widest font-semibold w-full sm:w-auto" disabled={isResending}>
            {isResending ? 'RESENDING...' : 'RESEND OTP'}
          </Button>
        </div>
      </div>
      <div className="mt-12">
        <Link href="/register">
          <span className="text-sm text-muted-foreground underline-offset-4 hover:underline cursor-pointer">
            Back to Register
          </span>
        </Link>
      </div>
    </div>
  );
}


export default function OtpVerificationPage() {
    return (
        <div className="flex min-h-[calc(100vh-400px)] flex-col items-center justify-center bg-white py-12 px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <OtpVerificationComponent />
            </Suspense>
        </div>
    )
}
