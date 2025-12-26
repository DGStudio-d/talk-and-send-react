import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavLogo } from '@/hooks/useResponsiveLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const { user, isAuthenticated, isAdmin, isTeacher, isStudent, logout } = useAuth();
  const { size, variant } = useNavLogo();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Define role-specific navigation menu items
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [];
    }

    if (isStudent) {
      return [
        { name: t('nav.dashboard'), path: '/student/dashboard' },
        { name: t('nav.browseQuizzes'), path: '/quizzes' },
        { name: t('nav.myAttempts'), path: '/attempts' },
        { name: t('nav.browseTeachers'), path: '/teachers' },
      ];
    }

    if (isTeacher) {
      return [
        { name: t('nav.dashboard'), path: '/teacher/dashboard' },
        { name: t('nav.myQuizzes'), path: '/teacher/quizzes' },
        { name: t('nav.createQuiz'), path: '/teacher/quizzes/create' },
        { name: t('nav.browseTeachers'), path: '/teachers' },
      ];
    }

    if (isAdmin) {
      return [];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav
      className={`bg-white shadow-md sticky top-0 z-50 ${
        direction === 'rtl' ? 'text-right' : 'text-left'
      }`}
      dir={direction}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo size={size} variant={variant} isAdmin={isAdmin} />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Auth Buttons for Non-Authenticated Users */}
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t('common.login')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">{t('common.register')}</Link>
                </Button>
              </div>
            )}

            {/* User Menu */}
            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu" role="navigation" aria-label="Mobile navigation">
            <div className="pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'text-primary bg-gray-50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Auth Buttons for Non-Authenticated Users */}
              {!isAuthenticated && (
                <div className="px-3 py-2 border-t border-gray-200 mt-2 pt-2 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-center text-gray-700 hover:bg-gray-50 hover:text-primary border border-gray-300"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-center bg-primary text-white hover:bg-primary/90"
                  >
                    {t('common.register')}
                  </Link>
                </div>
              )}

              {/* Mobile User Info and Logout */}
              {isAuthenticated && user && (
                <>
                  <div className="px-3 py-2 border-t border-gray-200 mt-2 pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      {t('nav.profile')}
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      {t('common.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
