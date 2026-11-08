import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';

import './globals.css';
import { cn } from '@/lib/utils';
import { SITE_NAME } from '@/constants/SITE_CONFIG';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — Tiệm Bánh Tươi Thủ Công & Đồ Uống`,
  description:
    'Tiệm bánh thủ công online: Bánh mì artisan, bánh ngọt, bánh lạnh và đồ uống tươi mỗi ngày.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={cn('font-sans', plusJakarta.variable, playfair.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-bakery-50 text-bakery-950 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
