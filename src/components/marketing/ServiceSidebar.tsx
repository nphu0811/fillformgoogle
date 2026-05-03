'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const serviceLinks = [
  { href: '/dien-form-theo-ti-le', label: 'Điền theo tỉ lệ đáp án' },
  { href: '/dien-form-theo-data-co-truoc', label: 'Điền theo data có trước' },
  { href: '/dien-form-chuan-mo-hinh-nghien-cuu', label: 'Điền theo mô hình NCKH' },
  { href: '/dien-form-bang-ai-agent', label: 'Điền bằng AI AGENT' },
  { href: '/dien-form-rai-random-nhu-nguoi-that', label: 'Điền rải như người thật' },
  { href: '/thue-fillform-thao-tac-ho', label: 'Thuê FillForm thao tác hộ' },
];

export default function ServiceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="sticky top-24">
        <h3 className="text-xl font-bold text-primary-dark mb-4">Dịch vụ điền form</h3>
        <div className="space-y-2">
          {serviceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-nav-item ${pathname === link.href ? 'active' : ''}`}
            >
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
