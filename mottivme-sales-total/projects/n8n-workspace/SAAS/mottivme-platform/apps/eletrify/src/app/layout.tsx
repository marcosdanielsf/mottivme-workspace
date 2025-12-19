import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELETRIFY — Gerador de Copy com IA + Sexy Canvas",
  description: "Crie copies que ELETRIFICAM usando os 14 gatilhos emocionais da metodologia Sexy Canvas.",
  keywords: ["copywriting", "IA", "Sexy Canvas", "gatilhos emocionais", "vendas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
