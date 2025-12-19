import { createClient } from "@/lib/supabase/client"

export interface Transaction {
  id: string
  invoiceId?: string
  type: "income" | "expense"
  category: string
  amount: number
  currency: string
  description?: string
  date: string
  paymentMethod?: string
  createdAt: string
}

export const transactionService = {
  async getAll(filters?: { type?: string; startDate?: string; endDate?: string }) {
    const supabase = createClient()
    let query = supabase.from("transactions").select("*").order("date", { ascending: false })

    if (filters?.type && filters.type !== "all") {
      query = query.eq("type", filters.type)
    }

    if (filters?.startDate) {
      query = query.gte("date", filters.startDate)
    }

    if (filters?.endDate) {
      query = query.lte("date", filters.endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching transactions:", error)
      throw error
    }

    return data as Transaction[]
  },

  async create(transaction: Omit<Transaction, "id" | "createdAt">) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        invoice_id: transaction.invoiceId,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        date: transaction.date,
        payment_method: transaction.paymentMethod,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating transaction:", error)
      throw error
    }

    return data
  },

  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("transactions").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting transaction:", error)
      throw error
    }
  },

  async getStats() {
    const supabase = createClient()
    const { data: transactions, error } = await supabase.from("transactions").select("*")

    if (error) {
      console.error("[v0] Error fetching transaction stats:", error)
      throw error
    }

    const totalIncome =
      transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0

    const totalExpenses =
      transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0

    const netProfit = totalIncome - totalExpenses

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      transactionCount: transactions?.length || 0,
    }
  },
}
