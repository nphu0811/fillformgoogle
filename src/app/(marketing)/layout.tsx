import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { ChatWidget, ScrollToTop } from '@/components/marketing/Widgets';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-[72px]">{children}</main>
      <Footer />
      <ChatWidget />
      <ScrollToTop />
    </>
  );
}
