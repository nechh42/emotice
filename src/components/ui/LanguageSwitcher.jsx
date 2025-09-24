import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher = ({ variant = 'default', className = '' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Available languages
  const languages = [
    {
      code: 'tr',
      name: 'Türkçe',
      nativeName: 'Türkçe',
      flag: '🇹🇷'
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Update document lang attribute
    document.documentElement.lang = languageCode;
    
    // Update document direction for RTL languages
    const rtlLanguages = ['ar', 'he'];
    document.documentElement.dir = rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
    
    // Store preference
    localStorage.setItem('i18nextLng', languageCode);
  };

  // Keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  // Compact variant (for mobile/small spaces)
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Change language"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-lg" role="img" aria-label={currentLanguage.name}>
            {currentLanguage.flag}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                    language.code === i18n.language ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                  }`}
                  role="menuitem"
                >
                  <span className="mr-2 text-base" role="img" aria-label={language.name}>
                    {language.flag}
                  </span>
                  <span className="font-medium">{language.nativeName}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Icon variant (just globe icon)
  if (variant === 'icon') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Change language"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Globe className="w-5 h-5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                    language.code === i18n.language ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                  }`}
                  role="menuitem"
                >
                  <span className="mr-3 text-base" role="img" aria-label={language.name}>
                    {language.flag}
                  </span>
                  <div>
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-gray-500">{language.name}</div>
                  </div>
                  {language.code === i18n.language && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant (full dropdown)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-base" role="img" aria-label={currentLanguage.name}>
          {currentLanguage.flag}
        </span>
        <span>{currentLanguage.nativeName}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`flex items-center w-full px-4 py-3 text-sm text-left hover:bg-gray-100 transition-colors ${
                  language.code === i18n.language ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                }`}
                role="menuitem"
              >
                <span className="mr-3 text-lg" role="img" aria-label={language.name}>
                  {language.flag}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-gray-500">{language.name}</div>
                </div>
                {language.code === i18n.language && (
                  <div className="ml-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;