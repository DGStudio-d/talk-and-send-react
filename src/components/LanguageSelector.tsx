import React, { useState, useEffect } from "react";
import { useLanguage, SupportedLanguage } from "../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguages } from "../hooks/useLanguages";
import { Language } from "../api/types";

interface LanguageSelectorProps {
  variant?: "dropdown" | "buttons" | "compact";
  className?: string;
}

const LANGUAGE_CONFIG = {
  ar: {
    name: "العربية",
    englishName: "Arabic",
    flag: "🇸🇦",
    direction: "rtl" as const,
  },
  en: {
    name: "English",
    englishName: "English",
    flag: "🇺🇸",
    direction: "ltr" as const,
  },
  es: {
    name: "Español",
    englishName: "Spanish",
    flag: "🇪🇸",
    direction: "ltr" as const,
  },
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "dropdown",
  className = "",
}) => {
  const { language, setLanguage, t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Get languages from API
  const { data: languages = [], loading } = useLanguages();

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    console.log(`Changing language from ${language} to ${newLanguage}`);
    setLanguage(newLanguage);
    setIsOpen(false);

    // Force a small delay to ensure state updates
    setTimeout(() => {
      console.log(`Language changed successfully to: ${newLanguage}`);
    }, 100);
  };

  const currentLanguageConfig = LANGUAGE_CONFIG[language];

  if (variant === "buttons") {
    return (
      <div className={`language-selector-buttons ${className}`}>
        <div className="flex flex-wrap gap-2">
          {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
            <Button
              key={code}
              onClick={() => handleLanguageChange(code as SupportedLanguage)}
              variant={language === code ? "default" : "outline"}
              size="sm"
              className="transition-all duration-300"
            >
              <span className="mr-1">{config.flag}</span>
              {config.name}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`language-selector-compact ${className}`}
          >
            <Globe className="h-4 w-4 mr-1" />
            <span className="mr-1">{currentLanguageConfig.flag}</span>
            <span className="text-sm font-medium">
              {language.toUpperCase()}
            </span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={dir === "rtl" ? "end" : "start"}
          className="w-48"
        >
          {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLanguageChange(code as SupportedLanguage)}
              className={`cursor-pointer ${
                language === code ? "bg-accent" : ""
              }`}
            >
              <span className="mr-2">{config.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{config.name}</span>
                <span className="text-xs text-muted-foreground">
                  {config.englishName}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`language-selector ${className} min-w-[120px] justify-between`}
        >
          <div className="flex items-center">
            <span className="mr-2">{currentLanguageConfig.flag}</span>
            <span>{currentLanguageConfig.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={dir === "rtl" ? "end" : "start"}
        className="w-48"
      >
        {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as SupportedLanguage)}
            className={`cursor-pointer ${language === code ? "bg-accent" : ""}`}
          >
            <span className="mr-3">{config.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{config.name}</span>
              <span className="text-xs text-muted-foreground">
                {config.englishName}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
