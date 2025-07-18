'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
            <h1 className="text-4xl font-headline mb-4">Thank You For Your Order!</h1>
            <p className="text-lg text-muted-foreground max-w-lg">
                Your order has been placed successfully. A confirmation email has been sent to you.
            </p>
            {orderId && (
                <p className="mt-4 text-base text-muted-foreground">
                    Your Order ID is: <span className="font-bold text-primary">#{orderId.slice(-6).toUpperCase()}</span>
                </p>
            )}
            <div className="mt-8 flex gap-4">
                <Button asChild>
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/account?view=orders">View My Orders</Link>
                </Button>
            </div>
        </div>
    )
}


export default function OrderConfirmationPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <Suspense fallback={<div>Loading confirmation...</div>}>
                <ConfirmationContent />
            </Suspense>
        </div>
    );
}