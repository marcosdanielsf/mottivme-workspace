'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Target,
  DollarSign,
  Users,
  TrendingUp,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Save,
  Loader2,
  ArrowDown,
  Percent,
  Package,
  RefreshCw,
  Database
} from 'lucide-react'
import {
  getProdutos,
  salvarPlanejamento,
  carregarPlanejamento,
  getTaxasHistoricas,
  type Produto
} from '@/lib/supabase'

// Types
interface FunnelStage {
  id: string
  label: string
  value: number
  rate: number
  color: string
  icon: React.ReactNode
}

interface CalculationResults {
  totalLeads: number
  mqls: number
  scheduledCalls: number
  attendedCalls: number
  sales: number
  revenue: number
  sdrCount: number
  closerCount: number
  totalInvestment: number
  dailyInvestment: number
  costPerMQL: number
  costPerCall: number
  costPerSale: number
  roas: number
  cac: number
  netProfit: number
  margin: number
  totalDays: number
}

// Demo empresa ID for initial development
const DEMO_EMPRESA_ID = process.env.NEXT_PUBLIC_DEFAULT_EMPRESA_ID || '00000000-0000-0000-0000-000000000001'

export default function SalesPlanner() {
  // Mode toggle
  const [calculationMode, setCalculationMode] = useState<'forward' | 'reverse'>('forward')
  const [dataOrigin, setDataOrigin] = useState<'estimated' | 'historical'>('estimated')

  // Product selection
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [selectedProdutoId, setSelectedProdutoId] = useState<string>('')
  const [loadingProdutos, setLoadingProdutos] = useState(true)

  // Save/Load states
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [hasHistoricalData, setHasHistoricalData] = useState(false)
  const [mesesComDados, setMesesComDados] = useState(0)

  // Date filter states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [startDay, setStartDay] = useState(1)
  const [endDay, setEndDay] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate())

  // Marketing and funnel states
  const [dailyInvestment, setDailyInvestment] = useState(500)
  const [pricePerLead, setPricePerLead] = useState(8)
  const [qualificationRate, setQualificationRate] = useState(50)
  const [sdrSchedulingRate, setSdrSchedulingRate] = useState(40)
  const [attendanceRate, setAttendanceRate] = useState(70)
  const [closerConversionRate, setCloserConversionRate] = useState(20)
  const [averageTicket, setAverageTicket] = useState(2500)

  // Reverse mode input
  const [targetRevenue, setTargetRevenue] = useState(100000)

  // Operational costs
  const [sdrFixedCost, setSdrFixedCost] = useState(3500)
  const [closerFixedCost, setCloserFixedCost] = useState(6000)
  const [closerCommission, setCloserCommission] = useState(300)
  const [toolsCost, setToolsCost] = useState(800)
  const [otherCosts, setOtherCosts] = useState(1500)

  // Team capacities
  const mqlsPerSDR = 150
  const callsPerCloser = 60

  // Helper functions
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const calculateTotalDays = () => endDay - startDay + 1

  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return 'R$ 0,00'
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatNumber = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0'
    return Math.round(value).toLocaleString('pt-BR')
  }

  // Load products
  useEffect(() => {
    async function loadProdutos() {
      try {
        const data = await getProdutos(DEMO_EMPRESA_ID)
        setProdutos(data)
        if (data.length > 0) {
          setSelectedProdutoId(data[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        // Create a demo product if none exist
        setProdutos([{
          id: 'demo-produto',
          empresa_id: DEMO_EMPRESA_ID,
          nome: 'Produto Demo',
          ticket_medio: 2500,
          taxas_estimadas: {
            cpl: 8,
            qualificacao: 50,
            agendamento_sdr: 40,
            comparecimento: 70,
            conversao_closer: 20
          },
          ativo: true,
          created_at: new Date().toISOString()
        }])
        setSelectedProdutoId('demo-produto')
      } finally {
        setLoadingProdutos(false)
      }
    }
    loadProdutos()
  }, [])

  // Load product defaults when product changes
  useEffect(() => {
    const produto = produtos.find(p => p.id === selectedProdutoId)
    if (produto) {
      setAverageTicket(produto.ticket_medio)
      if (produto.taxas_estimadas) {
        setPricePerLead(produto.taxas_estimadas.cpl)
        setQualificationRate(produto.taxas_estimadas.qualificacao)
        setSdrSchedulingRate(produto.taxas_estimadas.agendamento_sdr)
        setAttendanceRate(produto.taxas_estimadas.comparecimento)
        setCloserConversionRate(produto.taxas_estimadas.conversao_closer)
      }
    }
  }, [selectedProdutoId, produtos])

  // Check for historical data and load existing plan
  useEffect(() => {
    async function checkAndLoadData() {
      if (!selectedProdutoId || selectedProdutoId === 'demo-produto') return

      setLoadingPlan(true)
      try {
        // Check historical data
        const taxas = await getTaxasHistoricas(DEMO_EMPRESA_ID, selectedProdutoId)
        if (taxas && taxas.meses_dados >= 3) {
          setHasHistoricalData(true)
          setMesesComDados(taxas.meses_dados)
          setDataOrigin('historical')
          // Apply historical rates
          setPricePerLead(taxas.cpl)
          setQualificationRate(taxas.qualificacao)
          setSdrSchedulingRate(taxas.agendamento)
          setAttendanceRate(taxas.comparecimento)
          setCloserConversionRate(taxas.conversao)
        } else {
          setHasHistoricalData(false)
          setDataOrigin('estimated')
        }

        // Load existing plan
        const plan = await carregarPlanejamento(
          DEMO_EMPRESA_ID,
          selectedProdutoId,
          selectedMonth,
          selectedYear
        )
        if (plan) {
          setCalculationMode(plan.modo_calculo)
          setStartDay(plan.dia_inicio)
          setEndDay(plan.dia_fim)
          if (plan.investimento_diario) setDailyInvestment(plan.investimento_diario)
          if (plan.meta_faturamento) setTargetRevenue(plan.meta_faturamento)
          setPricePerLead(plan.cpl)
          setQualificationRate(plan.taxa_qualificacao)
          setSdrSchedulingRate(plan.taxa_agendamento)
          setAttendanceRate(plan.taxa_comparecimento)
          setCloserConversionRate(plan.taxa_conversao)
          setAverageTicket(plan.ticket_medio)
          setSdrFixedCost(plan.custo_sdr)
          setCloserFixedCost(plan.custo_closer)
          setCloserCommission(plan.comissao_closer)
          setToolsCost(plan.custo_ferramentas)
          setOtherCosts(plan.outros_custos)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoadingPlan(false)
      }
    }

    checkAndLoadData()
  }, [selectedProdutoId, selectedMonth, selectedYear])

  // Update end day when month/year changes
  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    if (endDay > daysInMonth) setEndDay(daysInMonth)
  }, [selectedMonth, selectedYear, endDay])

  // Main calculation
  const results = useMemo((): CalculationResults => {
    const totalDays = calculateTotalDays()
    const monthlyProportion = totalDays / getDaysInMonth(selectedMonth, selectedYear)

    if (calculationMode === 'forward') {
      const totalInvestment = dailyInvestment * totalDays
      const totalLeads = Math.floor(totalInvestment / pricePerLead)
      const mqls = Math.floor(totalLeads * (qualificationRate / 100))
      const scheduledCalls = Math.floor(mqls * (sdrSchedulingRate / 100))
      const attendedCalls = Math.floor(scheduledCalls * (attendanceRate / 100))
      const sales = Math.floor(attendedCalls * (closerConversionRate / 100))
      const revenue = sales * averageTicket

      const sdrCount = mqls > 0 ? Math.ceil(mqls / (mqlsPerSDR * monthlyProportion)) : 0
      const closerCount = attendedCalls > 0 ? Math.ceil(attendedCalls / (callsPerCloser * monthlyProportion)) : 0

      const totalSDRCosts = sdrCount * sdrFixedCost * monthlyProportion
      const totalCloserCosts = closerCount * closerFixedCost * monthlyProportion
      const totalCommissions = sales * closerCommission
      const proportionalTools = toolsCost * monthlyProportion
      const proportionalOther = otherCosts * monthlyProportion

      const totalOperationalCost = totalInvestment + totalSDRCosts + totalCloserCosts + totalCommissions + proportionalTools + proportionalOther

      return {
        totalLeads,
        mqls,
        scheduledCalls,
        attendedCalls,
        sales,
        revenue,
        sdrCount,
        closerCount,
        totalInvestment,
        dailyInvestment,
        costPerMQL: mqls > 0 ? totalInvestment / mqls : 0,
        costPerCall: attendedCalls > 0 ? totalInvestment / attendedCalls : 0,
        costPerSale: sales > 0 ? totalOperationalCost / sales : 0,
        roas: totalInvestment > 0 ? revenue / totalInvestment : 0,
        cac: sales > 0 ? totalOperationalCost / sales : 0,
        netProfit: revenue - totalOperationalCost,
        margin: revenue > 0 ? ((revenue - totalOperationalCost) / revenue) * 100 : 0,
        totalDays,
      }
    } else {
      // REVERSE MODE
      const sales = Math.ceil(targetRevenue / averageTicket)
      const attendedCalls = Math.ceil(sales / (closerConversionRate / 100))
      const scheduledCalls = Math.ceil(attendedCalls / (attendanceRate / 100))
      const mqls = Math.ceil(scheduledCalls / (sdrSchedulingRate / 100))
      const totalLeads = Math.ceil(mqls / (qualificationRate / 100))
      const totalInvestment = totalLeads * pricePerLead
      const dailyInvestmentNeeded = totalInvestment / totalDays

      const sdrCount = mqls > 0 ? Math.ceil(mqls / (mqlsPerSDR * monthlyProportion)) : 0
      const closerCount = attendedCalls > 0 ? Math.ceil(attendedCalls / (callsPerCloser * monthlyProportion)) : 0

      const totalSDRCosts = sdrCount * sdrFixedCost * monthlyProportion
      const totalCloserCosts = closerCount * closerFixedCost * monthlyProportion
      const totalCommissions = sales * closerCommission
      const proportionalTools = toolsCost * monthlyProportion
      const proportionalOther = otherCosts * monthlyProportion

      const totalOperationalCost = totalInvestment + totalSDRCosts + totalCloserCosts + totalCommissions + proportionalTools + proportionalOther

      return {
        totalLeads,
        mqls,
        scheduledCalls,
        attendedCalls,
        sales,
        revenue: targetRevenue,
        sdrCount,
        closerCount,
        totalInvestment,
        dailyInvestment: dailyInvestmentNeeded,
        costPerMQL: mqls > 0 ? totalInvestment / mqls : 0,
        costPerCall: attendedCalls > 0 ? totalInvestment / attendedCalls : 0,
        costPerSale: sales > 0 ? totalOperationalCost / sales : 0,
        roas: totalInvestment > 0 ? targetRevenue / totalInvestment : 0,
        cac: sales > 0 ? totalOperationalCost / sales : 0,
        netProfit: targetRevenue - totalOperationalCost,
        margin: targetRevenue > 0 ? ((targetRevenue - totalOperationalCost) / targetRevenue) * 100 : 0,
        totalDays,
      }
    }
  }, [
    calculationMode, selectedMonth, selectedYear, startDay, endDay,
    dailyInvestment, targetRevenue, pricePerLead, qualificationRate,
    sdrSchedulingRate, attendanceRate, closerConversionRate, averageTicket,
    sdrFixedCost, closerFixedCost, closerCommission, toolsCost, otherCosts
  ])

  // Save planning
  const handleSave = useCallback(async () => {
    if (!selectedProdutoId || selectedProdutoId === 'demo-produto') {
      alert('Configure seu Supabase e produtos primeiro!')
      return
    }

    setSaving(true)
    setSaveSuccess(false)

    try {
      await salvarPlanejamento({
        empresa_id: DEMO_EMPRESA_ID,
        produto_id: selectedProdutoId,
        mes: selectedMonth,
        ano: selectedYear,
        dia_inicio: startDay,
        dia_fim: endDay,
        modo_calculo: calculationMode,
        investimento_diario: calculationMode === 'forward' ? dailyInvestment : undefined,
        meta_faturamento: calculationMode === 'reverse' ? targetRevenue : undefined,
        cpl: pricePerLead,
        taxa_qualificacao: qualificationRate,
        taxa_agendamento: sdrSchedulingRate,
        taxa_comparecimento: attendanceRate,
        taxa_conversao: closerConversionRate,
        ticket_medio: averageTicket,
        custo_sdr: sdrFixedCost,
        custo_closer: closerFixedCost,
        comissao_closer: closerCommission,
        custo_ferramentas: toolsCost,
        outros_custos: otherCosts,
        leads_projetados: results.totalLeads,
        mqls_projetados: results.mqls,
        calls_agendadas: results.scheduledCalls,
        calls_realizadas: results.attendedCalls,
        vendas_projetadas: results.sales,
        faturamento_projetado: results.revenue,
        sdrs_necessarios: results.sdrCount,
        closers_necessarios: results.closerCount,
        investimento_total: results.totalInvestment,
        cac_projetado: results.cac,
        roas_projetado: results.roas,
        lucro_projetado: results.netProfit,
        margem_projetada: results.margin,
        origem_dados: dataOrigin
      })

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar planejamento. Verifique a configuracao do Supabase.')
    } finally {
      setSaving(false)
    }
  }, [
    selectedProdutoId, selectedMonth, selectedYear, startDay, endDay,
    calculationMode, dailyInvestment, targetRevenue, pricePerLead,
    qualificationRate, sdrSchedulingRate, attendanceRate, closerConversionRate,
    averageTicket, sdrFixedCost, closerFixedCost, closerCommission,
    toolsCost, otherCosts, results, dataOrigin
  ])

  // Funnel stages for visualization
  const funnelStages: FunnelStage[] = [
    { id: 'leads', label: 'Leads', value: results.totalLeads, rate: 100, color: '#3B82F6', icon: <Users className="w-5 h-5" /> },
    { id: 'mqls', label: 'MQLs', value: results.mqls, rate: qualificationRate, color: '#8B5CF6', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'scheduled', label: 'Calls Agendadas', value: results.scheduledCalls, rate: sdrSchedulingRate, color: '#06B6D4', icon: <Calendar className="w-5 h-5" /> },
    { id: 'attended', label: 'Calls Realizadas', value: results.attendedCalls, rate: attendanceRate, color: '#10B981', icon: <Phone className="w-5 h-5" /> },
    { id: 'sales', label: 'Vendas', value: results.sales, rate: closerConversionRate, color: '#F59E0B', icon: <DollarSign className="w-5 h-5" /> },
  ]

  const months = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i)

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
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  Sales Planner Inteligente
                </h1>
                <p className="text-gray-400 text-sm">Planejamento preditivo de vendas</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Product Selector */}
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedProdutoId}
                  onChange={(e) => setSelectedProdutoId(e.target.value)}
                  disabled={loadingProdutos}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 min-w-[200px]"
                >
                  {loadingProdutos ? (
                    <option>Carregando...</option>
                  ) : produtos.length === 0 ? (
                    <option value="">Nenhum produto</option>
                  ) : (
                    produtos.map((produto) => (
                      <option key={produto.id} value={produto.id} className="bg-gray-900">
                        {produto.nome}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Data Origin Badge */}
              <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
                dataOrigin === 'historical'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}>
                {dataOrigin === 'historical' ? (
                  <>
                    <Database className="w-4 h-4" />
                    <span className="text-sm font-medium">Dados Reais ({mesesComDados} meses)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Taxas Estimadas</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {loadingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 flex items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="text-white text-lg">Carregando planejamento...</span>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Mode Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setCalculationMode('forward')}
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
              calculationMode === 'forward'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-xl ${calculationMode === 'forward' ? 'bg-white/20' : 'bg-blue-500/20'}`}>
                  <DollarSign className={`w-6 h-6 ${calculationMode === 'forward' ? 'text-white' : 'text-blue-400'}`} />
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-lg ${calculationMode === 'forward' ? 'text-white' : 'text-gray-200'}`}>
                    Baseado em Investimento
                  </h3>
                  <p className={`text-sm ${calculationMode === 'forward' ? 'text-blue-100' : 'text-gray-400'}`}>
                    Defina quanto investir - Veja o resultado
                  </p>
                </div>
              </div>
              {calculationMode === 'forward' && (
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Modo Ativo
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => setCalculationMode('reverse')}
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
              calculationMode === 'reverse'
                ? 'bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg shadow-purple-500/25'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                calculationMode === 'reverse' ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-400'
              }`}>
                INTELIGENTE
              </span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-xl ${calculationMode === 'reverse' ? 'bg-white/20' : 'bg-purple-500/20'}`}>
                  <Target className={`w-6 h-6 ${calculationMode === 'reverse' ? 'text-white' : 'text-purple-400'}`} />
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-lg ${calculationMode === 'reverse' ? 'text-white' : 'text-gray-200'}`}>
                    Baseado em Meta
                  </h3>
                  <p className={`text-sm ${calculationMode === 'reverse' ? 'text-purple-100' : 'text-gray-400'}`}>
                    Defina a meta - Sistema calcula tudo
                  </p>
                </div>
              </div>
              {calculationMode === 'reverse' && (
                <div className="flex items-center gap-2 text-purple-100 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Modo Ativo
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Main Input Area */}
        {calculationMode === 'reverse' ? (
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Qual sua META de Faturamento?</h2>
                  <p className="text-purple-200">O sistema calculara tudo que voce precisa fazer</p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-purple-300">R$</span>
                <input
                  type="number"
                  value={targetRevenue}
                  onChange={(e) => setTargetRevenue(Number(e.target.value))}
                  className="w-full pl-20 pr-6 py-6 bg-white/10 backdrop-blur border border-white/20 rounded-2xl text-4xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="100000"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[50000, 100000, 250000, 500000].map((value) => (
                  <button
                    key={value}
                    onClick={() => setTargetRevenue(value)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      targetRevenue === value
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {formatCurrency(value)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <DollarSign className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Investimento em Marketing</h2>
                <p className="text-gray-400">Defina quanto voce vai investir por dia</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Investimento Diario</span>
                <span className="text-3xl font-bold text-blue-400">{formatCurrency(dailyInvestment)}</span>
              </div>

              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={dailyInvestment}
                onChange={(e) => setDailyInvestment(Number(e.target.value))}
                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
              />

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">R$ 50/dia</span>
                <span className="text-blue-400 font-medium">
                  Total: {formatCurrency(dailyInvestment * results.totalDays)} ({results.totalDays} dias)
                </span>
                <span className="text-gray-500">R$ 5.000/dia</span>
              </div>
            </div>
          </div>
        )}

        {/* Period Selection */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Periodo de Analise
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mes</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index} className="bg-gray-900">{month}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ano</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="bg-gray-900">{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Dia Inicial</label>
              <select
                value={startDay}
                onChange={(e) => setStartDay(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day} className="bg-gray-900">{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Dia Final</label>
              <select
                value={endDay}
                onChange={(e) => setEndDay(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1)
                  .filter((day) => day >= startDay)
                  .map((day) => (
                    <option key={day} value={day} className="bg-gray-900">{day}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {calculationMode === 'reverse' && (
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-7 h-7 text-amber-400" />
                Para atingir {formatCurrency(targetRevenue)} voce precisa:
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white/10 rounded-2xl p-5">
                  <p className="text-amber-200 text-sm mb-1">Investir</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(results.totalInvestment)}</p>
                  <p className="text-amber-300/60 text-sm mt-1">{formatCurrency(results.dailyInvestment)}/dia</p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <p className="text-amber-200 text-sm mb-1">Gerar Leads</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(results.totalLeads)}</p>
                  <p className="text-amber-300/60 text-sm mt-1">{Math.ceil(results.totalLeads / results.totalDays)}/dia</p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <p className="text-amber-200 text-sm mb-1">Realizar Calls</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(results.attendedCalls)}</p>
                  <p className="text-amber-300/60 text-sm mt-1">{Math.ceil(results.attendedCalls / results.totalDays)}/dia</p>
                </div>

                <div className="bg-white/10 rounded-2xl p-5">
                  <p className="text-amber-200 text-sm mb-1">Fechar Vendas</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(results.sales)}</p>
                  <p className="text-amber-300/60 text-sm mt-1">Ticket: {formatCurrency(averageTicket)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visual Funnel */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Funil de Vendas</h3>

          <div className="space-y-4">
            {funnelStages.map((stage, index) => {
              const widthPercent = results.totalLeads > 0 ? (stage.value / results.totalLeads) * 100 : 0
              const isLast = index === funnelStages.length - 1

              return (
                <div key={stage.id} className="relative">
                  <div className="flex items-center gap-4">
                    <div className="w-40 flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${stage.color}20` }}>
                        <span style={{ color: stage.color }}>{stage.icon}</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">{stage.label}</span>
                    </div>

                    <div className="flex-1 relative">
                      <div className="h-12 bg-white/5 rounded-xl overflow-hidden">
                        <div
                          className="h-full rounded-xl transition-all duration-500 flex items-center justify-end pr-4"
                          style={{
                            width: `${Math.max(widthPercent, 5)}%`,
                            backgroundColor: stage.color,
                          }}
                        >
                          <span className="text-white font-bold">{formatNumber(stage.value)}</span>
                        </div>
                      </div>
                    </div>

                    {!isLast && (
                      <div className="w-20 text-right">
                        <span className="text-gray-400 text-sm">{stage.rate}%</span>
                      </div>
                    )}
                  </div>

                  {!isLast && (
                    <div className="flex items-center justify-center py-2">
                      <ArrowDown className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Percent className="w-5 h-5 text-blue-400" />
            Taxas de Conversao
            {dataOrigin === 'estimated' ? (
              <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                Estimadas
              </span>
            ) : (
              <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                Historicas
              </span>
            )}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RateSlider
              label="CPL (Custo por Lead)"
              value={pricePerLead}
              onChange={setPricePerLead}
              min={1}
              max={100}
              format={(v) => formatCurrency(v)}
              color="#3B82F6"
            />
            <RateSlider
              label="Taxa Qualificacao (Lead - MQL)"
              value={qualificationRate}
              onChange={setQualificationRate}
              min={10}
              max={80}
              format={(v) => `${v}%`}
              color="#8B5CF6"
            />
            <RateSlider
              label="Taxa Agendamento SDR"
              value={sdrSchedulingRate}
              onChange={setSdrSchedulingRate}
              min={10}
              max={70}
              format={(v) => `${v}%`}
              color="#06B6D4"
            />
            <RateSlider
              label="Taxa Comparecimento"
              value={attendanceRate}
              onChange={setAttendanceRate}
              min={30}
              max={90}
              format={(v) => `${v}%`}
              color="#10B981"
            />
            <RateSlider
              label="Taxa Conversao Closer"
              value={closerConversionRate}
              onChange={setCloserConversionRate}
              min={5}
              max={50}
              format={(v) => `${v}%`}
              color="#F59E0B"
            />
            <RateSlider
              label="Ticket Medio"
              value={averageTicket}
              onChange={setAverageTicket}
              min={500}
              max={50000}
              step={500}
              format={(v) => formatCurrency(v)}
              color="#EC4899"
            />
          </div>
        </div>

        {/* Team & Financial Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Team Required */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Equipe Necessaria
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-300 text-sm">SDRs</p>
                <p className="text-4xl font-bold text-white">{results.sdrCount}</p>
                <p className="text-gray-400 text-xs mt-1">Cap: {mqlsPerSDR} MQLs/mes</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <p className="text-purple-300 text-sm">Closers</p>
                <p className="text-4xl font-bold text-white">{results.closerCount}</p>
                <p className="text-gray-400 text-xs mt-1">Cap: {callsPerCloser} calls/mes</p>
              </div>
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Metricas Financeiras
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard label="CAC" value={formatCurrency(results.cac)} />
              <MetricCard label="ROAS" value={`${results.roas.toFixed(2)}x`} highlight={results.roas >= 3} />
              <MetricCard label="Custo/MQL" value={formatCurrency(results.costPerMQL)} />
              <MetricCard label="Custo/Call" value={formatCurrency(results.costPerCall)} />
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="relative">
          <div className={`absolute inset-0 rounded-3xl blur-xl ${
            results.netProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
          }`} />
          <div className={`relative rounded-3xl p-8 border ${
            results.netProfit >= 0
              ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30'
              : 'bg-gradient-to-br from-red-900/30 to-rose-900/30 border-red-500/30'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <p className="text-gray-300 mb-1">Lucro Liquido Estimado</p>
                <p className={`text-5xl font-bold ${results.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(results.netProfit)}
                </p>
              </div>

              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Faturamento</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(results.revenue)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Margem</p>
                  <p className={`text-2xl font-bold ${results.margin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {results.margin.toFixed(1)}%
                  </p>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || selectedProdutoId === 'demo-produto'}
                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  saveSuccess
                    ? 'bg-green-500 text-white'
                    : saving
                    ? 'bg-white/10 text-gray-400 cursor-wait'
                    : selectedProdutoId === 'demo-produto'
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Salvo!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Planejamento
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info about historical data */}
        {!hasHistoricalData && selectedProdutoId !== 'demo-produto' && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-300 font-medium">Dados Historicos</p>
                <p className="text-gray-400 text-sm">
                  Apos 3 meses de dados reais sincronizados do GoHighLevel, o sistema usara automaticamente
                  as taxas de conversao historicas ao inves das estimadas para maior precisao.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Helper Components
interface RateSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  format: (value: number) => string
  color: string
}

function RateSlider({ label, value, onChange, min, max, step = 1, format, color }: RateSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-gray-400 text-sm">{label}</label>
        <span className="font-bold" style={{ color }}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  highlight?: boolean
}

function MetricCard({ label, value, highlight = false }: MetricCardProps) {
  return (
    <div className={`rounded-xl p-4 ${
      highlight ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5'
    }`}>
      <p className={`text-sm ${highlight ? 'text-green-300' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}
