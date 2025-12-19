import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'

interface Receita {
  data_vencimento: string
  cliente_fornecedor: string
  categoria: string
  valor_previsto: number
  valor_realizado: number | null
  quitado: boolean
  dias_atraso?: number
}

interface ReceitasTableProps {
  data: Receita[]
}

export function ReceitasTable({ data }: ReceitasTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma receita encontrada
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dashboard-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Vencimento
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Cliente
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Categoria
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Valor Previsto
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Valor Realizado
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-dashboard-border hover:bg-dashboard-accent transition-colors"
            >
              <td className="py-3 px-4 text-sm">{formatDate(item.data_vencimento)}</td>
              <td className="py-3 px-4 text-sm">{item.cliente_fornecedor}</td>
              <td className="py-3 px-4 text-sm">{item.categoria}</td>
              <td className="py-3 px-4 text-sm text-right font-medium">
                {formatCurrency(item.valor_previsto)}
              </td>
              <td className="py-3 px-4 text-sm text-right font-medium">
                {item.valor_realizado ? formatCurrency(item.valor_realizado) : '-'}
              </td>
              <td className="py-3 px-4 text-sm text-center">
                {item.quitado ? (
                  <div className="flex items-center justify-center gap-1 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">Quitado</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-yellow-500">
                    <XCircle className="h-4 w-4" />
                    <span className="text-xs">Pendente</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
