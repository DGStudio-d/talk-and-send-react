import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useLocaleQuery } from "@/hooks/useLocaleQuery";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Languages,
  CreditCard,
  FileText,
  LogOut,
} from "lucide-react";
import { useLogout } from "@/services";

const AdminDashboardLayout: React.FC = () => {
  const location = useLocation();
  const { linkTo } = useLocaleQuery();
  const { t, dir } = useLanguage();
  const logout = useLogout();

  const nav = [
    {
      to: linkTo("/admin"),
      label: t("admin.dashboard.overview"),
      icon: LayoutDashboard,
    },
    { to: linkTo("/admin/users"), label: t("admin.nav.users"), icon: Users },
    {
      to: linkTo("/admin/quizzes"),
      label: t("admin.nav.quizzes"),
      icon: FileText,
    },
    {
      to: linkTo("/admin/languages"),
      label: t("admin.nav.languages"),
      icon: Languages,
    },
    {
      to: linkTo("/admin/subscriptions"),
      label: t("admin.nav.settings"),
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <div className="mb-4">
            <div className="text-lg font-bold">
              {t("admin.dashboard.title")}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("admin.dashboard.manageSystemDesc")}
            </div>
          </div>
          <Separator className="my-4" />
          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                location.pathname ===
                new URL(item.to, window.location.origin).pathname;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-academy-green/10 text-academy-green"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4" />
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => logout.mutate()}
          >
            <LogOut className="h-4 w-4 me-2" />
            {t("nav.logout")}
          </Button>
        </aside>

        <main className="flex-1">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
