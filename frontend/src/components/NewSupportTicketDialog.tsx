'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSupportTicket } from '@/actions/support';

interface NewSupportTicketDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFormSubmit: () => void;
}

const formSchema = z.object({
    subject: z.string().min(3, 'Subject must be at least 3 characters.'),
    category: z.string().min(1, 'Please select a category.'),
    orderId: z.string().optional(),
    message: z.string().min(10, 'Please describe your issue in at least 10 characters.'),
});

const ticketCategories = ['Order Issue', 'Payment', 'Delivery', 'Account', 'Product Inquiry', 'Other'];

export default function NewSupportTicketDialog({ open, onOpenChange, onFormSubmit }: NewSupportTicketDialogProps) {
    const { user } = useAuth();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { subject: '', category: '', orderId: '', message: '' },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
            return;
        }

        const result = await createSupportTicket({ ...values, userId: user._id });
        if (result.success) {
            toast({ title: 'Ticket Created', description: 'Your support ticket has been submitted.' });
            form.reset();
            onFormSubmit();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Support Ticket</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem><FormLabel>Subject*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem><FormLabel>Category*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {ticketCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="orderId" render={({ field }) => (
                            <FormItem><FormLabel>Order ID (optional)</FormLabel><FormControl><Input placeholder="e.g., ORD12345" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem><FormLabel>Describe your issue*</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
