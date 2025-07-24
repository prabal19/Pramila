
'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';
import { createReturnRequest } from '@/lib/returns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const returnSchema = z.object({
  reason: z.string().min(1, 'Please select a reason for the return.'),
  description: z.string().optional(),
});

const returnReasons = [
  'Incorrect size',
  'Item not as described',
  'Damaged item',
  'Changed my mind',
  'Other',
];

interface ReturnItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  item: Order['items'][0];
  onReturnSuccess: () => void;
}

export default function ReturnItemDialog({ isOpen, onClose, order, item, onReturnSuccess }: ReturnItemDialogProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof returnSchema>>({
        resolver: zodResolver(returnSchema),
        defaultValues: { reason: '', description: '' },
    });
    
    const { handleSubmit, control, formState: { isSubmitting } } = form;

    const onSubmit = async (values: z.infer<typeof returnSchema>) => {
        if (!user) return;
        
        const result = await createReturnRequest({
            userId: user._id,
            orderId: order._id,
            orderItemId: item._id,
            productId: item.productId,
            reason: values.reason,
            description: values.description,
        });

        if(result.success) {
            toast({ title: 'Return Requested', description: 'Your return request has been submitted successfully.' });
            onReturnSuccess();
            onClose();
        } else {
            toast({ variant: 'destructive', title: 'Request Failed', description: result.message });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request a Return</DialogTitle>
                    <DialogDescription>For item: {item.name} (Size: {item.size})</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason for return</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {returnReasons.map(reason => (
                                                <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comments (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Provide more details about the return..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
