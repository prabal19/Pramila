'use client';

import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ShoppingBag, CreditCard, LogOut, Users, PictureInPicture , MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading, logout } = useAdminAuth();
    const pathname = usePathname();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isAdmin && pathname !== '/admin') {
        // The auth context will redirect. In the meantime, show nothing.
        return null;
    }
    
    // The /admin route is the login page, which doesn't have the sidebar layout.
    if (pathname === '/admin') {
        return <>{children}</>;
    }

    // All other authenticated admin routes get the full layout.
    return (
        <SidebarProvider className="bg-muted/40">
            <Sidebar className="border-r">
                <SidebarHeader>
                     <h2 className="text-xl font-semibold px-2">PRAMILA</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'}>
                                <Link href="/admin/dashboard">
                                    <LayoutDashboard />
                                    Dashboard
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/products')}>
                                <Link href="/admin/products">
                                    <ShoppingBag />
                                    Products
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/users')}>
                                <Link href="/admin/users">
                                    <Users />
                                    Users
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/orders')}>
                                 <Link href="/admin/orders">
                                    <ShoppingBag />
                                    Orders                                 
                                 </Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/requests')}>
                                <Link href="/admin/requests">
                                    <MessageSquareQuote />
                                    Requests
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/banners')}>
                                <Link href="/admin/banners">
                                    <PictureInPicture />
                                    Banners
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/payments')}>
                                 <Link href="/admin/payments">
                                    <CreditCard />
                                    Payments
                                 </Link>
                            </SidebarMenuButton>
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
            <SidebarInset className="flex-1 p-6 sm:p-8">
                {children}
            </SidebarInset>
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
