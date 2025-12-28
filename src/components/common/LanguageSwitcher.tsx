
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languageOptions: { code: SupportedLanguage, name: string, flag: string, isRtl: boolean }[] = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦', isRtl: true },
    { code: 'en', name: 'English', flag: '🇺🇸', isRtl: false },
    { code: 'es', name: 'Español', flag: '🇪🇸', isRtl: false }
  ];

  // Find current language details
  const currentLanguage = languageOptions.find(option => option.code === language);

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    if (import.meta.env.DEV) {
      console.log(`LanguageSwitcher: Changing language from ${language} to ${newLanguage}`);
    }
    setLanguage(newLanguage);
    setIsOpen(false);
    
    // Force a small delay to ensure state updates and re-render
    setTimeout(() => {
      if (import.meta.env.DEV) {
        console.log(`LanguageSwitcher: Language changed successfully to: ${newLanguage}`);
      }
      // Force a re-render by triggering a layout recalculation
      document.body.offsetHeight;
    }, 50);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-background transition-all duration-300"
        >
          <Globe className="h-4 w-4" />
          <span>{currentLanguage?.flag}</span>
          <span className="hidden md:inline">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={dir === 'rtl' ? 'start' : 'end'} 
        className="w-40 bg-background"
      >
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => handleLanguageChange(option.code)}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              language === option.code ? 'bg-accent' : ''
            }`}
          >
            <span>{option.flag}</span>
            <span>{option.name}</span>
            {language === option.code && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
