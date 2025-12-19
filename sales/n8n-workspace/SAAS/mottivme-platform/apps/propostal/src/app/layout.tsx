import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Propostal — Propostas que Fecham Sozinhas",
  description: "Transforme suas propostas em portais interativos que rastreiam, engajam e convertem.",
  keywords: ["propostas", "vendas", "SaaS", "tracking", "conversão"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
