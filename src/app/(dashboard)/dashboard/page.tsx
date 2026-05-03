'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  CreditCard,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface Form {
  id: string;
  title: string;
  googleFormUrl: string;
  status: string;
  createdAt: string;
  questions: any[];
  fillJobs: any[];
}

interface FillJob {
  id: string;
  responseCount: number;
  completedCount: number;
  status: string;
  createdAt: string;
  form?: { title: string; googleFormUrl: string };
}

export default function DashboardPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [fillJobs, setFillJobs] = useState<FillJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    loadData();
  }, []);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const loadData = async () => {
    try {
      const [formsRes, jobsRes] = await Promise.all([
        fetch('/api/forms', { headers: getAuthHeaders() }),
        fetch('/api/fill-jobs', { headers: getAuthHeaders() }),
      ]);

      if (formsRes.ok) {
        const data = await formsRes.json();
        setForms(data.forms || []);
      }
      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setFillJobs(data.fillJobs || []);
      }
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setImportError('');
    setImporting(true);

    try {
      // Step 1: Try server-side parse first
      const parseRes = await fetch('/api/forms/parse', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ googleFormUrl: importUrl }),
      });

      let parseData = await parseRes.json();

      // Step 2: If server says it needs client-side fetch, do it from the browser
      if (parseData.requireClientFetch || (!parseRes.ok && parseRes.status === 403)) {
        console.log('[Import] Server cannot access form, fetching from browser...');
        
        // Normalize the URL to viewform
        let viewformUrl = importUrl;
        if (!viewformUrl.includes('/viewform')) {
          viewformUrl = viewformUrl.replace(/\/?$/, '/viewform');
        }

        try {
          const clientRes = await fetch(viewformUrl, {
            credentials: 'include', // Include Google cookies from browser
          });

          if (!clientRes.ok) {
            throw new Error(`Không thể tải form từ trình duyệt (HTTP ${clientRes.status}). Hãy đảm bảo bạn đã đăng nhập Google và form có quyền truy cập.`);
          }

          const html = await clientRes.text();

          // Send the HTML to server for parsing
          const retryRes = await fetch('/api/forms/parse', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ googleFormUrl: importUrl, html }),
          });

          if (!retryRes.ok) {
            const err = await retryRes.json();
            throw new Error(err.error || 'Không thể phân tích form');
          }

          parseData = await retryRes.json();
        } catch (clientErr: any) {
          // If CORS blocks the client fetch, provide a helpful message
          if (clientErr.message.includes('CORS') || clientErr.message.includes('Failed to fetch') || clientErr.name === 'TypeError') {
            throw new Error('Không thể tải form do hạn chế CORS. Hãy dùng link chia sẻ công khai (dạng /forms/d/e/.../viewform).');
          }
          throw clientErr;
        }
      } else if (!parseRes.ok) {
        throw new Error(parseData.error || 'Không thể phân tích form');
      }

      const { form: parsedForm } = parseData;

      // Step 3: Save form
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

      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error || 'Không thể lưu form');
      }

      setShowImport(false);
      setImportUrl('');
      loadData();
    } catch (err: any) {
      setImportError(err.message);
    } finally {
      setImporting(false);
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
    <div className="max-w-6xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="glass-card rounded-3xl p-6 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tổng Form</span>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">{forms.length}</p>
        </div>
        <div className="glass-card rounded-3xl p-6 border-t-4 border-t-green-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tổng Fill Jobs</span>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">{fillJobs.length}</p>
        </div>
        <div className="glass-card rounded-3xl p-6 border-t-4 border-t-purple-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[30px] -mr-10 -mt-10"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Credits còn lại</span>
          </div>
          <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 relative z-10">{user?.credits || 0}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Forms của bạn</h2>
        <button
          onClick={() => setShowImport(true)}
          className="btn-premium flex items-center gap-2 py-3 px-6 text-sm shadow-indigo-500/30 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Thêm Form mới
        </button>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowImport(false)}></div>
          <div className="glass-card rounded-3xl p-8 w-full max-w-lg relative z-10 animate-slide-up border-white/80 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Thêm Google Form</h3>
            <p className="text-slate-500 mb-8 font-medium">Dán link Google Form của bạn, hệ thống sẽ tự động đồng bộ câu hỏi.</p>

            {importError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100 font-medium">
                {importError}
              </div>
            )}

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
              <button
                onClick={() => setShowImport(false)}
                className="px-6 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                disabled={importing}
              >
                Hủy
              </button>
              <button
                onClick={handleImport}
                disabled={importing || !importUrl}
                className="btn-premium py-3 px-6 flex items-center gap-2 disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  'Đồng bộ Form'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forms List */}
      {forms.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center border-dashed border-2 border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Chưa có Form nào</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Thêm Google Form đầu tiên của bạn để bắt đầu sử dụng công cụ tự động điền mạnh mẽ nhất.</p>
          <button
            onClick={() => setShowImport(true)}
            className="btn-premium inline-flex items-center gap-2 py-3 px-8 shadow-indigo-500/20"
          >
            <Plus className="w-5 h-5" />
            Thêm Form mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="glass-card rounded-2xl p-6 hover:shadow-lg hover:border-indigo-100 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{form.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md">{form.questions.length} câu hỏi</span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md">{form.fillJobs.length} lần điền</span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span>{new Date(form.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <a
                    href={form.googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    title="Mở Google Form"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <Link
                    href={`/dashboard/form/${form.id}`}
                    className="btn-premium py-2.5 px-5 text-sm flex items-center gap-1 shadow-sm"
                  >
                    Cấu hình <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Fill Jobs */}
      {fillJobs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Lịch sử điền gần đây</h2>
          <div className="glass-card rounded-3xl overflow-hidden border-white/60">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Form</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Số lượng</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {fillJobs.slice(0, 10).map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-semibold text-slate-700">{job.form?.title || 'N/A'}</td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-600">
                        {job.completedCount} <span className="text-slate-400">/</span> {job.responseCount}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(job.status)}</td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-500">
                        {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
