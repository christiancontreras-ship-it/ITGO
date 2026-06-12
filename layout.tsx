import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ITGO - Tu equipo TI, cuando lo necesitas',
  description: 'Marketplace TI OnDemand de Latinoamérica',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ITGO - Marketplace TI',
    description: 'Tu equipo TI, cuando lo necesitas',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0057FF" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-background text-gray-900 dark:bg-gray-950 dark:text-gray-50`}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
