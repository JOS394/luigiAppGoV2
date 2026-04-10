import React from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-base-200/50">
      <Sidebar />
      <main className="flex-grow transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-x-hidden">
        <div className="p-2 sm:p-4 md:p-6 h-full">
          {children}
        </div>
      </main>
      <Toaster position="top-right" expand={true} richColors />
    </div>
  );
};
