import { KpiCard } from '@/components/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateFilter } from '@/components/date-filter'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, TrendingUp, Users } from 'lucide-react'
import { ReceitasPorCategoriaChart } from '@/components/charts/receitas-por-categoria-chart'
import { ReceitasPorClienteChart } from '@/components/charts/receitas-por-cliente-chart'
import { ReceitasTable } from '@/components/tables/receitas-table'

async function getFaturamentoData(month: number, year: number) {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`

  // Buscar KPIs do mês
  const { data: receitasMes } = await supabase
    .from('movimentacoes_financeiras')
    .select('valor_realizado, valor_previsto, quitado')
    .eq('tipo', 'receita')
    .gte('data_vencimento', startDate)
    .lt('data_vencimento', endDate)

  const faturamentoMes = receitasMes?.reduce((sum, r) => sum + (r.valor_realizado || r.valor_previsto || 0), 0) || 0
  const faturamentoRealizado = receitasMes?.filter(r => r.quitado).reduce((sum, r) => sum + (r.valor_realizado || 0), 0) || 0
  const aReceber = receitasMes?.filter(r => !r.quitado).reduce((sum, r) => sum + (r.valor_previsto || 0), 0) || 0
  const quantidadePendentes = receitasMes?.filter(r => !r.quitado).length || 0

  // Buscar receitas por categoria
  const { data: porCategoria } = await supabase
    .from('movimentacoes_financeiras')
    .select('categoria_id, valor_realizado, valor_previsto')
    .eq('tipo', 'receita')
    .gte('data_vencimento', startDate)
    .lt('data_vencimento', endDate)

  const categoriaAgrupada = porCategoria?.reduce((acc: any[], r) => {
    const categoria = r.categoria_id || 'Sem categoria'
    const existing = acc.find(c => c.categoria === categoria)
    const valor = r.valor_realizado || r.valor_previsto || 0
    if (existing) {
      existing.total += valor
    } else {
      acc.push({ categoria, total: valor })
    }
    return acc
  }, []).sort((a, b) => b.total - a.total).slice(0, 10) || []

  // Buscar receitas por cliente
  const { data: porCliente } = await supabase
    .from('movimentacoes_financeiras')
    .select('fornecedor_cliente_id, valor_realizado, valor_previsto')
    .eq('tipo', 'receita')
    .gte('data_vencimento', startDate)
    .lt('data_vencimento', endDate)

  const clienteAgrupado = porCliente?.reduce((acc: any[], r) => {
    const cliente = r.fornecedor_cliente_id || 'Sem cliente'
    const existing = acc.find(c => c.cliente === cliente)
    const valor = r.valor_realizado || r.valor_previsto || 0
    if (existing) {
      existing.total += valor
    } else {
      acc.push({ cliente, total: valor })
    }
    return acc
  }, []).sort((a, b) => b.total - a.total).slice(0, 10) || []

  // Buscar receitas detalhadas
  const { data: receitas } = await supabase
    .from('movimentacoes_financeiras')
    .select('*')
    .eq('tipo', 'receita')
    .gte('data_vencimento', startDate)
    .lt('data_vencimento', endDate)
    .order('data_vencimento', { ascending: false })
    .limit(50)

  const receitasFormatadas = receitas?.map(r => ({
    ...r,
    valor: r.valor_realizado || r.valor_previsto,
  })) || []

  return {
    kpis: {
      faturamento_mes: faturamentoMes,
      faturamento_realizado: faturamentoRealizado,
      a_receber: aReceber,
      quantidade_pendentes: quantidadePendentes,
    },
    porCategoria: categoriaAgrupada,
    porCliente: clienteAgrupado,
    receitas: receitasFormatadas,
  }
}

export default async function FaturamentoPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string }
}) {
  const month = parseInt(searchParams.month || '10')
  const year = parseInt(searchParams.year || '2025')

  const { kpis, porCategoria, porCliente, receitas } = await getFaturamentoData(month, year)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Faturamento</h1>
        <p className="text-muted-foreground">
          Análise detalhada das receitas e faturamento
        </p>
      </div>

      <DateFilter />

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Faturamento do Mês"
          value={formatCurrency(kpis.faturamento_mes || 0)}
          icon={DollarSign}
        />
        <KpiCard
          title="Faturamento Realizado"
          value={formatCurrency(kpis.faturamento_realizado || 0)}
          icon={TrendingUp}
        />
        <KpiCard
          title="A Receber"
          value={formatCurrency(kpis.a_receber || 0)}
          icon={Users}
          subtitle={`${kpis.quantidade_pendentes || 0} pendentes`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receitas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ReceitasPorCategoriaChart data={porCategoria} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ReceitasPorClienteChart data={porCliente} />
          </CardContent>
        </Card>
      </div>

      {/* Receitas Table */}
      <Card>
        <CardHeader>
          <CardTitle>Receitas Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <ReceitasTable data={receitas} />
        </CardContent>
      </Card>
    </div>
  )
}
