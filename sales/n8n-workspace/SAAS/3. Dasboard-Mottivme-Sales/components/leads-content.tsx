"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { EnhancedTable } from "./enhanced-table"
import { Search, Filter, Download, Eye, Phone, Mail, Calendar, User, Building } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { LeadWithUser } from "@/lib/supabase"

interface LeadsContentProps {
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
}

// Status mapping para cores e labels
const statusConfig = {
  prospectado: { label: "Prospectado", color: "bg-gray-500", textColor: "text-gray-100" },
  lead: { label: "Lead", color: "bg-blue-500", textColor: "text-blue-100" },
  qualificado: { label: "Qualificado", color: "bg-yellow-500", textColor: "text-yellow-100" },
  agendado: { label: "Agendado", color: "bg-purple-500", textColor: "text-purple-100" },
  no_show: { label: "No Show", color: "bg-orange-500", textColor: "text-orange-100" },
  call_realizada: { label: "Call Realizada", color: "bg-indigo-500", textColor: "text-indigo-100" },
  ganho: { label: "Ganho", color: "bg-green-500", textColor: "text-green-100" },
  perdido: { label: "Perdido", color: "bg-red-500", textColor: "text-red-100" },
}

// Colunas da tabela
const leadsColumns = [
  { key: "lead", label: "Lead", sticky: true, minWidth: "250px" },
  { key: "contato", label: "Contato", minWidth: "200px" },
  { key: "fonte", label: "Fonte", minWidth: "200px" },
  { key: "status", label: "Status", align: "center", minWidth: "120px" },
  { key: "responsavel", label: "Responsável", minWidth: "180px" },
  { key: "permissao", label: "Permissão", align: "center", minWidth: "100px" },
  { key: "datas", label: "Datas", minWidth: "150px" },
  { key: "valores", label: "Valores", align: "right", minWidth: "120px" },
  { key: "acoes", label: "Ações", align: "center", minWidth: "100px" },
]

export function LeadsContent({ filters }: LeadsContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [fonteFilter, setFonteFilter] = useState("todos")
  const [leads, setLeads] = useState<LeadWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar leads do Supabase
  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true)
        setError(null)

        // 1) Fetch raw leads
        const { data: leadsData, error: leadsErr } = await supabase
          .from("leads")
          .select("*")
          .order("data_criacao", { ascending: false })

        if (leadsErr) throw leadsErr

        // 2) Fetch users just once
        const { data: usersData, error: usersErr } = await supabase.from("usuarios").select("id, nome, equipe")

        if (usersErr) throw usersErr

        // 3) Join in JS
        const leadsWithUsers = (leadsData ?? []).map((lead) => ({
          ...lead,
          usuario_responsavel: usersData?.find((u) => u.id === lead.usuario_responsavel_id),
        }))

        setLeads(leadsWithUsers as LeadWithUser[])
      } catch (err) {
        console.error("Erro ao buscar leads:", err)
        setError("Erro ao carregar os leads. Verifique sua conexão.")
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  // Filtrar dados baseado nos filtros e busca
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Filtro de busca
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        if (
          !lead.nome.toLowerCase().includes(searchLower) &&
          !lead.email?.toLowerCase().includes(searchLower) &&
          !lead.telefone?.includes(searchTerm) &&
          !lead.usuario_responsavel?.nome.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Filtro de status
      if (statusFilter !== "todos" && lead.status !== statusFilter) {
        return false
      }

      // Filtro de fonte
      if (fonteFilter !== "todos" && lead.fonte_lead !== fonteFilter) {
        return false
      }

      // Filtros globais
      if (filters) {
        if (filters.equipe !== "todos") {
          // Mapear usuários para equipes
          const userToTeam = {
            "shirley-carvalho": "Shirley Carvalho",
            "fernanda-lappe": "Fernanda Lappe",
            "andre-rosa": "André Rosa",
            "claudia-fehribach": "Cláudia Fehribach",
            "gladson-almeida": "Gladson Almeida",
            "milton": "Milton",
            "ana-karina": "Ana Karina",
            "meguro-financial": "Meguro Financial",
            "julia-supa": "Julia Supa",
            "melina-wiebusch": "Melina Wiebusch",
            "gustavo-couto": "Gustavo Couto",
            "renata": "Renata",
            };

          if (filters.equipe in userToTeam) {
            // Filtro por usuário específico
            const userName = userToTeam[filters.equipe as keyof typeof userToTeam]
            if (lead.usuario_responsavel?.nome !== userName) {
              return false
            }
          } else if (lead.equipe !== filters.equipe) {
            return false
          }
        }

        if (filters.chat !== "todos" && lead.canal_chat !== filters.chat) {
          return false
        }

        if (filters.fonteLeadBposs !== "todos") {
          // Mapear códigos de fonte para nomes completos
          const fonteMap = {
            "trafego-lead-direct-recrutamento": "Tráfego – Lead Direct – Recrutamento",
            "prospeccao-recrutamento": "Prospecção Recrutamento",
            "prospeccao-consultoria": "Prospecção Consultoria",
            "vs-trafego-lead-direct-consultoria": "VS Tráfego – Lead Direct – Consultoria",
            "gatilho-social": "Gatilho Social – GS",
            "novo-seguidor": "Novo Seguidor – NS",
            "seguidores-antigos": "Seguidores antigos",
          }

          const fonteNome = fonteMap[filters.fonteLeadBposs as keyof typeof fonteMap]
          if (fonteNome && lead.fonte_lead !== fonteNome) {
            return false
          }
        }
      }

      return true
    })
  }, [leads, searchTerm, statusFilter, fonteFilter, filters])

  // Preparar dados formatados para a tabela
  const formattedLeads = filteredLeads.map((lead) => ({
    lead: (
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-slate-300" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-white truncate">{lead.nome}</div>
          <div className="text-sm text-slate-400 truncate">ID: {lead.id}</div>
        </div>
      </div>
    ),
    contato: (
      <div className="space-y-1">
        {lead.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 truncate">{lead.email}</span>
          </div>
        )}
        {lead.telefone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300">{lead.telefone}</span>
          </div>
        )}
        {lead.canal_chat && (
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 text-xs">{lead.canal_chat === "instagram" ? "Instagram" : "WhatsApp"}</span>
          </div>
        )}
      </div>
    ),
    fonte: (
      <div className="text-sm text-slate-300">
        <div className="font-medium truncate">{lead.fonte_lead}</div>
      </div>
    ),
    status: (
      <Badge className={`${statusConfig[lead.status].color} ${statusConfig[lead.status].textColor} border-0`}>
        {statusConfig[lead.status].label}
      </Badge>
    ),
    responsavel: (
      <div className="text-sm">
        <div className="font-medium text-white">{lead.usuario_responsavel?.nome || "N/A"}</div>
        <div className="text-xs text-slate-400">{lead.equipe === "equipe-a" ? "Equipe A" : "Equipe B"}</div>
      </div>
    ),
    permissao: (
      <Badge className={lead.tem_permissao_trabalho ? "bg-green-500 text-green-100" : "bg-red-500 text-red-100"}>
        {lead.tem_permissao_trabalho ? "Sim" : "Não"}
      </Badge>
    ),
    datas: (
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-slate-400" />
          <span className="text-slate-300">Prosp: {new Date(lead.data_prospeccao).toLocaleDateString("pt-BR")}</span>
        </div>
        {lead.data_qualificacao && (
          <div className="text-slate-400">Qual: {new Date(lead.data_qualificacao).toLocaleDateString("pt-BR")}</div>
        )}
        {lead.data_agendamento && (
          <div className="text-slate-400">Agend: {new Date(lead.data_agendamento).toLocaleDateString("pt-BR")}</div>
        )}
      </div>
    ),
    valores: (
      <div className="text-sm text-right">
        {lead.ticket_medio && <div className="text-slate-300">Ticket: R$ {lead.ticket_medio.toLocaleString()}</div>}
        {lead.valor_fechamento && (
          <div className="text-green-400 font-medium">Fechado: R$ {lead.valor_fechamento.toLocaleString()}</div>
        )}
      </div>
    ),
    acoes: (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
          <Phone className="h-4 w-4" />
        </Button>
      </div>
    ),
  }))

  // Calcular estatísticas
  const stats = {
    total: filteredLeads.length,
    prospectados: filteredLeads.filter((l) => l.status === "prospectado").length,
    qualificados: filteredLeads.filter((l) => l.status === "qualificado").length,
    agendados: filteredLeads.filter((l) => l.status === "agendado").length,
    ganhos: filteredLeads.filter((l) => l.status === "ganho").length,
    perdidos: filteredLeads.filter((l) => l.status === "perdido").length,
    comPermissao: filteredLeads.filter((l) => l.tem_permissao_trabalho).length,
    valorTotal: filteredLeads.reduce((sum, l) => sum + (l.valor_fechamento || 0), 0),
  }

  // Fontes únicas para o filtro
  const fontesUnicas = [...new Set(leads.map((lead) => lead.fonte_lead))]

  if (loading) {
    return (
      <div className="h-full w-full bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Carregando leads...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full bg-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-slate-950 overflow-auto">
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <SidebarTrigger className="text-white hover:bg-slate-800" />
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Gestão de Leads</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Acompanhe todos os leads do funil de vendas ({leads.length} leads no total)
              {filters && (
                <span className="text-blue-400 ml-2">
                  | Filtros ativos: {filters.equipe !== "todos" ? "Usuário/Equipe" : ""}{" "}
                  {filters.chat !== "todos" ? "Chat" : ""}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Total</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Prospectados</div>
              <div className="text-2xl font-bold text-gray-400">{stats.prospectados}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Qualificados</div>
              <div className="text-2xl font-bold text-yellow-400">{stats.qualificados}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Agendados</div>
              <div className="text-2xl font-bold text-purple-400">{stats.agendados}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Ganhos</div>
              <div className="text-2xl font-bold text-green-400">{stats.ganhos}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Perdidos</div>
              <div className="text-2xl font-bold text-red-400">{stats.perdidos}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">C/ Permissão</div>
              <div className="text-2xl font-bold text-blue-400">{stats.comPermissao}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Valor Total</div>
              <div className="text-lg font-bold text-green-400">R$ {(stats.valorTotal / 1000).toFixed(0)}K</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nome, email, telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="todos" className="text-white">
                    Todos os Status
                  </SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="text-white">
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={fonteFilter} onValueChange={setFonteFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Fonte" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="todos" className="text-white">
                    Todas as Fontes
                  </SelectItem>
                  {fontesUnicas.map((fonte) => (
                    <SelectItem key={fonte} value={fonte} className="text-white">
                      {fonte}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Leads */}
        <EnhancedTable
          title={`Lista de Leads (${formattedLeads.length} leads encontrados)`}
          columns={leadsColumns}
          data={formattedLeads}
          maxHeight="600px"
        />
      </div>
    </div>
  )
}
