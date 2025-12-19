'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface CentroCustoChartProps {
  data: {
    nome: string
    codigo: string
    valor: number
    percentual: number
  }[]
}

const COLORS = [
  '#22c55e',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#84cc16',
]

export function CentroCustoChart({ data }: CentroCustoChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Sem dados para exibir
      </div>
    )
  }

  const chartData = data.map((item, index) => ({
    name: item.nome,
    value: item.valor,
    percentual: item.percentual,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percentual }) => `${name} (${percentual.toFixed(1)}%)`}
          labelLine={{ stroke: '#6b7280' }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
