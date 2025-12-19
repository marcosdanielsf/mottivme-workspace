"use client"

import { useState } from "react"
import { AppSidebar } from "./components/app-sidebar"
import { PageRouter } from "./components/page-router"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "users" | "leads" | "evolucao" | "growth-analysis" | "ranking-motivados" | "ranking-clientes" | "sales-planner"
  >("home")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filters, setFilters] = useState({
    ano: "2025",
    periodo: "todos" as string | string[],
    fonteLeadBposs: "todos",
    chat: "todos",
    equipe: "todos",
  })

  return (
    <SidebarProvider>
      <div className="h-screen w-full bg-slate-950 flex overflow-hidden">
        <AppSidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <main className="flex-1 overflow-auto">
          <PageRouter currentPage={currentPage} filters={filters} />
        </main>
      </div>
    </SidebarProvider>
  )
}
