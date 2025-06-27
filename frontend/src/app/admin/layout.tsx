'use client';

import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { LayoutDashboard, ShoppingBag, CreditCard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading, logout } = useAdminAuth();
    const pathname = usePathname();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isAdmin && pathname !== '/admin') {
        return null;
    }
    
    if (pathname === '/admin') {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-muted/40">
                <Sidebar className="border-r">
                    <SidebarHeader>
                         <h2 className="text-xl font-semibold px-2">PRAMILA</h2>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/admin/dashboard" legacyBehavior passHref>
                                    <SidebarMenuButton isActive={pathname === '/admin/dashboard'}>
                                        <LayoutDashboard />
                                        Dashboard
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link href="/admin/products" legacyBehavior passHref>
                                    <SidebarMenuButton isActive={pathname.startsWith('/admin/products')}>
                                        <ShoppingBag />
                                        Products
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link href="/admin/orders" legacyBehavior passHref>
                                     <SidebarMenuButton isActive={pathname.startsWith('/admin/orders')}>
                                        <ShoppingBag />
                                        Orders
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <Link href="/admin/payments" legacyBehavior passHref>
                                     <SidebarMenuButton isActive={pathname.startsWith('/admin/payments')}>
                                        <CreditCard />
                                        Payments
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                         <SidebarMenu>
                             <SidebarMenuItem>
                                <SidebarMenuButton onClick={logout}>
                                    <LogOut />
                                    Logout
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 p-6 sm:p-8">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminAuthProvider>
    );
}
