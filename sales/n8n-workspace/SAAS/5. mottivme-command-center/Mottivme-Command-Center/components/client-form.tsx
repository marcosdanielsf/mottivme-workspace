"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import type { Client } from "@/lib/types"

interface ClientFormProps {
  onSave: (client: Client) => void
  initialClient?: Client
}

export function ClientForm({ onSave, initialClient }: ClientFormProps) {
  const [name, setName] = useState(initialClient?.name || "")
  const [company, setCompany] = useState(initialClient?.company || "")
  const [taxId, setTaxId] = useState(initialClient?.taxId || "")
  const [address, setAddress] = useState(initialClient?.address || "")
  const [email, setEmail] = useState(initialClient?.email || "")
  const [phone, setPhone] = useState(initialClient?.phone || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const client: Client = {
      id: initialClient?.id || `client-${Date.now()}`,
      name,
      company,
      taxId,
      address,
      email,
      phone,
    }

    onSave(client)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">
            Company <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            required
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 234 567 8900"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="taxId">Tax ID / VAT Number</Label>
        <Input id="taxId" value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="123-45-6789" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St, City, State, ZIP"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" size="lg" className="gap-2">
          <Save className="h-5 w-5" />
          {initialClient ? "Update Client" : "Add Client"}
        </Button>
      </div>
    </form>
  )
}
