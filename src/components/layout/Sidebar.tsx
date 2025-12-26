import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Languages,
  BookOpen,
  ClipboardList,
  UserCircle,
  GraduationCap,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAdmin, isTeacher, isStudent } = useAuth();

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { name: t('nav.dashboard'), path: '/admin/dashboard', icon: LayoutDashboard },
        { name: t('nav.users'), path: '/admin/users', icon: Users },
        { name: t('nav.teachers'), path: '/admin/teachers', icon: GraduationCap },
        { name: t('nav.languages'), path: '/admin/languages', icon: Languages },
        { name: t('nav.quizzes'), path: '/admin/quizzes', icon: BookOpen },
      ];
    }

    if (isTeacher) {
      return [
        { name: t('nav.dashboard'), path: '/teacher/dashboard', icon: LayoutDashboard },
        { name: t('nav.myQuizzes'), path: '/teacher/quizzes', icon: BookOpen },
        { name: t('nav.createQuiz'), path: '/teacher/quizzes/create', icon: ClipboardList },
        { name: t('nav.profile'), path: '/teacher/profile', icon: UserCircle },
      ];
    }

    if (isStudent) {
      return [
        { name: t('nav.dashboard'), path: '/student/dashboard', icon: LayoutDashboard },
        { name: t('nav.browseQuizzes'), path: '/quizzes', icon: BookOpen },
        { name: t('nav.myAttempts'), path: '/attempts', icon: ClipboardList },
        { name: t('nav.browseTeachers'), path: '/teachers', icon: GraduationCap },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-gray-200 min-h-screen',
        className
      )}
    >
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
