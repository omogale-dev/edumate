import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduMate — Your personal AI teacher',
  description:
    "India's most premium AI tutor. From Class 5 to PhD — including NEET and JEE.",
  keywords: ['AI tutor', 'EduMate', 'NEET', 'JEE', 'study', 'India'],
  authors: [{ name: 'EduMate' }],
  openGraph: {
    title: 'EduMate — Your personal AI teacher',
    description: 'From Class 5 to PhD. Premium AI tutoring for India.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
