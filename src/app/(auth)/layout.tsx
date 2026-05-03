export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 flex items-center justify-center min-h-screen p-4">
      {children}
    </div>
  );
}
