import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, User, BarChart3, Crown, LogOut, Users, Brain } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSelector } from '@/components/LanguageSelector';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-primary p-2 rounded-xl shadow-primary group-hover:scale-110 transition-all duration-300">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Emotice</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`transition-colors ${isActive('/') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-1 transition-colors ${isActive('/dashboard') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>{t('nav.dashboard')}</span>
              </Link>
              <Link 
                to="/analytics" 
                className={`flex items-center space-x-1 transition-colors ${isActive('/analytics') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>{t('nav.analytics')}</span>
              </Link>
              <Link 
                to="/community" 
                className={`flex items-center space-x-1 transition-colors ${isActive('/community') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Users className="h-4 w-4" />
                <span>{t('nav.community')}</span>
              </Link>
              <Link 
                to="/mindfulness" 
                className={`flex items-center space-x-1 transition-colors ${isActive('/mindfulness') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Brain className="h-4 w-4" />
                <span>{t('nav.mindfulness')}</span>
              </Link>
              <Link 
                to="/premium" 
                className={`flex items-center space-x-1 transition-colors ${isActive('/premium') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Crown className="h-4 w-4" />
                <span>{t('nav.premium')}</span>
              </Link>
              <Link 
                to="/profile" 
                className={`flex items-center space-x-1 transition-colors ${isActive('/profile') ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary'}`}
              >
                <User className="h-4 w-4" />
                <span>{t('nav.profile')}</span>
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <LanguageSelector />
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button variant="ghost" size="icon" onClick={signOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => openAuth('login')}>
                    {t('nav.login')}
                  </Button>
                  <Button variant="hero" onClick={() => openAuth('signup')}>
                    {t('landing.startJourney')}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`px-2 py-1 transition-colors ${isActive('/') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center space-x-2 px-2 py-1 transition-colors ${isActive('/dashboard') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>{t('nav.dashboard')}</span>
                </Link>
                <Link 
                  to="/analytics" 
                  className={`flex items-center space-x-2 px-2 py-1 transition-colors ${isActive('/analytics') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>{t('nav.analytics')}</span>
                </Link>
                <Link 
                  to="/community" 
                  className={`flex items-center space-x-2 px-2 py-1 transition-colors ${isActive('/community') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="h-4 w-4" />
                  <span>{t('nav.community')}</span>
                </Link>
                <Link 
                  to="/mindfulness" 
                  className={`flex items-center space-x-2 px-2 py-1 transition-colors ${isActive('/mindfulness') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Brain className="h-4 w-4" />
                  <span>{t('nav.mindfulness')}</span>
                </Link>
                <Link 
                  to="/premium" 
                  className={`flex items-center space-x-2 px-2 py-1 transition-colors ${isActive('/premium') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Crown className="h-4 w-4" />
                  <span>{t('nav.premium')}</span>
                </Link>
                <Link 
                  to="/profile" 
                  className={`flex items-center space-x-2 px-2 py-1 transition-colors ${isActive('/profile') ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>{t('nav.profile')}</span>
                </Link>
                <div className="pt-4 border-t border-white/20 flex flex-col space-y-2">
                  {user ? (
                    <>
                      <div className="px-2 py-1 text-sm text-muted-foreground">
                        Welcome, {user.user_metadata?.full_name || user.email}
                      </div>
                      <Button variant="ghost" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" onClick={() => { openAuth('login'); setIsMenuOpen(false); }}>
                        {t('nav.login')}
                      </Button>
                      <Button variant="hero" onClick={() => { openAuth('signup'); setIsMenuOpen(false); }}>
                        {t('landing.startJourney')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </>
  );
};