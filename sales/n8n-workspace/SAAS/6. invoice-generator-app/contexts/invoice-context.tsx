"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Invoice, Client, Company, InvoiceStatus } from "@/lib/types"
import { DEFAULT_COMPANY } from "@/lib/default-data"
import { invoiceService } from "@/lib/services/invoice-service"
import { clientService } from "@/lib/services/client-service"
import { useToast } from "@/hooks/use-toast"

interface InvoiceContextType {
  invoices: Invoice[]
  clients: Client[]
  company: Company
  currentInvoice: Invoice | null
  loading: boolean
  setCurrentInvoice: (invoice: Invoice | null) => void
  saveInvoice: (invoice: Invoice) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>
  saveClient: (client: Client) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  updateCompany: (company: Company) => void
  refreshInvoices: () => Promise<void>
  refreshClients: () => Promise<void>
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [company, setCompany] = useState<Company>(DEFAULT_COMPANY)
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading data from Supabase...")

      const [invoicesData, clientsData] = await Promise.all([invoiceService.getAll(), clientService.getAll()])

      console.log("[v0] Loaded invoices:", invoicesData?.length || 0)
      console.log("[v0] Loaded clients:", clientsData?.length || 0)

      setInvoices(invoicesData || [])
      setClients(clientsData || [])
      setCompany(DEFAULT_COMPANY)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load data from database",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshInvoices = async () => {
    try {
      const data = await invoiceService.getAll()
      setInvoices(data || [])
    } catch (error) {
      console.error("[v0] Error refreshing invoices:", error)
    }
  }

  const refreshClients = async () => {
    try {
      const data = await clientService.getAll()
      setClients(data || [])
    } catch (error) {
      console.error("[v0] Error refreshing clients:", error)
    }
  }

  const saveInvoice = async (invoice: Invoice) => {
    try {
      console.log("[v0] Saving invoice:", invoice.number)

      if (invoice.id && invoices.find((inv) => inv.id === invoice.id)) {
        await invoiceService.update(invoice.id, invoice)
        toast({
          title: "Success",
          description: "Invoice updated successfully",
        })
      } else {
        await invoiceService.create(invoice)
        toast({
          title: "Success",
          description: "Invoice created successfully",
        })
      }

      await refreshInvoices()
    } catch (error) {
      console.error("[v0] Error saving invoice:", error)
      toast({
        title: "Error",
        description: "Failed to save invoice",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteInvoice = async (id: string) => {
    try {
      console.log("[v0] Deleting invoice:", id)
      await invoiceService.delete(id)
      await refreshInvoices()
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      })
    } catch (error) {
      console.error("[v0] Error deleting invoice:", error)
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
    try {
      console.log("[v0] Updating invoice status:", id, status)
      await invoiceService.updateStatus(id, status)
      await refreshInvoices()
      toast({
        title: "Success",
        description: `Invoice marked as ${status}`,
      })
    } catch (error) {
      console.error("[v0] Error updating invoice status:", error)
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      })
      throw error
    }
  }

  const saveClient = async (client: Client) => {
    try {
      console.log("[v0] Saving client:", client.name)

      if (client.id && clients.find((c) => c.id === client.id)) {
        await clientService.update(client.id, client)
        toast({
          title: "Success",
          description: "Client updated successfully",
        })
      } else {
        await clientService.create(client)
        toast({
          title: "Success",
          description: "Client created successfully",
        })
      }

      await refreshClients()
    } catch (error) {
      console.error("[v0] Error saving client:", error)
      toast({
        title: "Error",
        description: "Failed to save client",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteClient = async (id: string) => {
    try {
      console.log("[v0] Deleting client:", id)
      await clientService.delete(id)
      await refreshClients()
      toast({
        title: "Success",
        description: "Client deleted successfully",
      })
    } catch (error) {
      console.error("[v0] Error deleting client:", error)
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateCompany = (newCompany: Company) => {
    setCompany(newCompany)
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        clients,
        company,
        currentInvoice,
        loading,
        setCurrentInvoice,
        saveInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        saveClient,
        deleteClient,
        updateCompany,
        refreshInvoices,
        refreshClients,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoice() {
  const context = useContext(InvoiceContext)
  if (context === undefined) {
    throw new Error("useInvoice must be used within an InvoiceProvider")
  }
  return context
}
