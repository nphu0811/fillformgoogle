'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

const serviceLinks = [
  { href: '/service', label: 'Tổng quan dịch vụ' },
  { href: '/dien-form-theo-ti-le', label: 'Điền form theo tỉ lệ đáp án' },
  { href: '/dien-form-theo-data-co-truoc', label: 'Điền form theo Data' },
  { href: '/dien-form-chuan-mo-hinh-nghien-cuu', label: 'Điền form theo mô hình NCKH' },
  { href: '/dien-form-bang-ai-agent', label: 'Điền form bằng AI' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check auth status
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fallback to NextAuth session (for Google OAuth)
        fetch('/api/auth/session')
          .then(res => res.json())
          .then(session => {
            if (session?.user?.email && (session as any).dbUser) {
              const dbUser = (session as any).dbUser;
              setUser(dbUser);
              // Also sync to localStorage for consistency
              const customToken = (session as any).customToken;
              localStorage.setItem('user', JSON.stringify(dbUser));
              if (customToken) {
                localStorage.setItem('token', customToken);
              }
            }
          })
          .catch(() => {
            // Ignore errors, just means not logged in
          });
      }
    } catch (e) {
      console.error('Failed to parse user', e);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white shadow-sm border-b border-slate-200 py-3'
          : 'bg-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-700 transition-colors">
              F
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                FILLFORM
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors py-2">
                Dịch vụ
                <ChevronDown className="w-4 h-4 opacity-50" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2">
                  {serviceLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/#price"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              Báo Giá
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="btn-primary text-sm flex items-center gap-2">
                <span>Vào Dashboard</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                  Đăng nhập
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Bắt đầu miễn phí
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 absolute top-full left-0 right-0 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <Link href="/" className="block px-4 py-2 text-base font-semibold text-slate-900 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              Trang chủ
            </Link>

            <div className="px-4 py-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Dịch vụ
              </div>
              <div className="space-y-1">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/#price" className="block px-4 py-2 text-base font-semibold text-slate-900 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              Báo Giá
            </Link>

            <div className="pt-4 px-4 border-t border-slate-100 flex flex-col gap-3">
              {user ? (
                <Link href="/dashboard" className="btn-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Vào Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                  <Link href="/register" className="btn-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                    Bắt đầu miễn phí
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
