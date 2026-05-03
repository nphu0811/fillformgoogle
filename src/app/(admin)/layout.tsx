'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  LayoutDashboard,
  BarChart3,
  Search,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(stored);
    if (parsedUser.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { href: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Quản lý Users' },
    { href: '/admin/stats', icon: <BarChart3 className="w-5 h-5" />, label: 'Thống kê hệ thống' },
    { href: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Cài đặt Admin' },
    { href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Về Dashboard User' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center px-4 lg:px-6">
        <button
          className="lg:hidden p-2 hover:bg-slate-100 rounded-xl mr-2 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        <Link href="/admin/users" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
            A
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            ADMIN <span className="text-indigo-600 font-medium">PANEL</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            ADMIN ACCESS
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200">
              {user.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user.name || user.username}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">System Administrator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                item.href.startsWith('/admin') 
                  ? 'text-indigo-600 bg-indigo-50 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
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
      <main className="lg:ml-64 pt-16 p-4 lg:p-8 min-h-screen">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
