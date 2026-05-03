import ServiceSidebar from '@/components/marketing/ServiceSidebar';

export const metadata = {
  title: 'Thuê fillform thao tác hộ - Điền Form Tự Động',
  description: 'Nếu bạn cảm thấy mất thời gian build data, khó khăn khi thao tác, dịch vụ thao tác hộ của FillForm có thể giúp bạn.',
};

export default function HireFillformPage() {
  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary-dark mb-6">Thuê FillForm thao tác hộ</h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <p className="text-gray-600 leading-relaxed mb-4">
                Nếu bạn cảm thấy mất thời gian build data, khó khăn khi thao tác, dịch vụ thao tác hộ của FillForm có thể giúp bạn điền form với mọi yêu cầu của bạn.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Chỉ cần đưa yêu cầu, chuyên viên FillForm sẽ:
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Điền mẫu trên Form</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Copy → Paste data lên sheet kết quả</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Build data tự luận, nhân khẩu học</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Customize theo mọi yêu cầu</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-primary-dark mb-4">Bảng giá</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
              <div className="space-y-3">
                {[
                  { amount: '100.000 VND', responses: '100 Câu trả lời' },
                  { amount: '150.000 VND', responses: '200 Câu trả lời' },
                  { amount: '180.000 VND', responses: '300 Câu trả lời' },
                  { amount: '250.000 VND', responses: '500 Câu trả lời' },
                  { amount: '600.000 VND', responses: '2000 Câu trả lời' },
                ].map((p, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <span className="font-semibold text-primary-dark">{p.amount}</span>
                    <span className="text-gray-500">~ {p.responses}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p>(Optional) 50.000 VND – Hẹn giờ điền đơn & điền rải như người thật</p>
                <p>(Optional) 50.000 VND – Trả lời tự luận nâng cao (ý kiến, đáp án khác,…)</p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="https://github.com/nphu0811"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block px-8 py-3 text-base bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Liên hệ Fanpage →
              </a>
            </div>
          </div>
          <ServiceSidebar />
        </div>
      </div>
    </div>
  );
}
