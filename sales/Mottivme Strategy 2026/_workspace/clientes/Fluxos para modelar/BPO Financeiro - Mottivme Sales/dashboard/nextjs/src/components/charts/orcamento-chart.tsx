'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface OrcamentoChartProps {
  data: {
    categoria: string
    planejado: number
    realizado: number
    tipo: string
  }[]
}

export function OrcamentoChart({ data }: OrcamentoChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Sem dados de orcamento para exibir
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          type="number"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={{ stroke: '#374151' }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="categoria"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={{ stroke: '#374151' }}
          width={90}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Legend />
        <Bar
          dataKey="planejado"
          name="Planejado"
          fill="#6b7280"
          radius={[0, 4, 4, 0]}
        />
        <Bar
          dataKey="realizado"
          name="Realizado"
          radius={[0, 4, 4, 0]}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.tipo === 'receita'
                  ? entry.realizado >= entry.planejado
                    ? '#22c55e'
                    : '#f59e0b'
                  : entry.realizado <= entry.planejado
                  ? '#22c55e'
                  : '#ef4444'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
