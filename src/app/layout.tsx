import type { Metadata } from 'next';
import '@/app/globals.css';
import Experience from '@/components/Experience';

export const metadata: Metadata = {
  title: 'Lee Sangho',
  description: 'Security research notes, CTF writeups, and project logs.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Experience />
        <main>{children}</main>
      </body>
    </html>
  );
}
