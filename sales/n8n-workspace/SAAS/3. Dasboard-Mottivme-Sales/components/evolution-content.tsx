"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useMemo } from "react"

interface EvolutionContentProps {
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
}

// Dados completos para os gráficos de evolução
const allEvolutionData = [
  {
    mes: "Jan",
    mesAbrev: "Jan",
    totalLeads: 1410,
    reunioesAgendadas: 283,
    ttLeadQualif: 705,
    ttLeadsAgd: 283,
    leadsAgend: 283,
    custoReuniao: 342,
    leadsAgendOTB: 153,
    leadsAgendTRAF: 130,
    ttLeadAgend: 283,
    cpraTRAF: 1535,
    cpraBPO: 1322,
    taxaConversao: 20.1,
  },
  {
    mes: "Fev",
    mesAbrev: "Fev",
    totalLeads: 1471,
    reunioesAgendadas: 341,
    ttLeadQualif: 736,
    ttLeadsAgd: 341,
    leadsAgend: 341,
    custoReuniao: 378,
    leadsAgendOTB: 188,
    leadsAgendTRAF: 153,
    ttLeadAgend: 341,
    cpraTRAF: 1620,
    cpraBPO: 1419,
    taxaConversao: 23.2,
  },
  {
    mes: "Mar",
    mesAbrev: "Mar",
    totalLeads: 1260,
    reunioesAgendadas: 293,
    ttLeadQualif: 630,
    ttLeadsAgd: 293,
    leadsAgend: 293,
    custoReuniao: 152,
    leadsAgendOTB: 138,
    leadsAgendTRAF: 155,
    ttLeadAgend: 293,
    cpraTRAF: 1379,
    cpraBPO: 1201,
    taxaConversao: 23.3,
  },
  {
    mes: "Abr",
    mesAbrev: "Abr",
    totalLeads: 881,
    reunioesAgendadas: 153,
    ttLeadQualif: 441,
    ttLeadsAgd: 153,
    leadsAgend: 153,
    custoReuniao: 92,
    leadsAgendOTB: 92,
    leadsAgendTRAF: 61,
    ttLeadAgend: 153,
    cpraTRAF: 1240,
    cpraBPO: 1089,
    taxaConversao: 17.4,
  },
  {
    mes: "Mai",
    mesAbrev: "Mai",
    totalLeads: 0,
    reunioesAgendadas: 0,
    ttLeadQualif: 0,
    ttLeadsAgd: 0,
    leadsAgend: 0,
    custoReuniao: 50,
    leadsAgendOTB: 0,
    leadsAgendTRAF: 0,
    ttLeadAgend: 0,
    cpraTRAF: 1156,
    cpraBPO: 1034,
    taxaConversao: 0,
  },
  {
    mes: "Jun",
    mesAbrev: "Jun",
    totalLeads: 86,
    reunioesAgendadas: 25,
    ttLeadQualif: 43,
    ttLeadsAgd: 25,
    leadsAgend: 25,
    custoReuniao: 50,
    leadsAgendOTB: 20,
    leadsAgendTRAF: 5,
    ttLeadAgend: 25,
    cpraTRAF: 1089,
    cpraBPO: 978,
    taxaConversao: 29.1,
  },
  {
    mes: "Jul",
    mesAbrev: "Jul",
    totalLeads: 277,
    reunioesAgendadas: 28,
    ttLeadQualif: 139,
    ttLeadsAgd: 28,
    leadsAgend: 28,
    custoReuniao: 50,
    leadsAgendOTB: 28,
    leadsAgendTRAF: 0,
    ttLeadAgend: 28,
    cpraTRAF: 1034,
    cpraBPO: 945,
    taxaConversao: 10.1,
  },
  {
    mes: "Ago",
    mesAbrev: "Ago",
    totalLeads: 150,
    reunioesAgendadas: 46,
    ttLeadQualif: 75,
    ttLeadsAgd: 46,
    leadsAgend: 46,
    custoReuniao: 1205,
    leadsAgendOTB: 46,
    leadsAgendTRAF: 0,
    ttLeadAgend: 46,
    cpraTRAF: 978,
    cpraBPO: 889,
    taxaConversao: 30.7,
  },
  {
    mes: "Set",
    mesAbrev: "Set",
    totalLeads: 526,
    reunioesAgendadas: 120,
    ttLeadQualif: 263,
    ttLeadsAgd: 120,
    leadsAgend: 120,
    custoReuniao: 1111,
    leadsAgendOTB: 60,
    leadsAgendTRAF: 60,
    ttLeadAgend: 120,
    cpraTRAF: 945,
    cpraBPO: 834,
    taxaConversao: 22.8,
  },
  {
    mes: "Out",
    mesAbrev: "Out",
    totalLeads: 1274,
    reunioesAgendadas: 134,
    ttLeadQualif: 637,
    ttLeadsAgd: 134,
    leadsAgend: 134,
    custoReuniao: 573,
    leadsAgendOTB: 67,
    leadsAgendTRAF: 67,
    ttLeadAgend: 134,
    cpraTRAF: 889,
    cpraBPO: 778,
    taxaConversao: 10.5,
  },
  {
    mes: "Nov",
    mesAbrev: "Nov",
    totalLeads: 1149,
    reunioesAgendadas: 225,
    ttLeadQualif: 575,
    ttLeadsAgd: 225,
    leadsAgend: 225,
    custoReuniao: 579,
    leadsAgendOTB: 134,
    leadsAgendTRAF: 91,
    ttLeadAgend: 225,
    cpraTRAF: 834,
    cpraBPO: 723,
    taxaConversao: 19.6,
  },
  {
    mes: "Dez",
    mesAbrev: "Dez",
    totalLeads: 246,
    reunioesAgendadas: 82,
    ttLeadQualif: 123,
    ttLeadsAgd: 82,
    leadsAgend: 82,
    custoReuniao: 1326,
    leadsAgendOTB: 82,
    leadsAgendTRAF: 0,
    ttLeadAgend: 82,
    cpraTRAF: 778,
    cpraBPO: 667,
    taxaConversao: 33.3,
  },
]

// Dados para o gráfico inferior combinado
const combinedData = [
  {
    mes: "Jan",
    leadsAgendOTB: 153,
    leadsAgendTRAF: 130,
    ttLeadAgend: 283,
  },
  {
    mes: "Fev",
    leadsAgendOTB: 188,
    leadsAgendTRAF: 153,
    ttLeadAgend: 341,
  },
  {
    mes: "Mar",
    leadsAgendOTB: 138,
    leadsAgendTRAF: 155,
    ttLeadAgend: 293,
  },
  {
    mes: "Abr",
    leadsAgendOTB: 92,
    leadsAgendTRAF: 61,
    ttLeadAgend: 153,
  },
  {
    mes: "Mai",
    leadsAgendOTB: 25,
    leadsAgendTRAF: 28,
    ttLeadAgend: 53,
  },
  {
    mes: "Jun",
    leadsAgendOTB: 27,
    leadsAgendTRAF: 25,
    ttLeadAgend: 52,
  },
  {
    mes: "Jul",
    leadsAgendOTB: 46,
    leadsAgendTRAF: 0,
    ttLeadAgend: 46,
  },
  {
    mes: "Ago",
    leadsAgendOTB: 27,
    leadsAgendTRAF: 46,
    ttLeadAgend: 73,
  },
  {
    mes: "Set",
    leadsAgendOTB: 60,
    leadsAgendTRAF: 60,
    ttLeadAgend: 120,
  },
  {
    mes: "Out",
    leadsAgendOTB: 67,
    leadsAgendTRAF: 67,
    ttLeadAgend: 134,
  },
  {
    mes: "Nov",
    leadsAgendOTB: 134,
    leadsAgendTRAF: 91,
    ttLeadAgend: 225,
  },
  {
    mes: "Dez",
    leadsAgendOTB: 82,
    leadsAgendTRAF: 164,
    ttLeadAgend: 246,
  },
]

export function EvolutionContent({ filters }: EvolutionContentProps) {
  const filteredData = useMemo(() => {
    if (!filters || filters.periodo === "todos") return allEvolutionData

    if (Array.isArray(filters.periodo)) {
      return allEvolutionData.filter((item) => filters.periodo.includes(item.mes.toLowerCase()))
    }

    return allEvolutionData.filter((item) => item.mes.toLowerCase() === filters.periodo)
  }, [filters])

  const filteredCombinedData = useMemo(() => {
    if (!filters || filters.periodo === "todos") return combinedData

    if (Array.isArray(filters.periodo)) {
      return combinedData.filter((item) => filters.periodo.includes(item.mes.toLowerCase()))
    }

    return combinedData.filter((item) => item.mes.toLowerCase() === filters.periodo)
  }, [filters])

  // Calcular totais para os indicadores circulares
  const totals = useMemo(() => {
    const totalOTB = filteredCombinedData.reduce((sum, item) => sum + item.leadsAgendOTB, 0)
    const totalTRAF = filteredCombinedData.reduce((sum, item) => sum + item.leadsAgendTRAF, 0)
    const total = totalOTB + totalTRAF

    return {
      otbPercent: total > 0 ? Math.round((totalOTB / total) * 100) : 0,
      trafPercent: total > 0 ? Math.round((totalTRAF / total) * 100) : 0,
      totalOTB: totalOTB,
      totalTRAF: totalTRAF,
    }
  }, [filteredCombinedData])

  return (
    <div className="h-full w-full bg-slate-950 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-slate-800" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                OVERVIEW <span className="text-blue-400">EVOLUÇÃO</span>
              </h1>
              {filters && filters.periodo !== "todos" && (
                <p className="text-sm text-slate-400">
                  Período:{" "}
                  {Array.isArray(filters.periodo)
                    ? `${filters.periodo.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}`
                    : filters.periodo.charAt(0).toUpperCase() + filters.periodo.slice(1)}
                </p>
              )}
            </div>
          </div>

          {/* Indicadores Circulares */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-white text-sm font-medium">
                {totals.totalOTB.toLocaleString()} Mil ({totals.otbPercent}%)
              </span>
              <span className="text-slate-400 text-sm">Leads Agend OTB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-white text-sm font-medium">
                {totals.totalTRAF.toLocaleString()} Mil ({totals.trafPercent}%)
              </span>
              <span className="text-slate-400 text-sm">Leads Agend TRAF</span>
            </div>
          </div>
        </div>

        {/* Seção Superior - Dois Painéis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Painel Esquerdo - Total de Lead x Total de Reunião Agendada */}
          <Card className="bg-slate-900 border-blue-500/30 border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg">Total de Lead x Total de Reunião Agendada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="mesAbrev"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={{ stroke: "#475569" }}
                    />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#475569" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                    <Bar dataKey="totalLeads" fill="#3b82f6" name="Total Leads" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="reunioesAgendadas" fill="#1e40af" name="Reuniões Agendadas" radius={[2, 2, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Legenda personalizada */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-slate-300 text-sm">TT Lead Qualif</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                  <span className="text-slate-300 text-sm">TT leads agd / TT leads agd</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Leads Agend</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Painel Direito - Custo por Reunião Agendada */}
          <Card className="bg-slate-900 border-blue-500/30 border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg">Custo por Reunião Agendada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="mesAbrev"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={{ stroke: "#475569" }}
                    />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#475569" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                      formatter={(value) => [`R$ ${value}`, "Custo por Reunião"]}
                    />
                    <Bar dataKey="custoReuniao" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legenda personalizada */}
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-slate-300 text-sm">CPRA TRAF</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-300 text-sm">CPRA BPO</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção Inferior - Painel Grande */}
        <Card className="bg-slate-900 border-blue-500/30 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Total de Lead x Total de Reunião Agendada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredCombinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#475569" }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={{ stroke: "#475569" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Bar dataKey="leadsAgendOTB" fill="#3b82f6" name="Leads Agend OTB" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="leadsAgendTRAF" fill="#f97316" name="Leads Agend TRAF" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="ttLeadAgend" fill="#ef4444" name="TT Lead Agend" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda personalizada */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-slate-300 text-sm">Leads Agend OTB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-slate-300 text-sm">Leads Agend TRAF</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-300 text-sm">TT Lead Agend</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Total Leads OTB</div>
              <div className="text-2xl font-bold text-blue-400">{totals.totalOTB.toLocaleString()}</div>
              <div className="text-xs text-slate-500">{totals.otbPercent}% do total</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Total Leads TRAF</div>
              <div className="text-2xl font-bold text-orange-400">{totals.totalTRAF.toLocaleString()}</div>
              <div className="text-xs text-slate-500">{totals.trafPercent}% do total</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Total Geral</div>
              <div className="text-2xl font-bold text-white">
                {(totals.totalOTB + totals.totalTRAF).toLocaleString()}
              </div>
              <div className="text-xs text-green-500">Período selecionado</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="text-sm text-slate-400">Custo Médio</div>
              <div className="text-2xl font-bold text-white">
                R${" "}
                {Math.round(filteredData.reduce((sum, item) => sum + item.custoReuniao, 0) / filteredData.length || 0)}
              </div>
              <div className="text-xs text-purple-500">Por reunião</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
