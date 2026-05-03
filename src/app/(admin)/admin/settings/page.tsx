'use client';

import { 
  Settings, 
  Shield, 
  Bell, 
  Lock, 
  Globe, 
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const sections = [
    {
      title: 'Bảo mật hệ thống',
      icon: <Shield className="w-5 h-5 text-indigo-600" />,
      items: [
        { label: 'Xác thực 2 yếu tố (Admin)', desc: 'Bắt buộc Admin phải dùng 2FA khi đăng nhập.', type: 'toggle' },
        { label: 'Giới hạn IP truy cập', desc: 'Chỉ cho phép các địa chỉ IP được chỉ định vào trang Admin.', type: 'input', placeholder: '127.0.0.1, ...' }
      ]
    },
    {
      title: 'Thông báo',
      icon: <Bell className="w-5 h-5 text-indigo-600" />,
      items: [
        { label: 'Thông báo Telegram', desc: 'Gửi thông báo lỗi hệ thống về Telegram Bot.', type: 'toggle' },
        { label: 'Cảnh báo nạp tiền lớn', desc: 'Thông báo khi có giao dịch nạp trên 1.000.000đ.', type: 'toggle' }
      ]
    },
    {
      title: 'Cấu hình AI (ChatGPT)',
      icon: <Globe className="w-5 h-5 text-indigo-600" />,
      items: [
        { label: 'Sử dụng AI tự động trả lời', desc: 'Sử dụng AI (ChatGPT/Gemini) để tự động sinh câu trả lời thay vì dùng mẫu có sẵn.', type: 'toggle', enabled: true },
        { label: 'AI Provider', desc: 'Chọn nhà cung cấp dịch vụ AI.', type: 'select', options: ['OpenAI (ChatGPT)', 'Google Gemini', 'Anthropic (Claude)'], value: 'OpenAI (ChatGPT)' },
        { label: 'Model Name', desc: 'Tên model sử dụng (vd: gpt-4o, gemini-1.5-flash).', type: 'input', value: 'gpt-4o' },
        { label: 'API Key', desc: 'Khóa kết nối bí mật của bạn.', type: 'password', value: '••••••••••••••••' },
        { label: 'System Prompt', desc: 'Hướng dẫn cho AI cách trả lời câu hỏi.', type: 'textarea', value: 'Bạn là một người tham gia khảo sát. Hãy trả lời câu hỏi một cách tự nhiên, ngắn gọn và thực tế.' }
      ]
    },
    {
      title: 'Cấu hình chung',
      icon: <Globe className="w-5 h-5 text-indigo-600" />,
      items: [
        { label: 'Phí dịch vụ mặc định', desc: 'Số credit trừ mỗi lượt điền form.', type: 'number', value: 1 },
        { label: 'Tên hệ thống', desc: 'Hiển thị trên Header và Email.', type: 'input', value: 'FillForm Enterprise' }
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-indigo-600" />
            Cài đặt hệ thống
          </h1>
          <p className="text-slate-500 mt-1">Cấu hình các tham số vận hành của toàn bộ ứng dụng.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {saveStatus === 'saving' ? (
            'Đang lưu...'
          ) : saveStatus === 'success' ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Đã lưu
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Lưu thay đổi
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              {section.icon}
              <h2 className="font-bold text-slate-900">{section.title}</h2>
            </div>
            <div className="p-8 space-y-8">
              {section.items.map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="max-w-md">
                    <p className="font-bold text-slate-800">{item.label}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {item.type === 'toggle' ? (
                      <button className={`w-12 h-6 ${item.enabled !== false ? 'bg-indigo-600' : 'bg-slate-200'} rounded-full relative p-1 transition-colors`}>
                        <div className={`absolute ${item.enabled !== false ? 'right-1' : 'left-1'} top-1 w-4 h-4 bg-white rounded-full shadow-sm`}></div>
                      </button>
                    ) : item.type === 'select' ? (
                      <select className="w-full md:w-64 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        {item.options?.map((opt: string) => <option key={opt}>{opt}</option>)}
                      </select>
                    ) : item.type === 'textarea' ? (
                      <textarea 
                        defaultValue={item.value}
                        rows={3}
                        className="w-full md:w-64 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    ) : (
                      <input 
                        type={item.type} 
                        defaultValue={item.value}
                        placeholder={item.placeholder}
                        className="w-full md:w-64 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    )}                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900">Lưu ý quan trọng</p>
          <p className="text-sm text-amber-700 mt-1">Các thay đổi trong phần cài đặt này sẽ có hiệu lực ngay lập tức với toàn bộ người dùng trên hệ thống. Hãy cẩn trọng khi điều chỉnh các tham số bảo mật.</p>
        </div>
      </div>
    </div>
  );
}
