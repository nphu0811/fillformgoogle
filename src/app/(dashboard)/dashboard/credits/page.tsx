'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';

export default function CreditsPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Quản lý Credit</h1>

      {/* Balance Card */}
      <div className="bg-gradient-premium rounded-3xl p-10 text-white mb-10 shadow-lg shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[50px] -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-6">
          <div>
            <p className="text-white/80 font-medium text-sm mb-2 uppercase tracking-wider">Số dư hiện tại</p>
            <p className="text-5xl font-extrabold mb-2">{user?.credits || 0} <span className="text-xl font-medium text-white/80">credits</span></p>
            <p className="text-white/70 font-medium bg-white/10 inline-block px-3 py-1 rounded-lg backdrop-blur-sm">
              ~ {((user?.credits || 0) * 350).toLocaleString('vi-VN')} VND
            </p>
          </div>
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Top Up */}
        <div className="glass-card rounded-3xl p-8 border-white/60 md:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Nạp thêm Credit</h2>
          <p className="text-slate-500 font-medium mb-8">
            Liên hệ Fanpage FillForm để nạp credit. Đơn giá: <span className="text-primary font-bold">350đ / 1 credit</span> (1 câu trả lời).
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { credits: 100, price: '35.000', popular: false },
              { credits: 500, price: '175.000', popular: true },
              { credits: 1000, price: '350.000', popular: false },
              { credits: 5000, price: '1.750.000', popular: false },
            ].map((p) => (
              <a
                key={p.credits}
                href="https://github.com/nphu0811"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative p-6 border rounded-2xl transition-all text-center group ${
                  p.popular 
                    ? 'border-primary bg-indigo-50/30 hover:bg-indigo-50/80 shadow-sm' 
                    : 'border-slate-200 hover:border-primary hover:bg-slate-50'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-premium text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Phổ biến
                  </div>
                )}
                <p className={`text-2xl font-extrabold transition-colors ${p.popular ? 'text-primary' : 'text-slate-800 group-hover:text-primary'}`}>{p.credits}</p>
                <p className="text-sm font-medium text-slate-500 mb-2">credits</p>
                <div className="w-12 h-1 bg-slate-100 mx-auto my-3 rounded-full"></div>
                <p className="text-base font-bold text-slate-900">{p.price} <span className="text-sm font-medium text-slate-500">VND</span></p>
              </a>
            ))}
          </div>
        </div>

        {/* Referral Code */}
        <div className="glass-card rounded-3xl p-8 border-white/60">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Mã giới thiệu</h2>
          <p className="text-slate-500 font-medium mb-6">
            Chia sẻ mã để nhận 50 credit miễn phí khi bạn bè đăng ký.
          </p>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center mb-4">
            <span className="block text-2xl font-mono font-extrabold text-primary tracking-widest mb-4">{user?.referralCode || 'N/A'}</span>
            <button
              onClick={() => navigator.clipboard.writeText(user?.referralCode || '')}
              className="btn-premium w-full py-3"
            >
              Sao chép mã
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
