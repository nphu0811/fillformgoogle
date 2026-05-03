'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  History,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
      return;
    }

    // No localStorage user — check NextAuth session (for Google OAuth)
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(session => {
        if (session?.user?.email && (session as any).dbUser) {
          // Sync NextAuth session to localStorage
          const dbUser = (session as any).dbUser;
          const customToken = (session as any).customToken;
          localStorage.setItem('user', JSON.stringify(dbUser));
          if (customToken) {
            localStorage.setItem('token', customToken);
          }
          setUser(dbUser);
        } else {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also clear NextAuth session (for Google OAuth users)
    try { await fetch('/api/auth/signout', { method: 'POST' }); } catch {}
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { href: '/dashboard/forms', icon: <FileText className="w-5 h-5" />, label: 'Quản lý Form' },
    { href: '/dashboard/history', icon: <History className="w-5 h-5" />, label: 'Lịch sử điền' },
    { href: '/dashboard/credits', icon: <CreditCard className="w-5 h-5" />, label: 'Credit' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner border-primary border-t-transparent w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-nav z-40 flex items-center px-4 lg:px-6">
        <button
          className="lg:hidden p-2 hover:bg-slate-100/50 rounded-xl mr-2 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-8 relative">
            <div className="absolute inset-0 bg-gradient-premium rounded opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-sm">F</div>
          </div>
          <span className="text-base font-bold tracking-tight">
            <span className="text-primary">FILL</span>
            <span className="text-slate-800">FORM</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white/60 border border-indigo-100 px-4 py-1.5 rounded-full shadow-sm">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">{user.credits} <span className="font-medium text-slate-500">credits</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-slate-700">{user.name || user.username}</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 glass-panel border-r border-slate-200/50 z-30 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>
        <nav className="p-4 space-y-1 relative z-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm rounded-xl transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          {user.role === 'ADMIN' && (
            <Link
              href="/admin/users"
              className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl transition-all duration-200 mt-2 border border-indigo-100/50"
              onClick={() => setSidebarOpen(false)}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Trang Admin</span>
            </Link>
          )}

          <hr className="my-4 border-slate-200/50" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-rose-500 hover:bg-rose-50/50 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 p-6 lg:p-10 min-h-screen">
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}
