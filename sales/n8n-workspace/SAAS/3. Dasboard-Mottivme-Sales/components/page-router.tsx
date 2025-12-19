"use client"
import { HomeContent } from "./home-content"
import { UsersContent } from "./users-content"
import { EvolutionContent } from "./evolution-content"
import { RankingMotivadosContent } from "./ranking-motivados-content"
import { RankingClientesContent } from "./ranking-clientes-content"
import { GrowthAnalysis } from "./growth-analysis"
import { LeadsContent } from "./leads-content"
import { SalesPlannerContent } from "./sales-planner-content"

type PageType = "home" | "users" | "leads" | "evolucao" | "growth-analysis" | "ranking-motivados" | "ranking-clientes" | "sales-planner"

interface PageRouterProps {
  currentPage: PageType
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
}

export function PageRouter({ currentPage, filters }: PageRouterProps) {
  switch (currentPage) {
    case "home":
      return <HomeContent filters={filters} />
    case "users":
      return <UsersContent filters={filters} />
    case "leads":
      return <LeadsContent filters={filters} />
    case "evolucao":
      return <EvolutionContent filters={filters} />
    case "ranking-motivados":
      return <RankingMotivadosContent filters={filters} />
    case "ranking-clientes":
      return <RankingClientesContent filters={filters} />
    case "growth-analysis":
      return <GrowthAnalysis filters={filters} />
    case "sales-planner":
      return <SalesPlannerContent filters={filters} />
    default:
      return <HomeContent filters={filters} />
  }
}
