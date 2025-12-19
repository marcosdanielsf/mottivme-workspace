export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          company: string | null
          phone: string | null
          address: string | null
          tax_id: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["clients"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          client_id: string | null
          client_name: string
          client_email: string | null
          client_company: string | null
          client_address: string | null
          client_phone: string | null
          client_tax_id: string | null
          total_amount: number
          amount_paid: number
          amount_due: number
          currency: string
          status: "draft" | "pending" | "paid" | "overdue" | "cancelled"
          issue_date: string
          due_date: string
          items: any
          payment_info: any
          company_info: any
          template: string
          subtotal: number
          discount: number
          tax: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["invoices"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>
      }
      transactions: {
        Row: {
          id: string
          invoice_id: string | null
          type: "income" | "expense"
          category: string
          amount: number
          currency: string
          description: string | null
          date: string
          payment_method: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["transactions"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>
      }
      company_settings: {
        Row: {
          id: string
          name: string
          tax_id: string | null
          address: string | null
          email: string | null
          phone: string | null
          logo: string | null
          bank_name: string | null
          bank_branch: string | null
          bank_account: string | null
          bank_pix: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["company_settings"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["company_settings"]["Insert"]>
      }
    }
  }
}
