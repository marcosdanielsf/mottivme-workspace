import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Mail, Phone } from 'lucide-react'

interface Inadimplente {
  cliente_fornecedor: string
  telefone: string | null
  email: string | null
  data_vencimento: string
  dias_atraso: number
  valor_total: number
  status_cobranca: string
  tentativas_cobranca: number
  ultima_cobranca: string | null
}

interface InadimplentesTableProps {
  data: Inadimplente[]
}

const STATUS_LABELS: Record<string, string> = {
  em_cobranca: 'Em Cobrança',
  inadimplente: 'Inadimplente',
  negociacao: 'Em Negociação',
  irrecuperavel: 'Irrecuperável',
}

const STATUS_COLORS: Record<string, string> = {
  em_cobranca: 'bg-yellow-500/20 text-yellow-500',
  inadimplente: 'bg-red-500/20 text-red-500',
  negociacao: 'bg-blue-500/20 text-blue-500',
  irrecuperavel: 'bg-gray-500/20 text-gray-500',
}

export function InadimplentesTable({ data }: InadimplentesTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum inadimplente encontrado
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dashboard-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Cliente
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Contato
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Vencimento
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
              Dias Atraso
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Valor
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
              Status
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
              Tentativas
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-dashboard-border hover:bg-dashboard-accent transition-colors"
            >
              <td className="py-3 px-4 text-sm font-medium">{item.cliente_fornecedor}</td>
              <td className="py-3 px-4 text-sm">
                <div className="flex flex-col gap-1">
                  {item.telefone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {item.telefone}
                    </div>
                  )}
                  {item.email && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {item.email}
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{formatDate(item.data_vencimento)}</td>
              <td className="py-3 px-4 text-sm text-center">
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    item.dias_atraso > 90
                      ? 'bg-red-500/20 text-red-500'
                      : item.dias_atraso > 30
                        ? 'bg-orange-500/20 text-orange-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                  )}
                >
                  {item.dias_atraso} dias
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-right font-medium">
                {formatCurrency(item.valor_total)}
              </td>
              <td className="py-3 px-4 text-sm text-center">
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    STATUS_COLORS[item.status_cobranca] || 'bg-gray-500/20 text-gray-500'
                  )}
                >
                  {STATUS_LABELS[item.status_cobranca] || item.status_cobranca}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-center">{item.tentativas_cobranca}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
