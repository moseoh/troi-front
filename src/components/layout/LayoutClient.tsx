'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // 초기 화면 크기 체크
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSidebarExpanded(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

      <div
        className={cn(
          'transition-all duration-300',
          isSidebarExpanded ? 'ml-64' : 'ml-16'
        )}
      >
        <Header />
        <main className="container mx-auto p-6">{children}</main>
      </div>
    </div>
  );
}
