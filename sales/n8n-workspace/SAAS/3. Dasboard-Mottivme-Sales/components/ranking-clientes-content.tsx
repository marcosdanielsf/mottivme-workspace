"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, DollarSign } from "lucide-react"
import { EnhancedTable } from "./enhanced-table"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Dados dos Closers (Ranking Clientes)
const closerRankingData = [
  {
    ranking: 1,
    cliente: "Pedro Almeida",
    ttLead: 89,
    txQualifAgd: "78.5%",
    leadsAgend: 70,
    ticketMedio: 2850,
    avatar: "PA",
  },
  {
    ranking: 2,
    cliente: "Carla Mendes",
    ttLead: 76,
    txQualifAgd: "72.1%",
    leadsAgend: 55,
    ticketMedio: 3200,
    avatar: "CM",
  },
  {
    ranking: 3,
    cliente: "Rafael Costa",
    ttLead: 68,
    txQualifAgd: "69.8%",
    leadsAgend: 47,
    ticketMedio: 2950,
    avatar: "RC",
  },
  {
    ranking: 4,
    cliente: "Juliana Silva",
    ttLead: 62,
    txQualifAgd: "65.2%",
    leadsAgend: 40,
    ticketMedio: 2750,
    avatar: "JS",
  },
  {
    ranking: 5,
    cliente: "Marcos Santos",
    ttLead: 58,
    txQualifAgd: "63.8%",
    leadsAgend: 37,
    ticketMedio: 3100,
    avatar: "MS",
  },
  {
    ranking: 6,
    cliente: "Fernanda Lima",
    ttLead: 54,
    txQualifAgd: "61.1%",
    leadsAgend: 33,
    ticketMedio: 2650,
    avatar: "FL",
  },
  {
    ranking: 7,
    cliente: "Bruno Oliveira",
    ttLead: 48,
    txQualifAgd: "58.3%",
    leadsAgend: 28,
    ticketMedio: 2900,
    avatar: "BO",
  },
  {
    ranking: 8,
    cliente: "Amanda Costa",
    ttLead: 42,
    txQualifAgd: "55.7%",
    leadsAgend: 23,
    ticketMedio: 2800,
    avatar: "AC",
  },
]

const topClosers = closerRankingData.slice(0, 3)

interface RankingClientesContentProps {
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
}

export function RankingClientesContent({ filters }: RankingClientesContentProps) {
  const totalAgendamentos = closerRankingData.reduce((sum, closer) => sum + closer.leadsAgend, 0)
  const top3Agendamentos = topClosers.reduce((sum, closer) => sum + closer.leadsAgend, 0)
  const ticketMedioTop3 = Math.round(topClosers.reduce((sum, closer) => sum + closer.ticketMedio, 0) / 3)

  // Definir colunas
  const rankingColumns = [
    { key: "ranking", label: "Ranking", width: "100px", sticky: true },
    { key: "cliente", label: "Cliente", minWidth: "200px" },
    { key: "ttLead", label: "TT Lead", align: "right", minWidth: "100px" },
    { key: "txQualifAgd", label: "Tx Qualif/Agd", align: "right", minWidth: "130px" },
    { key: "leadsAgend", label: "Leads Agend", align: "right", minWidth: "120px" },
    { key: "ticketMedio", label: "Ticket Médio", align: "right", minWidth: "130px" },
  ]

  // Preparar dados formatados
  const rankingDataFormatted = closerRankingData.map((closer) => ({
    ranking: (
      <div className="flex items-center">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            closer.ranking === 1
              ? "bg-yellow-500 text-white"
              : closer.ranking === 2
                ? "bg-slate-400 text-white"
                : closer.ranking === 3
                  ? "bg-amber-600 text-white"
                  : "bg-slate-700 text-slate-300"
          }`}
        >
          {closer.ranking}
        </span>
      </div>
    ),
    cliente: (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-semibold">{closer.avatar}</span>
        </div>
        <span className="text-white font-medium">{closer.cliente}</span>
      </div>
    ),
    ttLead: <span className="text-white">{closer.ttLead}</span>,
    txQualifAgd: (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400">
        {closer.txQualifAgd}
      </span>
    ),
    leadsAgend: <span className="text-white font-semibold">{closer.leadsAgend}</span>,
    ticketMedio: <span className="text-white font-semibold">R$ {closer.ticketMedio.toLocaleString()}</span>,
  }))

  return (
    <div className="h-full w-full bg-slate-950 overflow-auto">
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <SidebarTrigger className="text-white hover:bg-slate-800" />
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Ranking Clientes (Closers)</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Performance dos Closers por conversão e ticket médio
              {filters && filters.periodo !== "todos" && (
                <span className="text-blue-400 ml-2">
                  |{" "}
                  {Array.isArray(filters.periodo)
                    ? `${filters.periodo.length} meses selecionados`
                    : filters.periodo.charAt(0).toUpperCase() + filters.periodo.slice(1)}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total de Agendamentos</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalAgendamentos.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-500">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Agendamentos - TOP 3</p>
                  <p className="text-2xl font-bold text-white mt-1">{top3Agendamentos.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-green-500">
                  <Medal className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Ticket Médio - TOP 3</p>
                  <p className="text-2xl font-bold text-white mt-1">R$ {ticketMedioTop3.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-500">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pódio */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-xl">🏆 Pódio dos Campeões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-end space-x-8 py-8">
              {/* 2º Lugar */}
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold text-lg">{topClosers[1]?.avatar}</span>
                </div>
                <div className="bg-slate-700 px-4 py-6 rounded-lg min-h-[100px] flex flex-col justify-end">
                  <div className="text-4xl mb-2">🥈</div>
                  <div className="text-white font-semibold">{topClosers[1]?.cliente}</div>
                  <div className="text-slate-300 text-sm">{topClosers[1]?.leadsAgend} agendamentos</div>
                  <div className="text-slate-300 text-xs">R$ {topClosers[1]?.ticketMedio.toLocaleString()}</div>
                </div>
              </div>

              {/* 1º Lugar */}
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold text-xl">{topClosers[0]?.avatar}</span>
                </div>
                <div className="bg-yellow-600 px-4 py-8 rounded-lg min-h-[120px] flex flex-col justify-end">
                  <div className="text-5xl mb-2">🥇</div>
                  <div className="text-white font-bold text-lg">{topClosers[0]?.cliente}</div>
                  <div className="text-yellow-100 text-sm">{topClosers[0]?.leadsAgend} agendamentos</div>
                  <div className="text-yellow-100 text-xs">R$ {topClosers[0]?.ticketMedio.toLocaleString()}</div>
                </div>
              </div>

              {/* 3º Lugar */}
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold text-lg">{topClosers[2]?.avatar}</span>
                </div>
                <div className="bg-amber-700 px-4 py-4 rounded-lg min-h-[80px] flex flex-col justify-end">
                  <div className="text-3xl mb-2">🥉</div>
                  <div className="text-white font-semibold">{topClosers[2]?.cliente}</div>
                  <div className="text-amber-100 text-sm">{topClosers[2]?.leadsAgend} agendamentos</div>
                  <div className="text-amber-100 text-xs">R$ {topClosers[2]?.ticketMedio.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Ranking */}
        <EnhancedTable
          title="Ranking Completo"
          columns={rankingColumns}
          data={rankingDataFormatted}
          maxHeight="600px"
        />
      </div>
    </div>
  )
}
