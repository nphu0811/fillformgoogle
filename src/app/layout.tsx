import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auto Tool: Điền Form Khảo sát Google Tự Động",
  description: "Công cụ điền khảo sát tự động chuyên biệt cho Google Form theo yêu cầu. Giúp bạn có số lượng lớn số liệu cho khảo sát của mình một cách nhanh chóng, chính xác.",
  keywords: "fillform, điền form, google form, khảo sát tự động, fill form",
  openGraph: {
    title: "FillForm - Điền Form Khảo sát Google Tự Động",
    description: "Công cụ điền khảo sát tự động chuyên biệt cho Google Form theo yêu cầu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
