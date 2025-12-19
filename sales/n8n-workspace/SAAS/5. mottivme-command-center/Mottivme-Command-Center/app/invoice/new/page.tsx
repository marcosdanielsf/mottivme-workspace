"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useInvoice } from "@/contexts/invoice-context"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { InvoiceForm } from "@/components/invoice-form"
import { InvoicePreview } from "@/components/invoice-preview"
import { PDFGenerator } from "@/components/pdf-generator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Invoice } from "@/lib/types"

export default function NewInvoicePage() {
  const router = useRouter()
  const { saveInvoice, company, clients, loading } = useInvoice()
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async (invoice: Invoice) => {
    try {
      setSaving(true)
      await saveInvoice(invoice)
      router.push("/history")
    } catch (error) {
      console.error("[v0] Error saving invoice:", error)
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = (invoice: Invoice) => {
    setPreviewInvoice(invoice)
    setShowPreview(true)
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <InvoiceForm
            onSave={handleSave}
            onPreview={handlePreview}
            company={company}
            clients={clients}
            saving={saving}
          />
        </main>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Invoice Preview</span>
              {previewInvoice && <PDFGenerator invoice={previewInvoice} />}
            </DialogTitle>
          </DialogHeader>
          {previewInvoice && <InvoicePreview invoice={previewInvoice} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
