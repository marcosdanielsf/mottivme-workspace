import { KpiCard } from '@/components/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { AlertCircle, TrendingDown, Users, Clock } from 'lucide-react'
import { InadimplenciaPorStatusChart } from '@/components/charts/inadimplencia-por-status-chart'
import { InadimplentesTable } from '@/components/tables/inadimplentes-table'
import { MultiMonthFilter } from '@/components/multi-month-filter'

function getMonthName(mes: number): string {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return meses[mes - 1] || ''
}

async function getInadimplenciaData(ano: number, meses: number[]) {
  // Get the last day of the last selected month
  const lastMonth = Math.max(...meses)
  const endOfMonth = lastMonth === 12 ? `${ano + 1}-01-01` : `${ano}-${String(lastMonth + 1).padStart(2, '0')}-01`

  // Buscar inadimplências - receitas vencidas e não pagas até o final do período
  const { data: inadimplentesData } = await supabase
    .from('movimentacoes_financeiras')
    .select('id, valor_realizado, valor_previsto, data_vencimento, status_cobranca')
    .eq('tipo', 'receita')
    .eq('quitado', false)
    .lt('data_vencimento', endOfMonth)

  // Filter by months
  const filtered = inadimplentesData?.filter(item => {
    const date = new Date(item.data_vencimento)
    const itemMonth = date.getMonth() + 1
    const itemYear = date.getFullYear()
    return itemYear === ano && meses.includes(itemMonth)
  }) || []

  const totalInadimplente = filtered.reduce((sum, i) => sum + (i.valor_realizado || i.valor_previsto || 0), 0)
  const quantidadeInadimplentes = filtered.length

  // Calcular média de dias de atraso
  const hoje = new Date()
  const diasAtrasoList = filtered.map(i => {
    const dataVencimento = new Date(i.data_vencimento)
    return Math.floor((hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24))
  })
  const mediaDiasAtraso = diasAtrasoList.length > 0
    ? Math.round(diasAtrasoList.reduce((sum, dias) => sum + dias, 0) / diasAtrasoList.length)
    : 0

  // Encontrar maior inadimplência
  const maiorInadimplencia = filtered.reduce((max, i) => {
    const valor = i.valor_realizado || i.valor_previsto || 0
    return valor > max ? valor : max
  }, 0)

  // Agrupar por status de cobrança
  const porStatus = filtered.reduce((acc: any[], i) => {
    const status = i.status_cobranca || 'inadimplente'
    const existing = acc.find(s => s.status_cobranca === status)
    const valor = i.valor_realizado || i.valor_previsto || 0
    if (existing) {
      existing.total += valor
      existing.quantidade += 1
    } else {
      acc.push({ status_cobranca: status, total: valor, quantidade: 1 })
    }
    return acc
  }, [])

  // Buscar detalhes dos inadimplentes
  const { data: inadimplentesDetalhado } = await supabase
    .from('movimentacoes_financeiras')
    .select('*')
    .eq('tipo', 'receita')
    .eq('quitado', false)
    .lt('data_vencimento', endOfMonth)
    .order('data_vencimento', { ascending: true })

  // Filter detailed by months
  const detalhado = inadimplentesDetalhado?.filter(item => {
    const date = new Date(item.data_vencimento)
    const itemMonth = date.getMonth() + 1
    const itemYear = date.getFullYear()
    return itemYear === ano && meses.includes(itemMonth)
  }) || []

  const inadimplentesFormatados = detalhado.map(i => {
    const dataVencimento = new Date(i.data_vencimento)
    const diasAtraso = Math.floor((hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24))
    return {
      ...i,
      valor: i.valor_realizado || i.valor_previsto,
      dias_atraso: diasAtraso,
    }
  })

  return {
    kpis: {
      total_inadimplente: totalInadimplente,
      quantidade_inadimplentes: quantidadeInadimplentes,
      media_dias_atraso: mediaDiasAtraso,
      maior_inadimplencia: maiorInadimplencia,
    },
    porStatus,
    inadimplentes: inadimplentesFormatados,
  }
}

export default async function InadimplenciaPage({
  searchParams,
}: {
  searchParams: { months?: string; year?: string }
}) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const meses = searchParams.months
    ? searchParams.months.split(',').map(m => parseInt(m)).filter(m => !isNaN(m))
    : [currentMonth]
  const ano = searchParams.year ? parseInt(searchParams.year) : currentYear

  const { kpis, porStatus, inadimplentes } = await getInadimplenciaData(ano, meses)

  const periodLabel = meses.length === 1
    ? `${getMonthName(meses[0])}/${ano}`
    : `${getMonthName(meses[0])} a ${getMonthName(meses[meses.length - 1])}/${ano}`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inadimplencia</h1>
        <p className="text-muted-foreground">
          Gestao e controle de inadimplentes e cobrancas
        </p>
      </div>

      {/* Filtro Multi-Mes */}
      <MultiMonthFilter basePath="/inadimplencia" />

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          title="Total Inadimplente"
          value={formatCurrency(kpis.total_inadimplente || 0)}
          icon={AlertCircle}
          subtitle={periodLabel}
        />
        <KpiCard
          title="Quantidade"
          value={String(kpis.quantidade_inadimplentes || 0)}
          icon={Users}
          subtitle="inadimplentes no periodo"
        />
        <KpiCard
          title="Media Dias Atraso"
          value={`${Math.round(kpis.media_dias_atraso || 0)} dias`}
          icon={Clock}
        />
        <KpiCard
          title="Maior Inadimplencia"
          value={formatCurrency(kpis.maior_inadimplencia || 0)}
          icon={TrendingDown}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inadimplencia por Status - {periodLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <InadimplenciaPorStatusChart data={porStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Cobranca</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-dashboard-accent rounded-lg">
              <div className="text-sm text-muted-foreground">Em Cobranca</div>
              <div className="text-xl font-bold text-yellow-500">
                {formatCurrency(
                  porStatus.find((s) => s.status_cobranca === 'em_cobranca')?.total || 0
                )}
              </div>
            </div>
            <div className="p-4 bg-dashboard-accent rounded-lg">
              <div className="text-sm text-muted-foreground">Inadimplente</div>
              <div className="text-xl font-bold text-red-500">
                {formatCurrency(
                  porStatus.find((s) => s.status_cobranca === 'inadimplente')?.total || 0
                )}
              </div>
            </div>
            <div className="p-4 bg-dashboard-accent rounded-lg">
              <div className="text-sm text-muted-foreground">Em Negociacao</div>
              <div className="text-xl font-bold text-blue-500">
                {formatCurrency(
                  porStatus.find((s) => s.status_cobranca === 'negociacao')?.total || 0
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inadimplentes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inadimplentes Detalhado - {periodLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <InadimplentesTable data={inadimplentes} />
        </CardContent>
      </Card>
    </div>
  )
}
