'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const MESES = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Fev' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Abr' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Ago' },
  { value: 9, label: 'Set' },
  { value: 10, label: 'Out' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dez' },
]

interface MultiMonthFilterProps {
  basePath: string
}

export function MultiMonthFilter({ basePath }: MultiMonthFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  // Parse months from URL (format: "10,11,12")
  const monthsParam = searchParams.get('months')
  const yearParam = searchParams.get('year')

  const [selectedYear, setSelectedYear] = useState(yearParam ? parseInt(yearParam) : currentYear)
  const [selectedMonths, setSelectedMonths] = useState<number[]>(() => {
    if (monthsParam) {
      return monthsParam.split(',').map(m => parseInt(m)).filter(m => !isNaN(m))
    }
    return [currentMonth]
  })

  const toggleMonth = (month: number) => {
    setSelectedMonths(prev => {
      if (prev.includes(month)) {
        // Don't allow deselecting all months
        if (prev.length === 1) return prev
        return prev.filter(m => m !== month).sort((a, b) => a - b)
      }
      return [...prev, month].sort((a, b) => a - b)
    })
  }

  const selectRange = (start: number, end: number) => {
    const range: number[] = []
    for (let i = start; i <= end; i++) {
      range.push(i)
    }
    setSelectedMonths(range)
  }

  const applyFilter = () => {
    const params = new URLSearchParams()
    params.set('months', selectedMonths.join(','))
    params.set('year', selectedYear.toString())
    router.push(`${basePath}?${params.toString()}`)
  }

  // Quick select buttons
  const quickSelects = [
    { label: 'Mes Atual', action: () => setSelectedMonths([currentMonth]) },
    { label: 'Ultimos 3', action: () => {
      const months: number[] = []
      for (let i = 0; i < 3; i++) {
        let m = currentMonth - i
        if (m <= 0) m += 12
        months.unshift(m)
      }
      setSelectedMonths(months)
    }},
    { label: 'Ultimos 6', action: () => {
      const months: number[] = []
      for (let i = 0; i < 6; i++) {
        let m = currentMonth - i
        if (m <= 0) m += 12
        months.unshift(m)
      }
      setSelectedMonths(months)
    }},
    { label: 'Ano Todo', action: () => selectRange(1, 12) },
    { label: 'Q1', action: () => selectRange(1, 3) },
    { label: 'Q2', action: () => selectRange(4, 6) },
    { label: 'Q3', action: () => selectRange(7, 9) },
    { label: 'Q4', action: () => selectRange(10, 12) },
  ]

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filtrar por Periodo</h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="bg-dashboard-accent border border-dashboard-border rounded px-3 py-1 text-sm"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {/* Quick select buttons */}
      <div className="flex flex-wrap gap-2">
        {quickSelects.map((qs) => (
          <button
            key={qs.label}
            onClick={qs.action}
            className="px-2 py-1 text-xs bg-dashboard-accent hover:bg-primary/20 rounded transition-colors"
          >
            {qs.label}
          </button>
        ))}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-6 gap-2">
        {MESES.map((mes) => (
          <button
            key={mes.value}
            onClick={() => toggleMonth(mes.value)}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              selectedMonths.includes(mes.value)
                ? 'bg-primary text-primary-foreground'
                : 'bg-dashboard-accent hover:bg-dashboard-accent/80'
            }`}
          >
            {mes.label}
          </button>
        ))}
      </div>

      {/* Selected months display */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Selecionados: {selectedMonths.map(m => MESES[m-1]?.label).join(', ')}
        </p>
        <button
          onClick={applyFilter}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Aplicar Filtro
        </button>
      </div>
    </div>
  )
}
