import { createClient } from "@/lib/supabase/client"
import type { Invoice } from "@/lib/types"

function mapSupabaseToInvoice(data: any): Invoice {
  return {
    id: data.id,
    number: data.invoice_number,
    date: data.issue_date,
    dueDate: data.due_date,
    status: data.status,
    currency: data.currency || "USD",
    template: data.template || "modern",
    subtotal: Number(data.subtotal) || 0,
    discount: Number(data.discount) || 0,
    tax: Number(data.tax) || 0,
    totalAmount: Number(data.total_amount) || 0,
    amountPaid: Number(data.amount_paid) || 0,
    amountDue: Number(data.amount_due) || 0,
    items: data.items || [],
    client: {
      id: data.client_id,
      name: data.client_name || "Unknown Client",
      email: data.client_email || "",
      company: data.client_company || "",
      address: data.client_address || "",
      phone: data.client_phone || "",
      taxId: data.client_tax_id || "",
    },
    company: data.company_info || {
      name: "",
      email: "",
      address: "",
      phone: "",
      taxId: "",
    },
    paymentInfo: data.payment_info || {
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      notes: data.notes || "",
    },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export const invoiceService = {
  async getAll(filters?: { status?: string; clientId?: string }) {
    const supabase = createClient()
    let query = supabase.from("invoices").select("*").order("created_at", { ascending: false })

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status)
    }

    if (filters?.clientId) {
      query = query.eq("client_id", filters.clientId)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching invoices:", error)
      throw error
    }

    return (data || []).map(mapSupabaseToInvoice)
  },

  async getById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from("invoices").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] Error fetching invoice:", error)
      throw error
    }

    return mapSupabaseToInvoice(data)
  },

  async create(invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("invoices")
      .insert({
        invoice_number: invoice.number,
        client_id: invoice.client.id,
        client_name: invoice.client.name,
        client_email: invoice.client.email,
        client_company: invoice.client.company,
        client_address: invoice.client.address,
        client_phone: invoice.client.phone,
        client_tax_id: invoice.client.taxId,
        total_amount: invoice.totalAmount,
        amount_paid: invoice.amountPaid,
        amount_due: invoice.amountDue,
        currency: invoice.currency,
        status: invoice.status,
        issue_date: invoice.date,
        due_date: invoice.dueDate,
        items: invoice.items,
        payment_info: invoice.paymentInfo,
        company_info: invoice.company,
        template: invoice.template,
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        tax: invoice.tax,
        notes: invoice.paymentInfo.notes,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating invoice:", error)
      throw error
    }

    return mapSupabaseToInvoice(data)
  },

  async update(id: string, updates: Partial<Invoice>) {
    const supabase = createClient()
    const updateData: any = {}

    if (updates.status) updateData.status = updates.status
    if (updates.amountPaid !== undefined) {
      updateData.amount_paid = updates.amountPaid
      updateData.amount_due = (updates.totalAmount || 0) - updates.amountPaid
    }
    if (updates.totalAmount !== undefined) updateData.total_amount = updates.totalAmount
    if (updates.items) updateData.items = updates.items
    if (updates.paymentInfo) updateData.payment_info = updates.paymentInfo

    const { data, error } = await supabase.from("invoices").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Error updating invoice:", error)
      throw error
    }

    return mapSupabaseToInvoice(data)
  },

  async updateStatus(id: string, status: string, amountPaid?: number) {
    const supabase = createClient()

    // First get the invoice to know the total amount
    const { data: invoice, error: fetchError } = await supabase.from("invoices").select("*").eq("id", id).single()

    if (fetchError) {
      console.error("[v0] Error fetching invoice for status update:", fetchError)
      throw fetchError
    }

    const totalAmount = Number(invoice.total_amount) || 0
    const newAmountPaid = status === "paid" ? totalAmount : (amountPaid ?? (Number(invoice.amount_paid) || 0))
    const newAmountDue = totalAmount - newAmountPaid

    const { data, error } = await supabase
      .from("invoices")
      .update({
        status,
        amount_paid: newAmountPaid,
        amount_due: newAmountDue,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating invoice status:", error)
      throw error
    }

    return mapSupabaseToInvoice(data)
  },

  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("invoices").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting invoice:", error)
      throw error
    }
  },

  async getStats() {
    const supabase = createClient()
    const { data: invoices, error } = await supabase.from("invoices").select("*")

    if (error) {
      console.error("[v0] Error fetching invoice stats:", error)
      throw error
    }

    const total = invoices?.length || 0
    const paid = invoices?.filter((inv) => inv.status === "paid").length || 0
    const pending = invoices?.filter((inv) => inv.status === "pending").length || 0
    const overdue = invoices?.filter((inv) => inv.status === "overdue").length || 0
    const totalRevenue = invoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0
    const totalPaid = invoices?.reduce((sum, inv) => sum + Number(inv.amount_paid), 0) || 0
    const totalDue = invoices?.reduce((sum, inv) => sum + Number(inv.amount_due), 0) || 0

    return {
      total,
      paid,
      pending,
      overdue,
      totalRevenue,
      totalPaid,
      totalDue,
    }
  },
}
