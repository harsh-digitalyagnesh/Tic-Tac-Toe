import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#030303',
};

export const metadata: Metadata = {
  title: 'CYBER TAC TOE | Retro Futuristic Arena',
  description:
    'Play a premium modern Tic Tac Toe game with high-fidelity glassmorphic visual designs, real-time audio synthesis, and minimax unbeatable AI opponent.',
  keywords: [
    'tic tac toe',
    'cyberpunk games',
    'minimax AI',
    'retro arcade',
    'Next.js games',
    'Tailwind CSS',
  ],
  authors: [{ name: 'Antigravity AI' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
