import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

/**
 * MainLayout component that wraps content with Header and optional Sidebar
 * Supports RTL layout direction
 * Adds container with proper padding
 * Includes skip link for keyboard navigation
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children, showSidebar = true }) => {
  const { direction } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50" dir={direction}>
      {/* Header with navigation */}
      <Header />

      <div className="flex">
        {/* Sidebar - only show if authenticated and showSidebar is true */}
        {isAuthenticated && showSidebar && <Sidebar />}

        {/* Main content area with proper padding */}
        <main
          id="main-content"
          className="flex-1 container mx-auto px-4 py-6 md:py-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
