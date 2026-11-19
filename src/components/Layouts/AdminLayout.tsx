'use client';
import type { ReactNode } from 'react';

import { DsSidebarInset, DsSidebarProvider } from '../Sidebar';
import { AdminHeader } from './Admin/AdminHeader';
import { AdminSidebar } from './Admin/AdminSidebar';

/**
 * Admin shell: collapsible sidebar (Ctrl+B, icon mode on desktop, drawer on
 * phones), sticky header with breadcrumb, ⌘K search, theme and notifications.
 * Navigation comes from NAV_SECTIONS in `src/constants/portal-nav.ts`.
 */
export const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <DsSidebarProvider>
      <AdminSidebar />
      <DsSidebarInset>
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</main>
      </DsSidebarInset>
    </DsSidebarProvider>
  );
};
