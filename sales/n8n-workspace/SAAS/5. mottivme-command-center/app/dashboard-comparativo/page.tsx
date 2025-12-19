'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Users,
  Phone,
  DollarSign,
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import {
  getProdutos,
  getComparativoMetaReal,
  getResultadosMes,
  carregarPlanejamento,
  type Produto,
  type ResultadoDiario
} from '@/lib/supabase'

interface ComparativoData {
  metrica: string
  planejado: number
  realizado: number
  percentual: number
  status: 'above' | 'below' | 'on_track'
}

const DEMO_EMPRESA_ID = process.env.NEXT_PUBLIC_DEFAULT_EMPRESA_ID || '00000000-0000-0000-0000-000000000001'

export default function DashboardComparativo() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [selectedProdutoId, setSelectedProdutoId] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [resultados, setResultados] = useState<ResultadoDiario[]>([])
  const [planejamento, setPlanejamento] = useState<any>(null)
  const [isDemo, setIsDemo] = useState(true)

  const months = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  // Load products
  useEffect(() => {
    async function loadProdutos() {
      try {
        const data = await getProdutos(DEMO_EMPRESA_ID)
        if (data.length > 0) {
          setProdutos(data)
          setSelectedProdutoId(data[0].id)
          setIsDemo(false)
        } else {
          // Demo mode
          setProdutos([{
            id: 'demo-produto',
            empresa_id: DEMO_EMPRESA_ID,
            nome: 'Produto Demo',
            ticket_medio: 2500,
            taxas_estimadas: { cpl: 8, qualificacao: 50, agendamento_sdr: 40, comparecimento: 70, conversao_closer: 20 },
            ativo: true,
            created_at: new Date().toISOString()
          }])
          setSelectedProdutoId('demo-produto')
          setIsDemo(true)
        }
      } catch {
        setIsDemo(true)
        setProdutos([{
          id: 'demo-produto',
          empresa_id: DEMO_EMPRESA_ID,
          nome: 'Produto Demo',
          ticket_medio: 2500,
          taxas_estimadas: { cpl: 8, qualificacao: 50, agendamento_sdr: 40, comparecimento: 70, conversao_closer: 20 },
          ativo: true,
          created_at: new Date().toISOString()
        }])
        setSelectedProdutoId('demo-produto')
      }
      setLoading(false)
    }
    loadProdutos()
  }, [])

  // Load data when product/month changes
  useEffect(() => {
    async function loadData() {
      if (!selectedProdutoId || isDemo) return

      setLoading(true)
      try {
        const [plan, results] = await Promise.all([
          carregarPlanejamento(DEMO_EMPRESA_ID, selectedProdutoId, selectedMonth, selectedYear),
          getResultadosMes(DEMO_EMPRESA_ID, selectedProdutoId, selectedMonth, selectedYear)
        ])
        setPlanejamento(plan)
        setResultados(results)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedProdutoId, selectedMonth, selectedYear, isDemo])

  // Calculate totals from results
  const totaisRealizados = useMemo(() => {
    return resultados.reduce((acc, r) => ({
      leads: acc.leads + (r.leads_gerados || 0),
      mqls: acc.mqls + (r.mqls_gerados || 0),
      callsAgendadas: acc.callsAgendadas + (r.calls_agendadas || 0),
      callsRealizadas: acc.callsRealizadas + (r.calls_realizadas || 0),
      vendas: acc.vendas + (r.vendas_fechadas || 0),
      faturamento: acc.faturamento + (r.faturamento_dia || 0),
      investimento: acc.investimento + (r.investimento_dia || 0)
    }), { leads: 0, mqls: 0, callsAgendadas: 0, callsRealizadas: 0, vendas: 0, faturamento: 0, investimento: 0 })
  }, [resultados])

  // Demo data
  const demoData = {
    planejado: {
      leads: 1875,
      mqls: 937,
      callsAgendadas: 375,
      callsRealizadas: 262,
      vendas: 52,
      faturamento: 130000,
      investimento: 15000
    },
    realizado: {
      leads: 1650,
      mqls: 890,
      callsAgendadas: 340,
      callsRealizadas: 245,
      vendas: 48,
      faturamento: 120000,
      investimento: 14200
    }
  }

  // Build comparison data
  const comparativo: ComparativoData[] = useMemo(() => {
    const plan = isDemo ? demoData.planejado : (planejamento || demoData.planejado)
    const real = isDemo ? demoData.realizado : totaisRealizados

    const buildMetric = (name: string, planejado: number, realizado: number, higherIsBetter = true): ComparativoData => {
      const percentual = planejado > 0 ? (realizado / planejado) * 100 : 0
      let status: 'above' | 'below' | 'on_track' = 'on_track'

      if (higherIsBetter) {
        if (percentual >= 95) status = 'above'
        else if (percentual < 80) status = 'below'
      } else {
        if (percentual <= 105) status = 'above'
        else if (percentual > 120) status = 'below'
      }

      return { metrica: name, planejado, realizado, percentual, status }
    }

    return [
      buildMetric('Leads Gerados', isDemo ? plan.leads : (plan?.leads_projetados || 0), real.leads),
      buildMetric('MQLs', isDemo ? plan.mqls : (plan?.mqls_projetados || 0), real.mqls),
      buildMetric('Calls Agendadas', isDemo ? plan.callsAgendadas : (plan?.calls_agendadas || 0), real.callsAgendadas),
      buildMetric('Calls Realizadas', isDemo ? plan.callsRealizadas : (plan?.calls_realizadas || 0), real.callsRealizadas),
      buildMetric('Vendas', isDemo ? plan.vendas : (plan?.vendas_projetadas || 0), real.vendas),
      buildMetric('Faturamento', isDemo ? plan.faturamento : (plan?.faturamento_projetado || 0), real.faturamento),
      buildMetric('Investimento', isDemo ? plan.investimento : (plan?.investimento_total || 0), real.investimento, false)
    ]
  }, [planejamento, totaisRealizados, isDemo])

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatNumber = (value: number) => {
    return Math.round(value).toLocaleString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'above': return 'text-green-400'
      case 'below': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'above': return 'bg-green-500/10 border-green-500/30'
      case 'below': return 'bg-red-500/10 border-red-500/30'
      default: return 'bg-yellow-500/10 border-yellow-500/30'
    }
  }

  // Overall health score
  const healthScore = useMemo(() => {
    const scores = comparativo.map(c => {
      if (c.metrica === 'Investimento') {
        return c.percentual <= 100 ? 100 : Math.max(0, 200 - c.percentual)
      }
      return Math.min(100, c.percentual)
    })
    return scores.reduce((a, b) => a + b, 0) / scores.length
  }, [comparativo])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#0d1220] to-[#0B0F19]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  META vs REALIZADO
                </h1>
                <p className="text-gray-400 text-sm">Acompanhe o desempenho do seu planejamento</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Product Selector */}
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedProdutoId}
                  onChange={(e) => setSelectedProdutoId(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 min-w-[200px]"
                >
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id} className="bg-gray-900">
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month/Year Selector */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index} className="bg-gray-900">{month}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year} className="bg-gray-900">{year}</option>
                  ))}
                </select>
              </div>

              {isDemo && (
                <div className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                  <span className="text-yellow-400 text-sm font-medium">Demo Mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Health Score */}
          <div className="relative mb-8">
            <div className={`absolute inset-0 rounded-3xl blur-xl ${
              healthScore >= 90 ? 'bg-green-500/20' : healthScore >= 70 ? 'bg-yellow-500/20' : 'bg-red-500/20'
            }`} />
            <div className={`relative rounded-3xl p-8 border ${
              healthScore >= 90
                ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30'
                : healthScore >= 70
                ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-yellow-500/30'
                : 'bg-gradient-to-br from-red-900/30 to-rose-900/30 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Score de Saude do Planejamento
                  </p>
                  <p className={`text-6xl font-bold ${
                    healthScore >= 90 ? 'text-green-400' : healthScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {healthScore.toFixed(0)}%
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${
                  healthScore >= 90 ? 'bg-green-500/20' : healthScore >= 70 ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  {healthScore >= 90 ? (
                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                  ) : healthScore >= 70 ? (
                    <AlertTriangle className="w-16 h-16 text-yellow-400" />
                  ) : (
                    <TrendingDown className="w-16 h-16 text-red-400" />
                  )}
                </div>
              </div>
              <p className="text-gray-400 mt-4">
                {healthScore >= 90
                  ? 'Excelente! Seu planejamento esta sendo executado com sucesso.'
                  : healthScore >= 70
                  ? 'Atencao! Algumas metricas estao abaixo do esperado.'
                  : 'Alerta! O planejamento esta significativamente abaixo da meta.'}
              </p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {comparativo.map((item) => (
              <div
                key={item.metrica}
                className={`rounded-2xl p-6 border ${getStatusBg(item.status)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">{item.metrica}</h3>
                  <div className={`flex items-center gap-1 ${getStatusColor(item.status)}`}>
                    {item.percentual >= 100 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="font-bold">{item.percentual.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Meta</span>
                    <span className="text-white font-medium">
                      {item.metrica.includes('Faturamento') || item.metrica.includes('Investimento')
                        ? formatCurrency(item.planejado)
                        : formatNumber(item.planejado)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Realizado</span>
                    <span className={`font-bold ${getStatusColor(item.status)}`}>
                      {item.metrica.includes('Faturamento') || item.metrica.includes('Investimento')
                        ? formatCurrency(item.realizado)
                        : formatNumber(item.realizado)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === 'above' ? 'bg-green-500' :
                        item.status === 'below' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(100, item.percentual)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Funnel Comparison */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              Funil Comparativo
            </h3>

            <div className="space-y-6">
              {comparativo.slice(0, 5).map((item, index) => {
                const maxValue = Math.max(item.planejado, item.realizado)
                const planejadoWidth = maxValue > 0 ? (item.planejado / maxValue) * 100 : 0
                const realizadoWidth = maxValue > 0 ? (item.realizado / maxValue) * 100 : 0

                return (
                  <div key={item.metrica} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{item.metrica}</span>
                      <span className={`font-bold ${getStatusColor(item.status)}`}>
                        {item.percentual.toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      {/* Meta bar */}
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-xs w-16">Meta</span>
                        <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-blue-500/50 rounded-lg flex items-center justify-end pr-2"
                            style={{ width: `${planejadoWidth}%` }}
                          >
                            <span className="text-white text-xs font-medium">
                              {formatNumber(item.planejado)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Real bar */}
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-xs w-16">Real</span>
                        <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                          <div
                            className={`h-full rounded-lg flex items-center justify-end pr-2 ${
                              item.status === 'above' ? 'bg-green-500' :
                              item.status === 'below' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${realizadoWidth}%` }}
                          >
                            <span className="text-white text-xs font-medium">
                              {formatNumber(item.realizado)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Resumo Financeiro
              </h3>
              <div className="space-y-4">
                {comparativo.filter(c => c.metrica.includes('Faturamento') || c.metrica.includes('Investimento')).map((item) => (
                  <div key={item.metrica} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-gray-400 text-sm">{item.metrica}</p>
                      <p className="text-white font-bold text-lg">{formatCurrency(item.realizado)}</p>
                    </div>
                    <div className={`text-right ${getStatusColor(item.status)}`}>
                      <p className="text-sm">vs Meta</p>
                      <p className="font-bold">{item.percentual.toFixed(0)}%</p>
                    </div>
                  </div>
                ))}

                {/* ROAS */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
                  <div>
                    <p className="text-gray-400 text-sm">ROAS Realizado</p>
                    <p className="text-white font-bold text-2xl">
                      {((comparativo.find(c => c.metrica === 'Faturamento')?.realizado || 0) /
                        (comparativo.find(c => c.metrica === 'Investimento')?.realizado || 1)).toFixed(2)}x
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Conversoes do Funil
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Lead -> MQL', value: comparativo[1].realizado > 0 && comparativo[0].realizado > 0
                    ? ((comparativo[1].realizado / comparativo[0].realizado) * 100).toFixed(1) : '0' },
                  { label: 'MQL -> Call Agendada', value: comparativo[2].realizado > 0 && comparativo[1].realizado > 0
                    ? ((comparativo[2].realizado / comparativo[1].realizado) * 100).toFixed(1) : '0' },
                  { label: 'Agendada -> Realizada', value: comparativo[3].realizado > 0 && comparativo[2].realizado > 0
                    ? ((comparativo[3].realizado / comparativo[2].realizado) * 100).toFixed(1) : '0' },
                  { label: 'Call -> Venda', value: comparativo[4].realizado > 0 && comparativo[3].realizado > 0
                    ? ((comparativo[4].realizado / comparativo[3].realizado) * 100).toFixed(1) : '0' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-white font-bold text-lg">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Link to Sales Planner */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/sales-planner"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Ajustar Planejamento
            </Link>
          </div>
        </main>
      )}
    </div>
  )
}
