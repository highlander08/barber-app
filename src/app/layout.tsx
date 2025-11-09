import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BarberFlow - Gestão para Barbearias',
  description: 'Sistema completo de gestão para barbearias e salões',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-900 text-white">
          {children}
        </div>
      </body>
    </html>
  );
}