'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface FluxoCaixaData {
  mes_ano: string
  receitas: number
  despesas: number
  lucro: number
}

interface FluxoCaixaChartProps {
  data: FluxoCaixaData[]
}

export function FluxoCaixaChart({ data }: FluxoCaixaChartProps) {
  const chartData = data.reverse().map((item) => ({
    mes: item.mes_ano,
    Receitas: item.receitas,
    Despesas: item.despesas,
    Lucro: item.lucro,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A3B55" />
        <XAxis dataKey="mes" stroke="#888" />
        <YAxis stroke="#888" tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A2B45',
            border: '1px solid #2A3B55',
            borderRadius: '8px',
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Receitas"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981' }}
        />
        <Line
          type="monotone"
          dataKey="Despesas"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444' }}
        />
        <Line
          type="monotone"
          dataKey="Lucro"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
