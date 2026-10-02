'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Building2, Menu, X } from 'lucide-react';

export function Navigation() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Staffly</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Pricing
            </a>
            <a 
              href="#testimonials" 
              className="text-slate-600 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Reviews
            </a>
            <Button 
              onClick={handleLogin}
              className="bg-primary hover:bg-primary/90"
            >
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-slate-200">
              <a
                href="#features"
                className="block px-3 py-2 text-slate-600 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-slate-600 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-slate-600 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Reviews
              </a>
              <div className="px-3 py-2">
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
