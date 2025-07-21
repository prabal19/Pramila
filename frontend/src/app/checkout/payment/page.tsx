
import { Suspense } from 'react';
import PaymentPageContent from './PaymentPageContent';
import { Loader2 } from 'lucide-react';

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
        </div>
    );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentPageContent />
    </Suspense>
  );
}
