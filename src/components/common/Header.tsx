import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  BookOpen,
  Languages,
  Users,
  Phone,
  Home,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrentUser, useLogout } from "@/services";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocaleQuery, withLocale } from "@/hooks/useLocaleQuery";

interface HeaderProps {
  variant?: "default" | "transparent" | "solid";
}

export const Header: React.FC<HeaderProps> = ({ variant = "default" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, dir, language, setLanguage } = useLanguage();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useLocaleQuery();

  const navLinks = [
    { name: t("nav.home"), path: "/", icon: Home },
    { name: t("nav.professors"), path: "/professors", icon: Users },
    { name: t("nav.quizzes"), path: "/quizzes", icon: BookOpen },
    { name: t("nav.contact"), path: "/contact", icon: Phone },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    document.getElementsByTagName("body")[0]?.setAttribute("dir", dir);
    // Add any additional effects here if needed
  }, [dir]);

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  const withCurrentLocale = (path: string) => withLocale(path, locale);

  const isActivePath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getHeaderClasses = () => {
    const baseClasses =
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300";

    if (variant === "transparent") {
      return `${baseClasses} ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`;
    }

    if (variant === "solid") {
      return `${baseClasses} bg-white shadow-md`;
    }

    return `${baseClasses} bg-white/95 backdrop-blur-sm shadow-sm ${
      isScrolled ? "shadow-md" : ""
    }`;
  };

  return (
    <header
      className={getHeaderClasses()}
      dir={dir}
      data-direction={dir}
      data-language={language}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={withCurrentLocale("/")}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-academy-green rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Academy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActivePath(link.path);

              return (
                <Link
                  key={link.path}
                  to={withCurrentLocale(link.path)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-academy-green ${
                    isActive ? "text-academy-green" : "text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="hidden md:block">
              <DropdownMenu dir={dir}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Languages className="h-4 w-4" />
                    <ChevronDown className="h-3 w-3 ms-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={dir === "rtl" ? "end" : "start"}
                  className="w-56"
                >
                  <DropdownMenuItem
                    onClick={() => setLanguage("ar")}
                    className={
                      language === "ar"
                        ? "bg-academy-green/10 text-academy-green"
                        : ""
                    }
                  >
                    🇸🇦 العربية
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage("en")}
                    className={
                      language === "en"
                        ? "bg-academy-green/10 text-academy-green"
                        : ""
                    }
                  >
                    🇬🇧 English
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage("es")}
                    className={
                      language === "es"
                        ? "bg-academy-green/10 text-academy-green"
                        : ""
                    }
                  >
                    🇪🇸 Español
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User Actions */}
            {user ? (
              <DropdownMenu dir={dir}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-academy-green rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:block">{user.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === "rtl" ? "end" : "start"}>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 me-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate(withCurrentLocale("/register"))}
                  className="bg-academy-green hover:bg-opacity-90"
                >
                  {t("nav.register")}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={withCurrentLocale(link.path)}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(link.path)
                        ? "text-academy-green bg-academy-green/10"
                        : "text-gray-700 hover:text-academy-green hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Language Switcher */}
              <div className="pt-2 border-t">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {t("nav.language")}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setLanguage("ar");
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      language === "ar"
                        ? "text-academy-green bg-academy-green/10"
                        : "text-gray-700 hover:text-academy-green hover:bg-gray-50"
                    }`}
                  >
                    <span>🇸🇦</span>
                    <span>العربية</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      language === "en"
                        ? "text-academy-green bg-academy-green/10"
                        : "text-gray-700 hover:text-academy-green hover:bg-gray-50"
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("es");
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      language === "es"
                        ? "text-academy-green bg-academy-green/10"
                        : "text-gray-700 hover:text-academy-green hover:bg-gray-50"
                    }`}
                  >
                    <span>🇪🇸</span>
                    <span>Español</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
