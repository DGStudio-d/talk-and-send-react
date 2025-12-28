import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import { Button } from "../ui/button";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, dir } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.professors"), path: "/professors" },
    { name: t("nav.languages"), path: "/languages" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <nav
      className="bg-white shadow-md sticky top-0 z-50"
      
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between " >

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

            {/* REGISTER BUTTON */}
            <Button
              asChild
              className="bg-academy-green hover:bg-opacity-90"
            >
              <Link to="/register">{t("button.register")}</Link>
            </Button>

            {/* LANGUAGE SWITCHER */}
            <LanguageSwitcher />
          </div>

          {/* MOBILE CONTROLS */}
          {/* gap-2 ensures correct spacing for Switcher and Menu Button */}
          <div className="md:hidden flex items-center gap-2 " >
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

            <Button
              asChild
              className="w-full bg-academy-green hover:bg-opacity-90 mt-2"
              onClick={() => setIsOpen(false)}
            >
              <Link to="/register">{t("button.register")}</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;