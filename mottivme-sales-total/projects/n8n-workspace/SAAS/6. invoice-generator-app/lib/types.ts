export interface Company {
  logo: string
  name: string
  taxId: string
  address: string
  email: string
  phone: string
  bankDetails: BankDetails
}

export interface BankDetails {
  bankName: string
  branch: string
  account: string
  pix: string
}

export interface Client {
  id: string
  name: string
  company: string
  taxId: string
  address: string
  email: string
  phone: string
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface PaymentInfo {
  terms: string
  notes: string
}

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue"
export type InvoiceTemplate = "modern" | "professional" | "minimal" | "luxury" | "creative"
export type Currency = "USD" | "BRL" | "EUR" | "GBP"

export interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  status: InvoiceStatus
  company: Company
  client: Client
  items: LineItem[]
  subtotal: number
  discount: number
  tax: number
  totalAmount: number
  amountPaid: number
  amountDue: number
  currency: Currency
  paymentInfo: PaymentInfo
  template: InvoiceTemplate
  createdAt: string
  updatedAt: string
}
