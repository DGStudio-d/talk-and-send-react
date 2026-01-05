import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { authService } from "@/api/services/authService";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.professors"), path: "/professors" },
    { name: t("nav.languages"), path: "/languages" },
    { name: t("nav.quizzes"), path: "/quizzes" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  const getUserDashboardPath = () => {
    if (!user) return "/dashboard";

    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between ">
          {/* LOGO */}
          {/* Added flex-shrink-0 to ensure logo never gets squashed on small screens */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <Logo />
          </Link>

          {/* DESKTOP MENU */}
          {/* gap-6 ensures correct spacing for both LTR and RTL */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                  location.pathname === link.path
                    ? "text-academy-green border-academy-green"
                    : "text-gray-700 border-transparent hover:text-academy-green"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* AUTHENTICATION SECTION */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={getUserDashboardPath()}>
                      {t("nav.dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">{t("nav.profile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">{t("nav.settings")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/register">{t("button.register")}</Link>
                </Button>
              </div>
            )}

            {/* LANGUAGE SWITCHER */}
            <LanguageSwitcher />
          </div>

          {/* MOBILE CONTROLS */}
          {/* gap-2 ensures correct spacing for Switcher and Menu Button */}
          <div className="md:hidden flex items-center gap-2 ">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-academy-green hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? "text-academy-green bg-gray-50"
                    : "text-gray-700 hover:bg-gray-50 hover:text-academy-green"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* AUTHENTICATION BUTTONS */}
            {user ? (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <Link
                  to={getUserDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  {t("nav.dashboard")}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  {t("nav.profile")}
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  {t("nav.settings")}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/register">{t("button.register")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
