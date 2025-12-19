"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Target,
  DollarSign,
  Users,
  TrendingUp,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Save,
  ArrowDown,
  Percent,
  Calculator,
  Zap,
} from "lucide-react"

interface SalesPlannerContentProps {
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
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

interface FunnelStage {
  id: string
  label: string
  value: number
  rate: number
  color: string
  icon: React.ReactNode
}

export function SalesPlannerContent({ filters }: SalesPlannerContentProps) {
  // Mode toggle
  const [calculationMode, setCalculationMode] = useState<"forward" | "reverse">("forward")
  const [dataOrigin] = useState<"estimated" | "historical">("estimated")

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
  const [sdrFixedCost] = useState(3500)
  const [closerFixedCost] = useState(6000)
  const [closerCommission] = useState(300)
  const [toolsCost] = useState(800)
  const [otherCosts] = useState(1500)

  // Team capacities
  const mqlsPerSDR = 150
  const callsPerCloser = 60

  // Helper functions
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const calculateTotalDays = () => endDay - startDay + 1

  const formatCurrency = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return "R$ 0,00"
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const formatNumber = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return "0"
    return Math.round(value).toLocaleString("pt-BR")
  }

  // Update end day when month/year changes
  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    if (endDay > daysInMonth) setEndDay(daysInMonth)
  }, [selectedMonth, selectedYear, endDay])

  // Main calculation
  const results = useMemo((): CalculationResults => {
    const totalDays = calculateTotalDays()
    const monthlyProportion = totalDays / getDaysInMonth(selectedMonth, selectedYear)

    if (calculationMode === "forward") {
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

      const totalOperationalCost =
        totalInvestment + totalSDRCosts + totalCloserCosts + totalCommissions + proportionalTools + proportionalOther

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

      const totalOperationalCost =
        totalInvestment + totalSDRCosts + totalCloserCosts + totalCommissions + proportionalTools + proportionalOther

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
    calculationMode,
    selectedMonth,
    selectedYear,
    startDay,
    endDay,
    dailyInvestment,
    targetRevenue,
    pricePerLead,
    qualificationRate,
    sdrSchedulingRate,
    attendanceRate,
    closerConversionRate,
    averageTicket,
    sdrFixedCost,
    closerFixedCost,
    closerCommission,
    toolsCost,
    otherCosts,
  ])

  // Funnel stages for visualization
  const funnelStages: FunnelStage[] = [
    { id: "leads", label: "Leads", value: results.totalLeads, rate: 100, color: "#3B82F6", icon: <Users className="w-4 h-4" /> },
    { id: "mqls", label: "MQLs", value: results.mqls, rate: qualificationRate, color: "#8B5CF6", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "scheduled", label: "Calls Agendadas", value: results.scheduledCalls, rate: sdrSchedulingRate, color: "#06B6D4", icon: <Calendar className="w-4 h-4" /> },
    { id: "attended", label: "Calls Realizadas", value: results.attendedCalls, rate: attendanceRate, color: "#10B981", icon: <Phone className="w-4 h-4" /> },
    { id: "sales", label: "Vendas", value: results.sales, rate: closerConversionRate, color: "#F59E0B", icon: <DollarSign className="w-4 h-4" /> },
  ]

  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i)

  return (
    <div className="h-full w-full bg-slate-950 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Calculator className="w-8 h-8 text-blue-500" />
              Sales Planner Inteligente
            </h1>
            <p className="text-slate-400 mt-1">Planejamento preditivo de vendas com cálculo reverso</p>
          </div>

          {/* Data Origin Badge */}
          <div
            className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
              dataOrigin === "historical"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
            }`}
          >
            {dataOrigin === "historical" ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Dados Reais (3+ meses)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Taxas Estimadas</span>
              </>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCalculationMode("forward")}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              calculationMode === "forward"
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-700 bg-slate-900 hover:border-blue-500/50"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-3 rounded-lg ${calculationMode === "forward" ? "bg-blue-500/20" : "bg-slate-800"}`}>
                <DollarSign className={`w-6 h-6 ${calculationMode === "forward" ? "text-blue-400" : "text-slate-400"}`} />
              </div>
              <div>
                <h3 className="font-bold text-white">Baseado em Investimento</h3>
                <p className="text-sm text-slate-400">Defina quanto investir → Veja o resultado</p>
              </div>
            </div>
            {calculationMode === "forward" && (
              <div className="flex items-center gap-2 text-blue-400 text-sm mt-2">
                <CheckCircle2 className="w-4 h-4" />
                Modo Ativo
              </div>
            )}
          </button>

          <button
            onClick={() => setCalculationMode("reverse")}
            className={`p-6 rounded-xl border-2 transition-all text-left relative ${
              calculationMode === "reverse"
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-700 bg-slate-900 hover:border-purple-500/50"
            }`}
          >
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                calculationMode === "reverse" ? "bg-purple-500/20 text-purple-300" : "bg-slate-700 text-slate-400"
              }`}>
                INTELIGENTE
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-3 rounded-lg ${calculationMode === "reverse" ? "bg-purple-500/20" : "bg-slate-800"}`}>
                <Target className={`w-6 h-6 ${calculationMode === "reverse" ? "text-purple-400" : "text-slate-400"}`} />
              </div>
              <div>
                <h3 className="font-bold text-white">Baseado em Meta</h3>
                <p className="text-sm text-slate-400">Defina a meta → Sistema calcula tudo</p>
              </div>
            </div>
            {calculationMode === "reverse" && (
              <div className="flex items-center gap-2 text-purple-400 text-sm mt-2">
                <CheckCircle2 className="w-4 h-4" />
                Modo Ativo
              </div>
            )}
          </button>
        </div>

        {/* Main Input Area */}
        {calculationMode === "reverse" ? (
          <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-400" />
                Qual sua META de Faturamento?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-purple-300">R$</span>
                <input
                  type="number"
                  value={targetRevenue}
                  onChange={(e) => setTargetRevenue(Number(e.target.value))}
                  className="w-full pl-16 pr-4 py-4 bg-slate-800/50 border border-purple-500/30 rounded-xl text-3xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="100000"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[50000, 100000, 250000, 500000].map((value) => (
                  <button
                    key={value}
                    onClick={() => setTargetRevenue(value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      targetRevenue === value
                        ? "bg-purple-500 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {formatCurrency(value)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-400" />
                Investimento em Marketing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Investimento Diário</span>
                  <span className="text-2xl font-bold text-blue-400">{formatCurrency(dailyInvestment)}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={dailyInvestment}
                  onChange={(e) => setDailyInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">R$ 50/dia</span>
                  <span className="text-blue-400 font-medium">
                    Total: {formatCurrency(dailyInvestment * results.totalDays)} ({results.totalDays} dias)
                  </span>
                  <span className="text-slate-500">R$ 5.000/dia</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Period Selection */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Período de Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Mês</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Ano</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Dia Inicial</label>
                <select
                  value={startDay}
                  onChange={(e) => setStartDay(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Dia Final</label>
                <select
                  value={endDay}
                  onChange={(e) => setEndDay(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1)
                    .filter((day) => day >= startDay)
                    .map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reverse Mode Results */}
        {calculationMode === "reverse" && (
          <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-amber-400" />
                Para atingir {formatCurrency(targetRevenue)} você precisa:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-amber-300 text-sm mb-1">Investir</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(results.totalInvestment)}</p>
                  <p className="text-amber-400/60 text-sm mt-1">{formatCurrency(results.dailyInvestment)}/dia</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-amber-300 text-sm mb-1">Gerar Leads</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(results.totalLeads)}</p>
                  <p className="text-amber-400/60 text-sm mt-1">{Math.ceil(results.totalLeads / results.totalDays)}/dia</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-amber-300 text-sm mb-1">Realizar Calls</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(results.attendedCalls)}</p>
                  <p className="text-amber-400/60 text-sm mt-1">{Math.ceil(results.attendedCalls / results.totalDays)}/dia</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-amber-300 text-sm mb-1">Fechar Vendas</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(results.sales)}</p>
                  <p className="text-amber-400/60 text-sm mt-1">Ticket: {formatCurrency(averageTicket)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Funnel Visualization */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Funil de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelStages.map((stage, index) => {
                const widthPercent = results.totalLeads > 0 ? (stage.value / results.totalLeads) * 100 : 0
                const isLast = index === funnelStages.length - 1

                return (
                  <div key={stage.id}>
                    <div className="flex items-center gap-4">
                      <div className="w-36 flex items-center gap-2">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${stage.color}20` }}>
                          <span style={{ color: stage.color }}>{stage.icon}</span>
                        </div>
                        <span className="text-slate-300 text-sm">{stage.label}</span>
                      </div>

                      <div className="flex-1">
                        <div className="h-10 bg-slate-800 rounded-lg overflow-hidden">
                          <div
                            className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                            style={{
                              width: `${Math.max(widthPercent, 5)}%`,
                              backgroundColor: stage.color,
                            }}
                          >
                            <span className="text-white font-bold text-sm">{formatNumber(stage.value)}</span>
                          </div>
                        </div>
                      </div>

                      {!isLast && (
                        <div className="w-16 text-right">
                          <span className="text-slate-400 text-sm">{stage.rate}%</span>
                        </div>
                      )}
                    </div>

                    {!isLast && (
                      <div className="flex items-center justify-center py-1">
                        <ArrowDown className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rates */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-400" />
              Taxas de Conversão
              {dataOrigin === "estimated" && (
                <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Estimadas</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RateSlider label="CPL (Custo por Lead)" value={pricePerLead} onChange={setPricePerLead} min={1} max={100} format={(v) => formatCurrency(v)} color="#3B82F6" />
              <RateSlider label="Taxa Qualificação (Lead → MQL)" value={qualificationRate} onChange={setQualificationRate} min={10} max={80} format={(v) => `${v}%`} color="#8B5CF6" />
              <RateSlider label="Taxa Agendamento SDR" value={sdrSchedulingRate} onChange={setSdrSchedulingRate} min={10} max={70} format={(v) => `${v}%`} color="#06B6D4" />
              <RateSlider label="Taxa Comparecimento" value={attendanceRate} onChange={setAttendanceRate} min={30} max={90} format={(v) => `${v}%`} color="#10B981" />
              <RateSlider label="Taxa Conversão Closer" value={closerConversionRate} onChange={setCloserConversionRate} min={5} max={50} format={(v) => `${v}%`} color="#F59E0B" />
              <RateSlider label="Ticket Médio" value={averageTicket} onChange={setAverageTicket} min={500} max={50000} step={500} format={(v) => formatCurrency(v)} color="#EC4899" />
            </div>
          </CardContent>
        </Card>

        {/* Team & Financial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Equipe Necessária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-blue-300 text-sm">SDRs</p>
                  <p className="text-4xl font-bold text-white">{results.sdrCount}</p>
                  <p className="text-slate-400 text-xs mt-1">Cap: {mqlsPerSDR} MQLs/mês</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-purple-300 text-sm">Closers</p>
                  <p className="text-4xl font-bold text-white">{results.closerCount}</p>
                  <p className="text-slate-400 text-xs mt-1">Cap: {callsPerCloser} calls/mês</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Métricas Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="CAC" value={formatCurrency(results.cac)} />
                <MetricCard label="ROAS" value={`${results.roas.toFixed(2)}x`} highlight={results.roas >= 3} />
                <MetricCard label="Custo/MQL" value={formatCurrency(results.costPerMQL)} />
                <MetricCard label="Custo/Call" value={formatCurrency(results.costPerCall)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Line */}
        <Card className={`border ${results.netProfit >= 0 ? "bg-green-900/20 border-green-500/30" : "bg-red-900/20 border-red-500/30"}`}>
          <CardContent className="py-6">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <p className="text-slate-300 mb-1">Lucro Líquido Estimado</p>
                <p className={`text-4xl font-bold ${results.netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatCurrency(results.netProfit)}
                </p>
              </div>

              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Faturamento</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(results.revenue)}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Margem</p>
                  <p className={`text-2xl font-bold ${results.margin >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {results.margin.toFixed(1)}%
                  </p>
                </div>
              </div>

              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium flex items-center gap-2 transition-colors">
                <Save className="w-5 h-5" />
                Salvar Planejamento
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-slate-400 text-sm">{label}</label>
        <span className="font-bold" style={{ color }}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
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
    <div className={`rounded-xl p-4 ${highlight ? "bg-green-500/10 border border-green-500/20" : "bg-slate-800"}`}>
      <p className={`text-sm ${highlight ? "text-green-300" : "text-slate-400"}`}>{label}</p>
      <p className={`text-xl font-bold ${highlight ? "text-green-400" : "text-white"}`}>{value}</p>
    </div>
  )
}
