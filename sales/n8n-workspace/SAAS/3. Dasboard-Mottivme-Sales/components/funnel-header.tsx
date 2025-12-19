"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo } from "react"

interface FunnelHeaderProps {
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
}

// Dados base do funil
const baseFunnelData = {
  trafego: {
    prospec: 4120,
    lead: 1620,
    qualif: 810,
    agend: 507,
    noshow: 101,
    calls: 406,
    ganho: 162,
    perdido: 244,
    txConv: 39.9,
  },
  bpo: {
    prospec: 3175,
    lead: 1227,
    qualif: 613,
    agend: 385,
    noshow: 77,
    calls: 308,
    ganho: 123,
    perdido: 185,
    txConv: 39.9,
  },
  total: {
    prospec: 7295,
    lead: 2847,
    qualif: 1423,
    agend: 892,
    noshow: 178,
    calls: 714,
    ganho: 285,
    perdido: 429,
    txConv: 39.9,
  },
}

const funnelSteps = [
  { key: "prospec", label: "Prospec" },
  { key: "lead", label: "Lead" },
  { key: "qualif", label: "Qualif" },
  { key: "agend", label: "Agend" },
  { key: "noshow", label: "NoShow" },
  { key: "calls", label: "Calls" },
  { key: "ganho", label: "Ganho" },
  { key: "perdido", label: "Perdido" },
  { key: "txConv", label: "Tx Conv" },
]

export function FunnelHeader({ filters }: FunnelHeaderProps) {
  // Aplicar filtros aos dados do funil
  const funnelData = useMemo(() => {
    if (!filters) return baseFunnelData

    // Simular aplicação de filtros (multiplicadores baseados nos filtros)
    let multiplier = 1

    // Ajustar dados baseado no ano
    if (filters.ano === "2024") multiplier *= 0.85
    if (filters.ano === "2023") multiplier *= 0.72

    // Ajustar dados baseado na equipe
    if (filters.equipe === "equipe-a") multiplier *= 0.6
    if (filters.equipe === "equipe-b") multiplier *= 0.4

    // Ajustar dados baseado no chat
    if (filters.chat === "instagram") multiplier *= 0.6
    if (filters.chat === "whatsapp") multiplier *= 0.4

    // Aplicar multiplicador aos dados
    const adjustedData = {
      trafego: {},
      bpo: {},
      total: {},
    }

    Object.keys(baseFunnelData).forEach((category) => {
      adjustedData[category] = {}
      Object.keys(baseFunnelData[category]).forEach((key) => {
        if (key === "txConv") {
          adjustedData[category][key] = baseFunnelData[category][key]
        } else {
          adjustedData[category][key] = Math.round(baseFunnelData[category][key] * multiplier)
        }
      })
    })

    return adjustedData
  }, [filters])

  return (
    <Card className="bg-slate-900 border-slate-800 mb-6">
      <CardHeader>
        <CardTitle className="text-white text-xl">
          Funil de Vendas - Visão Geral
          {filters && (
            <span className="text-sm text-blue-400 ml-2">
              ({filters.ano} |{" "}
              {filters.periodo === "todos"
                ? "Todos"
                : Array.isArray(filters.periodo)
                  ? `${filters.periodo.length} meses`
                  : filters.periodo.charAt(0).toUpperCase() + filters.periodo.slice(1)}
              )
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-4 px-4 min-w-[100px] sticky left-0 bg-slate-900 z-10">
                  Funil
                </th>
                {funnelSteps.map((step) => (
                  <th key={step.key} className="text-center text-slate-400 font-medium py-4 px-4 min-w-[100px]">
                    {step.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* TRÁFEGO */}
              <tr className="border-b border-slate-700/50">
                <td className="text-blue-400 font-semibold py-4 px-4 sticky left-0 bg-slate-900 z-10">TRÁFEGO</td>
                {funnelSteps.map((step) => (
                  <td key={step.key} className="text-center py-4 px-4">
                    <div className="text-white font-bold text-lg">
                      {step.key === "txConv"
                        ? `${funnelData.trafego[step.key]}%`
                        : funnelData.trafego[step.key].toLocaleString()}
                    </div>
                    {step.key !== "prospec" && step.key !== "txConv" && (
                      <div className="text-slate-400 text-xs mt-1">
                        {((funnelData.trafego[step.key] / funnelData.trafego.prospec) * 100).toFixed(1)}%
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* BPO */}
              <tr className="border-b border-slate-700/50">
                <td className="text-purple-400 font-semibold py-4 px-4 sticky left-0 bg-slate-900 z-10">BPO</td>
                {funnelSteps.map((step) => (
                  <td key={step.key} className="text-center py-4 px-4">
                    <div className="text-white font-bold text-lg">
                      {step.key === "txConv"
                        ? `${funnelData.bpo[step.key]}%`
                        : funnelData.bpo[step.key].toLocaleString()}
                    </div>
                    {step.key !== "prospec" && step.key !== "txConv" && (
                      <div className="text-slate-400 text-xs mt-1">
                        {((funnelData.bpo[step.key] / funnelData.bpo.prospec) * 100).toFixed(1)}%
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* TOTAL */}
              <tr className="bg-slate-800/50">
                <td className="text-green-400 font-semibold py-4 px-4 sticky left-0 bg-slate-800/50 z-10">TOTAL</td>
                {funnelSteps.map((step) => (
                  <td key={step.key} className="text-center py-4 px-4">
                    <div className="text-white font-bold text-lg">
                      {step.key === "txConv"
                        ? `${funnelData.total[step.key]}%`
                        : funnelData.total[step.key].toLocaleString()}
                    </div>
                    {step.key !== "prospec" && step.key !== "txConv" && (
                      <div className="text-slate-400 text-xs mt-1">
                        {((funnelData.total[step.key] / funnelData.total.prospec) * 100).toFixed(1)}%
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
