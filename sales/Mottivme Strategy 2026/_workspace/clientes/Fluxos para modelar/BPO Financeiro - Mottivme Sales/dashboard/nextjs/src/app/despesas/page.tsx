import { KpiCard } from '@/components/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateFilter } from '@/components/date-filter'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, TrendingDown, Users } from 'lucide-react'
import { DespesasPorCategoriaChart } from '@/components/charts/despesas-por-categoria-chart'
import { DespesasPFPJChart } from '@/components/charts/despesas-pf-pj-chart'
import { DespesasTabs } from '@/components/despesas-tabs'

async function getDespesasData(month: number, year: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`

  // Buscar KPIs do mês
  const { data: despesasMes } = await supabase
    .from('movimentacoes_financeiras')
    .select('valor_realizado, valor_previsto, quitado')
    .eq('tipo', 'despesa')
    .gte('data_vencimento', startDate)
    .lt('data_vencimento', endDate)

  const despesasMesTotal = despesasMes?.reduce((sum, d) => sum + (d.valor_realizado || d.valor_previsto || 0), 0) || 0
  const despesasPagas = despesasMes?.filter(d => d.quitado).reduce((sum, d) => sum + (d.valor_realizado || 0), 0) || 0
  const aPagar = despesasMes?.filter(d => !d.quitado).reduce((sum, d) => sum + (d.valor_previsto || 0), 0) || 0
  const quantidadePendentes = despesasMes?.filter(d => !d.quitado).length || 0

  // Buscar despesas por categoria
  const { data: porCategoria } = await supabase
    .from('movimentacoes_financeiras')
    .select('categoria_id, valor_realizado, valor_previsto')
    .eq('tipo', 'despesa')
    .gte('data_vencimento', startDate)
    .lt('data_vencimento', endDate)

  const categoriaAgrupada = porCategoria?.reduce((acc: any[], d) => {
    const categoria = d.categoria_id || 'Sem categoria'
    const existing = acc.find(c => c.categoria === categoria)
    const valor = d.valor_realizado || d.valor_previsto || 0
    if (existing) {
      existing.total += valor
    } else {
      acc.push({ categoria, total: valor })
    }
    return acc
  }, []).sort((a, b) => b.total - a.total).slice(0, 10) || []

  // Buscar despesas PF/PJ
  const { data: despesasPFPJ } = await supabase
    .from('movimentacoes_financeiras')
    .select('tipo_pessoa, valor_realizado, valor_previsto')
    .eq('tipo', 'despesa')
    .gte('data_vencimento', startDate)
    .lt('data_vencimento', endDate)

  const pfpjAgrupado = despesasPFPJ?.reduce((acc: any[], d) => {
    const tipoPessoa = d.tipo_pessoa || 'Não informado'
    const existing = acc.find(t => t.tipo === tipoPessoa)
    const valor = d.valor_realizado || d.valor_previsto || 0
    if (existing) {
      existing.total += valor
    } else {
      acc.push({ tipo: tipoPessoa, total: valor })
    }
    return acc
  }, []) || []

  // Buscar despesas detalhadas
  const { data: todasDespesas } = await supabase
    .from('movimentacoes_financeiras')
    .select('*')
    .eq('tipo', 'despesa')
    .gte('data_vencimento', startDate)
    .lt('data_vencimento', endDate)
    .order('data_vencimento', { ascending: false })
    .limit(100)

  const despesasFormatadas = todasDespesas?.map(d => ({
    ...d,
    valor: d.valor_realizado || d.valor_previsto,
  })) || []

  return {
    kpis: {
      despesas_mes: despesasMesTotal,
      despesas_pagas: despesasPagas,
      a_pagar: aPagar,
      quantidade_pendentes: quantidadePendentes,
    },
    porCategoria: categoriaAgrupada,
    pfpj: pfpjAgrupado,
    todasDespesas: despesasFormatadas,
  }
}

export default async function DespesasPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string }
}) {
  const month = parseInt(searchParams.month || '10')
  const year = parseInt(searchParams.year || '2025')

  const { kpis, porCategoria, pfpj, todasDespesas } = await getDespesasData(month, year)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Despesas</h1>
        <p className="text-muted-foreground">
          Controle e análise de despesas PF e PJ
        </p>
      </div>

      <DateFilter />

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Despesas do Mês"
          value={formatCurrency(kpis.despesas_mes || 0)}
          icon={DollarSign}
        />
        <KpiCard
          title="Despesas Pagas"
          value={formatCurrency(kpis.despesas_pagas || 0)}
          icon={TrendingDown}
        />
        <KpiCard
          title="A Pagar"
          value={formatCurrency(kpis.a_pagar || 0)}
          icon={Users}
          subtitle={`${kpis.quantidade_pendentes || 0} pendentes`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <DespesasPorCategoriaChart data={porCategoria} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas PF vs PJ</CardTitle>
          </CardHeader>
          <CardContent>
            <DespesasPFPJChart data={pfpj} />
          </CardContent>
        </Card>
      </div>

      {/* Despesas Tabs */}
      <DespesasTabs despesas={todasDespesas} />
    </div>
  )
}
