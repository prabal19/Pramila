'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRequestById } from '@/lib/requests';
import { addMessageToTicket, updateTicketStatus } from '@/actions/requests';
import { useAuth } from '@/hooks/use-auth';
import type { Request as SupportRequest, RequestStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowLeft, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TicketDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { user: adminUser } = useAuth();

    const [ticket, setTicket] = useState<SupportRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<RequestStatus | undefined>(undefined);
    
    useEffect(() => {
        const fetchTicket = async () => {
            if (typeof id !== 'string') return;
            setLoading(true);
            const data = await getRequestById(id);
            setTicket(data);
            if (data) {
                setCurrentStatus(data.status);
            }
            setLoading(false);
        };
        fetchTicket();
    }, [id]);

    const handleUpdateStatus = async () => {
        if (!ticket || !currentStatus || currentStatus === ticket.status) return;
        
        const result = await updateTicketStatus(ticket._id, currentStatus);
        if (result.success && result.data) {
            setTicket(result.data);
            toast({ title: 'Status Updated', description: `Request status changed to ${currentStatus}.` });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
            setCurrentStatus(ticket.status); // Revert on failure
        }
    };
    
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !ticket || !adminUser) return;
        setIsSending(true);
        const result = await addMessageToTicket(ticket._id, {
            sender: 'support',
            senderName: `Support Team`,
            message: newMessage,
        });
        
        if (result.success && result.data) {
            setTicket(result.data);
            setCurrentStatus(result.data.status);
            setNewMessage('');
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setIsSending(false);
    };

    const getStatusVariant = (status?: string) => {
        switch (status) {
            case 'Open': return 'bg-green-100 text-green-800 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'New Subscriber': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'secondary';
        }
    };

    if (loading) {
        return <div className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-[60vh] w-full" /></div>
    }

    if (!ticket) {
        return <div className="text-center py-10">Request not found.</div>
    }
    
    const isSupportTicket = ticket.type === 'Support';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => router.push('/admin/requests')} className="text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Requests
                </Button>
                 <Button asChild>
                    <a href={`mailto:${ticket.contactEmail}`}>
                        <Mail className="mr-2 h-4 w-4" /> Reply via Email
                    </a>
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>#{ticket.ticketId} - {ticket.subject}</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[50vh] flex flex-col">
                           <ScrollArea className="flex-1 pr-4 -mr-4 mb-4">
                                <div className="space-y-6">
                                    {isSupportTicket ? ticket.messages.map(msg => (
                                        <div key={msg._id} className={cn("flex items-end gap-3", msg.sender === 'support' ? 'justify-end' : 'justify-start')}>
                                            {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm shrink-0">U</div>}
                                            <div className={cn("max-w-md p-3 rounded-lg", msg.sender === 'support' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                                <p className="text-sm">{msg.message}</p>
                                                <p className="text-xs opacity-70 mt-1.5 text-right">{format(new Date(msg.timestamp), 'MMM d, h:mm a')}</p>
                                            </div>
                                            {msg.sender === 'support' && <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">S</div>}
                                        </div>
                                    )) : (
                                        <p className="text-muted-foreground italic">{ticket.message || 'No message content.'}</p>
                                    )}
                                </div>
                            </ScrollArea>
                            {isSupportTicket && (
                                <div className="relative pt-4 border-t">
                                    <Textarea 
                                        placeholder="Type your reply..." 
                                        className="pr-24" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <Button 
                                        className="absolute right-2 bottom-3" 
                                        size="sm"
                                        onClick={handleSendMessage}
                                        disabled={isSending || !newMessage.trim()}
                                    >
                                        {isSending ? 'Sending...' : 'Send Reply'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Request Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <p className="font-semibold mb-1">Status</p>
                            <div className="flex items-center gap-2">
                                <Select value={currentStatus} onValueChange={(val) => setCurrentStatus(val as RequestStatus)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Open">Open</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                         {ticket.type === 'Newsletter' && <SelectItem value="New Subscriber">New Subscriber</SelectItem>}
                                    </SelectContent>
                                </Select>
                                 <Button size="sm" onClick={handleUpdateStatus} disabled={currentStatus === ticket.status}>Save</Button>
                            </div>
                        </div>
                        <Separator />
                         <div>
                            <p className="font-semibold">Requester</p>
                            <p className="text-muted-foreground">{ticket.contactName}</p>
                            <p className="text-muted-foreground">{ticket.contactEmail}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="font-semibold">Type</p>
                             <Badge variant="outline" className={cn('capitalize', getStatusVariant(ticket.status))}>
                                {ticket.type}
                            </Badge>
                        </div>
                         {ticket.orderId && <>
                            <Separator />
                            <div>
                                <p className="font-semibold">Order ID</p>
                                <p className="text-muted-foreground">{ticket.orderId}</p>
                            </div>
                         </>}
                         <Separator />
                         <div>
                            <p className="font-semibold">Created</p>
                            <p className="text-muted-foreground">{format(new Date(ticket.createdAt), 'PPpp')}</p>
                        </div>
                         <div>
                            <p className="font-semibold">Last Updated</p>
                            <p className="text-muted-foreground">{format(new Date(ticket.updatedAt), 'PPpp')}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}