import { getOrders } from '@/lib/orders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';


function getStatusVariant(status: OrderStatus) {
    // Assuming payment status mirrors order status for this implementation
    switch (status) {
        case 'Delivered':
        case 'Shipped':
        case 'Processing':
            return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100';
        case 'Cancelled':
            return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100';
        case 'Pending':
        default:
            return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100';
    }
}

function getPaymentStatusText(status: OrderStatus) {
    switch (status) {
         case 'Delivered':
        case 'Shipped':
        case 'Processing':
            return 'Paid';
        case 'Cancelled':
            return 'Refunded';
        case 'Pending':
        default:
            return 'Pending';
    }
}

export default async function AdminPaymentsPage() {
    const orders = await getOrders();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">View Payments</h1>
            <Card>
                 <CardHeader>
                    <CardTitle>All Payments</CardTitle>
                    <CardDescription>A list of all payments received from orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {orders.length > 0 ? (
                                orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-medium text-xs">#{order._id.slice(-6).toUpperCase()}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.userId.firstName} {order.userId.lastName}</div>
                                            <div className="text-xs text-muted-foreground">{order.userId.email}</div>
                                        </TableCell>
                                        <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn('capitalize', getStatusVariant(order.status))}>
                                                {getPaymentStatusText(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            Rs. {order.totalAmount.toLocaleString('en-IN')}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No payments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
