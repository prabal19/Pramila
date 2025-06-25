'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewsletterPopup({ open, onOpenChange }: NewsletterPopupProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-10 text-center bg-white shadow-2xl rounded-none">
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs tracking-[0.2em] text-muted-foreground mb-6">NEWSLETTER</p>
          <h2 className="font-headline text-5xl mb-3" style={{fontFamily: "'Cormorant Garamond', serif"}}>Come Join Us</h2>
          <p className="text-muted-foreground mb-10">Get 10% off on your first purchase.</p>
          <form onSubmit={handleSubmit} className="w-full max-w-xs">
            <div className="space-y-8">
              <div className="text-left">
                <label htmlFor="name" className="text-sm text-muted-foreground">Name</label>
                <Input id="name" className="bg-transparent border-0 border-b border-gray-300 rounded-none p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
              </div>
              <div className="text-left">
                <label htmlFor="email" className="text-sm text-muted-foreground">Email</label>
                <Input id="email" type="email" className="bg-transparent border-0 border-b border-gray-300 rounded-none p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full mt-10 rounded-none tracking-wider font-semibold">
              GET 10% OFF &rarr;
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-6 max-w-xs">
            This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
