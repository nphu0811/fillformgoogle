import Link from 'next/link';
import { Globe } from 'lucide-react';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left side */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-9 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-lg">F</div>
              </div>
              <span className="text-lg font-bold">
                <span className="text-primary">FILL </span>
                <span className="text-primary-dark">FORM</span>
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Công cụ điền khảo sát tự động chuyên biệt cho Google Form theo yêu cầu.
            </h3>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://github.com/nphu0811"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right side */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Liên hệ hợp tác, trở thành đối tác. Hỗ trợ sử dụng sản phẩm.
            </h3>
            <div className="space-y-3">
              <a
                href="https://github.com/nphu0811"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
              >
                <GitHubIcon className="w-5 h-5 text-gray-900" />
                <span>github.com/nphu0811</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">
            Copyright © {new Date().getFullYear()} FILLFORM – Điền đơn tự động
          </p>
        </div>
      </div>
    </footer>
  );
}
