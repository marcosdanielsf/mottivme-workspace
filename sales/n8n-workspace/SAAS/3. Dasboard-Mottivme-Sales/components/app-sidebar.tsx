"use client"

import {
  Home,
  Users,
  UserCheck,
  TrendingUp,
  Trophy,
  Award,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarDays,
  BarChart3,
  Calculator,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

interface AppSidebarProps {
  currentPage?: string
  onPageChange?: (page: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
  onFiltersChange?: (filters: any) => void
}

const navigationItems = [
  { title: "Home", url: "home", icon: Home },
  { title: "Usuários", url: "users", icon: Users },
  { title: "Leads", url: "leads", icon: UserCheck },
  { title: "Evolução", url: "evolucao", icon: TrendingUp },
  { title: "Análise Crescimento", url: "growth-analysis", icon: BarChart3 },
  { title: "Ranking Motivados", url: "ranking-motivados", icon: Trophy },
  { title: "Ranking Usuários", url: "ranking-clientes", icon: Award },
  { title: "Sales Planner", url: "sales-planner", icon: Calculator },
]

export function AppSidebar({
  currentPage = "home",
  onPageChange,
  collapsed = false,
  onToggleCollapse,
  filters = {
    ano: "2025",
    periodo: "todos",
    fonteLeadBposs: "todos",
    chat: "todos",
    equipe: "todos",
  },
  onFiltersChange,
}: AppSidebarProps) {
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange?.(newFilters)
  }

  return (
    <div
      className={cn(
        "bg-slate-900 border-r border-slate-800 h-full transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-[60px]" : "w-[280px]",
      )}
    >
      {/* Header */}
      <div className={cn("border-b border-slate-800 p-4 flex items-center justify-between")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
            <span className="text-lg font-bold text-white">M</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <span className="text-lg font-semibold text-white block truncate">Mottivme Sales</span>
              <p className="text-sm text-slate-400 truncate">Dashboard Comercial</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.title}
              onClick={() => onPageChange?.(item.url)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all",
                "hover:bg-slate-800 hover:text-white text-slate-300",
                currentPage === item.url && "bg-blue-600 text-white",
                collapsed ? "justify-center px-2" : "justify-start",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Filtros */}
      {!collapsed && (
        <div className="border-t border-slate-800 p-4">
          <h3 className="mb-4 text-sm font-semibold text-white">Filtros</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ano-select" className="text-xs font-medium text-slate-400">
                Ano
              </Label>
              <Select value={filters.ano} onValueChange={(value) => handleFilterChange("ano", value)}>
                <SelectTrigger className="h-9 text-sm bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="2025" className="text-white">
                    2025
                  </SelectItem>
                  <SelectItem value="2024" className="text-white">
                    2024
                  </SelectItem>
                  <SelectItem value="2023" className="text-white">
                    2023
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo-select" className="text-xs font-medium text-slate-400">
                Período
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 text-sm bg-slate-800 border-slate-700 text-white hover:bg-slate-700 justify-between w-full"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {filters.periodo === "todos"
                        ? "Todos os meses"
                        : Array.isArray(filters.periodo)
                          ? `${filters.periodo.length} meses selecionados`
                          : filters.periodo.charAt(0).toUpperCase() + filters.periodo.slice(1)}
                    </span>
                    <Calendar className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-slate-800 border-slate-700" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">Selecionar Períodos</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFilterChange("periodo", "todos")}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Limpar
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "janeiro",
                        "fevereiro",
                        "março",
                        "abril",
                        "maio",
                        "junho",
                        "julho",
                        "agosto",
                        "setembro",
                        "outubro",
                        "novembro",
                        "dezembro",
                      ].map((mes) => {
                        const isSelected = Array.isArray(filters.periodo)
                          ? filters.periodo.includes(mes)
                          : filters.periodo === mes

                        return (
                          <div key={mes} className="flex items-center space-x-2">
                            <Checkbox
                              id={mes}
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const currentSelection = Array.isArray(filters.periodo)
                                    ? filters.periodo
                                    : filters.periodo === "todos"
                                      ? []
                                      : [filters.periodo]
                                  handleFilterChange("periodo", [...currentSelection, mes])
                                } else {
                                  const currentSelection = Array.isArray(filters.periodo)
                                    ? filters.periodo
                                    : [filters.periodo]
                                  const newSelection = currentSelection.filter((m) => m !== mes)
                                  handleFilterChange("periodo", newSelection.length === 0 ? "todos" : newSelection)
                                }
                              }}
                              className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label
                              htmlFor={mes}
                              className="text-sm text-slate-300 hover:text-white cursor-pointer capitalize"
                            >
                              {mes}
                            </Label>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilterChange("periodo", ["janeiro", "fevereiro", "março"])}
                        className="flex-1 text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      >
                        Q1 (Jan-Mar)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilterChange("periodo", ["abril", "maio", "junho"])}
                        className="flex-1 text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      >
                        Q2 (Abr-Jun)
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilterChange("periodo", ["julho", "agosto", "setembro"])}
                        className="flex-1 text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      >
                        Q3 (Jul-Set)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFilterChange("periodo", ["outubro", "novembro", "dezembro"])}
                        className="flex-1 text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      >
                        Q4 (Out-Dez)
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fonte-select" className="text-xs font-medium text-slate-400">
                Fonte do Lead BPOSS
              </Label>
              <Select
                value={filters.fonteLeadBposs}
                onValueChange={(value) => handleFilterChange("fonteLeadBposs", value)}
              >
                <SelectTrigger className="h-9 text-sm bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="todos" className="text-white">
                    Todos
                  </SelectItem>
                  <SelectItem value="trafego-lead-direct-recrutamento" className="text-white">
                    Tráfego – Lead Direct – Recrutamento
                  </SelectItem>
                  <SelectItem value="prospeccao-recrutamento" className="text-white">
                    Prospecção Recrutamento
                  </SelectItem>
                  <SelectItem value="prospeccao-consultoria" className="text-white">
                    Prospecção Consultoria
                  </SelectItem>
                  <SelectItem value="vs-trafego-lead-direct-consultoria" className="text-white">
                    VS Tráfego – Lead Direct – Consultoria
                  </SelectItem>
                  <SelectItem value="gatilho-social" className="text-white">
                    Gatilho Social – GS
                  </SelectItem>
                  <SelectItem value="novo-seguidor" className="text-white">
                    Novo Seguidor – NS
                  </SelectItem>
                  <SelectItem value="seguidores-antigos" className="text-white">
                    Seguidores antigos
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat-select" className="text-xs font-medium text-slate-400">
                Chat
              </Label>
              <Select value={filters.chat} onValueChange={(value) => handleFilterChange("chat", value)}>
                <SelectTrigger className="h-9 text-sm bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="todos" className="text-white">
                    Todos
                  </SelectItem>
                  <SelectItem value="instagram" className="text-white">
                    Instagram
                  </SelectItem>
                  <SelectItem value="whatsapp" className="text-white">
                    WhatsApp
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuarios-select" className="text-xs font-medium text-slate-400">
                Usuários
              </Label>
              <Select value={filters.equipe} onValueChange={(value) => handleFilterChange("equipe", value)}>
                <SelectTrigger className="h-9 text-sm bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="todos" className="text-white">
                    Todos
                  </SelectItem>
                  <SelectItem value="shirley-carvalho" className="text-white">
                    Shirley Carvalho
                  </SelectItem>
                  <SelectItem value="ana-paula-silva" className="text-white">
                    Ana Paula Silva
                  </SelectItem>
                  <SelectItem value="carlos-roberto-santos" className="text-white">
                    Carlos Roberto Santos
                  </SelectItem>
                  <SelectItem value="maria-fernanda-costa" className="text-white">
                    Maria Fernanda Costa
                  </SelectItem>
                  <SelectItem value="joao-pedro-oliveira" className="text-white">
                    João Pedro Oliveira
                  </SelectItem>
                  <SelectItem value="paula-regina-lima" className="text-white">
                    Paula Regina Lima
                  </SelectItem>
                  <SelectItem value="roberto-carlos-silva" className="text-white">
                    Roberto Carlos Silva
                  </SelectItem>
                  <SelectItem value="fernanda-cristina-costa" className="text-white">
                    Fernanda Cristina Costa
                  </SelectItem>
                  <SelectItem value="pedro-henrique-almeida" className="text-white">
                    Pedro Henrique Almeida
                  </SelectItem>
                  <SelectItem value="carla-regina-mendes" className="text-white">
                    Carla Regina Mendes
                  </SelectItem>
                  <SelectItem value="rafael-eduardo-costa" className="text-white">
                    Rafael Eduardo Costa
                  </SelectItem>
                  <SelectItem value="juliana-aparecida-silva" className="text-white">
                    Juliana Aparecida Silva
                  </SelectItem>
                  <SelectItem value="marcos-antonio-santos" className="text-white">
                    Marcos Antonio Santos
                  </SelectItem>
                  <SelectItem value="fernanda-beatriz-lima" className="text-white">
                    Fernanda Beatriz Lima
                  </SelectItem>
                  <SelectItem value="bruno-alexandre-oliveira" className="text-white">
                    Bruno Alexandre Oliveira
                  </SelectItem>
                  <SelectItem value="amanda-caroline-costa" className="text-white">
                    Amanda Caroline Costa
                  </SelectItem>
                  <SelectItem value="fernanda-lappe" className="text-white">
                    Fernanda Lappe
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
