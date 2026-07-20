import React from 'react';
import './globals.css';
import { ClientLayout } from '../components/ClientLayout';

export const metadata = {
  title: 'Discord Bot Control Center',
  description: 'Enterprise Discord Bot Control Center Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
