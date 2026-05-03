'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Minus, 
  CreditCard, 
  Mail, 
  User as UserIcon,
  ChevronRight,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  credits: number;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchUsers = async (query = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const handleUpdateCredits = async (action: 'add' | 'remove') => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${selectedUser.id}/credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: creditAmount,
          action
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        // Update local state
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, credits: data.credits } : u));
        setTimeout(() => {
          setModalOpen(false);
          setSelectedUser(null);
          setMessage(null);
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi kết nối server' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            Quản lý Người dùng
          </h1>
          <p className="text-slate-500 mt-1">Xem danh sách tài khoản và quản lý số dư credit của hệ thống.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm kiếm email, tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <button type="submit" className="hidden">Tìm</button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 bg-slate-100 rounded-lg w-full"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-md w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-md w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-md w-24"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 rounded-md w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name || user.username}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-600">
                        <CreditCard className="w-4 h-4" />
                        {user.credits.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Cấp Credit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !isSubmitting && setModalOpen(false)}
          />
          
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Quản lý Credit</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <UserIcon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900">{selectedUser.name || selectedUser.username}</h4>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs text-slate-600 font-medium">
                  Số dư hiện tại: <span className="font-bold text-indigo-600">{selectedUser.credits.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Số lượng Credit thay đổi</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                    className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    PTS
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message.text}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={() => handleUpdateCredits('remove')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                  >
                    <Minus className="w-5 h-5" />
                    Trừ Bớt
                  </button>
                  <button
                    onClick={() => handleUpdateCredits('add')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Thêm Vào
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
