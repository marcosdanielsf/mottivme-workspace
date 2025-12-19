"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import type { Invoice } from "@/lib/types"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"

interface PDFGeneratorProps {
  invoice: Invoice
}

export function PDFGenerator({ invoice }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - margin * 2
      let y = margin

      // Helper functions
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: invoice.currency || "USD",
        }).format(amount ?? 0)
      }

      const formatDate = (dateStr: string) => {
        if (!dateStr) return ""
        return new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      }

      // Colors (RGB values)
      const colors = {
        primary: [37, 99, 235] as [number, number, number], // Blue
        dark: [17, 24, 39] as [number, number, number], // Dark gray
        gray: [107, 114, 128] as [number, number, number], // Medium gray
        lightGray: [229, 231, 235] as [number, number, number], // Light gray
        white: [255, 255, 255] as [number, number, number],
        headerBg: [30, 64, 175] as [number, number, number], // Dark blue
        red: [220, 38, 38] as [number, number, number],
      }

      // === HEADER ===
      // Company name
      pdf.setFontSize(22)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(...colors.dark)
      pdf.text(invoice.company?.name || "Company Name", margin, y)

      // INVOICE title on right
      pdf.setFontSize(28)
      pdf.setTextColor(...colors.primary)
      pdf.text("INVOICE", pageWidth - margin, y, { align: "right" })

      y += 8

      // Company address
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(...colors.gray)
      const companyAddress = invoice.company?.address || ""
      const addressLines = companyAddress.split("\n")
      addressLines.forEach((line) => {
        pdf.text(line, margin, y)
        y += 4
      })

      // Invoice details on right
      let rightY = margin + 12
      pdf.setFontSize(10)
      pdf.setTextColor(...colors.dark)
      pdf.text(`Invoice #: ${invoice.number || ""}`, pageWidth - margin, rightY, { align: "right" })
      rightY += 5
      pdf.text(`Date: ${formatDate(invoice.date)}`, pageWidth - margin, rightY, { align: "right" })
      rightY += 5
      pdf.text(`Due Date: ${formatDate(invoice.dueDate)}`, pageWidth - margin, rightY, { align: "right" })

      // Company tax ID if exists
      if (invoice.company?.taxId) {
        pdf.text(`Tax ID: ${invoice.company.taxId}`, margin, y)
        y += 4
      }

      y = Math.max(y, rightY) + 5

      // Header line
      pdf.setDrawColor(...colors.primary)
      pdf.setLineWidth(0.8)
      pdf.line(margin, y, pageWidth - margin, y)

      y += 15

      // === BILL TO / FROM ===
      const halfWidth = contentWidth / 2 - 10

      // Bill To
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(...colors.gray)
      pdf.text("BILL TO", margin, y)

      // From
      pdf.text("FROM", margin + halfWidth + 20, y)

      y += 6

      // Client details
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(...colors.dark)
      pdf.text(invoice.client?.name || "Client Name", margin, y)

      // Company name in From section
      pdf.text(invoice.company?.name || "Company Name", margin + halfWidth + 20, y)

      y += 5

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(...colors.gray)

      let leftY = y
      let rightFromY = y

      // Client company
      if (invoice.client?.company) {
        pdf.text(invoice.client.company, margin, leftY)
        leftY += 4
      }

      // Client address
      const clientAddress = invoice.client?.address || ""
      const clientAddressLines = clientAddress.split("\n")
      clientAddressLines.forEach((line) => {
        if (line.trim()) {
          pdf.text(line, margin, leftY)
          leftY += 4
        }
      })

      // Client email
      if (invoice.client?.email) {
        pdf.text(invoice.client.email, margin, leftY)
        leftY += 4
      }

      // Client phone
      if (invoice.client?.phone) {
        pdf.text(invoice.client.phone, margin, leftY)
        leftY += 4
      }

      // From section details
      if (invoice.company?.taxId) {
        pdf.text(`Tax ID: ${invoice.company.taxId}`, margin + halfWidth + 20, rightFromY)
        rightFromY += 4
      }
      if (invoice.company?.email) {
        pdf.text(invoice.company.email, margin + halfWidth + 20, rightFromY)
        rightFromY += 4
      }
      if (invoice.company?.phone) {
        pdf.text(invoice.company.phone, margin + halfWidth + 20, rightFromY)
        rightFromY += 4
      }

      y = Math.max(leftY, rightFromY) + 10

      // === ITEMS TABLE ===
      const tableStartY = y
      const colWidths = [contentWidth * 0.45, contentWidth * 0.15, contentWidth * 0.2, contentWidth * 0.2]
      const colX = [
        margin,
        margin + colWidths[0],
        margin + colWidths[0] + colWidths[1],
        margin + colWidths[0] + colWidths[1] + colWidths[2],
      ]

      // Table header background
      pdf.setFillColor(...colors.headerBg)
      pdf.rect(margin, y, contentWidth, 10, "F")

      // Table header text
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(...colors.white)
      y += 7
      pdf.text("Description", colX[0] + 3, y)
      pdf.text("Qty", colX[1] + colWidths[1] / 2, y, { align: "center" })
      pdf.text("Unit Price", colX[2] + colWidths[2] - 3, y, { align: "right" })
      pdf.text("Amount", colX[3] + colWidths[3] - 3, y, { align: "right" })

      y += 6

      // Table rows
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(...colors.dark)

      const items = invoice.items || []
      items.forEach((item, index) => {
        // Check if we need a new page
        if (y > pageHeight - 60) {
          pdf.addPage()
          y = margin
        }

        const rowHeight = 10

        // Alternate row background
        if (index % 2 === 1) {
          pdf.setFillColor(249, 250, 251)
          pdf.rect(margin, y - 3, contentWidth, rowHeight, "F")
        }

        // Row border
        pdf.setDrawColor(...colors.lightGray)
        pdf.setLineWidth(0.2)
        pdf.line(margin, y + rowHeight - 3, pageWidth - margin, y + rowHeight - 3)

        pdf.setTextColor(...colors.dark)
        pdf.setFontSize(10)

        // Description (truncate if too long)
        const description = item.description || ""
        const maxDescLength = 50
        const truncatedDesc =
          description.length > maxDescLength ? description.substring(0, maxDescLength) + "..." : description
        pdf.text(truncatedDesc, colX[0] + 3, y + 3)

        // Quantity
        pdf.text(String(item.quantity ?? 0), colX[1] + colWidths[1] / 2, y + 3, { align: "center" })

        // Unit Price
        pdf.text(formatCurrency(item.unitPrice ?? 0), colX[2] + colWidths[2] - 3, y + 3, { align: "right" })

        // Amount
        pdf.setFont("helvetica", "bold")
        pdf.text(formatCurrency(item.amount ?? 0), colX[3] + colWidths[3] - 3, y + 3, { align: "right" })
        pdf.setFont("helvetica", "normal")

        y += rowHeight
      })

      y += 10

      // === TOTALS ===
      const totalsX = pageWidth - margin - 80
      const totalsWidth = 80

      // Subtotal
      pdf.setFontSize(10)
      pdf.setTextColor(...colors.gray)
      pdf.text("Subtotal", totalsX, y)
      pdf.setTextColor(...colors.dark)
      pdf.text(formatCurrency(invoice.subtotal ?? 0), pageWidth - margin, y, { align: "right" })
      y += 6

      // Discount
      if (invoice.discount && invoice.discount > 0) {
        pdf.setTextColor(...colors.gray)
        pdf.text("Discount", totalsX, y)
        pdf.setTextColor(...colors.red)
        pdf.text(`-${formatCurrency(invoice.discount)}`, pageWidth - margin, y, { align: "right" })
        y += 6
      }

      // Tax
      if (invoice.tax && invoice.tax > 0) {
        pdf.setTextColor(...colors.gray)
        pdf.text(`Tax (${invoice.taxRate ?? 0}%)`, totalsX, y)
        pdf.setTextColor(...colors.dark)
        pdf.text(formatCurrency(invoice.tax), pageWidth - margin, y, { align: "right" })
        y += 6
      }

      y += 2

      // Total background
      pdf.setFillColor(243, 244, 246)
      pdf.roundedRect(totalsX - 5, y - 4, totalsWidth + 5, 12, 2, 2, "F")

      // Total
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(...colors.dark)
      pdf.text("Total", totalsX, y + 4)
      pdf.setTextColor(...colors.primary)
      pdf.text(formatCurrency(invoice.totalAmount ?? 0), pageWidth - margin, y + 4, { align: "right" })

      y += 20

      // === PAYMENT TERMS & NOTES ===
      if (invoice.paymentTerms || invoice.notes) {
        // Check if we need a new page
        if (y > pageHeight - 40) {
          pdf.addPage()
          y = margin
        }

        pdf.setDrawColor(...colors.lightGray)
        pdf.setLineWidth(0.3)
        pdf.line(margin, y, pageWidth - margin, y)
        y += 10

        if (invoice.paymentTerms) {
          pdf.setFontSize(9)
          pdf.setFont("helvetica", "bold")
          pdf.setTextColor(...colors.gray)
          pdf.text("PAYMENT TERMS", margin, y)
          y += 5
          pdf.setFont("helvetica", "normal")
          pdf.setTextColor(...colors.dark)
          pdf.setFontSize(10)

          const termsLines = pdf.splitTextToSize(invoice.paymentTerms, contentWidth)
          termsLines.forEach((line: string) => {
            pdf.text(line, margin, y)
            y += 5
          })
          y += 5
        }

        if (invoice.notes) {
          pdf.setFontSize(9)
          pdf.setFont("helvetica", "bold")
          pdf.setTextColor(...colors.gray)
          pdf.text("NOTES", margin, y)
          y += 5
          pdf.setFont("helvetica", "normal")
          pdf.setTextColor(...colors.dark)
          pdf.setFontSize(10)

          const notesLines = pdf.splitTextToSize(invoice.notes, contentWidth)
          notesLines.forEach((line: string) => {
            pdf.text(line, margin, y)
            y += 5
          })
        }
      }

      // === FOOTER ===
      pdf.setFontSize(9)
      pdf.setTextColor(...colors.gray)
      pdf.text("Thank you for your business!", pageWidth / 2, pageHeight - 15, { align: "center" })

      // Generate filename and save
      const clientName = invoice.client?.name || "Client"
      const fileName = `Invoice-${invoice.number}-${clientName.replace(/\s+/g, "-")}.pdf`
      pdf.save(fileName)

      toast({
        title: "PDF Downloaded",
        description: `Invoice ${invoice.number} has been downloaded successfully.`,
      })
    } catch (error) {
      console.error("PDF Generation Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={generatePDF} disabled={isGenerating} size="lg" className="gap-2">
      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          Download PDF
        </>
      )}
    </Button>
  )
}
