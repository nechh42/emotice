import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'tr', name: '🇹🇷 Türkçe', flag: '🇹🇷' },
  { code: 'en', name: '🇺🇸 English', flag: '🇺🇸' },
  { code: 'es', name: '🇪🇸 Español', flag: '🇪🇸' },
  { code: 'fr', name: '🇫🇷 Français', flag: '🇫🇷' },
  { code: 'de', name: '🇩🇪 Deutsch', flag: '🇩🇪' },
  { code: 'it', name: '🇮🇹 Italiano', flag: '🇮🇹' },
  { code: 'pt', name: '🇵🇹 Português', flag: '🇵🇹' },
  { code: 'zh', name: '🇨🇳 中文', flag: '🇨🇳' },
  { code: 'ja', name: '🇯🇵 日本語', flag: '🇯🇵' },
  { code: 'ar', name: '🇸🇦 العربية', flag: '🇸🇦' }
];

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  
  // Initialize language from localStorage on component mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[1]; // Default to English

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`cursor-pointer ${
              currentLanguage.code === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm">{language.name.split(' ')[1]}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};