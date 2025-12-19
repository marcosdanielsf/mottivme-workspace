'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ReceitaPorCliente {
  cliente: string
  total: number
}

interface ReceitasPorClienteChartProps {
  data: ReceitaPorCliente[]
}

export function ReceitasPorClienteChart({ data }: ReceitasPorClienteChartProps) {
  const chartData = data.map((item) => ({
    cliente: item.cliente,
    total: item.total,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#2A3B55" />
        <XAxis type="number" stroke="#888" tickFormatter={(value) => formatCurrency(value)} />
        <YAxis dataKey="cliente" type="category" stroke="#888" width={150} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A2B45',
            border: '1px solid #2A3B55',
            borderRadius: '8px',
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Bar dataKey="total" fill="#3b82f6" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
