import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bakery Shop — Bánh Tươi Thủ Công & Đồ Uống',
  description:
    'Tiệm bánh thủ công online: Bánh mì artisan, bánh ngọt, bánh lạnh và đồ uống tươi mỗi ngày.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-bakery-50 text-bakery-950 antialiased">
        {children}
      </body>
    </html>
  );
}
