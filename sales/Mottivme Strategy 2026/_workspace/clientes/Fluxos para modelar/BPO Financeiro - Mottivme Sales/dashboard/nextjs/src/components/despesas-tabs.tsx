'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DespesasTable } from '@/components/tables/despesas-table'

interface Despesa {
  data_vencimento: string
  cliente_fornecedor: string
  categoria: string
  tipo_entidade: 'pf' | 'pj'
  valor_previsto: number
  valor_realizado: number | null
  quitado: boolean
}

interface DespesasTabsProps {
  despesas: Despesa[]
}

export function DespesasTabs({ despesas }: DespesasTabsProps) {
  const despesasPF = despesas.filter((d) => d.tipo_entidade === 'pf')
  const despesasPJ = despesas.filter((d) => d.tipo_entidade === 'pj')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas Detalhadas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="todas" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pf">Pessoa Física</TabsTrigger>
            <TabsTrigger value="pj">Pessoa Jurídica</TabsTrigger>
          </TabsList>
          <TabsContent value="todas">
            <DespesasTable data={despesas} />
          </TabsContent>
          <TabsContent value="pf">
            <DespesasTable data={despesasPF} />
          </TabsContent>
          <TabsContent value="pj">
            <DespesasTable data={despesasPJ} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
