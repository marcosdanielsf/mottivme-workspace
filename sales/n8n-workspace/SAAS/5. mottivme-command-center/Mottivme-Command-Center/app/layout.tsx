import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { InvoiceProvider } from "@/contexts/invoice-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Invoice Pro - Professional Invoice Generator",
  description: "Create beautiful, professional invoices in minutes",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <InvoiceProvider>
          {children}
          <Toaster />
        </InvoiceProvider>
      </body>
    </html>
  )
}
