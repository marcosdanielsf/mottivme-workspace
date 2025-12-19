import { KpiCard } from '@/components/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateFilter } from '@/components/date-filter'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { FluxoCaixaChart } from '@/components/charts/fluxo-caixa-chart'
import { ReceitasDespesasChart } from '@/components/charts/receitas-despesas-chart'
import { VencimentosTable } from '@/components/tables/vencimentos-table'

async function getOverviewData(month: number, year: number) {
  // Buscar saldo total das contas
  const { data: contasData } = await supabase
    .from('contas_bancarias')
    .select('saldo_atual')
    .eq('ativo', true)

  const saldoTotal = contasData?.reduce((sum, c) => sum + (c.saldo_atual || 0), 0) || 0

  // Buscar receitas do mês
  const { data: receitasData } = await supabase
    .from('movimentacoes_financeiras')
    .select('valor_realizado, valor_previsto')
    .eq('tipo', 'receita')
    .gte('data_vencimento', `${year}-${String(month).padStart(2, '0')}-01`)
    .lt('data_vencimento', month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`)

  const receitasMes = receitasData?.reduce((sum, r) => sum + (r.valor_realizado || r.valor_previsto || 0), 0) || 0

  // Buscar despesas do mês
  const { data: despesasData } = await supabase
    .from('movimentacoes_financeiras')
    .select('valor_realizado, valor_previsto')
    .eq('tipo', 'despesa')
    .gte('data_vencimento', `${year}-${String(month).padStart(2, '0')}-01`)
    .lt('data_vencimento', month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`)

  const despesasMes = despesasData?.reduce((sum, d) => sum + (d.valor_realizado || d.valor_previsto || 0), 0) || 0

  // Buscar inadimplências
  const { data: inadimplenciasData, count: inadimplenciasCount } = await supabase
    .from('movimentacoes_financeiras')
    .select('valor_realizado, valor_previsto', { count: 'exact' })
    .eq('quitado', false)
    .lt('data_vencimento', new Date().toISOString().split('T')[0])

  const inadimplenciaTotal = inadimplenciasData?.reduce((sum, i) => sum + (i.valor_realizado || i.valor_previsto || 0), 0) || 0

  // Buscar vencimentos próximos (7 dias)
  const hoje = new Date()
  const daquiA7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000)

  const { data: vencimentosData, count: vencimentosCount } = await supabase
    .from('movimentacoes_financeiras')
    .select('*', { count: 'exact' })
    .eq('quitado', false)
    .gte('data_vencimento', hoje.toISOString().split('T')[0])
    .lte('data_vencimento', daquiA7Dias.toISOString().split('T')[0])
    .limit(10)

  const vencimentosTotal = vencimentosData?.reduce((sum, v) => sum + (v.valor_realizado || v.valor_previsto || 0), 0) || 0

  const kpis = {
    saldo_total: saldoTotal,
    receitas_mes: receitasMes,
    despesas_mes: despesasMes,
    lucro_mes: receitasMes - despesasMes,
    inadimplencia_total: inadimplenciaTotal,
    inadimplencia_quantidade: inadimplenciasCount || 0,
    vencimentos_proximos_total: vencimentosTotal,
    vencimentos_proximos_quantidade: vencimentosCount || 0,
  }

  // Buscar fluxo de caixa (últimos 6 meses)
  const { data: fluxoCaixa } = await supabase
    .from('vw_dashboard_fluxo_caixa_mensal')
    .select('*')
    .order('mes_num', { ascending: false })
    .limit(6)

  // Formatar vencimentos próximos
  const vencimentos = vencimentosData?.map(v => ({
    ...v,
    valor: v.valor_realizado || v.valor_previsto,
  })) || []

  return { kpis, fluxoCaixa: fluxoCaixa || [], vencimentos }
}

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string }
}) {
  const month = parseInt(searchParams.month || '10')
  const year = parseInt(searchParams.year || '2025')

  const { kpis, fluxoCaixa, vencimentos } = await getOverviewData(month, year)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Overview Financeiro</h1>
        <p className="text-muted-foreground">
          Visão geral dos indicadores financeiros
        </p>
      </div>

      {/* Filtro de Data */}
      <DateFilter />

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Saldo Total"
          value={formatCurrency(kpis.saldo_total || 0)}
          icon={DollarSign}
        />
        <KpiCard
          title="Receitas do Mês"
          value={formatCurrency(kpis.receitas_mes || 0)}
          icon={TrendingUp}
        />
        <KpiCard
          title="Despesas do Mês"
          value={formatCurrency(kpis.despesas_mes || 0)}
          icon={TrendingDown}
        />
        <KpiCard
          title="Lucro do Mês"
          value={formatCurrency(kpis.lucro_mes || 0)}
          icon={DollarSign}
          trend={{
            value: kpis.lucro_mes >= 0 ? 'Positivo' : 'Negativo',
            isPositive: kpis.lucro_mes >= 0,
          }}
        />
      </div>

      {/* Inadimplência KPIs */}
      <div className="grid gap-4 md:grid-cols-2">
        <KpiCard
          title="Total Inadimplente"
          value={formatCurrency(kpis.inadimplencia_total || 0)}
          icon={AlertCircle}
          subtitle={`${kpis.inadimplencia_quantidade || 0} inadimplentes`}
        />
        <KpiCard
          title="Vencimentos Próximos"
          value={formatCurrency(kpis.vencimentos_proximos_total || 0)}
          icon={AlertCircle}
          subtitle={`${kpis.vencimentos_proximos_quantidade || 0} vencendo em 7 dias`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <FluxoCaixaChart data={fluxoCaixa} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ReceitasDespesasChart
              receitas={kpis.receitas_mes || 0}
              despesas={kpis.despesas_mes || 0}
            />
          </CardContent>
        </Card>
      </div>

      {/* Vencimentos Próximos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vencimentos Próximos (7 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <VencimentosTable data={vencimentos} />
        </CardContent>
      </Card>
    </div>
  )
}
