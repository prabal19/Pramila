'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/actions/requests';

const formSchema = z.object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().email('A valid email is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    isUrgent: z.boolean().default(false),
});

export default function ContactClientPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', message: '', isUrgent: false },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await submitContactForm(values);
    if (result.success) {
      toast({ title: 'Message Sent!', description: 'We have received your message and will get back to you shortly.'});
      form.reset();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-headline mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Contact Us
        </h1>
        <div id="contact-content">
          <div className="space-y-2 text-muted-foreground mb-10">
              <p>+91 9266748866 (Mon - Fri 9am-7pm IST)</p>
              <p>Jaypee greens wishtown, sector 128, Noida-201304</p>
              {/* <p><Link href="#" className="underline hover:text-primary">Whatsapp Support</Link></p> */}
              <p>contact@pramila.shop</p>
          </div>
          <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
              Alternatively, you can contact us via the form below or email us at contact@pramila.shop and we'll aim to get back to you within 24 hours. During busy periods, holidays and public holidays, please allow up to 3 business days.
          </p>

          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="text-left space-y-10 max-w-xl mx-auto">
              <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                      <Label htmlFor="fullName" className="text-sm font-medium text-muted-foreground">Full Name*</Label>
                      <FormControl>
                        <Input id="fullName" {...field} className="bg-transparent border-0 border-b border-input rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
               <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                     <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email*</Label>
                      <FormControl>
                        <Input type="email" id="email" {...field} className="bg-transparent border-0 border-b border-input rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                      </FormControl>
                       <FormMessage />
                  </FormItem>
              )} />
               <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                     <Label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message*</Label>
                     <FormControl>
                         <Textarea id="message" {...field} className="bg-transparent border-0 border-b border-input rounded-none px-0 h-auto py-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary min-h-[100px]" />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
              )} />
              
              <FormField control={form.control} name="isUrgent" render={({ field }) => (
                <FormItem>
                    <Label className="text-sm font-medium text-muted-foreground mb-2">Optional</Label>
                    <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox id="isUrgent" checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <Label htmlFor="isUrgent" className="text-sm font-medium text-gray-700">
                            This is urgent
                        </Label>
                    </div>
                    <FormMessage />
                </FormItem>
              )}/>

              <div className="flex flex-col items-center">
                  <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-none px-12 py-3 h-auto tracking-widest font-semibold w-full max-w-xs">
                      {form.formState.isSubmitting ? 'SENDING...' : 'SEND'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                      Fields marked with an asterisk (*) are required.
                  </p>
                   <p className="mt-4 text-xs text-gray-400">
                      This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
                  </p>
              </div>
          </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
