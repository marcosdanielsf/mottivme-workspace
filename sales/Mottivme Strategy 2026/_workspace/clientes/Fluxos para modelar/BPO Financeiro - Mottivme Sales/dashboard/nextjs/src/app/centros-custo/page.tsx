import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { CentroCustoChart } from '@/components/charts/centro-custo-chart'
import { MultiMonthFilter } from '@/components/multi-month-filter'

interface CentroCusto {
  id: string
  nome: string
  codigo: string
  descricao: string | null
}

interface DespesaPorCentro {
  centro_custo_id: string
  centro_nome: string
  centro_codigo: string
  total: number
  quantidade: number
}

async function getCentrosCusto() {
  const { data, error } = await supabase
    .from('centros_custo')
    .select('*')
    .eq('ativo', true)
    .order('codigo')

  if (error) {
    console.error('Erro ao buscar centros de custo:', error)
    return []
  }

  return (data || []) as CentroCusto[]
}

async function getDespesasPorCentro(ano: number, meses: number[]) {
  const { data, error } = await supabase
    .from('movimentacoes_financeiras')
    .select(`
      centro_custo_id,
      valor_realizado,
      valor_previsto,
      data_vencimento,
      centros_custo (
        nome,
        codigo
      )
    `)
    .eq('tipo', 'despesa')
    .not('centro_custo_id', 'is', null)

  if (error) {
    console.error('Erro ao buscar despesas:', error)
    return []
  }

  // Filter by months manually
  const filtered = data?.filter(item => {
    const date = new Date(item.data_vencimento)
    const itemMonth = date.getMonth() + 1
    const itemYear = date.getFullYear()
    return itemYear === ano && meses.includes(itemMonth)
  }) || []

  // Agrupar por centro de custo
  const agrupado: { [key: string]: DespesaPorCentro } = {}

  filtered.forEach(item => {
    const centroId = item.centro_custo_id || 'sem-centro'
    const centroData = item.centros_custo as any
    const centro = Array.isArray(centroData) ? centroData[0] : centroData

    if (!agrupado[centroId]) {
      agrupado[centroId] = {
        centro_custo_id: centroId,
        centro_nome: centro?.nome || 'Sem Centro de Custo',
        centro_codigo: centro?.codigo || '-',
        total: 0,
        quantidade: 0,
      }
    }

    agrupado[centroId].total += item.valor_realizado || item.valor_previsto || 0
    agrupado[centroId].quantidade += 1
  })

  return Object.values(agrupado).sort((a, b) => b.total - a.total)
}

function getMonthName(mes: number): string {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return meses[mes - 1] || ''
}

export default async function CentrosCustoPage({
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

  const [centrosCusto, despesasPorCentro] = await Promise.all([
    getCentrosCusto(),
    getDespesasPorCentro(ano, meses),
  ])

  const totalDespesas = despesasPorCentro.reduce((sum, d) => sum + d.total, 0)
  const totalMovimentacoes = despesasPorCentro.reduce((sum, d) => sum + d.quantidade, 0)

  const chartData = despesasPorCentro.map(d => ({
    nome: d.centro_nome,
    codigo: d.centro_codigo,
    valor: d.total,
    percentual: totalDespesas > 0 ? (d.total / totalDespesas) * 100 : 0,
  }))

  const cores = [
    '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
    '#14b8a6', '#f97316', '#6366f1', '#84cc16'
  ]

  const periodLabel = meses.length === 1
    ? `${getMonthName(meses[0])}/${ano}`
    : `${getMonthName(meses[0])} a ${getMonthName(meses[meses.length - 1])}/${ano}`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Centros de Custo</h1>
        <p className="text-muted-foreground">
          Analise a distribuicao de despesas por area da empresa
        </p>
      </div>

      {/* Filtro Multi-Mes */}
      <MultiMonthFilter basePath="/centros-custo" />

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalDespesas)}</p>
            <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Centros Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{centrosCusto.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Centros de custo cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Movimentacoes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalMovimentacoes}</p>
            <p className="text-xs text-muted-foreground mt-1">Lancamentos no periodo</p>
          </CardContent>
        </Card>
      </div>

      {/* Grafico e Tabela lado a lado */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Grafico de Pizza */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuicao por Centro de Custo - {periodLabel}</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <CentroCustoChart data={chartData} />
          </CardContent>
        </Card>

        {/* Lista de Centros */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {despesasPorCentro.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma despesa com centro de custo no periodo
                </p>
              ) : (
                despesasPorCentro.map((centro, index) => {
                  const percentual = totalDespesas > 0 ? (centro.total / totalDespesas) * 100 : 0
                  return (
                    <div key={centro.centro_custo_id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cores[index % cores.length] }}
                          />
                          <span className="font-medium">{centro.centro_nome}</span>
                          <span className="text-xs text-muted-foreground">({centro.centro_codigo})</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(centro.total)}</p>
                          <p className="text-xs text-muted-foreground">{percentual.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="h-2 bg-dashboard-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentual}%`,
                            backgroundColor: cores[index % cores.length],
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Centros de Custo */}
      <Card>
        <CardHeader>
          <CardTitle>Centros de Custo Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dashboard-border">
                  <th className="text-left py-3 px-4">Codigo</th>
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Descricao</th>
                </tr>
              </thead>
              <tbody>
                {centrosCusto.map((centro) => (
                  <tr key={centro.id} className="border-b border-dashboard-border/50 hover:bg-dashboard-card/50">
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-mono">
                        {centro.codigo}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{centro.nome}</td>
                    <td className="py-3 px-4 text-muted-foreground">{centro.descricao || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
