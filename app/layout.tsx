
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import SplashScreen from '@/components/layout/SplashScreen';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Schola — Student Planner',
  description: 'Atur jadwal pelajaran, tugas, dan fokus belajarmu dalam satu tempat.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="antialiased m-0 p-0 selection:bg-[#052948] selection:text-white">
        {children}
        <SplashScreen />
      </body>
    </html>
  );
}
