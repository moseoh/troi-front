import type { Metadata } from 'next';
import { LayoutClient } from '@/components/layout/LayoutClient';
import './globals.css';

export const metadata: Metadata = {
  title: 'Troi - Trace ROI',
  description: '광고 링크 추적 및 ROI 분석 도구',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
