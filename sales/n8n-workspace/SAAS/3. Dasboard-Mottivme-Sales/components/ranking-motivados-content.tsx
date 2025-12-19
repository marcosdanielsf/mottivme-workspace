"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import { EnhancedTable } from "./enhanced-table"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Dados dos SDRs (Ranking Motivados)
const sdrRankingData = [
  { ranking: 1, quemAgendou: "Ana Silva", leadsAgend: 156, avatar: "AS" },
  { ranking: 2, quemAgendou: "Carlos Santos", leadsAgend: 142, avatar: "CS" },
  { ranking: 3, quemAgendou: "Maria Costa", leadsAgend: 138, avatar: "MC" },
  { ranking: 4, quemAgendou: "João Oliveira", leadsAgend: 125, avatar: "JO" },
  { ranking: 5, quemAgendou: "Paula Lima", leadsAgend: 118, avatar: "PL" },
  { ranking: 6, quemAgendou: "Roberto Silva", leadsAgend: 112, avatar: "RS" },
  { ranking: 7, quemAgendou: "Fernanda Costa", leadsAgend: 98, avatar: "FC" },
  { ranking: 8, quemAgendou: "Lucas Pereira", leadsAgend: 87, avatar: "LP" },
]

const topSDRs = sdrRankingData.slice(0, 3)

// Definir colunas
const rankingColumns = [
  {
    key: "ranking",
    label: "Ranking",
    width: "100px",
    sticky: true,
  },
  {
    key: "quemAgendou",
    label: "Quem Agendou",
    minWidth: "200px",
  },
  {
    key: "leadsAgend",
    label: "Leads Agend",
    align: "right",
    minWidth: "120px",
  },
]

// Preparar dados com componentes React para ranking e avatar
const rankingDataFormatted = sdrRankingData.map((sdr) => ({
  ranking: (
    <div className="flex items-center">
      <span
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
          sdr.ranking === 1
            ? "bg-yellow-500 text-white"
            : sdr.ranking === 2
              ? "bg-slate-400 text-white"
              : sdr.ranking === 3
                ? "bg-amber-600 text-white"
                : "bg-slate-700 text-slate-300"
        }`}
      >
        {sdr.ranking}
      </span>
    </div>
  ),
  quemAgendou: (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-semibold">{sdr.avatar}</span>
      </div>
      <span className="text-white font-medium">{sdr.quemAgendou}</span>
    </div>
  ),
  leadsAgend: <span className="text-white font-semibold">{sdr.leadsAgend}</span>,
}))

interface RankingMotivadosContentProps {
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
}

export function RankingMotivadosContent({ filters }: RankingMotivadosContentProps) {
  const totalLeads = sdrRankingData.reduce((sum, sdr) => sum + sdr.leadsAgend, 0)
  const totalAgendamentos = sdrRankingData.reduce((sum, sdr) => sum + sdr.leadsAgend, 0)
  const top3Total = topSDRs.reduce((sum, sdr) => sum + sdr.leadsAgend, 0)

  return (
    <div className="h-full w-full bg-slate-950 overflow-auto">
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <SidebarTrigger className="text-white hover:bg-slate-800" />
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Ranking Motivados (SDRs)</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Performance dos SDRs por agendamentos realizados
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
                  <p className="text-slate-400 text-sm font-medium">Total de Leads</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalLeads.toLocaleString()}</p>
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
                  <p className="text-slate-400 text-sm font-medium">Total de Agendamentos</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalAgendamentos.toLocaleString()}</p>
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
                  <p className="text-slate-400 text-sm font-medium">Total Agendamentos - TOP 3</p>
                  <p className="text-2xl font-bold text-white mt-1">{top3Total.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-500">
                  <Award className="h-6 w-6 text-white" />
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
                  <span className="text-white font-bold text-lg">{topSDRs[1]?.avatar}</span>
                </div>
                <div className="bg-slate-700 px-4 py-6 rounded-lg min-h-[100px] flex flex-col justify-end">
                  <div className="text-4xl mb-2">🥈</div>
                  <div className="text-white font-semibold">{topSDRs[1]?.quemAgendou}</div>
                  <div className="text-slate-300 text-sm">{topSDRs[1]?.leadsAgend} agendamentos</div>
                </div>
              </div>

              {/* 1º Lugar */}
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold text-xl">{topSDRs[0]?.avatar}</span>
                </div>
                <div className="bg-yellow-600 px-4 py-8 rounded-lg min-h-[120px] flex flex-col justify-end">
                  <div className="text-5xl mb-2">🥇</div>
                  <div className="text-white font-bold text-lg">{topSDRs[0]?.quemAgendou}</div>
                  <div className="text-yellow-100 text-sm">{topSDRs[0]?.leadsAgend} agendamentos</div>
                </div>
              </div>

              {/* 3º Lugar */}
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold text-lg">{topSDRs[2]?.avatar}</span>
                </div>
                <div className="bg-amber-700 px-4 py-4 rounded-lg min-h-[80px] flex flex-col justify-end">
                  <div className="text-3xl mb-2">🥉</div>
                  <div className="text-white font-semibold">{topSDRs[2]?.quemAgendou}</div>
                  <div className="text-amber-100 text-sm">{topSDRs[2]?.leadsAgend} agendamentos</div>
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
