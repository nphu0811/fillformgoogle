import ServiceSidebar from '@/components/marketing/ServiceSidebar';
import Link from 'next/link';
import { ClipboardList, BookOpen, FlaskConical, Bot, Clock, Users } from 'lucide-react';

export const metadata = {
  title: 'Giới thiệu các dịch vụ điền form tự động FillForm',
  description: 'FillForm là công cụ điền form Google số lượng lớn. Có thể điền theo yêu cầu tỉ lệ đáp án, theo data có trước, điền form bằng AI Agent, điền form như người thật.',
};

export default function ServicePage() {
  const services = [
    {
      icon: <ClipboardList className="w-8 h-8 text-blue-600" />,
      title: 'Điền Form theo tỉ lệ đáp án',
      desc: 'Người dùng tuỳ biến tỉ lệ xuất hiện đáp án của từng câu hỏi. Hệ thống sẽ trộn đáp án theo tỉ lệ yêu cầu. Gợi ý điền tỉ lệ tự động.',
      href: '/dien-form-theo-ti-le',
      features: ['Tùy chỉnh tỉ lệ cho từng câu hỏi', 'Gợi ý tỉ lệ tự động', 'Điền tức thì, nhanh chóng'],
    },
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      title: 'Điền Form theo Data có trước',
      desc: 'Điền form theo dữ liệu từ bảng excel. Hoàn hảo để làm minh chứng sau khi fix data. Cam kết chính xác từng câu trả lời.',
      href: '/dien-form-theo-data-co-truoc',
      features: ['Upload data từ Excel', 'Chính xác 100%', 'Hỗ trợ điều hướng section'],
    },
    {
      icon: <FlaskConical className="w-8 h-8 text-purple-600" />,
      title: 'Điền Form chuẩn mô hình NCKH',
      desc: '(VIP) Điền form chuẩn mô hình nghiên cứu khoa học. Cam kết data đẹp, đạt các kiểm định thống kê.',
      href: '/dien-form-chuan-mo-hinh-nghien-cuu',
      features: ['Đạt kiểm định Cronbach\'s Alpha', 'Chuẩn phân tích hồi quy', 'Data đẹp cho SPSS'],
    },
    {
      icon: <Bot className="w-8 h-8 text-pink-600" />,
      title: 'Điền Form bằng AI AGENT',
      desc: 'Giải pháp tiên tiến nhất. AI Agent tự động biện luận để điền form phù hợp với nhân khẩu học và nghiên cứu của bạn.',
      href: '/dien-form-bang-ai-agent',
      features: ['AI tự tư duy, biện luận', 'Nhân khẩu học chính xác', 'Báo cáo học thuật'],
    },
    {
      icon: <Clock className="w-8 h-8 text-teal-600" />,
      title: 'Điền rải random như người thật',
      desc: 'Hẹn giờ điền form hằng ngày, tùy chỉnh giãn cách thời gian giữa các mẫu như người thật điền.',
      href: '/dien-form-rai-random-nhu-nguoi-that',
      features: ['Giãn cách thời gian tùy chỉnh', 'Hẹn giờ hàng ngày', 'Không thể truy vết'],
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: 'Thuê FillForm thao tác hộ',
      desc: 'Chuyên viên FillForm thao tác toàn bộ cho bạn. Chỉ cần đưa yêu cầu, nhận kết quả.',
      href: '/thue-fillform-thao-tac-ho',
      features: ['Không cần tự thao tác', 'Customize 100%', 'Hỗ trợ tận tình'],
    },
  ];

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Tổng quan dịch vụ</h1>
            <p className="text-gray-600 mb-10 text-lg leading-relaxed">
              FillForm cung cấp đa dạng các dịch vụ điền form tự động cho Google Form, phục vụ mọi nhu cầu từ sinh viên, nhà nghiên cứu đến doanh nghiệp. Cam kết chất lượng và bảo hành tuyệt đối.
            </p>

            <div className="space-y-6">
              {services.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary-dark mb-2">{s.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{s.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {s.features.map((f, j) => (
                          <span key={j} className="text-xs bg-blue-50 text-primary px-3 py-1 rounded-full">{f}</span>
                        ))}
                      </div>
                      <Link href={s.href} className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                        Chi tiết dịch vụ →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ServiceSidebar />
        </div>
      </div>
    </div>
  );
}
