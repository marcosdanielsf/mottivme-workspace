"use client"

import { useState } from "react"
import { useInvoice } from "@/contexts/invoice-context"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Building2 } from "lucide-react"
import type { Company } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function SettingsPage() {
  const { company, updateCompany } = useInvoice()
  const { toast } = useToast()

  const [logo, setLogo] = useState(company.logo)
  const [name, setName] = useState(company.name)
  const [taxId, setTaxId] = useState(company.taxId)
  const [address, setAddress] = useState(company.address)
  const [email, setEmail] = useState(company.email)
  const [phone, setPhone] = useState(company.phone)
  const [bankName, setBankName] = useState(company.bankDetails.bankName)
  const [branch, setBranch] = useState(company.bankDetails.branch)
  const [account, setAccount] = useState(company.bankDetails.account)
  const [pix, setPix] = useState(company.bankDetails.pix)

  const handleSave = () => {
    const updatedCompany: Company = {
      logo,
      name,
      taxId,
      address,
      email,
      phone,
      bankDetails: {
        bankName,
        branch,
        account,
        pix,
      },
    }

    updateCompany(updatedCompany)
    toast({
      title: "Settings saved",
      description: "Your company information has been updated successfully.",
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="mt-1 text-muted-foreground">Manage your company information</p>
              </div>
              <Button size="lg" className="gap-2" onClick={handleSave}>
                <Save className="h-5 w-5" />
                Save Changes
              </Button>
            </div>

            {/* Company Info */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-primary/20 p-3">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Company Information</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo URL</Label>
                  <div className="flex gap-4 items-start">
                    <Input
                      id="logo"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="flex-1"
                    />
                    {logo && (
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border">
                        <Image src={logo || "/placeholder.svg"} alt="Company logo" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="company-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Company Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
                    <Input
                      id="tax-id"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="12.345.678/0001-90"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, State, ZIP"
                    required
                  />
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
                      placeholder="contact@company.com"
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
              </div>
            </Card>

            {/* Bank Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Bank Details</h2>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input
                      id="bank-name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Bank of America"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="0001" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="account">Account Number</Label>
                    <Input
                      id="account"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      placeholder="123456-7"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pix">PIX Key</Label>
                    <Input
                      id="pix"
                      value={pix}
                      onChange={(e) => setPix(e.target.value)}
                      placeholder="email@company.com"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button size="lg" className="gap-2" onClick={handleSave}>
                <Save className="h-5 w-5" />
                Save Changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
