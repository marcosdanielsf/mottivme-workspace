"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function LeadCalculator() {
  // Date filter states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [startDay, setStartDay] = useState(1)
  const [endDay, setEndDay] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate())

  // Marketing and funnel states
  const [dailyInvestment, setDailyInvestment] = useState(333) // ~10k/month = 333/day
  const [pricePerLead, setPricePerLead] = useState(5)
  const [qualificationRate, setQualificationRate] = useState(50)
  const [sdrSchedulingRate, setSdrSchedulingRate] = useState(40)
  const [attendanceRate, setAttendanceRate] = useState(70)
  const [closerConversionRate, setCloserConversionRate] = useState(20)
  const [averageTicket, setAverageTicket] = useState(1000)
  const [averageSaleTime, setAverageSaleTime] = useState(30)

  // Operational cost states (monthly costs)
  const [sdrFixedCost, setSdrFixedCost] = useState(3000)
  const [closerFixedCost, setCloserFixedCost] = useState(5000)
  const [closerCommission, setCloserCommission] = useState(200)
  const [toolsCost, setToolsCost] = useState(500)
  const [otherFixedCosts, setOtherFixedCosts] = useState(1000)

  const [results, setResults] = useState({
    totalLeads: 0,
    mqls: 0,
    scheduledCalls: 0,
    attendedCalls: 0,
    sales: 0,
    revenue: 0,
    sdrCount: 0,
    closerCount: 0,
    costPerMQL: 0,
    roas: 0,
    cac: 0,
    netProfit: 0,
    totalDays: 0,
    totalInvestment: 0,
  })

  // Capacities
  const mqlsPerSDR = 150
  const callsPerCloser = 60

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Calculate total days in selected period
  const calculateTotalDays = () => {
    return endDay - startDay + 1
  }

  // Format currency in USD
  const formatCurrency = (value: number) => {
    if (isNaN(value)) return "$ 0,00"
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })
  }

  // Update end day when month/year changes
  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    if (endDay > daysInMonth) {
      setEndDay(daysInMonth)
    }
  }, [selectedMonth, selectedYear])

  // Calculate results when inputs change
  useEffect(() => {
    const totalDays = calculateTotalDays()
    const totalInvestment = dailyInvestment * totalDays

    const totalLeads = Math.floor(totalInvestment / pricePerLead)
    const mqls = Math.floor(totalLeads * (qualificationRate / 100))
    const scheduledCalls = Math.floor(mqls * (sdrSchedulingRate / 100))
    const attendedCalls = Math.floor(scheduledCalls * (attendanceRate / 100))
    const sales = Math.floor(attendedCalls * (closerConversionRate / 100))
    const revenue = sales * averageTicket

    // Calculate monthly proportional costs based on the period
    const monthlyProportion = totalDays / getDaysInMonth(selectedMonth, selectedYear)

    const sdrCount = mqls > 0 ? Math.ceil(mqls / (mqlsPerSDR * monthlyProportion)) : 0
    const closerCount = attendedCalls > 0 ? Math.ceil(attendedCalls / (callsPerCloser * monthlyProportion)) : 0

    const totalSDRCosts = sdrCount * sdrFixedCost * monthlyProportion
    const totalCloserCosts = closerCount * closerFixedCost * monthlyProportion
    const totalCommissions = sales * closerCommission
    const proportionalToolsCost = toolsCost * monthlyProportion
    const proportionalOtherCosts = otherFixedCosts * monthlyProportion

    const totalOperationalCost =
      totalInvestment +
      totalSDRCosts +
      totalCloserCosts +
      totalCommissions +
      proportionalToolsCost +
      proportionalOtherCosts

    const costPerMQL = mqls > 0 ? totalInvestment / mqls : totalInvestment > 0 ? totalInvestment : 0
    const roas = totalInvestment > 0 ? revenue / totalInvestment : 0
    const cac = sales > 0 ? totalOperationalCost / sales : totalOperationalCost > 0 ? totalOperationalCost : 0
    const netProfit = revenue - totalOperationalCost

    setResults({
      totalLeads,
      mqls,
      scheduledCalls,
      attendedCalls,
      sales,
      revenue,
      sdrCount,
      closerCount,
      costPerMQL,
      roas,
      cac,
      netProfit,
      totalDays,
      totalInvestment,
    })
  }, [
    selectedMonth,
    selectedYear,
    startDay,
    endDay,
    dailyInvestment,
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
    otherFixedCosts,
  ])

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i)

  return (
    <div className="max-w-6xl mx-auto p-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl p-8 text-white">
        <div className="text-center mb-8">
          <h1 className="text-lg font-normal text-blue-200 mb-2 tracking-wide" style={{ fontFamily: "Cinzel, serif" }}>
            ALAVANQUE SEU NEGÓCIO COM
          </h1>
          <h2 className="text-4xl font-semibold mb-8" style={{ fontFamily: "Cinzel, serif" }}>
            DESCUBRA QUANTO VOCÊ PODE GANHAR POR PERÍODO
          </h2>
        </div>

        {/* Date Filter Section */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 mb-6">
          <CardContent className="p-6">
            <h3
              className="text-xl font-medium text-blue-300 text-center mb-6 tracking-wide"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              PERÍODO DE ANÁLISE
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block font-medium text-slate-300" style={{ fontFamily: "Cinzel, serif" }}>
                  Mês:
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-slate-300" style={{ fontFamily: "Cinzel, serif" }}>
                  Ano:
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-slate-300" style={{ fontFamily: "Cinzel, serif" }}>
                  Dia Inicial:
                </label>
                <select
                  value={startDay}
                  onChange={(e) => setStartDay(Number(e.target.value))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-slate-300" style={{ fontFamily: "Cinzel, serif" }}>
                  Dia Final:
                </label>
                <select
                  value={endDay}
                  onChange={(e) => setEndDay(Number(e.target.value))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1)
                    .filter((day) => day >= startDay)
                    .map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-blue-300 font-medium" style={{ fontFamily: "Cinzel, serif" }}>
                Período Selecionado: {results.totalDays} dias | Investimento Total:{" "}
                {formatCurrency(results.totalInvestment)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-8">
            <h3
              className="text-xl font-medium text-blue-300 text-center mb-8 tracking-wide"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              CONFIGURAÇÕES DE MARKETING E FUNIL DE VENDAS
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <SliderInput
                  label="Investimento em Marketing por Dia"
                  value={dailyInvestment}
                  onChange={setDailyInvestment}
                  min={10}
                  max={50000}
                  step={10}
                  formatValue={formatCurrency}
                />

                <SliderInput
                  label="Custo por Lead (CPL)"
                  value={pricePerLead}
                  onChange={setPricePerLead}
                  min={1}
                  max={100}
                  step={1}
                  formatValue={formatCurrency}
                />

                <SliderInput
                  label="Taxa de Qualificação (Lead → MQL)"
                  value={qualificationRate}
                  onChange={setQualificationRate}
                  min={1}
                  max={100}
                  step={1}
                  formatValue={(v) => `${v}%`}
                  subText="% de leads gerados que se tornam Marketing Qualified Leads."
                />

                <SliderInput
                  label="Taxa de Agendamento (MQL → Call Agendada por SDR)"
                  value={sdrSchedulingRate}
                  onChange={setSdrSchedulingRate}
                  min={1}
                  max={100}
                  step={1}
                  formatValue={(v) => `${v}%`}
                  subText="% de MQLs que SDRs conseguem agendar uma call/reunião."
                />
              </div>

              <div className="space-y-6">
                <SliderInput
                  label="Taxa de Comparecimento (Agendada → Realizada)"
                  value={attendanceRate}
                  onChange={setAttendanceRate}
                  min={10}
                  max={100}
                  step={1}
                  formatValue={(v) => `${v}%`}
                  subText="% de calls agendadas que efetivamente acontecem."
                />

                <SliderInput
                  label="Taxa de Conversão (Call Realizada → Venda por Closer)"
                  value={closerConversionRate}
                  onChange={setCloserConversionRate}
                  min={1}
                  max={80}
                  step={1}
                  formatValue={(v) => `${v}%`}
                  subText="% de calls realizadas que resultam em venda pelo Closer."
                />

                <SliderInput
                  label="Ticket Médio por Venda"
                  value={averageTicket}
                  onChange={setAverageTicket}
                  min={100}
                  max={1000000}
                  step={1000}
                  formatValue={formatCurrency}
                />

                <div className="space-y-2">
                  <label className="block font-medium text-slate-300" style={{ fontFamily: "Cinzel, serif" }}>
                    Tempo Médio de Venda (Ciclo de Vendas em dias):
                  </label>
                  <input
                    type="number"
                    value={averageSaleTime}
                    onChange={(e) => setAverageSaleTime(Number(e.target.value))}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    style={{ fontFamily: "Cinzel, serif" }}
                    min="1"
                  />
                  <p className="text-xs text-slate-400">
                    Informativo: do primeiro contato à venda. Ajuda no planejamento de fluxo de caixa.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-600 pt-8">
              <h3
                className="text-xl font-medium text-blue-300 text-center mb-8 tracking-wide"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                CUSTOS OPERACIONAIS MENSAIS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NumberInput
                  label="Custo Fixo por SDR (Salário + Encargos)"
                  value={sdrFixedCost}
                  onChange={setSdrFixedCost}
                />
                <NumberInput
                  label="Custo Fixo por Closer (Salário + Encargos)"
                  value={closerFixedCost}
                  onChange={setCloserFixedCost}
                />
                <NumberInput
                  label="Comissão Fixa por Venda (para Closer)"
                  value={closerCommission}
                  onChange={setCloserCommission}
                />
                <NumberInput label="Custo de Ferramentas de Vendas" value={toolsCost} onChange={setToolsCost} />
                <NumberInput
                  label="Outros Custos Fixos da Operação"
                  value={otherFixedCosts}
                  onChange={setOtherFixedCosts}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3
            className="text-xl font-medium text-blue-300 text-center mb-8 tracking-wide"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            RESULTADOS E PROJEÇÕES PARA O PERÍODO
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard label="Total de Leads Gerados" value={results.totalLeads.toString()} />
            <ResultCard label="MQLs Gerados" value={results.mqls.toString()} />
            <ResultCard label="Calls Agendadas (SDR)" value={results.scheduledCalls.toString()} />
            <ResultCard label="Calls Realizadas" value={results.attendedCalls.toString()} />
            <ResultCard label="Número de Vendas" value={results.sales.toString()} />
            <ResultCard label="Faturamento Bruto" value={formatCurrency(results.revenue)} />
            <ResultCard
              label="SDRs Necessários"
              value={results.sdrCount.toString()}
              subText={`Para o período de ${results.totalDays} dias`}
            />
            <ResultCard
              label="Closers Necessários"
              value={results.closerCount.toString()}
              subText={`Para o período de ${results.totalDays} dias`}
            />
            <ResultCard label="Custo por MQL (Marketing)" value={formatCurrency(results.costPerMQL)} />
            <ResultCard label="ROAS (Marketing)" value={results.roas.toFixed(2)} />
            <ResultCard label="CAC (Custo Aquisição Cliente)" value={formatCurrency(results.cac)} />
            <ResultCard label="Lucro Líquido da Operação" value={formatCurrency(results.netProfit)} highlight={true} />
          </div>

          <div className="text-center mt-8 text-sm text-slate-400">
            <p>
              Ciclo de Vendas Estimado:{" "}
              <span className="font-bold text-white" style={{ fontFamily: "Cinzel, serif" }}>
                {averageSaleTime} dias
              </span>
              . Considere este tempo para o retorno do investimento.
            </p>
            <p className="mt-2">
              *Todos os valores são estimativas para o período de{" "}
              <span className="font-bold text-white" style={{ fontFamily: "Cinzel, serif" }}>
                {results.totalDays} dias
              </span>{" "}
              ({startDay} a {endDay} de {months[selectedMonth]} de {selectedYear}).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SliderInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  formatValue: (value: number) => string
  subText?: string
}

function SliderInput({ label, value, onChange, min, max, step, formatValue, subText }: SliderInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="font-medium text-slate-300" style={{ fontFamily: "Cinzel, serif" }}>
          {label}:
        </label>
        <span className="font-semibold text-blue-300" style={{ fontFamily: "Cinzel, serif" }}>
          {formatValue(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
        className="my-2"
      />
      {subText && <p className="text-xs text-slate-400">{subText}</p>}
    </div>
  )
}

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
}

function NumberInput({ label, value, onChange }: NumberInputProps) {
  const formatCurrency = (value: number) => {
    return value
      .toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
      .replace(/\s/g, " ")
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block font-medium text-slate-300" style={{ fontFamily: "Cinzel, serif" }}>
          {label}:
        </label>
        <span className="font-semibold text-blue-300" style={{ fontFamily: "Cinzel, serif" }}>
          {formatCurrency(value)}
        </span>
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
        style={{ fontFamily: "Cinzel, serif" }}
        min="0"
      />
    </div>
  )
}

interface ResultCardProps {
  label: string
  value: string
  subText?: string
  highlight?: boolean
}

function ResultCard({ label, value, subText, highlight = false }: ResultCardProps) {
  return (
    <Card
      className={`${highlight ? "bg-blue-600/20 border-blue-400" : "bg-slate-700/50"} backdrop-blur-sm border-slate-600 hover:transform hover:-translate-y-1 transition-all duration-200`}
    >
      <CardContent className="p-4 text-center">
        <div
          className={`text-xs font-medium uppercase tracking-wide mb-2 ${highlight ? "text-blue-300" : "text-slate-400"}`}
          style={{ fontFamily: "Cinzel, serif" }}
        >
          {label}
        </div>
        <div
          className={`text-xl font-semibold mb-1 ${highlight ? "text-blue-200 text-2xl" : "text-white"}`}
          style={{ fontFamily: "Cinzel, serif" }}
        >
          {value}
        </div>
        {subText && <div className="text-xs text-slate-400">{subText}</div>}
      </CardContent>
    </Card>
  )
}
