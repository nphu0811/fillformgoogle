import ServiceSidebar from '@/components/marketing/ServiceSidebar';
import Link from 'next/link';

export const metadata = {
  title: 'Điền form theo Data có trước - Điền Form Tự Động',
  description: 'Điền form theo data có trước là cách hoàn hảo nhất để điền form. Bạn sẽ kiểm soát độ chính xác qua từng câu trả lời.',
};

export default function FillByDataPage() {
  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Điền Form theo data có trước</h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                Điền form theo data có trước là cách hoàn hảo nhất để điền form. Bạn sẽ kiểm soát độ chính xác qua từng câu trả lời.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Cách này cũng cho phép bạn điền điều hướng section, điền câu trắc nhiệm chọn đáp án khác, câu tự luận. Với các bạn đã có data sẵn, chỉ cần upload file excel lên, FillForm sẽ điền chính xác từng câu.
              </p>
              <p className="font-bold text-primary-dark">Cam kết chính xác 100% theo data bạn cung cấp.</p>
            </div>

            <h2 className="text-2xl font-bold text-primary-dark mb-4">Cách làm</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Chuẩn bị file Excel với data đáp án cho từng câu hỏi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Upload file lên hệ thống FillForm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Mapping các cột data với câu hỏi tương ứng trên form.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Bấm điền và nhận kết quả chính xác tuyệt đối.</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Link href="/login" className="btn-primary inline-block px-8 py-3 text-base">
                Bắt đầu điền form theo data →
              </Link>
            </div>
          </div>
          <ServiceSidebar />
        </div>
      </div>
    </div>
  );
}
