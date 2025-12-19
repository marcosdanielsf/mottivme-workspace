"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, Trash2, Filter } from "lucide-react"
import { transactionService, type Transaction } from "@/lib/services/transaction-service"
import { TransactionForm } from "@/components/transaction-form"
import { useToast } from "@/hooks/use-toast"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadTransactions()
  }, [typeFilter])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await transactionService.getAll({
        type: typeFilter !== "all" ? typeFilter : undefined,
      })
      setTransactions(data)
    } catch (error) {
      console.error("[v0] Error loading transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">) => {
    try {
      await transactionService.create(transaction)
      setIsDialogOpen(false)
      await loadTransactions()
      toast({
        title: "Success",
        description: "Transaction added successfully",
      })
    } catch (error) {
      console.error("[v0] Error saving transaction:", error)
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        setDeleting(id)
        await transactionService.delete(id)
        await loadTransactions()
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        })
      } catch (error) {
        console.error("[v0] Error deleting transaction:", error)
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        })
      } finally {
        setDeleting(null)
      }
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      (transaction.description?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false) ||
      (transaction.category?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false),
  )

  const stats = {
    totalIncome: transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + (t.amount ?? 0), 0),
    totalExpenses: transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + (t.amount ?? 0), 0),
    netProfit: 0,
  }
  stats.netProfit = stats.totalIncome - stats.totalExpenses

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
                <p className="mt-1 text-muted-foreground">Track your income and expenses</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                  </DialogHeader>
                  <TransactionForm onSave={handleSaveTransaction} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">${stats.totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-success/20 p-3">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">${stats.totalExpenses.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-destructive/20 p-3">
                    <TrendingDown className="h-6 w-6 text-destructive" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                    <p
                      className={`mt-2 text-3xl font-bold ${stats.netProfit >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      ${Math.abs(stats.netProfit).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/20 p-3">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(value) => setTypeFilter(value as "all" | "income" | "expense")}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Transaction List */}
            {filteredTransactions.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchQuery || typeFilter !== "all" ? "No transactions found" : "No transactions yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || typeFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Add your first transaction to start tracking"}
                  </p>
                  {!searchQuery && typeFilter === "all" && (
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Transaction
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Date</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Type</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Category</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Description</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Amount</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6">
                            <p className="text-sm text-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              className={
                                transaction.type === "income"
                                  ? "bg-success/20 text-success hover:bg-success/30"
                                  : "bg-destructive/20 text-destructive hover:bg-destructive/30"
                              }
                            >
                              {transaction.type === "income" ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-foreground">{transaction.category}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-muted-foreground">{transaction.description || "-"}</p>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <p
                              className={`font-semibold ${transaction.type === "income" ? "text-success" : "text-destructive"}`}
                            >
                              {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                disabled={deleting === transaction.id}
                              >
                                {deleting === transaction.id ? (
                                  <div className="h-4 w-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
