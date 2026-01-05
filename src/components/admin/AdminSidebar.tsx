
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Languages, 
  UserPlus, 
  Settings,
  BookOpen,
  FileText,
  Upload,
  BarChart3,
  Shield
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const AdminSidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      name: t('admin.nav.overview'), 
      path: "/admin", 
      icon: Home 
    },
    { 
      name: t('admin.nav.users'), 
      path: "/admin/users", 
      icon: Users 
    },
    { 
      name: t('admin.nav.teachers'), 
      path: "/admin/teachers", 
      icon: UserPlus 
    },
    { 
      name: t('admin.nav.languages'), 
      path: "/admin/languages", 
      icon: Languages 
    },
    { 
      name: t('admin.nav.courses'), 
      path: "/admin/courses", 
      icon: BookOpen 
    },
    { 
      name: t('admin.nav.quizzes'), 
      path: "/admin/quizzes", 
      icon: FileText 
    },
    { 
      name: t('admin.nav.quizImport'), 
      path: "/admin/quiz-import", 
      icon: Upload 
    },
    { 
      name: t('admin.nav.analytics'), 
      path: "/admin/analytics", 
      icon: BarChart3 
    },
    { 
      name: t('admin.nav.settings'), 
      path: "/admin/settings", 
      icon: Settings 
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] w-64 border-r bg-background">
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors ${
                active ? "bg-muted font-medium text-primary" : ""
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSidebar;
