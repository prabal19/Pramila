
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User, Order } from "@/lib/types"
import { format } from "date-fns"
import { ScrollArea } from "../ui/scroll-area"

type FullUserDetails = {
    user: User;
    orders: Order[];
};

interface UserDetailsDialogProps {
    userDetails: FullUserDetails | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UserDetailsDialog({ userDetails, open, onOpenChange }: UserDetailsDialogProps) {
    if (!userDetails) return null;

    const { user, orders } = userDetails;
    
    const isValidDate = user.date && !isNaN(new Date(user.date).getTime());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle>User Details - {user.firstName} {user.lastName}</DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-hidden">
                    <Tabs defaultValue="profile" className="flex flex-col h-full">
                        <TabsList className="mx-6">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="addresses">Addresses</TabsTrigger>
                            <TabsTrigger value="orders">Order History ({orders.length})</TabsTrigger>
                        </TabsList>
                        <ScrollArea className="flex-grow">
                             <div className="p-6">
                                <TabsContent value="profile" className="m-0">
                                    <Card>
                                        <CardContent className="pt-6 grid grid-cols-2 gap-4">
                                            <div><p className="font-semibold">First Name</p><p>{user.firstName}</p></div>
                                            <div><p className="font-semibold">Last Name</p><p>{user.lastName}</p></div>
                                            <div className="col-span-2"><p className="font-semibold">Email</p><p>{user.email}</p></div>
                                            <div className="col-span-2">
                                                <p className="font-semibold">Date Joined</p>
                                                <p>{isValidDate ? format(new Date(user.date), 'PPpp') : '-'}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="addresses" className="m-0">
                                     <Card>
                                        <CardContent className="pt-6 space-y-4">
                                            {user.addresses && user.addresses.length > 0 ? (
                                                user.addresses.map((address) => (
                                                    <div key={address._id} className="p-4 border rounded-md bg-muted/50">
                                                        {address.fullAddress}
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No saved addresses.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="orders" className="m-0">
                                    <Card>
                                        <CardContent className="pt-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Order ID</TableHead>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {orders.map((order) => (
                                                        <TableRow key={order._id}>
                                                            <TableCell>#{(order._id as string).slice(-6).toUpperCase()}</TableCell>
                                                            <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                                                            <TableCell>{order.status}</TableCell>
                                                            <TableCell className="text-right">Rs. {order.totalAmount.toLocaleString()}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                             </div>
                        </ScrollArea>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
