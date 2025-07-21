'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { getUserRequests } from '@/lib/requests';
import type { Request as SupportRequest, RequestStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FilePlus2, MessageSquare, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import NewSupportTicketDialog from '@/components/NewSupportTicketDialog';
import { addMessageToTicket } from '@/actions/requests';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SupportPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [tickets, setTickets] = useState<SupportRequest[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const fetchTickets = async () => {
        if (user) {
            setLoading(true);
            const userTickets = await getUserRequests(user._id);
            setTickets(userTickets);
            if (userTickets.length > 0 && !selectedTicket) {
                setSelectedTicket(userTickets[0]);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/support');
        } else if (!authLoading && user) {
            fetchTickets();
        }
    }, [user, authLoading, router]);

    const handleFormSubmit = () => {
        fetchTickets();
        setIsFormOpen(false);
    }
    
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket || !user) return;
        setIsSending(true);
        const result = await addMessageToTicket(selectedTicket._id, {
            sender: 'user',
            senderName: `${user.firstName} ${user.lastName}`,
            message: newMessage,
        });
        
        if (result.success && result.data) {
            setSelectedTicket(result.data);
            const updatedTickets = tickets.map(t => t._id === result.data?._id ? result.data : t).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            setTickets(updatedTickets);
            setNewMessage('');
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setIsSending(false);
    };

    if (authLoading || loading) {
        return <div className="container mx-auto px-4 py-8"><Skeleton className="h-[60vh] w-full" /></div>
    }
    
    if (!user) {
        return null;
    }

    const getStatusVariant = (status: RequestStatus) => {
        switch (status) {
            case 'Open': return 'bg-green-100 text-green-800 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'secondary';
        }
    };

    return (
        <>
            <NewSupportTicketDialog open={isFormOpen} onOpenChange={setIsFormOpen} onFormSubmit={handleFormSubmit} />
            <div className="container mx-auto px-4 py-8">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Support Center</h1>
                        <p className="text-muted-foreground">View your tickets or create a new one.</p>
                    </div>
                    <Button onClick={() => setIsFormOpen(true)}>
                        <FilePlus2 className="mr-2 h-4 w-4" /> New Ticket
                    </Button>
                </header>
                <Card className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 min-h-[65vh]">
                    <aside className="md:col-span-1 lg:col-span-1 border-r">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold">My Tickets</h2>
                        </div>
                        <ScrollArea className="h-[calc(65vh-60px)]">
                            {tickets.length > 0 ? (
                                tickets.map(ticket => (
                                    <button key={ticket._id} onClick={() => setSelectedTicket(ticket)}
                                        className={cn("w-full text-left p-4 border-b hover:bg-muted/50", selectedTicket?._id === ticket._id && "bg-muted")}>
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold truncate">#{ticket.ticketId} - {ticket.subject}</p>
                                            <Badge variant="outline" className={cn("text-xs", getStatusVariant(ticket.status))}>{ticket.status}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Last update: {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">No tickets found.</div>
                            )}
                        </ScrollArea>
                    </aside>
                    <main className="md:col-span-2 lg:col-span-3 flex flex-col">
                        {selectedTicket ? (
                            <>
                                <header className="p-4 border-b flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                                        <p className="text-sm text-muted-foreground">Category: {selectedTicket.category}</p>
                                    </div>
                                    <Badge variant="outline" className={cn("text-sm", getStatusVariant(selectedTicket.status))}>
                                        {selectedTicket.status}
                                    </Badge>
                                </header>
                                <ScrollArea className="flex-1 p-6">
                                    <div className="space-y-6">
                                        {selectedTicket.messages.map(msg => (
                                            <div key={msg._id} className={cn("flex items-end gap-3", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                                                {msg.sender === 'support' && <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">S</div>}
                                                <div className={cn("max-w-md p-3 rounded-lg", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                                    <p className="text-sm">{msg.message}</p>
                                                    <p className="text-xs opacity-70 mt-1.5 text-right">{format(new Date(msg.timestamp), 'MMM d, h:mm a')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <div className="p-4 border-t bg-background">
                                    <div className="relative">
                                        <Textarea 
                                            placeholder="Type your message..." 
                                            className="pr-20" 
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                        />
                                        <Button 
                                            className="absolute right-2 bottom-2" 
                                            size="sm"
                                            onClick={handleSendMessage}
                                            disabled={isSending || !newMessage.trim()}
                                        >
                                            {isSending ? 'Sending...' : 'Send'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <MessageSquare className="w-16 h-16 text-muted-foreground/30" />
                                <h3 className="mt-4 text-xl font-semibold">Select a Ticket</h3>
                                <p className="text-muted-foreground">Choose a ticket from the left panel to see the conversation.</p>
                            </div>
                        )}
                    </main>
                </Card>
            </div>
        </>
    );
}
