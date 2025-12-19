import { createClient } from "@/lib/supabase/client"
import type { Client } from "@/lib/types"

export const clientService = {
  async getAll() {
    const supabase = createClient()
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching clients:", error)
      throw error
    }

    return data as Client[]
  },

  async getById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] Error fetching client:", error)
      throw error
    }

    return data as Client
  },

  async create(client: Omit<Client, "id">) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("clients")
      .insert({
        name: client.name,
        email: client.email,
        company: client.company,
        phone: client.phone,
        address: client.address,
        tax_id: client.taxId,
        country: client.country || "USA",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating client:", error)
      throw error
    }

    return data
  },

  async update(id: string, updates: Partial<Client>) {
    const supabase = createClient()
    const updateData: any = {}

    if (updates.name) updateData.name = updates.name
    if (updates.email) updateData.email = updates.email
    if (updates.company) updateData.company = updates.company
    if (updates.phone) updateData.phone = updates.phone
    if (updates.address) updateData.address = updates.address
    if (updates.taxId) updateData.tax_id = updates.taxId
    if (updates.country) updateData.country = updates.country

    const { data, error } = await supabase.from("clients").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Error updating client:", error)
      throw error
    }

    return data
  },

  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from("clients").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting client:", error)
      throw error
    }
  },
}
