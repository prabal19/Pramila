'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { subscribeToNewsletter } from '@/actions/requests';

interface NewsletterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export default function NewsletterPopup({ open, onOpenChange }: NewsletterPopupProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await subscribeToNewsletter(values);
    if (result.success) {
      toast({
        title: 'Subscription Successful!',
        description: "You're now on our mailing list.",
      });
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Subscription Failed',
        description: result.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-10 text-center bg-white shadow-2xl rounded-none">      
        <DialogHeader className="sr-only">
          <DialogTitle>Newsletter: Come Join Us</DialogTitle>
          <DialogDescription>Get 10% off on your first purchase by subscribing to our newsletter.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs tracking-[0.2em] text-muted-foreground mb-6">NEWSLETTER</p>
          <h2 className="font-headline text-5xl mb-3" style={{fontFamily: "'Cormorant Garamond', serif"}}>Come Join Us</h2>
          <p className="text-muted-foreground mb-10">Get 10% off on your first purchase.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xs space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-sm text-muted-foreground">Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-transparent border-0 border-b border-input rounded-none p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-sm text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="bg-transparent border-0 border-b border-input rounded-none p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full mt-10 rounded-none tracking-wider font-semibold" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'SUBSCRIBING...' : 'GET 10% OFF →'}
              </Button>
            </form>
          </Form>
          <p className="text-xs text-gray-400 mt-6 max-w-xs">
            This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
