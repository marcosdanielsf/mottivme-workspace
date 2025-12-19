import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Vencimento {
  data_vencimento: string
  cliente_fornecedor: string
  categoria: string
  valor_previsto: number
  tipo: 'receita' | 'despesa'
}

interface VencimentosTableProps {
  data: Vencimento[]
}

export function VencimentosTable({ data }: VencimentosTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum vencimento próximo
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
              Cliente/Fornecedor
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Categoria
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Valor
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
              Tipo
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
              <td className="py-3 px-4 text-sm text-center">
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    item.tipo === 'receita'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  )}
                >
                  {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
