
'use client';

import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 top-0 translate-y-0 max-w-full w-full rounded-none border-0 border-b bg-white shadow-lg data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top">
        <div className="container mx-auto px-4 py-8">
            <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <Input
                    placeholder="Search"
                    className="w-full pl-10 pr-10 text-lg border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary h-auto pb-4 bg-transparent"
                 />
                 <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8">
                        <X className="h-6 w-6" />
                    </Button>
                 </DialogClose>
            </div>
            <div className="mt-8">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">Popular searches</h3>
                <div className="flex flex-col items-start gap-3">
                    <Link href="/shop/saree" className="text-lg hover:underline" onClick={() => onOpenChange(false)}>
                        Sarees
                    </Link>
                    <Link href="/shop/draped-sets" className="text-lg hover:underline" onClick={() => onOpenChange(false)}>
                        Draped sets
                    </Link>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
