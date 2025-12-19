"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, Target, Users, Calendar, DollarSign, Phone } from "lucide-react"
import { useMemo } from "react"

interface GrowthAnalysisProps {
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
}

// Dados completos de métricas por mês
const allMetricsData = [
  {
    mes: "Jan",
    totalLeads: 1250,
    reunioesAgendadas: 850,
    vendas: 285,
    roi: 265,
    crescimentoLeads: 0,
    crescimentoVendas: 0,
    crescimentoROI: 0,
    crescimentoReunioes: 0,
    eficiencia: 68.0,
    custoAquisicao: 274,
    ticketMedio: 2450,
    taxaConversao: 22.8,
    custoReuniao: 779,
    investimentoTotal: 78000,
    leadsQualificados: 625,
    noShow: 85,
    callsRealizadas: 765,
    taxaFechamento: 37.3,
    cplMedio: 320,
    cpraMedio: 1213,
    cpaMedio: 831,
  },
  {
    mes: "Fev",
    totalLeads: 1380,
    reunioesAgendadas: 920,
    vendas: 333,
    roi: 280,
    crescimentoLeads: 10.4,
    crescimentoVendas: 16.8,
    crescimentoROI: 5.7,
    crescimentoReunioes: 8.2,
    eficiencia: 66.7,
    custoAquisicao: 259,
    ticketMedio: 2650,
    taxaConversao: 24.1,
    custoReuniao: 825,
    investimentoTotal: 91000,
    leadsQualificados: 690,
    noShow: 92,
    callsRealizadas: 828,
    taxaFechamento: 40.2,
    cplMedio: 316,
    cpraMedio: 1200,
    cpaMedio: 805,
  },
  {
    mes: "Mar",
    totalLeads: 1420,
    reunioesAgendadas: 980,
    vendas: 307,
    roi: 275,
    crescimentoLeads: 2.9,
    crescimentoVendas: -7.8,
    crescimentoROI: -1.8,
    crescimentoReunioes: 6.5,
    eficiencia: 69.0,
    custoAquisicao: 273,
    ticketMedio: 2580,
    taxaConversao: 21.6,
    custoReuniao: 692,
    investimentoTotal: 84000,
    leadsQualificados: 710,
    noShow: 98,
    callsRealizadas: 882,
    taxaFechamento: 34.8,
    cplMedio: 315,
    cpraMedio: 1200,
    cpaMedio: 793,
  },
  {
    mes: "Abr",
    totalLeads: 1180,
    reunioesAgendadas: 780,
    vendas: 260,
    roi: 266,
    crescimentoLeads: -16.9,
    crescimentoVendas: -15.3,
    crescimentoROI: -3.3,
    crescimentoReunioes: -20.4,
    eficiencia: 66.1,
    custoAquisicao: 273,
    ticketMedio: 2380,
    taxaConversao: 22.0,
    custoReuniao: 890,
    investimentoTotal: 71100,
    leadsQualificados: 590,
    noShow: 78,
    callsRealizadas: 702,
    taxaFechamento: 37.0,
    cplMedio: 320,
    cpraMedio: 1265,
    cpaMedio: 882,
  },
  {
    mes: "Mai",
    totalLeads: 1650,
    reunioesAgendadas: 1100,
    vendas: 362,
    roi: 315,
    crescimentoLeads: 39.8,
    crescimentoVendas: 39.2,
    crescimentoROI: 18.4,
    crescimentoReunioes: 41.0,
    eficiencia: 66.7,
    custoAquisicao: 273,
    ticketMedio: 2750,
    taxaConversao: 21.9,
    custoReuniao: 745,
    investimentoTotal: 98900,
    leadsQualificados: 825,
    noShow: 110,
    callsRealizadas: 990,
    taxaFechamento: 36.6,
    cplMedio: 319,
    cpraMedio: 1177,
    cpaMedio: 727,
  },
  {
    mes: "Jun",
    totalLeads: 1580,
    reunioesAgendadas: 1050,
    vendas: 315,
    roi: 290,
    crescimentoLeads: -4.2,
    crescimentoVendas: -13.0,
    crescimentoROI: -7.9,
    crescimentoReunioes: -4.5,
    eficiencia: 66.5,
    custoAquisicao: 273,
    ticketMedio: 2520,
    taxaConversao: 19.9,
    custoReuniao: 812,
    investimentoTotal: 86000,
    leadsQualificados: 790,
    noShow: 105,
    callsRealizadas: 945,
    taxaFechamento: 33.3,
    cplMedio: 311,
    cpraMedio: 1246,
    cpaMedio: 772,
  },
  {
    mes: "Jul",
    totalLeads: 1720,
    reunioesAgendadas: 1150,
    vendas: 343,
    roi: 310,
    crescimentoLeads: 8.9,
    crescimentoVendas: 8.9,
    crescimentoROI: 6.9,
    crescimentoReunioes: 9.5,
    eficiencia: 66.9,
    custoAquisicao: 273,
    ticketMedio: 2680,
    taxaConversao: 19.9,
    custoReuniao: 698,
    investimentoTotal: 93600,
    leadsQualificados: 860,
    noShow: 115,
    callsRealizadas: 1035,
    taxaFechamento: 33.1,
    cplMedio: 319,
    cpraMedio: 1212,
    cpaMedio: 769,
  },
  {
    mes: "Ago",
    totalLeads: 1450,
    reunioesAgendadas: 950,
    vendas: 298,
    roi: 285,
    crescimentoLeads: -15.7,
    crescimentoVendas: -13.1,
    crescimentoROI: -8.1,
    crescimentoReunioes: -17.4,
    eficiencia: 65.5,
    custoAquisicao: 273,
    ticketMedio: 2590,
    taxaConversao: 20.6,
    custoReuniao: 756,
    investimentoTotal: 81300,
    leadsQualificados: 725,
    noShow: 95,
    callsRealizadas: 855,
    taxaFechamento: 34.9,
    cplMedio: 318,
    cpraMedio: 1268,
    cpaMedio: 828,
  },
]

// Métricas de performance
const performanceMetrics = [
  {
    titulo: "Melhor Mês",
    valor: "Maio",
    crescimento: "+39.8%",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    titulo: "Pior Mês",
    valor: "Abril",
    crescimento: "-16.9%",
    icon: TrendingDown,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    titulo: "Média Crescimento",
    valor: "+2.1%",
    crescimento: "mensal",
    icon: Activity,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    titulo: "Meta Atingida",
    valor: "75%",
    crescimento: "dos meses",
    icon: Target,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
]

export function GrowthAnalysis({ filters }: GrowthAnalysisProps) {
  // Filtrar dados baseado nos filtros
  const filteredData = useMemo(() => {
    if (!filters) return allMetricsData

    return allMetricsData.filter((item) => {
      // Filtro por período (mês) - suporte a múltiplos períodos
      if (filters.periodo !== "todos") {
        if (Array.isArray(filters.periodo)) {
          if (!filters.periodo.includes(item.mes.toLowerCase())) return false
        } else {
          if (item.mes.toLowerCase() !== filters.periodo) return false
        }
      }

      return true
    })
  }, [filters])

  // Calcular totais e médias dos dados filtrados
  const totals = useMemo(() => {
    const totalLeads = filteredData.reduce((sum, item) => sum + item.totalLeads, 0)
    const totalReunioes = filteredData.reduce((sum, item) => sum + item.reunioesAgendadas, 0)
    const totalVendas = filteredData.reduce((sum, item) => sum + item.vendas, 0)
    const totalInvestimento = filteredData.reduce((sum, item) => sum + item.investimentoTotal, 0)
    const totalCalls = filteredData.reduce((sum, item) => sum + item.callsRealizadas, 0)
    const totalNoShow = filteredData.reduce((sum, item) => sum + item.noShow, 0)
    const mediaTicket = filteredData.reduce((sum, item) => sum + item.ticketMedio, 0) / filteredData.length
    const mediaTaxaConversao = filteredData.reduce((sum, item) => sum + item.taxaConversao, 0) / filteredData.length
    const mediaROI = filteredData.reduce((sum, item) => sum + item.roi, 0) / filteredData.length
    const mediaCustoReuniao = filteredData.reduce((sum, item) => sum + item.custoReuniao, 0) / filteredData.length

    return {
      totalLeads,
      totalReunioes,
      totalVendas,
      totalInvestimento,
      totalCalls,
      totalNoShow,
      mediaTicket: Math.round(mediaTicket),
      mediaTaxaConversao: Number(mediaTaxaConversao.toFixed(1)),
      mediaROI: Math.round(mediaROI),
      mediaCustoReuniao: Math.round(mediaCustoReuniao),
      taxaAgendamento: Number(((totalReunioes / totalLeads) * 100).toFixed(1)),
      taxaComparecimento: Number((((totalReunioes - totalNoShow) / totalReunioes) * 100).toFixed(1)),
    }
  }, [filteredData])

  return (
    <div className="h-full w-full bg-slate-950 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">📈 Análise de Crescimento</h2>
          <p className="text-slate-400">
            Análise detalhada do crescimento e tendências das principais métricas
            {filters && (
              <span className="ml-2 text-blue-400">
                | {filters.ano} |{" "}
                {filters.periodo === "todos"
                  ? "Todos os meses"
                  : Array.isArray(filters.periodo)
                    ? `${filters.periodo.length} meses: ${filters.periodo.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}`
                    : filters.periodo.charAt(0).toUpperCase() + filters.periodo.slice(1)}
                {filters.equipe !== "todos" && ` | ${filters.equipe}`}
              </span>
            )}
          </p>
        </div>

        {/* Métricas Totais - Relatório Completo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Total de Leads</div>
                  <div className="text-2xl font-bold text-white">{totals.totalLeads.toLocaleString()}</div>
                  <div className="text-xs text-blue-400">Período selecionado</div>
                </div>
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Reuniões Agendadas</div>
                  <div className="text-2xl font-bold text-white">{totals.totalReunioes.toLocaleString()}</div>
                  <div className="text-xs text-green-400">Taxa: {totals.taxaAgendamento}%</div>
                </div>
                <div className="p-3 rounded-full bg-green-500/10">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Total de Vendas</div>
                  <div className="text-2xl font-bold text-white">{totals.totalVendas.toLocaleString()}</div>
                  <div className="text-xs text-purple-400">Ticket: R$ {totals.mediaTicket.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-full bg-purple-500/10">
                  <DollarSign className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Calls Realizadas</div>
                  <div className="text-2xl font-bold text-white">{totals.totalCalls.toLocaleString()}</div>
                  <div className="text-xs text-orange-400">Comparecimento: {totals.taxaComparecimento}%</div>
                </div>
                <div className="p-3 rounded-full bg-orange-500/10">
                  <Phone className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Pré-Venda */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-xl">📊 Métricas de Pré-Venda - Período Selecionado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{totals.mediaTaxaConversao}%</div>
                <div className="text-sm text-slate-400">Taxa de Conversão Média</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">R$ {totals.mediaCustoReuniao.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Custo por Reunião</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{totals.mediaROI}%</div>
                <div className="text-sm text-slate-400">ROI Médio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  R$ {(totals.totalInvestimento / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-slate-400">Investimento Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas de Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">{metric.titulo}</div>
                    <div className="text-xl font-bold text-white">{metric.valor}</div>
                    <div className={`text-xs ${metric.color}`}>{metric.crescimento}</div>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Crescimento Percentual */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">📊 Crescimento Percentual Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                      formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
                    />
                    <Line
                      type="monotone"
                      dataKey="crescimentoLeads"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Leads"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="crescimentoVendas"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Vendas"
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="crescimentoReunioes"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="Reuniões"
                      dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Métricas Absolutas */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">📈 Evolução das Métricas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />
                    <Bar yAxisId="left" dataKey="totalLeads" fill="#3b82f6" name="Total Leads" radius={[2, 2, 0, 0]} />
                    <Bar
                      yAxisId="left"
                      dataKey="reunioesAgendadas"
                      fill="#10b981"
                      name="Reuniões"
                      radius={[2, 2, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="vendas"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="Vendas"
                      dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Área - Evolução Completa */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">📊 Evolução Completa - Leads vs Reuniões vs Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalLeads"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                    name="Total Leads"
                  />
                  <Area
                    type="monotone"
                    dataKey="reunioesAgendadas"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.4}
                    name="Reuniões Agendadas"
                  />
                  <Area
                    type="monotone"
                    dataKey="vendas"
                    stackId="3"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.4}
                    name="Vendas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Métricas Detalhadas */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">📋 Relatório Detalhado por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 font-medium py-3 px-2">Mês</th>
                    <th className="text-right text-slate-400 font-medium py-3 px-2">Leads</th>
                    <th className="text-right text-slate-400 font-medium py-3 px-2">Reuniões</th>
                    <th className="text-right text-slate-400 font-medium py-3 px-2">Vendas</th>
                    <th className="text-right text-slate-400 font-medium py-3 px-2">Taxa Conv.</th>
                    <th className="text-right text-slate-400 font-medium py-3 px-2">Ticket Médio</th>
                    <th className="text-right text-slate-400 font-medium py-3 px-2">ROI</th>
                    <th className="text-right text-slate-400 font-medium py-3 px-2">Investimento</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index} className="border-b border-slate-700/50">
                      <td className="py-3 px-2 text-white font-medium">{item.mes}</td>
                      <td className="py-3 px-2 text-right text-slate-300">{item.totalLeads.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right text-slate-300">{item.reunioesAgendadas.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right text-slate-300">{item.vendas.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right text-slate-300">{item.taxaConversao}%</td>
                      <td className="py-3 px-2 text-right text-slate-300">R$ {item.ticketMedio.toLocaleString()}</td>
                      <td className="py-3 px-2 text-right text-slate-300">{item.roi}%</td>
                      <td className="py-3 px-2 text-right text-slate-300">
                        R$ {item.investimentoTotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights e Recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">💡 Insights Principais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Maio foi o melhor mês</div>
                    <div className="text-slate-400 text-sm">
                      {totals.totalLeads.toLocaleString()} leads totais com {totals.totalReunioes.toLocaleString()}{" "}
                      reuniões agendadas
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Taxa de agendamento: {totals.taxaAgendamento}%</div>
                    <div className="text-slate-400 text-sm">
                      {totals.totalReunioes.toLocaleString()} reuniões de {totals.totalLeads.toLocaleString()} leads
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Ticket médio: R$ {totals.mediaTicket.toLocaleString()}</div>
                    <div className="text-slate-400 text-sm">
                      {totals.totalVendas.toLocaleString()} vendas realizadas no período
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">🎯 Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Otimizar taxa de comparecimento</div>
                    <div className="text-slate-400 text-sm">
                      Atual: {totals.taxaComparecimento}% - Meta: 85%+ para maximizar conversões
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Manter custo por reunião</div>
                    <div className="text-slate-400 text-sm">
                      R$ {totals.mediaCustoReuniao.toLocaleString()} está dentro do target ideal
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Escalar estratégias de sucesso</div>
                    <div className="text-slate-400 text-sm">
                      ROI médio de {totals.mediaROI}% indica boa performance geral
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
