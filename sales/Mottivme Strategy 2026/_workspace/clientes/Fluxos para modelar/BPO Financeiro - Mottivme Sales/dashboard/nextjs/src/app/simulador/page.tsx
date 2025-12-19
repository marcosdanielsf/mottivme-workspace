'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { SimulacaoResultChart } from '@/components/charts/simulacao-result-chart'
import { Calculator } from 'lucide-react'

export default function SimuladorPage() {
  const [faturamento, setFaturamento] = useState<number>(0)
  const [despesasPF, setDespesasPF] = useState<number>(0)
  const [despesasPJ, setDespesasPJ] = useState<number>(0)
  const [investimento, setInvestimento] = useState<number>(0)
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function simular() {
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('fn_simular_fluxo_caixa', {
        p_faturamento: faturamento,
        p_despesas_pf: despesasPF,
        p_despesas_pj: despesasPJ,
        p_investimento: investimento,
      })

      if (error) throw error
      setResultado(data)
    } catch (error) {
      console.error('Erro na simulação:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Simulador de Fluxo de Caixa</h1>
        <p className="text-muted-foreground">
          Simule diferentes cenários financeiros para planejamento
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Parâmetros da Simulação
            </CardTitle>
            <CardDescription>
              Informe os valores para simular o fluxo de caixa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faturamento">Faturamento Mensal</Label>
              <Input
                id="faturamento"
                type="number"
                value={faturamento}
                onChange={(e) => setFaturamento(Number(e.target.value))}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="despesas-pf">Despesas PF</Label>
              <Input
                id="despesas-pf"
                type="number"
                value={despesasPF}
                onChange={(e) => setDespesasPF(Number(e.target.value))}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="despesas-pj">Despesas PJ</Label>
              <Input
                id="despesas-pj"
                type="number"
                value={despesasPJ}
                onChange={(e) => setDespesasPJ(Number(e.target.value))}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investimento">Investimento Planejado</Label>
              <Input
                id="investimento"
                type="number"
                value={investimento}
                onChange={(e) => setInvestimento(Number(e.target.value))}
                placeholder="R$ 0,00"
              />
            </div>

            <Button onClick={simular} disabled={loading} className="w-full">
              {loading ? 'Simulando...' : 'Simular'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultado da Simulação</CardTitle>
          </CardHeader>
          <CardContent>
            {resultado ? (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="p-4 bg-dashboard-accent rounded-lg">
                    <div className="text-sm text-muted-foreground">Receita Total</div>
                    <div className="text-2xl font-bold text-green-500">
                      {formatCurrency(resultado.receita_total)}
                    </div>
                  </div>

                  <div className="p-4 bg-dashboard-accent rounded-lg">
                    <div className="text-sm text-muted-foreground">Despesas Totais</div>
                    <div className="text-2xl font-bold text-red-500">
                      {formatCurrency(resultado.despesas_totais)}
                    </div>
                  </div>

                  <div className="p-4 bg-dashboard-accent rounded-lg">
                    <div className="text-sm text-muted-foreground">Saldo Final</div>
                    <div
                      className={`text-2xl font-bold ${
                        resultado.saldo_final >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {formatCurrency(resultado.saldo_final)}
                    </div>
                  </div>

                  <div className="p-4 bg-dashboard-accent rounded-lg">
                    <div className="text-sm text-muted-foreground">Margem Líquida</div>
                    <div
                      className={`text-2xl font-bold ${
                        resultado.margem_liquida >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {resultado.margem_liquida.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <SimulacaoResultChart resultado={resultado} />
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Preencha os parâmetros e clique em Simular
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
