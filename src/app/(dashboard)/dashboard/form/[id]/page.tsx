'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Play,
  Settings,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  Sparkles,
} from 'lucide-react';

interface Question {
  id: string;
  googleEntryId: string;
  title: string;
  type: string;
  required: boolean;
  options: string;
  order: number;
}

interface Form {
  id: string;
  title: string;
  description?: string;
  googleFormUrl: string;
  googleFormId: string;
  questions: Question[];
}

interface RatioConfig {
  [questionId: string]: {
    ratios: Record<string, number>;
    customTexts?: string[];
  };
}

export default function FormConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratioConfigs, setRatioConfigs] = useState<RatioConfig>({});
  const [responseCount, setResponseCount] = useState(100);
  const [spreadEnabled, setSpreadEnabled] = useState(false);
  const [spreadInterval, setSpreadInterval] = useState(5);
  const [filling, setFilling] = useState(false);
  const [fillResult, setFillResult] = useState<{ success: boolean; message: string } | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [useFullAI, setUseFullAI] = useState(true);

  useEffect(() => {
    loadForm();
  }, [id]);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const loadForm = async () => {
    try {
      const res = await fetch('/api/forms', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const found = data.forms?.find((f: Form) => f.id === id);
        if (found) {
          setForm(found);
          // Initialize ratios with equal distribution
          const configs: RatioConfig = {};
          for (const q of found.questions) {
            const options = JSON.parse(q.options || '[]');
            if (options.length > 0) {
              const equalRatio = Math.floor(100 / options.length);
              const ratios: Record<string, number> = {};
              options.forEach((opt: string, i: number) => {
                ratios[opt] = i === 0 ? 100 - equalRatio * (options.length - 1) : equalRatio;
              });
              configs[q.id] = { ratios };
            } else {
              configs[q.id] = { ratios: {}, customTexts: [''] };
            }
          }
          setRatioConfigs(configs);
          // Expand first question by default
          if (found.questions.length > 0) {
            setExpandedQuestions(new Set([found.questions[0].id]));
          }
        }
      }
    } catch (err) {
      console.error('Load form error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateRatio = (questionId: string, option: string, value: number) => {
    setRatioConfigs(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ratios: {
          ...prev[questionId]?.ratios,
          [option]: Math.max(0, Math.min(100, value)),
        },
      },
    }));
  };

  const updateCustomTexts = (questionId: string, texts: string[]) => {
    setRatioConfigs(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        customTexts: texts,
      },
    }));
  };

  const toggleQuestion = (qId: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleAISuggest = async (qId: string, qTitle: string, qType: string, optionsStr: string) => {
    try {
      const options = JSON.parse(optionsStr || '[]');
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ questionTitle: qTitle, questionType: qType, options }),
      });
      
      const data = await res.json();
      if (data.suggestions) {
        updateCustomTexts(qId, data.suggestions);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error('AI suggest error:', err);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SHORT_TEXT: 'Tự luận ngắn',
      LONG_TEXT: 'Tự luận dài',
      MULTIPLE_CHOICE: 'Trắc nghiệm',
      CHECKBOX: 'Chọn nhiều',
      DROPDOWN: 'Dropdown',
      LINEAR_SCALE: 'Thang đo',
      MULTIPLE_CHOICE_GRID: 'Lưới trắc nghiệm',
      CHECKBOX_GRID: 'Lưới checkbox',
      DATE: 'Ngày',
      TIME: 'Giờ',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    if (['MULTIPLE_CHOICE', 'DROPDOWN', 'LINEAR_SCALE'].includes(type)) return 'bg-blue-50 text-blue-700';
    if (['CHECKBOX'].includes(type)) return 'bg-purple-50 text-purple-700';
    if (['SHORT_TEXT', 'LONG_TEXT'].includes(type)) return 'bg-green-50 text-green-700';
    return 'bg-gray-50 text-gray-700';
  };

  const handleStartFill = async () => {
    setFilling(true);
    setFillResult(null);

    try {
      const answerConfigs = form!.questions.map(q => ({
        questionId: q.id,
        ratios: ratioConfigs[q.id]?.ratios || {},
        customTexts: ratioConfigs[q.id]?.customTexts?.filter(t => t.trim()) || [],
      }));

      const res = await fetch('/api/fill-jobs', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          formId: form!.id,
          responseCount,
          answerConfigs,
          spreadEnabled,
          spreadInterval,
          useFullAI, // Send this to the backend
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFillResult({ success: false, message: data.error || 'Lỗi khi tạo fill job' });
        return;
      }

      setFillResult({
        success: true,
        message: `Đã bắt đầu điền ${responseCount} câu trả lời! Job ID: ${data.fillJob.id}`,
      });

      // Update user credits locally
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        user.credits -= responseCount;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err: any) {
      setFillResult({ success: false, message: err.message });
    } finally {
      setFilling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Form không tồn tại</h2>
        <Link href="/dashboard" className="text-primary hover:underline">
          Quay lại Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="p-3 bg-white/50 hover:bg-white rounded-2xl border border-white/60 shadow-sm transition-all text-slate-500 hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
            <span className="bg-white/60 px-2.5 py-1 rounded-md">{form.questions.length} câu hỏi</span>
          </p>
        </div>
      </div>

      {/* Fill Result */}
      {fillResult && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-fade-in ${
          fillResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {fillResult.success ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <span className="text-sm">{fillResult.message}</span>
        </div>
      )}

      {/* Fill Mode Selection */}
      <div className="glass-card rounded-3xl border-white/60 shadow-sm p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Chế độ điền Form</h2>
            <p className="text-sm text-slate-500">Chọn cách thức AI xử lý các câu trả lời của bạn.</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setUseFullAI(true)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              useFullAI ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            AI Tự động (Khuyên dùng)
          </button>
          <button 
            onClick={() => setUseFullAI(false)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              !useFullAI ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Thủ công (Tùy chỉnh tỉ lệ)
          </button>
        </div>
      </div>

      {/* AI Mode Active Info */}
      {useFullAI && (
        <div className="bg-indigo-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Chế độ AI Tự động đang bật
            </h3>
            <p className="text-indigo-100 max-w-2xl mb-6">
              Hệ thống sẽ sử dụng Google Gemini để phân tích từng câu hỏi và tạo ra 100% dữ liệu mẫu tự nhiên (tên, email, ý kiến phản hồi...) cho mỗi lượt điền. Bạn không cần phải cấu hình gì thêm.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium border border-white/20">
                ✅ Email & Tên đa dạng
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium border border-white/20">
                ✅ Logic trả lời tự nhiên
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium border border-white/20">
                ✅ Tự động chọn trắc nghiệm
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions - Only show if not in Full AI Mode or if user wants to see them */}
      {!useFullAI && (
        <div className="space-y-4 mb-8">
        {form.questions.map((q, qi) => {
          const options: string[] = JSON.parse(q.options || '[]');
          const isExpanded = expandedQuestions.has(q.id);
          const isText = ['SHORT_TEXT', 'LONG_TEXT'].includes(q.type);

          return (
            <div key={q.id} className="glass-card rounded-3xl border-white/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-4">
              {/* Question header */}
              <button
                className="w-full flex items-center justify-between p-6 hover:bg-white/40 transition-colors text-left"
                onClick={() => toggleQuestion(q.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 text-sm font-bold flex items-center justify-center shrink-0">
                    {qi + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-bold text-slate-800 truncate mb-1">{q.title}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getTypeColor(q.type)}`}>
                        {getQuestionTypeLabel(q.type)}
                      </span>
                      {q.required && (
                        <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md">* Bắt buộc</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </div>
              </button>

              {/* Question config */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-100/50 pt-5 bg-white/20">
                  {isText ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-slate-700">
                          Câu trả lời mẫu (mỗi dòng 1 câu trả lời, sẽ được chọn ngẫu nhiên)
                        </label>
                        <button 
                          onClick={() => handleAISuggest(q.id, q.title, q.type, q.options)}
                          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          AI Gợi ý
                        </button>
                      </div>
                      <textarea
                        className="input-premium resize-none h-40 py-4"
                        placeholder="Nhập các câu trả lời mẫu, mỗi dòng một câu..."
                        value={ratioConfigs[q.id]?.customTexts?.join('\n') || ''}
                        onChange={(e) => updateCustomTexts(q.id, e.target.value.split('\n'))}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-bold text-slate-700">Tỉ lệ đáp án (%)</label>
                        <span className="text-xs font-semibold text-slate-500 bg-white/60 px-3 py-1 rounded-full">
                          Tổng: {Object.values(ratioConfigs[q.id]?.ratios || {}).reduce((a, b) => a + b, 0)}%
                        </span>
                      </div>
                      {options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-4 bg-white/40 p-3 rounded-2xl border border-white/50">
                          <span className="text-sm font-medium text-slate-700 flex-1 min-w-0 truncate">{opt}</span>
                          <div className="flex items-center gap-3 shrink-0">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={ratioConfigs[q.id]?.ratios?.[opt] || 0}
                              onChange={(e) => updateRatio(q.id, opt, parseInt(e.target.value))}
                              className="w-24 sm:w-32 accent-primary"
                            />
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={ratioConfigs[q.id]?.ratios?.[opt] || 0}
                                onChange={(e) => updateRatio(q.id, opt, parseInt(e.target.value) || 0)}
                                className="w-20 input-premium text-center text-sm py-2 px-3 pr-6 font-semibold"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Fill Config */}
      <div className="glass-card rounded-3xl border-white/60 shadow-lg shadow-indigo-500/5 p-8 mb-10">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          Cấu hình điền form
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/40 p-6 rounded-2xl border border-white/50">
            <label className="text-sm font-bold text-slate-700 mb-3 block">
              Số lượng câu trả lời
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={responseCount}
              onChange={(e) => setResponseCount(parseInt(e.target.value) || 1)}
              className="input-premium py-3 text-lg font-bold"
            />
            <p className="text-sm font-medium text-slate-500 mt-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Chi phí: <span className="font-bold text-slate-800">{responseCount} credits</span> (~{(responseCount * 350).toLocaleString('vi-VN')} VND)
            </p>
          </div>

          <div className="bg-white/40 p-6 rounded-2xl border border-white/50">
            <label className="flex items-center gap-3 cursor-pointer mb-4 group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={spreadEnabled}
                  onChange={(e) => setSpreadEnabled(e.target.checked)}
                  className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary transition-all peer"
                />
              </div>
              <span className="text-sm font-bold text-slate-700 flex items-center gap-2 group-hover:text-slate-900 transition-colors">
                <Clock className="w-4 h-4 text-slate-400" /> Điền rải rác như người thật
              </span>
            </label>
            
            {spreadEnabled && (
              <div className="animate-slide-up">
                <label className="text-sm font-medium text-slate-600 mb-2 block">
                  Giãn cách tối đa giữa các mẫu (giây)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="3600"
                    value={spreadInterval}
                    onChange={(e) => setSpreadInterval(parseInt(e.target.value) || 5)}
                    className="input-premium py-3 pl-4 pr-12 font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 pointer-events-none">s</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Fill Button */}
      <div className="flex justify-center pb-16">
        <button
          onClick={handleStartFill}
          disabled={filling}
          className="btn-premium flex items-center justify-center gap-3 px-12 py-5 text-lg font-bold shadow-indigo-500/30 w-full sm:w-auto min-w-[300px]"
        >
          {filling ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Bắt đầu điền form ({responseCount} mẫu)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
