import Link from 'next/link';
import { Gift, Users, DollarSign, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Giới thiệu bạn bè - FillForm Điền Form Tự Động',
  description: 'Cùng FillForm lan tỏa giá trị đến sinh viên. Hỗ trợ các bạn lượt điền form miễn phí. Và nhận lại hoa hồng vô hạn.',
};

export default function AffiliatePage() {
  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-dark mb-4">Giới thiệu bạn bè</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cùng FillForm lan tỏa giá trị đến sinh viên đang vật lộn với deadline điền form khảo sát. Hỗ trợ các bạn lượt điền form miễn phí. Và nhận lại hoa hồng vô hạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 text-center">
            <div className="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-primary-dark mb-2">Nhận lượt điền miễn phí</h3>
            <p className="text-sm text-gray-600">Mỗi bạn bè đăng ký thành công qua link của bạn, cả hai đều nhận lượt điền miễn phí.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 text-center">
            <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-primary-dark mb-2">Giới thiệu không giới hạn</h3>
            <p className="text-sm text-gray-600">Số lượng bạn bè giới thiệu không giới hạn. Càng giới thiệu nhiều, hoa hồng càng lớn.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 text-center">
            <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-primary-dark mb-2">Hoa hồng vô hạn</h3>
            <p className="text-sm text-gray-600">Nhận hoa hồng từ mỗi giao dịch của bạn bè bạn giới thiệu.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 mb-8">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Cách tham gia</h2>
          <div className="space-y-4">
            {[
              'Đăng ký tài khoản FillForm',
              'Nhận mã giới thiệu cá nhân',
              'Chia sẻ mã/link cho bạn bè',
              'Bạn bè đăng ký và sử dụng dịch vụ',
              'Nhận hoa hồng tự động vào tài khoản',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/login" className="btn-cta inline-block">
            Tham gia ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
