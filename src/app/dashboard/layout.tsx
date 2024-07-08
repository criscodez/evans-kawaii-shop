import Header from '@/components/dashboard/layout/header';
import Sidebar from '@/components/dashboard/layout/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evans Kawaii Shop',
  description: 'Aplicación web para la gestión de ventas e inventario en la tienda Evans Kawaii Shop.'
};

export default function DashboardLayout({
  children
}: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}