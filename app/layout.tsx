import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: '森の日々 HRVレポートアプリ',
  description: 'ヘッドスパ施術とHRVデータを管理するサロン向けダッシュボード',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
