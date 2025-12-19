"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { EnhancedTable } from "./enhanced-table"

// Dados dos usuários atualizados com base no CSV real
const usersData = [
  {
    id: 1,
    name: "Shirley Carvalho",
    avatar: "/placeholder.svg?height=32&width=32",
    invTrafego: "R$ 42.100",
    invBpo: "R$ 23.800",
    sal: "R$ 65.900",
    pctAgd: "67.2%",
    ttLeadAgend: "267",
    ttCalls: "1.225",
    pctGanhos: "43.8%",
    ttGanhos: "117",
    ldsAgdTraf: "160",
    tipo: "SDR",
    equipe: "equipe-b",
  },
  {
    id: 2,
    name: "Andre Rosa",
    avatar: "/placeholder.svg?height=32&width=32",
    invTrafego: "R$ 45.800",
    invBpo: "R$ 25.900",
    sal: "R$ 71.700",
    pctAgd: "68.5%",
    ttLeadAgend: "289",
    ttCalls: "1.326",
    pctGanhos: "45.2%",
    ttGanhos: "131",
    ldsAgdTraf: "173",
    tipo: "SDR",
    equipe: "equipe-a",
  },
  {
    id: 3,
    name: "Fernanda Lappe",
    avatar: "/placeholder.svg?height=32&width=32",
    invTrafego: "R$ 28.100",
    invBpo: "R$ 15.900",
    sal: "R$ 44.000",
    pctAgd: "64.1%",
    ttLeadAgend: "178",
    ttCalls: "817",
    pctGanhos: "41.5%",
    ttGanhos: "78",
    ldsAgdTraf: "107",
    tipo: "SDR",
    equipe: "equipe-b",
  },
  {
    id: 4,
    name: "Cláudia Fehribach",
    avatar: "/placeholder.svg?height=32&width=32",
    invTrafego: "R$ 30.500",
    invBpo: "R$ 17.300",
    sal: "R$ 47.800",
    pctAgd: "65.8%",
    ttLeadAgend: "193",
    ttCalls: "884",
    pctGanhos: "43.1%",
    ttGanhos: "87",
    ldsAgdTraf: "116",
    tipo: "SDR",
    equipe: "equipe-b",
  },
  {
    id: 5,
    name: "Milton",
    avatar: "/placeholder.svg?height=32&width=32",
    invTrafego: "R$ 38.900",
    invBpo: "R$ 22.000",
    sal: "R$ 199.500",
    pctAgd: "78.5%",
    ttLeadAgend: "70",
    ttCalls: "156",
    pctGanhos: "85.7%",
    ttGanhos: "60",
    ldsAgdTraf: "42",
    tipo: "CLOSER",
    equipe: "equipe-b",
  },
  {
    id: 6,
    name: "Meguro Financial",
    avatar: "/placeholder.svg?height=32&width=32",
    invTrafego: "R$ 25.900",
    invBpo: "R$ 14.700",
    sal: "R$ 176.000",
    pctAgd: "72.1%",
    ttLeadAgend: "55",
    ttCalls: "148",
    pctGanhos: "81.8%",
    ttGanhos: "45",
    ldsAgdTraf: "33",
    tipo: "CLOSER",
    equipe: "equipe-b",
  },
  {
    id: 7,
    name: "Gustavo Couto",
    avatar: "/placeholder.svg?height=32&width=32",
    invTrafego: "R$ 33.600",
    invBpo: "R$ 19.000",
    sal: "R$ 138.650",
    pctAgd: "69.8%",
    ttLeadAgend: "47",
    ttCalls: "142",
    pctGanhos: "78.7%",
    ttGanhos: "37",
    ldsAgdTraf: "28",
    tipo: "CLOSER",
    equipe: "equipe-b",
  },
  {
    id: 8,
    name: "Melina Wiebusch",
    avatar: "/placeholder.svg?height=32&width=32",
    invTrafego: "R$ 22.400",
    invBpo: "R$ 12.700",
    sal: "R$ 110.000",
    pctAgd: "65.2%",
    ttLeadAgend: "40",
    ttCalls: "135",
    pctGanhos: "75.0%",
    ttGanhos: "30",
    ldsAgdTraf: "24",
    tipo: "CLOSER",
    equipe: "equipe-b",
  },
]

// Definir as colunas
const usersColumns = [
  {
    key: "user",
    label: "User",
    sticky: true,
    minWidth: "200px",
  },
  { key: "tipo", label: "Tipo", align: "center", minWidth: "80px" },
  { key: "equipe", label: "Equipe", align: "center", minWidth: "100px" },
  { key: "invTrafego", label: "Inv Tráfego", align: "right", minWidth: "120px" },
  { key: "invBpo", label: "Inv BPO", align: "right", minWidth: "120px" },
  { key: "sal", label: "SAL", align: "right", minWidth: "120px" },
  { key: "pctAgd", label: "% Agd", align: "right", minWidth: "100px" },
  { key: "ttLeadAgend", label: "TT Lead Agend", align: "right", minWidth: "130px" },
  { key: "ttCalls", label: "TT Calls", align: "right", minWidth: "100px" },
  { key: "pctGanhos", label: "% Ganhos", align: "right", minWidth: "110px" },
  { key: "ttGanhos", label: "TT Ganhos", align: "right", minWidth: "110px" },
  { key: "ldsAgdTraf", label: "Lds Agd TRAF", align: "right", minWidth: "130px" },
]

// Adicionar props de filtros ao componente
interface UsersContentProps {
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
}

export function UsersContent({ filters }: UsersContentProps) {
  // 1) Filter the raw objects first
  const filteredUsers = usersData.filter((u) => {
    if (!filters) return true
    // Filtrar por equipe, se houver
    if (filters.equipe !== "todos" && u.equipe !== filters.equipe) return false
    return true
  })

  // 2) Format only the filtered result
  const formattedRows = filteredUsers.map((user) => ({
    user: (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="text-xs">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-foreground">{user.name}</span>
      </div>
    ),
    tipo: (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          user.tipo === "SDR"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
        }`}
      >
        {user.tipo}
      </span>
    ),
    equipe: (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          user.equipe === "equipe-a"
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
        }`}
      >
        {user.equipe === "equipe-a" ? "Equipe A" : "Equipe B"}
      </span>
    ),
    invTrafego: user.invTrafego,
    invBpo: user.invBpo,
    sal: (
      <span className={`font-semibold ${user.tipo === "CLOSER" ? "text-green-400" : "text-blue-400"}`}>{user.sal}</span>
    ),
    pctAgd: (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        {user.pctAgd}
      </span>
    ),
    ttLeadAgend: user.ttLeadAgend,
    ttCalls: user.ttCalls,
    pctGanhos: (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
        {user.pctGanhos}
      </span>
    ),
    ttGanhos: user.ttGanhos,
    ldsAgdTraf: user.ldsAgdTraf,
  }))

  // Calcular estatísticas
  const stats = {
    totalSDRs: usersData.filter((u) => u.tipo === "SDR").length,
    totalClosers: usersData.filter((u) => u.tipo === "CLOSER").length,
    totalInvestimento: usersData.reduce((sum, u) => {
      const trafego = Number.parseFloat(u.invTrafego.replace(/[R$.,]/g, ""))
      const bpo = Number.parseFloat(u.invBpo.replace(/[R$.,]/g, ""))
      return sum + trafego + bpo
    }, 0),
    totalVendas: usersData.reduce((sum, u) => {
      const vendas = Number.parseFloat(u.sal.replace(/[R$.,]/g, ""))
      return sum + vendas
    }, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <SidebarTrigger className="text-white hover:bg-slate-800" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">Desempenho dos Usuários</h2>
          {filters && (filters.periodo !== "todos" || filters.equipe !== "todos") && (
            <p className="text-sm text-blue-400">
              Filtros ativos:{" "}
              {filters.periodo !== "todos"
                ? Array.isArray(filters.periodo)
                  ? `${filters.periodo.length} meses`
                  : filters.periodo
                : ""}{" "}
              {filters.equipe !== "todos" ? `| ${filters.equipe}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400">Total SDRs</div>
          <div className="text-2xl font-bold text-blue-400">{stats.totalSDRs}</div>
          <div className="text-xs text-slate-500">Especialistas em agendamento</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400">Total Closers</div>
          <div className="text-2xl font-bold text-purple-400">{stats.totalClosers}</div>
          <div className="text-xs text-slate-500">Especialistas em fechamento</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400">Investimento Total</div>
          <div className="text-2xl font-bold text-green-400">R$ {(stats.totalInvestimento / 1000).toFixed(0)}K</div>
          <div className="text-xs text-slate-500">Tráfego + BPO</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-sm text-slate-400">Total em Vendas</div>
          <div className="text-2xl font-bold text-yellow-400">R$ {(stats.totalVendas / 1000).toFixed(0)}K</div>
          <div className="text-xs text-slate-500">Receita gerada</div>
        </div>
      </div>

      <div>
        <EnhancedTable
          title={`Métricas Gerais - Dados dos Usuários (${formattedRows.length} usuários)`}
          columns={usersColumns}
          data={formattedRows}
          maxHeight="600px"
        />
      </div>
    </div>
  )
}
