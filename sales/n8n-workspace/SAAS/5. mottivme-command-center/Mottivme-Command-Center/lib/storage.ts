import type { Invoice, Client, Company } from "./types"

const STORAGE_KEYS = {
  INVOICES: "invoices",
  CLIENTS: "clients",
  COMPANY: "company",
  SETTINGS: "settings",
}

export const storage = {
  // Invoices
  getInvoices: (): Invoice[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.INVOICES)
    return data ? JSON.parse(data) : []
  },

  saveInvoice: (invoice: Invoice) => {
    const invoices = storage.getInvoices()
    const index = invoices.findIndex((inv) => inv.id === invoice.id)

    if (index >= 0) {
      invoices[index] = invoice
    } else {
      invoices.push(invoice)
    }

    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices))
  },

  deleteInvoice: (id: string) => {
    const invoices = storage.getInvoices().filter((inv) => inv.id !== id)
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices))
  },

  // Clients
  getClients: (): Client[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS)
    return data ? JSON.parse(data) : []
  },

  saveClient: (client: Client) => {
    const clients = storage.getClients()
    const index = clients.findIndex((c) => c.id === client.id)

    if (index >= 0) {
      clients[index] = client
    } else {
      clients.push(client)
    }

    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients))
  },

  deleteClient: (id: string) => {
    const clients = storage.getClients().filter((c) => c.id !== id)
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients))
  },

  // Company
  getCompany: (): Company | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.COMPANY)
    return data ? JSON.parse(data) : null
  },

  saveCompany: (company: Company) => {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company))
  },
}
