import ServiceSidebar from '@/components/marketing/ServiceSidebar';
import Link from 'next/link';

export const metadata = {
  title: 'Điền Form Google tự động theo tỉ lệ đáp án',
  description: 'Yêu cầu tỉ lệ đáp án của từng câu hỏi -> Auto tool FillForm sẽ tự động điền form nhanh chóng, cam kết đúng theo tỉ lệ.',
};

export default function FillByRatioPage() {
  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Điền Form theo tỉ lệ đáp án</h1>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                Trong các form khảo sát, số lượng câu hỏi/lưới trắc nhiệm chọn một hoặc nhiều đáp án chiếm đa số. Tỉ lệ đáp án trong các thang đo linkert (5-7) cũng sẽ quyết định giá trị trung bình, độ lệch chuẩn, phương sai,...
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bằng cách yêu cầu tỉ lệ đầu ra đáp án, bạn có thể quyết định kết quả bài khảo sát. FillForm sẽ trộn đáp án theo tỉ lệ yêu cầu để điền vào form của bạn một cách chính xác.
              </p>
              <p className="font-bold text-primary-dark">Cam kết kết quả điền form giống tỉ lệ yêu cầu.</p>
            </div>

            <h2 className="text-2xl font-bold text-primary-dark mb-4">Cách làm</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Điền tỉ lệ là <strong>số tự nhiên từ 0-100</strong> đơn vị % tương ứng với các đáp án.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span><strong>Với câu hỏi chọn nhiều đáp án</strong>, đặt tỉ lệ sao cho tổng các tỉ lệ lớn hơn 120 để có phép trộn đáp án tốt nhất.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Với câu hỏi tự luận, chọn loại câu hỏi name; email; phone; custom - tự nhập data; hoặc other- Bỏ qua không điền.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span><strong>Yêu cầu số lượng muốn tăng thêm</strong> (điền tiếp vào form gốc của bạn): 101 mẫu, 202 mẫu,... chỉ cần điền số lượng lẻ, bạn sẽ có % các đáp án lẻ thập phân.</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Link href="/login" className="btn-primary inline-block px-8 py-3 text-base">
                Bắt đầu điền form theo tỉ lệ →
              </Link>
            </div>
          </div>

          <ServiceSidebar />
        </div>
      </div>
    </div>
  );
}
