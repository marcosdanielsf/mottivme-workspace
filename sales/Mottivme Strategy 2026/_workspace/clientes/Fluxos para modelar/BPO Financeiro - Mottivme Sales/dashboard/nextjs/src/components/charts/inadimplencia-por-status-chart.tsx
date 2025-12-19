'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface InadimplenciaPorStatus {
  status_cobranca: string
  total: number
  quantidade: number
}

interface InadimplenciaPorStatusChartProps {
  data: InadimplenciaPorStatus[]
}

const COLORS: Record<string, string> = {
  em_cobranca: '#f59e0b',
  inadimplente: '#ef4444',
  negociacao: '#3b82f6',
  irrecuperavel: '#6b7280',
}

const STATUS_LABELS: Record<string, string> = {
  em_cobranca: 'Em Cobrança',
  inadimplente: 'Inadimplente',
  negociacao: 'Em Negociação',
  irrecuperavel: 'Irrecuperável',
}

export function InadimplenciaPorStatusChart({ data }: InadimplenciaPorStatusChartProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status_cobranca] || item.status_cobranca,
    value: item.total,
    quantidade: item.quantidade,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => {
            const statusKey = data[index].status_cobranca
            return <Cell key={`cell-${index}`} fill={COLORS[statusKey] || '#6b7280'} />
          })}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A2B45',
            border: '1px solid #2A3B55',
            borderRadius: '8px',
          }}
          formatter={(value: number, name: string, props: any) => [
            `${formatCurrency(value)} (${props.payload.quantidade} clientes)`,
            name,
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
