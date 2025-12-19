import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Assembly Line | AI-Powered Funnel Builder',
  description: 'Crie estratégias de marketing completas com 16 agentes de IA trabalhando para você.',
  keywords: ['funnel builder', 'AI', 'marketing', 'automation', 'MOTTIVME'],
  authors: [{ name: 'MOTTIVME' }],
  openGraph: {
    title: 'Assembly Line | AI-Powered Funnel Builder',
    description: 'Crie estratégias de marketing completas com 16 agentes de IA trabalhando para você.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
