
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          <div className="grid w-full items-center gap-1.5">
             <label htmlFor="password" className="text-sm font-medium text-gray-500">Password</label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-between mt-12">
            <Button type="submit" className="rounded-none px-10 tracking-widest font-semibold">
              SIGN IN
            </Button>
            <Link href="/forgot-password">
              <span className="text-sm text-muted-foreground underline-offset-4 hover:underline cursor-pointer">
                Forgot your password?
              </span>
            </Link>
          </div>
        </form>
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
