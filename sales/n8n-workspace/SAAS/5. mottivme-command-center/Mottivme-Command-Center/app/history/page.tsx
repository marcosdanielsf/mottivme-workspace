"use client"

import { useState } from "react"
import { useInvoice } from "@/contexts/invoice-context"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  FileText,
  Eye,
  Trash2,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  FileEdit,
} from "lucide-react"
import { CURRENCY_SYMBOLS } from "@/lib/default-data"
import type { Invoice, InvoiceStatus } from "@/lib/types"
import { InvoicePreview } from "@/components/invoice-preview"
import { PDFGenerator } from "@/components/pdf-generator"

export default function HistoryPage() {
  const { invoices, deleteInvoice, updateInvoiceStatus, loading } = useInvoice()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "amount" | "number">("date")
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const filteredInvoices = (invoices ?? [])
    .filter((invoice) => {
      const matchesSearch =
        invoice.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.client?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false

      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "amount":
          return (b.totalAmount ?? 0) - (a.totalAmount ?? 0)
        case "number":
          return (b.number ?? "").localeCompare(a.number ?? "")
        default:
          return 0
      }
    })

  const handleViewInvoice = (invoice: Invoice) => {
    setPreviewInvoice(invoice)
    setShowPreview(true)
  }

  const handleDeleteInvoice = async (id: string, number: string) => {
    if (confirm(`Are you sure you want to delete invoice ${number}?`)) {
      try {
        setDeleting(id)
        await deleteInvoice(id)
      } catch (error) {
        console.error("[v0] Error deleting invoice:", error)
      } finally {
        setDeleting(null)
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: InvoiceStatus) => {
    try {
      setUpdatingStatus(id)
      await updateInvoiceStatus(id, newStatus)
    } catch (error) {
      console.error("[v0] Error updating status:", error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "bg-success/20 text-success hover:bg-success/30"
      case "pending":
        return "bg-warning/20 text-warning hover:bg-warning/30"
      case "overdue":
        return "bg-destructive/20 text-destructive hover:bg-destructive/30"
      case "draft":
        return "bg-muted text-muted-foreground hover:bg-muted/80"
      default:
        return "bg-muted text-muted-foreground"
    }
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
              <p className="text-muted-foreground">Loading invoices...</p>
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
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Invoice History</h1>
                <p className="mt-1 text-muted-foreground">View and manage all your invoices</p>
              </div>
            </div>

            <Card className="p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as InvoiceStatus | "all")}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "amount" | "number")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date (Newest First)</SelectItem>
                    <SelectItem value="amount">Amount (Highest First)</SelectItem>
                    <SelectItem value="number">Invoice Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
              <Card className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{invoices?.length ?? 0}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                <p className="mt-2 text-3xl font-bold text-success">
                  {invoices?.filter((inv) => inv.status === "paid").length ?? 0}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="mt-2 text-3xl font-bold text-warning">
                  {invoices?.filter((inv) => inv.status === "pending").length ?? 0}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="mt-2 text-3xl font-bold text-destructive">
                  {invoices?.filter((inv) => inv.status === "overdue").length ?? 0}
                </p>
              </Card>
            </div>

            {filteredInvoices.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchQuery || statusFilter !== "all" ? "No invoices found" : "No invoices yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Create your first invoice to get started"}
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Invoice</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Client</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Date</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Due Date</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Amount</th>
                        <th className="text-center py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{invoice.number ?? "N/A"}</p>
                                <p className="text-xs text-muted-foreground">{invoice.template ?? "modern"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-foreground">{invoice.client?.name ?? "Unknown Client"}</p>
                            <p className="text-sm text-muted-foreground">{invoice.client?.company ?? ""}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-foreground">
                              {invoice.date ? new Date(invoice.date).toLocaleDateString() : "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-foreground">
                              {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <p className="font-semibold text-foreground">
                              {CURRENCY_SYMBOLS[invoice.currency] ?? "$"}
                              {(invoice.totalAmount ?? 0).toLocaleString()}
                            </p>
                            {(invoice.amountDue ?? 0) > 0 && invoice.status !== "paid" && (
                              <p className="text-xs text-muted-foreground">
                                Due: {CURRENCY_SYMBOLS[invoice.currency] ?? "$"}
                                {(invoice.amountDue ?? 0).toLocaleString()}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status
                                ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
                                : "Unknown"}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewInvoice(invoice)}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={updatingStatus === invoice.id}
                                  >
                                    {updatingStatus === invoice.id ? (
                                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <MoreHorizontal className="h-4 w-4" />
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(invoice.id, "paid")}
                                    disabled={invoice.status === "paid"}
                                    className="gap-2"
                                  >
                                    <CheckCircle className="h-4 w-4 text-success" />
                                    Mark as Paid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(invoice.id, "pending")}
                                    disabled={invoice.status === "pending"}
                                    className="gap-2"
                                  >
                                    <Clock className="h-4 w-4 text-warning" />
                                    Mark as Pending
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(invoice.id, "overdue")}
                                    disabled={invoice.status === "overdue"}
                                    className="gap-2"
                                  >
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                    Mark as Overdue
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(invoice.id, "draft")}
                                    disabled={invoice.status === "draft"}
                                    className="gap-2"
                                  >
                                    <FileEdit className="h-4 w-4 text-muted-foreground" />
                                    Mark as Draft
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteInvoice(invoice.id, invoice.number)}
                                    className="gap-2 text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Invoice
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
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
