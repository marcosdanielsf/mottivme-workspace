import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { DreChart } from '@/components/charts/dre-chart'
import { MultiMonthFilter } from '@/components/multi-month-filter'

interface DreData {
  ano: number
  mes: number
  receita_bruta: number
  despesas_totais: number
  resultado_liquido: number
  margem_liquida_percentual: number
}

async function getDreData(ano: number, meses: number[]) {
  // Build query for selected months
  const { data, error } = await supabase
    .from('vw_dre_mensal')
    .select('*')
    .eq('ano', ano)
    .in('mes', meses)
    .order('mes', { ascending: true })

  if (error) {
    console.error('Erro ao buscar DRE:', error)
    return []
  }

  return (data || []) as DreData[]
}

function getMonthName(mes: number): string {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return meses[mes - 1] || ''
}

export default async function DrePage({
  searchParams,
}: {
  searchParams: { months?: string; year?: string }
}) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  // Parse months from URL
  const meses = searchParams.months
    ? searchParams.months.split(',').map(m => parseInt(m)).filter(m => !isNaN(m))
    : [currentMonth]
  const ano = searchParams.year ? parseInt(searchParams.year) : currentYear

  const dreData = await getDreData(ano, meses)

  // Aggregate totals across selected months
  const totalReceitas = dreData.reduce((sum, d) => sum + (d.receita_bruta || 0), 0)
  const totalDespesas = dreData.reduce((sum, d) => sum + (d.despesas_totais || 0), 0)
  const resultadoTotal = totalReceitas - totalDespesas
  const margemMedia = totalReceitas > 0 ? ((resultadoTotal / totalReceitas) * 100) : 0

  const chartData = dreData.map(d => ({
    mes: `${getMonthName(d.mes)}/${d.ano}`,
    receitas: d.receita_bruta || 0,
    despesas: d.despesas_totais || 0,
    resultado: d.resultado_liquido || 0,
  }))

  const periodLabel = meses.length === 1
    ? `${getMonthName(meses[0])}/${ano}`
    : `${getMonthName(meses[0])} a ${getMonthName(meses[meses.length - 1])}/${ano}`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">DRE - Demonstrativo de Resultado</h1>
        <p className="text-muted-foreground">
          Analise o resultado financeiro da empresa
        </p>
      </div>

      {/* Filtro Multi-Mes */}
      <MultiMonthFilter basePath="/dre" />

      {/* KPIs do DRE */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {formatCurrency(totalReceitas)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalDespesas)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resultado Liquido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${resultadoTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(resultadoTotal)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Margem Liquida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${margemMedia >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {margemMedia.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
          </CardContent>
        </Card>
      </div>

      {/* Grafico DRE */}
      <Card>
        <CardHeader>
          <CardTitle>Evolucao do DRE - {periodLabel}</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <DreChart data={chartData} />
        </CardContent>
      </Card>

      {/* Tabela detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dashboard-border">
                  <th className="text-left py-3 px-4">Periodo</th>
                  <th className="text-right py-3 px-4">Receitas</th>
                  <th className="text-right py-3 px-4">Despesas</th>
                  <th className="text-right py-3 px-4">Resultado</th>
                  <th className="text-right py-3 px-4">Margem</th>
                </tr>
              </thead>
              <tbody>
                {dreData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhum dado encontrado para o periodo selecionado
                    </td>
                  </tr>
                ) : (
                  <>
                    {dreData.map((item, index) => (
                      <tr key={index} className="border-b border-dashboard-border/50 hover:bg-dashboard-card/50">
                        <td className="py-3 px-4 font-medium">
                          {getMonthName(item.mes)}/{item.ano}
                        </td>
                        <td className="text-right py-3 px-4 text-green-500">
                          {formatCurrency(item.receita_bruta || 0)}
                        </td>
                        <td className="text-right py-3 px-4 text-red-500">
                          {formatCurrency(item.despesas_totais || 0)}
                        </td>
                        <td className={`text-right py-3 px-4 font-medium ${(item.resultado_liquido || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(item.resultado_liquido || 0)}
                        </td>
                        <td className={`text-right py-3 px-4 ${(item.margem_liquida_percentual || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {(item.margem_liquida_percentual || 0).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                    {/* Totals row */}
                    {dreData.length > 1 && (
                      <tr className="border-t-2 border-dashboard-border bg-dashboard-accent/30 font-bold">
                        <td className="py-3 px-4">TOTAL</td>
                        <td className="text-right py-3 px-4 text-green-500">
                          {formatCurrency(totalReceitas)}
                        </td>
                        <td className="text-right py-3 px-4 text-red-500">
                          {formatCurrency(totalDespesas)}
                        </td>
                        <td className={`text-right py-3 px-4 ${resultadoTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(resultadoTotal)}
                        </td>
                        <td className={`text-right py-3 px-4 ${margemMedia >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {margemMedia.toFixed(1)}%
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
  )
}
