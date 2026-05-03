import { Globe } from 'lucide-react';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

export const metadata = {
  title: 'Contact - Điền Form Tự Động',
  description: 'Liên hệ với FillForm qua GitHub để tư vấn dịch vụ, liên hệ hợp tác và nhận các ưu đãi.',
};

export default function ContactPage() {
  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-primary-dark mb-4 text-center">LIÊN HỆ FILLFORM</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Liên hệ với FillForm qua GitHub để tư vấn dịch vụ, liên hệ hợp tác và nhận các ưu đãi.
        </p>

        <div className="grid grid-cols-1 max-w-md mx-auto gap-8 mb-12">
          <a
            href="https://github.com/nphu0811"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 hover:shadow-md transition-all text-center group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <GitHubIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-primary-dark mb-2">GitHub</h3>
            <p className="text-primary">github.com/nphu0811</p>
          </a>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Hợp tác</h2>
          <p className="text-gray-600 leading-relaxed">
            FillForm đã, đang và sẽ luôn sẵn sàng với tất cả các phương án hợp tác với các nhà phân phối, đại lý, cộng tác viên. Liên hệ ngay để nhận thông tin chi tiết về chương trình hợp tác.
          </p>
        </div>
      </div>
    </div>
  );
}
