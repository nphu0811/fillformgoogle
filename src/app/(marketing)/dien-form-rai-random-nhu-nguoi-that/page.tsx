import ServiceSidebar from '@/components/marketing/ServiceSidebar';
import Link from 'next/link';

export const metadata = {
  title: 'Điền form rải random như người thật - Điền Form Tự Động',
  description: 'Điền rải là giải pháp giúp kết quả điền form giống như người thật điền, với giãn cách thời gian tùy chỉnh.',
};

export default function FillRandomPage() {
  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Điền rải random như người thật</h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <h2 className="text-xl font-bold text-primary-dark mb-4">Điền rải là gì?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nếu không có điền rải, kết quả chạy tool sẽ lên ngay trong khoảng 2 phút, mỗi mẫu cách nhau dưới 1s. Điều này có thể khiến người xem nghi ngờ, khi xem cột timestamp trên sheet kết quả.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bạn có thể sửa timestamp trên sheet, nhưng với tính năng điền rải, FillForm sẽ tự động giãn cách thời gian giữa các mẫu, giống như có nhiều người thật đang điền form.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-dark mb-4">Các tùy chọn</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Giãn cách cố định</strong>: Mỗi mẫu cách nhau một khoảng thời gian nhất định (ví dụ 5 phút)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Giãn cách ngẫu nhiên</strong>: Thời gian giữa các mẫu thay đổi ngẫu nhiên trong khoảng bạn cài đặt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Hẹn giờ</strong>: Tự động điền form vào thời gian bạn chọn hàng ngày</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Link href="/login" className="btn-primary inline-block px-8 py-3 text-base">
                Bắt đầu điền rải →
              </Link>
            </div>
          </div>
          <ServiceSidebar />
        </div>
      </div>
    </div>
  );
}
