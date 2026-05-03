import ServiceSidebar from '@/components/marketing/ServiceSidebar';
import Link from 'next/link';

export const metadata = {
  title: 'Điền form bằng AI AGENT - Điền Form Tự Động',
  description: 'AI Agent sẽ tự động biện luận theo thực tế để điền form phù hợp với nhân khẩu học và nghiên cứu của bạn.',
};

export default function FillByAIPage() {
  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Điền Form bằng AI AGENT</h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                Đây là giải pháp tiên tiến nhất của FillForm. AI Agent sẽ tự động biện luận theo thực tế để điền form phù hợp với nhân khẩu học và nghiên cứu của bạn.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Kết quả điền form có ý nghĩa học thuật cao, bạn sẽ nhận lại báo cáo chi tiết về kết quả.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-dark mb-4">Ưu điểm vượt trội</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { title: 'Dữ liệu chuẩn SPSS', desc: 'Chuẩn mô hình và đạt kiểm định: Thống kê mô tả, Cronbach\'s Alpha, phân tích tương quan, hồi quy,...' },
                { title: 'Báo cáo học thuật', desc: 'Báo cáo học thuật và giải thích số liệu, kết luận giúp bạn viết bài nhanh chóng' },
                { title: 'Nhân khẩu học chính xác', desc: 'Mapping hợp lí nhân khẩu học theo từng mẫu nhưng vẫn đảm bảo tỉ lệ chung.' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                  <h3 className="text-base font-bold text-primary-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/login" className="btn-primary inline-block px-8 py-3 text-base">
                Bắt đầu điền form bằng AI →
              </Link>
            </div>
          </div>
          <ServiceSidebar />
        </div>
      </div>
    </div>
  );
}
