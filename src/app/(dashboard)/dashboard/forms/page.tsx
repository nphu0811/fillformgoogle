'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  FileText,
  ExternalLink,
  ChevronRight,
  Loader2,
  Trash2,
} from 'lucide-react';

export default function FormsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const loadForms = async () => {
    try {
      const res = await fetch('/api/forms', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setForms(data.forms || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setImportError('');
    setImporting(true);
    try {
      const parseRes = await fetch('/api/forms/parse', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ googleFormUrl: importUrl }),
      });
      if (!parseRes.ok) {
        const err = await parseRes.json();
        throw new Error(err.error);
      }
      const { form: parsedForm } = await parseRes.json();
      const saveRes = await fetch('/api/forms', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          googleFormUrl: importUrl,
          googleFormId: parsedForm.formId,
          title: parsedForm.title,
          description: parsedForm.description,
          questions: parsedForm.questions,
        }),
      });
      if (!saveRes.ok) throw new Error('Không thể lưu form');
      setShowImport(false);
      setImportUrl('');
      loadForms();
    } catch (err: any) {
      setImportError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteForm = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/forms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setForms(prev => prev.filter(f => f.id !== id));
      } else {
        const data = await res.json();
        window.alert('Lỗi xóa: ' + (data.error || 'Không xác định'));
      }
    } catch (err: any) {
      console.error('Delete form error:', err);
      window.alert('Lỗi hệ thống: ' + err.message);
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
    <div className="max-w-4xl mx-auto pt-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Form</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowImport(true)} 
            className="btn-premium flex items-center gap-2 py-3 px-6 text-sm shadow-indigo-500/30 flex-1 sm:flex-none justify-center"
          >
            <Plus className="w-5 h-5" /> Thêm Form mới
          </button>
        </div>
      </div>

      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowImport(false)}></div>
          <div className="glass-card rounded-3xl p-8 w-full max-w-lg relative z-10 animate-slide-up border-white/80 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Thêm Google Form</h3>
            <p className="text-slate-500 mb-8 font-medium">Dán link Google Form của bạn, hệ thống sẽ tự động đồng bộ câu hỏi.</p>
            {importError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100 font-medium">{importError}</div>}
            <div className="mb-8">
              <input
                type="url"
                className="input-premium py-3.5"
                placeholder="https://docs.google.com/forms/d/e/..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                disabled={importing}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowImport(false)} className="px-6 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors" disabled={importing}>Hủy</button>
              <button onClick={handleImport} disabled={importing || !importUrl} className="btn-premium py-3 px-6 flex items-center gap-2 disabled:opacity-50">
                {importing ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang phân tích...</> : 'Đồng bộ Form'}
              </button>
            </div>
          </div>
        </div>
      )}

      {forms.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center border-dashed border-2 border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Chưa có Form nào</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Thêm Google Form đầu tiên của bạn để bắt đầu sử dụng công cụ tự động điền mạnh mẽ nhất.</p>
          <button onClick={() => setShowImport(true)} className="btn-premium inline-flex items-center gap-2 py-3 px-8 shadow-indigo-500/20">
            <Plus className="w-5 h-5" /> Thêm Form mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <div key={form.id} className="glass-card rounded-2xl p-6 hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{form.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md">{form.questions?.length || 0} câu hỏi</span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span>{new Date(form.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <a href={form.googleFormUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Mở Google Form">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteForm(form.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>XÓA</span>
                  </button>
                  <Link href={`/dashboard/form/${form.id}`} className="btn-premium py-2.5 px-5 text-sm flex items-center gap-1 shadow-sm">
                    Cấu hình <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
