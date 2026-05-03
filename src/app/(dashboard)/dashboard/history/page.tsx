'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, ExternalLink, Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const [fillJobs, setFillJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch('/api/fill-jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setFillJobs(data.fillJobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleDeleteJob = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/fill-jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setFillJobs(prev => prev.filter(j => j.id !== id));
      } else {
        const data = await res.json();
        window.alert('Lỗi xóa: ' + (data.error || 'Không xác định'));
      }
    } catch (err: any) {
      console.error('Delete job error:', err);
      window.alert('Lỗi hệ thống: ' + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700"><CheckCircle className="w-3 h-3" /> Hoàn thành</span>;
      case 'RUNNING':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700"><Loader2 className="w-3 h-3 animate-spin" /> Đang chạy</span>;
      case 'FAILED':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Lỗi</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-700"><Clock className="w-3 h-3" /> Chờ</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lịch sử điền form</h1>
          <p className="text-slate-500 mt-1">Danh sách các tiến trình automation đã thực hiện</p>
        </div>
      </div>

      {fillJobs.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center border-dashed border-2 border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có lịch sử</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">Lịch sử điền form sẽ hiển thị ở đây sau khi bạn bắt đầu điền tự động.</p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border-white/60 shadow-sm hover:shadow-md transition-shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Form</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Số lượng</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {fillJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-700">{job.form?.title || 'N/A'}</td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600">
                      {job.completedCount} <span className="text-slate-400">/</span> {job.responseCount}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(job.status)}</td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500">{new Date(job.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="py-4 px-6 text-right">
                      {job.form?.googleFormUrl && (
                        <a href={job.form.googleFormUrl} target="_blank" rel="noopener noreferrer" className="inline-flex p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob(job.id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                        title="Xóa lịch sử"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>XÓA</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
