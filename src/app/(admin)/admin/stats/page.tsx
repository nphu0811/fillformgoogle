'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  Loader2
} from 'lucide-react';

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, let's mock it or fetch a simplified version
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setStats({
          totalUsers: 1254,
          activeForms: 842,
          totalCredits: 452000,
          revenue: '12,500,000đ',
          userGrowth: '+12%',
          creditUsage: '+5%'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: 'Tổng người dùng', value: stats.totalUsers, icon: <Users />, color: 'bg-blue-500', growth: stats.userGrowth },
    { label: 'Form đang chạy', value: stats.activeForms, icon: <FileText />, color: 'bg-emerald-500', growth: '+8%' },
    { label: 'Tổng Credit hệ thống', value: stats.totalCredits.toLocaleString(), icon: <CreditCard />, color: 'bg-indigo-500', growth: stats.creditUsage },
    { label: 'Doanh thu (Ước tính)', value: stats.revenue, icon: <TrendingUp />, color: 'bg-amber-500', growth: '+15%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
          Thống kê hệ thống
        </h1>
        <p className="text-slate-500 mt-1">Tổng quan về hiệu suất và quy mô của FillForm.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl text-white ${card.color} shadow-lg shadow-inner`}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-bold">
                <ArrowUpRight className="w-3 h-3" />
                {card.growth}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-900">Biểu đồ tăng trưởng</h4>
          <p className="text-sm text-slate-500 max-w-xs mt-1">Tính năng này đang được phát triển để cung cấp cái nhìn chi tiết theo thời gian thực.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-900">Hoạt động gần đây</h4>
          <p className="text-sm text-slate-500 max-w-xs mt-1">Lịch sử các hoạt động quan trọng của hệ thống sẽ được hiển thị tại đây.</p>
        </div>
      </div>
    </div>
  );
}
