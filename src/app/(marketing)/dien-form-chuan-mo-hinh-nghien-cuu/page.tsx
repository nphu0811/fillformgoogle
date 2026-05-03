import ServiceSidebar from '@/components/marketing/ServiceSidebar';
import Link from 'next/link';

export const metadata = {
  title: 'Điền form chuẩn mô hình nghiên cứu - Điền Form Tự Động',
  description: 'Điền Form theo Mô hình nghiên cứu. Chỉ cần vẽ mô hình và nhập số lượng mẫu, hệ thống sẽ tự động build data chuẩn.',
};

export default function FillByResearchPage() {
  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Điền Form theo mô hình nghiên cứu</h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                Bạn đang làm nghiên cứu/khóa luận/bài tập nhưng gặp khó khăn trong việc thu thập khảo sát đạt kiểm định độ tin cậy?
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                FillForm mang đến giải pháp có chất lượng học thuật cao nhất: chỉ cần vẽ mô hình và nhập số lượng mẫu, hệ thống sẽ tự động build data chuẩn mô hình nghiên cứu của bạn.
              </p>
              <p className="font-bold text-primary-dark">Cam kết data đẹp, đạt các kiểm định thống kê.</p>
            </div>

            <h2 className="text-2xl font-bold text-primary-dark mb-4">Các kiểm định được hỗ trợ</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Thống kê mô tả", "Cronbach's Alpha", "Phân tích tương quan",
                  "Hồi quy tuyến tính", "AVE", "HTMT", "R²", "VIF",
                  "Mô hình SEM", "Mô hình hồi quy", "Biến trung gian", "Biến điều tiết"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50/50 rounded-lg px-4 py-2.5">
                    <span className="w-2 h-2 bg-primary rounded-full shrink-0"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link href="/login" className="btn-primary inline-block px-8 py-3 text-base">
                Bắt đầu điền form chuẩn NCKH →
              </Link>
            </div>
          </div>
          <ServiceSidebar />
        </div>
      </div>
    </div>
  );
}
