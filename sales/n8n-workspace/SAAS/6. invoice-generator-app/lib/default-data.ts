import type { Company, Client } from "./types"

export const DEFAULT_COMPANY: Company = {
  logo: "https://mottivme.com.br/wp-content/uploads/2023/11/company-7-1.webp",
  name: "MOTTIVME SALES LTDA",
  taxId: "32.408.090/0001-40",
  address: "Alameda Rio Negro, 503 Conj 2005, Barueri - SP, Brazil",
  email: "financeiro@mottivme.com.br",
  phone: "+55 11 1234-5678",
  bankDetails: {
    bankName: "BTG Pactual",
    branch: "0050",
    account: "822601-4",
    pix: "financeiro@mottivme.com.br",
  },
}

export const SAMPLE_CLIENT: Client = {
  id: "client-1",
  name: "Andrey Medeiros",
  company: "Karv Repair",
  taxId: "769187477",
  address: "108 Edgelake Dr, DeBary, FL 32713, USA",
  email: "amedeiros@karvrepair.com",
  phone: "+1 407 304 0347",
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  BRL: "R$",
  EUR: "€",
  GBP: "£",
}
