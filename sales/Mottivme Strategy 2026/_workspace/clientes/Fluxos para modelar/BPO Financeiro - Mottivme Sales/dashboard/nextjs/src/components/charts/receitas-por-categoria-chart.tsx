'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ReceitaPorCategoria {
  categoria: string
  total: number
}

interface ReceitasPorCategoriaChartProps {
  data: ReceitaPorCategoria[]
}

export function ReceitasPorCategoriaChart({ data }: ReceitasPorCategoriaChartProps) {
  const chartData = data.map((item) => ({
    categoria: item.categoria,
    total: item.total,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A3B55" />
        <XAxis
          dataKey="categoria"
          stroke="#888"
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis stroke="#888" tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A2B45',
            border: '1px solid #2A3B55',
            borderRadius: '8px',
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Bar dataKey="total" fill="#10b981" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
