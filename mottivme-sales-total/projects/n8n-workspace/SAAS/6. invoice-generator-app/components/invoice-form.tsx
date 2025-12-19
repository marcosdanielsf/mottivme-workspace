"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, Eye } from "lucide-react"
import type { Invoice, LineItem, Client, Company, Currency, InvoiceStatus, InvoiceTemplate } from "@/lib/types"
import { CURRENCY_SYMBOLS } from "@/lib/default-data"

interface InvoiceFormProps {
  onSave: (invoice: Invoice) => void
  onPreview?: (invoice: Invoice) => void
  company: Company
  clients: Client[]
  initialInvoice?: Invoice
}

export function InvoiceForm({ onSave, onPreview, company, clients, initialInvoice }: InvoiceFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState(initialInvoice?.number || `INV-${Date.now()}`)
  const [date, setDate] = useState(initialInvoice?.date || new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState(
    initialInvoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [selectedClientId, setSelectedClientId] = useState(initialInvoice?.client.id || clients[0]?.id || "")
  const [currency, setCurrency] = useState<Currency>(initialInvoice?.currency || "USD")
  const [status, setStatus] = useState<InvoiceStatus>(initialInvoice?.status || "draft")
  const [template, setTemplate] = useState<InvoiceTemplate>(initialInvoice?.template || "modern")
  const [items, setItems] = useState<LineItem[]>(
    initialInvoice?.items || [
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ],
  )
  const [discount, setDiscount] = useState(initialInvoice?.discount || 0)
  const [tax, setTax] = useState(initialInvoice?.tax || 0)
  const [paymentTerms, setPaymentTerms] = useState(initialInvoice?.paymentInfo.terms || "Net 30")
  const [notes, setNotes] = useState(initialInvoice?.paymentInfo.notes || "")

  const selectedClient = clients.find((c) => c.id === selectedClientId)

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const discountAmount = (subtotal * discount) / 100
  const taxAmount = ((subtotal - discountAmount) * tax) / 100
  const totalAmount = subtotal - discountAmount + taxAmount

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updated.amount = updated.quantity * updated.unitPrice
          }
          return updated
        }
        return item
      }),
    )
  }

  const buildInvoice = (): Invoice | null => {
    if (!selectedClient) return null

    return {
      id: initialInvoice?.id || `invoice-${Date.now()}`,
      number: invoiceNumber,
      date,
      dueDate,
      status,
      company,
      client: selectedClient,
      items,
      subtotal,
      discount,
      tax,
      totalAmount,
      amountPaid: initialInvoice?.amountPaid || 0,
      amountDue: totalAmount - (initialInvoice?.amountPaid || 0),
      currency,
      paymentInfo: {
        terms: paymentTerms,
        notes,
      },
      template,
      createdAt: initialInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  const handleSave = () => {
    const invoice = buildInvoice()
    if (invoice) {
      onSave(invoice)
    }
  }

  const handlePreview = () => {
    const invoice = buildInvoice()
    if (invoice && onPreview) {
      onPreview(invoice)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {initialInvoice ? "Edit Invoice" : "Create New Invoice"}
          </h1>
          <p className="mt-1 text-muted-foreground">Fill in the details to generate your invoice</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="gap-2 bg-transparent" onClick={handlePreview}>
            <Eye className="h-5 w-5" />
            Preview
          </Button>
          <Button size="lg" className="gap-2" onClick={handleSave}>
            <Save className="h-5 w-5" />
            Save Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Details */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Invoice Details</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="invoice-number">Invoice Number</Label>
            <Input
              id="invoice-number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Invoice Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="BRL">BRL (R$)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as InvoiceStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={template} onValueChange={(value) => setTemplate(value as InvoiceTemplate)}>
              <SelectTrigger id="template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Client Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Bill To</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Select Client</Label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedClient && (
            <div className="rounded-lg bg-muted/50 p-4 space-y-1">
              <p className="font-medium text-foreground">{selectedClient.name}</p>
              <p className="text-sm text-muted-foreground">{selectedClient.company}</p>
              <p className="text-sm text-muted-foreground">{selectedClient.address}</p>
              <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
              <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Line Items */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Items</h2>
          <Button onClick={addItem} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid gap-4 md:grid-cols-12 items-end">
              <div className="md:col-span-5 space-y-2">
                <Label htmlFor={`desc-${item.id}`}>Description</Label>
                <Input
                  id={`desc-${item.id}`}
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor={`qty-${item.id}`}>Quantity</Label>
                <Input
                  id={`qty-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor={`price-${item.id}`}>Unit Price</Label>
                <Input
                  id={`price-${item.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Amount</Label>
                <div className="h-10 flex items-center px-3 rounded-md bg-muted text-foreground font-medium">
                  {CURRENCY_SYMBOLS[currency]}
                  {item.amount.toFixed(2)}
                </div>
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Totals */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Totals</h2>
        <div className="space-y-4 max-w-md ml-auto">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              {CURRENCY_SYMBOLS[currency]}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="discount" className="text-muted-foreground">
              Discount (%)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={discount}
                onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                className="w-24"
              />
              <span className="font-medium text-foreground w-24 text-right">
                -{CURRENCY_SYMBOLS[currency]}
                {discountAmount.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="tax" className="text-muted-foreground">
              Tax (%)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="tax"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={tax}
                onChange={(e) => setTax(Number.parseFloat(e.target.value) || 0)}
                className="w-24"
              />
              <span className="font-medium text-foreground w-24 text-right">
                +{CURRENCY_SYMBOLS[currency]}
                {taxAmount.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">
                {CURRENCY_SYMBOLS[currency]}
                {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Payment Information</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-terms">Payment Terms</Label>
            <Input
              id="payment-terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="Net 30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or payment instructions..."
              rows={4}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="lg">
          Cancel
        </Button>
        <Button size="lg" className="gap-2" onClick={handleSave}>
          <Save className="h-5 w-5" />
          Save Invoice
        </Button>
      </div>
    </div>
  )
}
