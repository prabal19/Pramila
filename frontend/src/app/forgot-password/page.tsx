
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="flex min-h-[calc(100vh-400px)] flex-col items-center justify-center bg-white py-12 px-4">
      <div className="mx-auto w-full max-w-sm text-center">
        <h1 className="text-5xl font-headline" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Reset your password
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          We will send you an email to reset your password.
        </p>
        <form className="mt-12 space-y-10 text-left">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-500">Email</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary"
            />
          </div>
          <div className="flex items-center justify-start mt-12">
            <Button type="submit" className="rounded-none px-10 tracking-widest font-semibold">
              SUBMIT
            </Button>
          </div>
        </form>
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
