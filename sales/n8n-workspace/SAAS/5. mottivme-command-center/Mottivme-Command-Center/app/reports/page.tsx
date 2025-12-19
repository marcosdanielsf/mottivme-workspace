"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useInvoice } from "@/contexts/invoice-context"
import { transactionService, type Transaction } from "@/lib/services/transaction-service"
import { Download, TrendingUp, TrendingDown, DollarSign, FileText, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type TimeRange = "7d" | "30d" | "90d" | "1y" | "all"

export default function ReportsPage() {
  const { invoices, clients, loading: invoicesLoading } = useInvoice()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const { toast } = useToast()

  const safeInvoices = invoices ?? []
  const safeClients = clients ?? []

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await transactionService.getAll()
      setTransactions(data ?? [])
    } catch (error) {
      console.error("[v0] Error loading transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transaction data",
        variant: "destructive",
      })
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const getDateRange = (range: TimeRange) => {
    const now = new Date()
    const start = new Date()

    switch (range) {
      case "7d":
        start.setDate(now.getDate() - 7)
        break
      case "30d":
        start.setDate(now.getDate() - 30)
        break
      case "90d":
        start.setDate(now.getDate() - 90)
        break
      case "1y":
        start.setFullYear(now.getFullYear() - 1)
        break
      case "all":
        start.setFullYear(2000)
        break
    }

    return { start, end: now }
  }

  const filteredData = useMemo(() => {
    const { start, end } = getDateRange(timeRange)

    const filteredInvoices = safeInvoices.filter((inv) => {
      const date = new Date(inv.date)
      return date >= start && date <= end
    })

    const filteredTransactions = transactions.filter((txn) => {
      const date = new Date(txn.date)
      return date >= start && date <= end
    })

    return { invoices: filteredInvoices, transactions: filteredTransactions }
  }, [safeInvoices, transactions, timeRange])

  const stats = useMemo(() => {
    const totalRevenue = filteredData.invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0)

    const totalIncome = filteredData.transactions
      .filter((txn) => txn.type === "income")
      .reduce((sum, txn) => sum + (txn.amount ?? 0), 0)

    const totalExpenses = filteredData.transactions
      .filter((txn) => txn.type === "expense")
      .reduce((sum, txn) => sum + (txn.amount ?? 0), 0)

    const netProfit = totalRevenue + totalIncome - totalExpenses

    const pendingAmount = filteredData.invoices
      .filter((inv) => inv.status === "pending" || inv.status === "overdue")
      .reduce((sum, inv) => sum + (inv.amountDue ?? 0), 0)

    return {
      totalRevenue,
      totalIncome,
      totalExpenses,
      netProfit,
      pendingAmount,
      totalInvoices: filteredData.invoices.length,
      paidInvoices: filteredData.invoices.filter((inv) => inv.status === "paid").length,
    }
  }, [filteredData])

  const monthlyRevenueData = useMemo(() => {
    const monthlyData: { [key: string]: { revenue: number; expenses: number; profit: number } } = {}

    filteredData.invoices
      .filter((inv) => inv.status === "paid")
      .forEach((inv) => {
        const date = new Date(inv.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, expenses: 0, profit: 0 }
        }
        monthlyData[monthKey].revenue += inv.totalAmount ?? 0
      })

    filteredData.transactions.forEach((txn) => {
      const date = new Date(txn.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, expenses: 0, profit: 0 }
      }
      if (txn.type === "income") {
        monthlyData[monthKey].revenue += txn.amount ?? 0
      } else {
        monthlyData[monthKey].expenses += txn.amount ?? 0
      }
    })

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        revenue: data.revenue,
        expenses: data.expenses,
        profit: data.revenue - data.expenses,
      }))
  }, [filteredData])

  const categoryExpenseData = useMemo(() => {
    const categoryData: { [key: string]: number } = {}

    filteredData.transactions
      .filter((txn) => txn.type === "expense")
      .forEach((txn) => {
        const category = txn.category ?? "Other"
        categoryData[category] = (categoryData[category] || 0) + (txn.amount ?? 0)
      })

    return Object.entries(categoryData)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => ({ category, amount }))
  }, [filteredData])

  const clientRevenueData = useMemo(() => {
    const clientData: { [key: string]: { name: string; revenue: number; invoices: number } } = {}

    filteredData.invoices
      .filter((inv) => inv.status === "paid" && inv.client)
      .forEach((inv) => {
        const clientId = inv.client?.id
        if (!clientId) return
        if (!clientData[clientId]) {
          clientData[clientId] = { name: inv.client?.name ?? "Unknown Client", revenue: 0, invoices: 0 }
        }
        clientData[clientId].revenue += inv.totalAmount ?? 0
        clientData[clientId].invoices += 1
      })

    return Object.values(clientData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }, [filteredData])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

  const handleExportReport = () => {
    const reportData = {
      timeRange,
      generatedAt: new Date().toISOString(),
      stats,
      monthlyRevenue: monthlyRevenueData,
      categoryExpenses: categoryExpenseData,
      clientRevenue: clientRevenueData,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financial-report-${timeRange}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Report exported successfully",
    })
  }

  if (loading || invoicesLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading reports...</p>
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
                <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
                <p className="mt-1 text-muted-foreground">Comprehensive financial insights and trends</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExportReport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      ${(stats.totalRevenue ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/20 p-3">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{stats.paidInvoices} paid invoices</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      ${(stats.totalExpenses ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-full bg-destructive/20 p-3">
                    <TrendingDown className="h-6 w-6 text-destructive" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Operating costs</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                    <p
                      className={`mt-2 text-3xl font-bold ${(stats.netProfit ?? 0) >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      ${Math.abs(stats.netProfit ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-full bg-success/20 p-3">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {(stats.netProfit ?? 0) >= 0 ? "Profitable" : "Loss"} period
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      ${(stats.pendingAmount ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-full bg-warning/20 p-3">
                    <FileText className="h-6 w-6 text-warning" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Awaiting payment</p>
              </Card>
            </div>

            {/* Revenue vs Expenses Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue vs Expenses Over Time</h3>
              {monthlyRevenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  No data available for selected period
                </div>
              )}
            </Card>

            {/* Profit Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profit Trend</h3>
              {monthlyRevenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} name="Net Profit" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for selected period
                </div>
              )}
            </Card>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Expense by Category */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Expenses by Category</h3>
                {categoryExpenseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryExpenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {categoryExpenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No expense data available
                  </div>
                )}
              </Card>

              {/* Top Clients */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Top Clients by Revenue</h3>
                {clientRevenueData.length > 0 ? (
                  <div className="space-y-4">
                    {clientRevenueData.map((client, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.invoices} invoices</p>
                          </div>
                        </div>
                        <p className="font-semibold text-foreground">${(client.revenue ?? 0).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">No client data available</div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
