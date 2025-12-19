"use client"

import { useInvoice } from "@/contexts/invoice-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, FileText, Clock, TrendingUp, Plus, AlertCircle, Users } from "lucide-react"
import Link from "next/link"
import { CURRENCY_SYMBOLS } from "@/lib/default-data"
import {
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
} from "recharts"
import { useMemo } from "react"

export function DashboardContent() {
  const { invoices, clients, loading } = useInvoice()

  const safeInvoices = invoices ?? []

  const stats = useMemo(() => {
    const total = safeInvoices.length
    const paid = safeInvoices.filter((inv) => inv.status === "paid").length
    const pending = safeInvoices.filter((inv) => inv.status === "pending").length
    const overdue = safeInvoices.filter((inv) => inv.status === "overdue").length
    const draft = safeInvoices.filter((inv) => inv.status === "draft").length

    const totalRevenue = safeInvoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0)

    const pendingAmount = safeInvoices
      .filter((inv) => inv.status === "pending" || inv.status === "overdue")
      .reduce((sum, inv) => sum + (inv.amountDue ?? 0), 0)

    const overdueAmount = safeInvoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + (inv.amountDue ?? 0), 0)

    // Calculate this month's revenue
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthRevenue = safeInvoices
      .filter((inv) => inv.status === "paid" && new Date(inv.date) >= thisMonthStart)
      .reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0)

    return {
      total,
      paid,
      pending,
      overdue,
      draft,
      totalRevenue,
      pendingAmount,
      overdueAmount,
      thisMonthRevenue,
      averageInvoice: total > 0 ? totalRevenue / paid || 0 : 0,
    }
  }, [safeInvoices])

  const revenueChartData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {}

    safeInvoices
      .filter((inv) => inv.status === "paid")
      .forEach((inv) => {
        const date = new Date(inv.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (inv.totalAmount ?? 0)
      })

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, revenue]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        revenue,
      }))
  }, [safeInvoices])

  const statusData = useMemo(
    () =>
      [
        { name: "Paid", value: stats.paid, color: "#10b981" },
        { name: "Pending", value: stats.pending, color: "#f59e0b" },
        { name: "Overdue", value: stats.overdue, color: "#ef4444" },
        { name: "Draft", value: stats.draft, color: "#6b7280" },
      ].filter((item) => item.value > 0),
    [stats],
  )

  const topClients = useMemo(() => {
    const clientRevenue: { [key: string]: { name: string; revenue: number } } = {}

    safeInvoices
      .filter((inv) => inv.status === "paid" && inv.client)
      .forEach((inv) => {
        const clientId = inv.client?.id
        if (!clientId) return
        if (!clientRevenue[clientId]) {
          clientRevenue[clientId] = { name: inv.client?.name ?? "Unknown Client", revenue: 0 }
        }
        clientRevenue[clientId].revenue += inv.totalAmount ?? 0
      })

    return Object.values(clientRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [safeInvoices])

  const upcomingDue = useMemo(() => {
    const now = new Date()
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return safeInvoices
      .filter((inv) => {
        const dueDate = new Date(inv.dueDate)
        return (inv.status === "pending" || inv.status === "overdue") && dueDate <= next7Days
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
  }, [safeInvoices])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back! Here's your financial overview</p>
        </div>
        <Link href="/invoice/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold text-foreground">${(stats.totalRevenue ?? 0).toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-primary/20 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">{stats.paid} paid invoices</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                ${(stats.thisMonthRevenue ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-success/20 p-3">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">Revenue this month</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
              <p className="mt-2 text-3xl font-bold text-foreground">${(stats.pendingAmount ?? 0).toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-warning/20 p-3">
              <Clock className="h-6 w-6 text-warning" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {stats.pending + stats.overdue} invoices awaiting payment
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue</p>
              <p className="mt-2 text-3xl font-bold text-destructive">${(stats.overdueAmount ?? 0).toLocaleString()}</p>
            </div>
            <div className="rounded-full bg-destructive/20 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">{stats.overdue} overdue invoices</div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Over Time</h3>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
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
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">No revenue data yet</div>
          )}
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Invoice Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">No invoice data yet</div>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Clients */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Top Clients by Revenue</h3>
            <Link href="/clients">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          {topClients.length > 0 ? (
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{client.name}</p>
                      <p className="text-sm text-muted-foreground">Client</p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">${(client.revenue ?? 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">No client data yet</div>
          )}
        </Card>

        {/* Upcoming Due */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Upcoming Due (Next 7 Days)</h3>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          {upcomingDue.length > 0 ? (
            <div className="space-y-4">
              {upcomingDue.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{invoice.number}</p>
                    <p className="text-sm text-muted-foreground">{invoice.client?.name ?? "Unknown Client"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {CURRENCY_SYMBOLS[invoice.currency] ?? "$"}
                      {(invoice.amountDue ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">No upcoming due invoices</div>
          )}
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Invoices</h2>
          <Link href="/history">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {safeInvoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No invoices yet</h3>
            <p className="text-muted-foreground mb-6">Create your first invoice to get started</p>
            <Link href="/invoice/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {safeInvoices.slice(0, 5).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{invoice.number}</p>
                    <p className="text-sm text-muted-foreground">{invoice.client?.name ?? "Unknown Client"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {CURRENCY_SYMBOLS[invoice.currency] ?? "$"}
                      {(invoice.totalAmount ?? 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invoice.status === "paid"
                        ? "bg-success/20 text-success"
                        : invoice.status === "overdue"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-warning/20 text-warning"
                    }`}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
