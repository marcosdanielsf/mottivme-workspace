import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { OrcamentoChart } from '@/components/charts/orcamento-chart'
import { MultiMonthFilter } from '@/components/multi-month-filter'

interface OrcamentoData {
  ano: number
  mes: number
  tipo: string
  categoria: string
  centro_custo: string | null
  valor_planejado: number
  valor_realizado: number
  diferenca: number
  percentual_realizado: number
}

async function getOrcamentoData(ano: number, meses: number[]) {
  const { data, error } = await supabase
    .from('vw_orcamento_realizado')
    .select('*')
    .eq('ano', ano)
    .in('mes', meses)
    .order('tipo')
    .order('categoria')

  if (error) {
    console.error('Erro ao buscar orcamento:', error)
    return []
  }

  return (data || []) as OrcamentoData[]
}

function getMonthName(mes: number): string {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return meses[mes - 1] || ''
}

function getStatusBadge(percentual: number, tipo: string) {
  if (tipo === 'receita') {
    if (percentual >= 100) return { color: 'bg-green-500/20 text-green-500', label: 'Atingido' }
    if (percentual >= 80) return { color: 'bg-yellow-500/20 text-yellow-500', label: 'Proximo' }
    return { color: 'bg-red-500/20 text-red-500', label: 'Abaixo' }
  } else {
    if (percentual <= 100) return { color: 'bg-green-500/20 text-green-500', label: 'No limite' }
    if (percentual <= 120) return { color: 'bg-yellow-500/20 text-yellow-500', label: 'Atencao' }
    return { color: 'bg-red-500/20 text-red-500', label: 'Estourado' }
  }
}

// Aggregate data by category across months
function aggregateByCategory(data: OrcamentoData[]) {
  const aggregated: { [key: string]: { tipo: string; categoria: string; planejado: number; realizado: number } } = {}

  data.forEach(item => {
    const key = `${item.tipo}-${item.categoria}`
    if (!aggregated[key]) {
      aggregated[key] = {
        tipo: item.tipo,
        categoria: item.categoria || 'Sem categoria',
        planejado: 0,
        realizado: 0,
      }
    }
    aggregated[key].planejado += item.valor_planejado || 0
    aggregated[key].realizado += item.valor_realizado || 0
  })

  return Object.values(aggregated).map(item => ({
    ...item,
    percentual: item.planejado > 0 ? (item.realizado / item.planejado) * 100 : 0,
  }))
}

export default async function OrcamentoPage({
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

  const orcamentoData = await getOrcamentoData(ano, meses)
  const aggregatedData = aggregateByCategory(orcamentoData)

  const receitas = aggregatedData.filter(o => o.tipo === 'receita')
  const despesas = aggregatedData.filter(o => o.tipo === 'despesa')

  const totalReceitaPlanejada = receitas.reduce((sum, r) => sum + r.planejado, 0)
  const totalReceitaRealizada = receitas.reduce((sum, r) => sum + r.realizado, 0)
  const totalDespesaPlanejada = despesas.reduce((sum, d) => sum + d.planejado, 0)
  const totalDespesaRealizada = despesas.reduce((sum, d) => sum + d.realizado, 0)

  const chartData = aggregatedData.map(o => ({
    categoria: o.categoria,
    planejado: o.planejado,
    realizado: o.realizado,
    tipo: o.tipo,
  }))

  const periodLabel = meses.length === 1
    ? `${getMonthName(meses[0])}/${ano}`
    : `${getMonthName(meses[0])} a ${getMonthName(meses[meses.length - 1])}/${ano}`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Orcamento vs Realizado</h1>
        <p className="text-muted-foreground">
          Compare o planejamento financeiro com a execucao real
        </p>
      </div>

      {/* Filtro Multi-Mes */}
      <MultiMonthFilter basePath="/orcamento" />

      {/* KPIs de Orcamento */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Planejada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalReceitaPlanejada)}</p>
            <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Realizada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalReceitaRealizada >= totalReceitaPlanejada ? 'text-green-500' : 'text-yellow-500'}`}>
              {formatCurrency(totalReceitaRealizada)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalReceitaPlanejada > 0 ? ((totalReceitaRealizada / totalReceitaPlanejada) * 100).toFixed(0) : 0}% da meta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesa Planejada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalDespesaPlanejada)}</p>
            <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesa Realizada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalDespesaRealizada <= totalDespesaPlanejada ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(totalDespesaRealizada)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalDespesaPlanejada > 0 ? ((totalDespesaRealizada / totalDespesaPlanejada) * 100).toFixed(0) : 0}% do limite
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafico */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo por Categoria - {periodLabel}</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <OrcamentoChart data={chartData} />
        </CardContent>
      </Card>

      {/* Tabelas por tipo */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Receitas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-500">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dashboard-border">
                    <th className="text-left py-2 px-3">Categoria</th>
                    <th className="text-right py-2 px-3">Planejado</th>
                    <th className="text-right py-2 px-3">Realizado</th>
                    <th className="text-center py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {receitas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted-foreground">
                        Nenhum orcamento de receita cadastrado
                      </td>
                    </tr>
                  ) : (
                    <>
                      {receitas.map((item, index) => {
                        const status = getStatusBadge(item.percentual, 'receita')
                        return (
                          <tr key={index} className="border-b border-dashboard-border/50">
                            <td className="py-2 px-3">{item.categoria}</td>
                            <td className="text-right py-2 px-3">{formatCurrency(item.planejado)}</td>
                            <td className="text-right py-2 px-3">{formatCurrency(item.realizado)}</td>
                            <td className="text-center py-2 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                                {item.percentual.toFixed(0)}%
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                      {receitas.length > 0 && (
                        <tr className="border-t-2 border-dashboard-border bg-dashboard-accent/30 font-bold">
                          <td className="py-2 px-3">TOTAL</td>
                          <td className="text-right py-2 px-3">{formatCurrency(totalReceitaPlanejada)}</td>
                          <td className="text-right py-2 px-3">{formatCurrency(totalReceitaRealizada)}</td>
                          <td className="text-center py-2 px-3">
                            {totalReceitaPlanejada > 0 ? ((totalReceitaRealizada / totalReceitaPlanejada) * 100).toFixed(0) : 0}%
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Despesas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dashboard-border">
                    <th className="text-left py-2 px-3">Categoria</th>
                    <th className="text-right py-2 px-3">Planejado</th>
                    <th className="text-right py-2 px-3">Realizado</th>
                    <th className="text-center py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {despesas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted-foreground">
                        Nenhum orcamento de despesa cadastrado
                      </td>
                    </tr>
                  ) : (
                    <>
                      {despesas.map((item, index) => {
                        const status = getStatusBadge(item.percentual, 'despesa')
                        return (
                          <tr key={index} className="border-b border-dashboard-border/50">
                            <td className="py-2 px-3">{item.categoria}</td>
                            <td className="text-right py-2 px-3">{formatCurrency(item.planejado)}</td>
                            <td className="text-right py-2 px-3">{formatCurrency(item.realizado)}</td>
                            <td className="text-center py-2 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                                {item.percentual.toFixed(0)}%
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                      {despesas.length > 0 && (
                        <tr className="border-t-2 border-dashboard-border bg-dashboard-accent/30 font-bold">
                          <td className="py-2 px-3">TOTAL</td>
                          <td className="text-right py-2 px-3">{formatCurrency(totalDespesaPlanejada)}</td>
                          <td className="text-right py-2 px-3">{formatCurrency(totalDespesaRealizada)}</td>
                          <td className="text-center py-2 px-3">
                            {totalDespesaPlanejada > 0 ? ((totalDespesaRealizada / totalDespesaPlanejada) * 100).toFixed(0) : 0}%
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
