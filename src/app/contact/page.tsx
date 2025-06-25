
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-headline mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Contact Us
        </h1>
        <div className="space-y-2 text-muted-foreground mb-10">
            <p>+91 9266748866 (Mon - Fri 9am-7pm IST)</p>
            <p>Jaypee greens wishtown, sector 128, Noida-201304</p>
            <p><Link href="#" className="underline hover:text-primary">Whatsapp Support</Link></p>
            <p>contact@pramila.shop</p>
        </div>
        <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
            Alternatively, you can contact us via the form below or email us at contact@pramila.shop and we'll aim to get back to you within 24 hours. During busy periods, holidays and public holidays, please allow up to 3 business days.
        </p>

        <form className="text-left space-y-10 max-w-xl mx-auto">
            <div className="grid w-full items-center gap-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-500">Full Name</label>
                <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary"
                />
            </div>
             <div className="grid w-full items-center gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-500">Email*</label>
                <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary"
                    required
                />
            </div>
             <div className="grid w-full items-center gap-1.5">
                <label htmlFor="message" className="text-sm font-medium text-gray-500">Message*</label>
                <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary min-h-[100px]"
                    required
                />
            </div>
            
            <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Optional</p>
                <div className="flex items-center space-x-2">
                    <Checkbox id="isUrgent" checked={isUrgent} onCheckedChange={(checked) => setIsUrgent(Boolean(checked))} />
                    <Label htmlFor="isUrgent" className="text-sm font-medium text-gray-700">
                        This is urgent
                    </Label>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <Button type="submit" className="rounded-none px-12 py-3 h-auto tracking-widest font-semibold w-full max-w-xs">
                    SEND
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                    Fields marked with an asterisk (*) are required.
                </p>
                 <p className="mt-4 text-xs text-gray-400">
                    This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
                </p>
            </div>
        </form>
      </div>
    </div>
  );
}
