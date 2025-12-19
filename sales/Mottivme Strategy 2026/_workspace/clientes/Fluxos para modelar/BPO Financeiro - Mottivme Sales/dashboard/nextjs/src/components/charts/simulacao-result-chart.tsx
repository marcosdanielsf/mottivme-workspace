'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface SimulacaoResultChartProps {
  resultado: {
    receita_total: number
    despesas_totais: number
    saldo_final: number
    margem_liquida: number
  }
}

export function SimulacaoResultChart({ resultado }: SimulacaoResultChartProps) {
  const data = [
    { name: 'Receitas', value: resultado.receita_total, color: '#10b981' },
    { name: 'Despesas', value: resultado.despesas_totais, color: '#ef4444' },
    {
      name: 'Saldo Final',
      value: Math.abs(resultado.saldo_final),
      color: resultado.saldo_final >= 0 ? '#3b82f6' : '#f59e0b',
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A3B55" />
        <XAxis dataKey="name" stroke="#888" />
        <YAxis stroke="#888" tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A2B45',
            border: '1px solid #2A3B55',
            borderRadius: '8px',
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
