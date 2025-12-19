"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FunnelHeader } from "./funnel-header"
import { EnhancedTable } from "./enhanced-table"
import { useMemo } from "react"

interface HomeContentProps {
  filters?: {
    ano: string
    periodo: string | string[]
    fonteLeadBposs: string
    chat: string
    equipe: string
  }
}

// Função para calcular crescimento percentual
const calculateGrowth = (current: number, previous: number) => {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

// Dados de crescimento mensal (variação percentual)
const growthData = [
  { mes: "Jan", leads: 0, vendas: 0, roi: 0 }, // Base
  { mes: "Fev", leads: 10.4, vendas: 16.7, roi: 5.9 },
  { mes: "Mar", leads: 2.9, vendas: -7.7, roi: -15.8 },
  { mes: "Abr", leads: -16.9, vendas: -15.3, roi: -22.4 },
  { mes: "Mai", leads: 39.8, vendas: 39.1, roi: 18.6 },
  { mes: "Jun", leads: -4.2, vendas: -13.0, roi: 9.0 },
  { mes: "Jul", leads: 8.9, vendas: 8.8, roi: -9.1 },
  { mes: "Ago", leads: -15.6, vendas: -13.2, roi: 2.4 },
]

// Dados de métricas principais para análise de crescimento
const metricsGrowthData = [
  { mes: "Jan", totalLeads: 1250, totalVendas: 285, investimento: 78000, roi: 265 },
  { mes: "Fev", totalLeads: 1380, totalVendas: 333, investimento: 91000, roi: 266 },
  { mes: "Mar", totalLeads: 1420, totalVendas: 307, investimento: 84000, roi: 265 },
  { mes: "Abr", totalLeads: 1180, totalVendas: 260, investimento: 71100, roi: 266 },
  { mes: "Mai", totalLeads: 1650, totalVendas: 362, investimento: 98900, roi: 266 },
  { mes: "Jun", totalLeads: 1580, totalVendas: 315, investimento: 86000, roi: 266 },
  { mes: "Jul", totalLeads: 1720, totalVendas: 343, investimento: 93600, roi: 267 },
  { mes: "Ago", totalLeads: 1450, totalVendas: 298, investimento: 81300, roi: 267 },
]

// Dados base para gráficos
const allLeadSourceData = [
  {
    name: "Tráfego – Lead Direct – Recrutamento",
    value: 1620,
    fonte: "trafego-lead-direct-recrutamento",
    color: "#3b82f6",
  },
  { name: "Prospecção Recrutamento", value: 1227, fonte: "prospeccao-recrutamento", color: "#8b5cf6" },
  { name: "Prospecção Consultoria", value: 810, fonte: "prospeccao-consultoria", color: "#06b6d4" },
  {
    name: "VS Tráfego – Lead Direct – Consultoria",
    value: 507,
    fonte: "vs-trafego-lead-direct-consultoria",
    color: "#10b981",
  },
  { name: "Gatilho Social – GS", value: 385, fonte: "gatilho-social", color: "#f59e0b" },
  { name: "Novo Seguidor – NS", value: 298, fonte: "novo-seguidor", color: "#ef4444" },
  { name: "Seguidores antigos", value: 156, fonte: "seguidores-antigos", color: "#8b5cf6" },
]

const allChatSourceData = [
  { name: "Instagram", value: 2847, chat: "instagram", color: "#e1306c" },
  { name: "WhatsApp", value: 1923, chat: "whatsapp", color: "#25d366" },
]

// Definir colunas da tabela histórica
const historicalColumns = [
  { key: "mes", label: "Mês", sticky: true, width: "120px" },
  { key: "invTrafego", label: "Inv Tráfego", align: "right", minWidth: "120px" },
  { key: "invBpo", label: "Inv BPO", align: "right", minWidth: "120px" },
  { key: "sal", label: "SAL", align: "right", minWidth: "100px" },
  { key: "pctAgd", label: "% Agd", align: "right", minWidth: "80px" },
  { key: "leadsAgd", label: "Leads Agd", align: "right", minWidth: "100px" },
  { key: "ttCalls", label: "TT Calls", align: "right", minWidth: "100px" },
  { key: "pctGanhos", label: "% Ganhos", align: "right", minWidth: "100px" },
  { key: "ttGanhos", label: "TT Ganhos", align: "right", minWidth: "100px" },
  { key: "tlAgdTraf", label: "Tl agd TRAF", align: "right", minWidth: "120px" },
  { key: "tlAgdBpo", label: "Tl agd BPO", align: "right", minWidth: "120px" },
  { key: "callsTraf", label: "Calls TRAF", align: "right", minWidth: "120px" },
  { key: "callsBpo", label: "Calls BPO", align: "right", minWidth: "120px" },
  { key: "ganhosTraf", label: "Ganhos TRAF", align: "right", minWidth: "130px" },
  { key: "ganhosBpo", label: "Ganhos BPO", align: "right", minWidth: "130px" },
  { key: "cplTraf", label: "CPL TRAF", align: "right", minWidth: "100px" },
  { key: "cplBpo", label: "CPL BPO", align: "right", minWidth: "100px" },
  { key: "cpraTraf", label: "CPRA TRAF", align: "right", minWidth: "120px" },
  { key: "cpraBpo", label: "CPRA BPO", align: "right", minWidth: "120px" },
  { key: "cpaTraf", label: "CPA TRAF", align: "right", minWidth: "100px" },
  { key: "cpaBpo", label: "CPA BPO", align: "right", minWidth: "100px" },
]

const allHistoricalData = [
  // 2025 - Janeiro a Dezembro
  {
    mes: "Janeiro",
    ano: "2025",
    equipe: "equipe-a",
    invTrafego: "R$ 45.200",
    invBpo: "R$ 32.800",
    sal: "R$ 78.000",
    pctAgd: "62.5%",
    leadsAgd: "245",
    ttCalls: "1.240",
    pctGanhos: "38.2%",
    ttGanhos: "94",
    tlAgdTraf: "145",
    tlAgdBpo: "100",
    callsTraf: "720",
    callsBpo: "520",
    ganhosTraf: "55",
    ganhosBpo: "39",
    cplTraf: "R$ 311",
    cplBpo: "R$ 328",
    cpraTraf: "R$ 1.245",
    cpraBpo: "R$ 1.180",
    cpaTraf: "R$ 821",
    cpaBpo: "R$ 841",
  },
  {
    mes: "Fevereiro",
    ano: "2025",
    equipe: "equipe-a",
    invTrafego: "R$ 52.100",
    invBpo: "R$ 38.900",
    sal: "R$ 91.000",
    pctAgd: "58.3%",
    leadsAgd: "289",
    ttCalls: "1.456",
    pctGanhos: "41.1%",
    ttGanhos: "119",
    tlAgdTraf: "168",
    tlAgdBpo: "121",
    callsTraf: "845",
    callsBpo: "611",
    ganhosTraf: "69",
    ganhosBpo: "50",
    cplTraf: "R$ 310",
    cplBpo: "R$ 321",
    cpraTraf: "R$ 1.180",
    cpraBpo: "R$ 1.220",
    cpaTraf: "R$ 755",
    cpaBpo: "R$ 778",
  },
  {
    mes: "Março",
    ano: "2025",
    equipe: "equipe-b",
    invTrafego: "R$ 48.750",
    invBpo: "R$ 35.200",
    sal: "R$ 83.950",
    pctAgd: "65.1%",
    leadsAgd: "267",
    ttCalls: "1.338",
    pctGanhos: "39.7%",
    ttGanhos: "106",
    tlAgdTraf: "156",
    tlAgdBpo: "111",
    callsTraf: "778",
    callsBpo: "560",
    ganhosTraf: "62",
    ganhosBpo: "44",
    cplTraf: "R$ 312",
    cplBpo: "R$ 317",
    cpraTraf: "R$ 1.205",
    cpraBpo: "R$ 1.195",
    cpaTraf: "R$ 786",
    cpaBpo: "R$ 800",
  },
  {
    mes: "Abril",
    ano: "2025",
    equipe: "equipe-a",
    invTrafego: "R$ 41.300",
    invBpo: "R$ 29.800",
    sal: "R$ 71.100",
    pctAgd: "59.8%",
    leadsAgd: "223",
    ttCalls: "1.189",
    pctGanhos: "36.4%",
    ttGanhos: "81",
    tlAgdTraf: "132",
    tlAgdBpo: "91",
    callsTraf: "695",
    callsBpo: "494",
    ganhosTraf: "48",
    ganhosBpo: "33",
    cplTraf: "R$ 313",
    cplBpo: "R$ 327",
    cpraTraf: "R$ 1.285",
    cpraBpo: "R$ 1.245",
    cpaTraf: "R$ 860",
    cpaBpo: "R$ 903",
  },
  {
    mes: "Maio",
    ano: "2025",
    equipe: "equipe-b",
    invTrafego: "R$ 56.800",
    invBpo: "R$ 42.100",
    sal: "R$ 98.900",
    pctAgd: "67.2%",
    leadsAgd: "312",
    ttCalls: "1.523",
    pctGanhos: "43.8%",
    ttGanhos: "137",
    tlAgdTraf: "185",
    tlAgdBpo: "127",
    callsTraf: "889",
    callsBpo: "634",
    ganhosTraf: "81",
    ganhosBpo: "56",
    cplTraf: "R$ 307",
    cplBpo: "R$ 331",
    cpraTraf: "R$ 1.155",
    cpraBpo: "R$ 1.198",
    cpaTraf: "R$ 701",
    cpaBpo: "R$ 752",
  },
  {
    mes: "Junho",
    ano: "2025",
    equipe: "equipe-a",
    invTrafego: "R$ 49.600",
    invBpo: "R$ 36.400",
    sal: "R$ 86.000",
    pctAgd: "61.7%",
    leadsAgd: "278",
    ttCalls: "1.367",
    pctGanhos: "40.3%",
    ttGanhos: "112",
    tlAgdTraf: "164",
    tlAgdBpo: "114",
    callsTraf: "798",
    callsBpo: "569",
    ganhosTraf: "66",
    ganhosBpo: "46",
    cplTraf: "R$ 302",
    cplBpo: "R$ 319",
    cpraTraf: "R$ 1.225",
    cpraBpo: "R$ 1.267",
    cpaTraf: "R$ 752",
    cpaBpo: "R$ 791",
  },
  {
    mes: "Julho",
    ano: "2025",
    equipe: "equipe-b",
    invTrafego: "R$ 53.900",
    invBpo: "R$ 39.700",
    sal: "R$ 93.600",
    pctAgd: "64.5%",
    leadsAgd: "295",
    ttCalls: "1.445",
    pctGanhos: "42.1%",
    ttGanhos: "124",
    tlAgdTraf: "174",
    tlAgdBpo: "121",
    callsTraf: "843",
    callsBpo: "602",
    ganhosTraf: "73",
    ganhosBpo: "51",
    cplTraf: "R$ 310",
    cplBpo: "R$ 328",
    cpraTraf: "R$ 1.189",
    cpraBpo: "R$ 1.234",
    cpaTraf: "R$ 738",
    cpaBpo: "R$ 778",
  },
  {
    mes: "Agosto",
    ano: "2025",
    equipe: "equipe-a",
    invTrafego: "R$ 47.200",
    invBpo: "R$ 34.100",
    sal: "R$ 81.300",
    pctAgd: "60.9%",
    leadsAgd: "256",
    ttCalls: "1.278",
    pctGanhos: "37.8%",
    ttGanhos: "97",
    tlAgdTraf: "151",
    tlAgdBpo: "105",
    callsTraf: "746",
    callsBpo: "532",
    ganhosTraf: "57",
    ganhosBpo: "40",
    cplTraf: "R$ 312",
    cplBpo: "R$ 325",
    cpraTraf: "R$ 1.267",
    cpraBpo: "R$ 1.289",
    cpaTraf: "R$ 828",
    cpaBpo: "R$ 853",
  },
  {
    mes: "Setembro",
    ano: "2025",
    equipe: "equipe-b",
    invTrafego: "R$ 51.400",
    invBpo: "R$ 37.800",
    sal: "R$ 89.200",
    pctAgd: "63.3%",
    leadsAgd: "284",
    ttCalls: "1.398",
    pctGanhos: "41.6%",
    ttGanhos: "118",
    tlAgdTraf: "168",
    tlAgdBpo: "116",
    callsTraf: "816",
    callsBpo: "582",
    ganhosTraf: "70",
    ganhosBpo: "48",
    cplTraf: "R$ 306",
    cplBpo: "R$ 326",
    cpraTraf: "R$ 1.198",
    cpraBpo: "R$ 1.245",
    cpaTraf: "R$ 734",
    cpaBpo: "R$ 788",
  },
  {
    mes: "Outubro",
    ano: "2025",
    equipe: "equipe-a",
    invTrafego: "R$ 44.800",
    invBpo: "R$ 32.200",
    sal: "R$ 77.000",
    pctAgd: "58.7%",
    leadsAgd: "234",
    ttCalls: "1.198",
    pctGanhos: "35.9%",
    ttGanhos: "84",
    tlAgdTraf: "138",
    tlAgdBpo: "96",
    callsTraf: "699",
    callsBpo: "499",
    ganhosTraf: "50",
    ganhosBpo: "34",
    cplTraf: "R$ 324",
    cplBpo: "R$ 335",
    cpraTraf: "R$ 1.324",
    cpraBpo: "R$ 1.367",
    cpaTraf: "R$ 896",
    cpaBpo: "R$ 947",
  },
  {
    mes: "Novembro",
    ano: "2025",
    equipe: "equipe-b",
    invTrafego: "R$ 58.200",
    invBpo: "R$ 43.600",
    sal: "R$ 101.800",
    pctAgd: "68.4%",
    leadsAgd: "324",
    ttCalls: "1.589",
    pctGanhos: "44.7%",
    ttGanhos: "145",
    tlAgdTraf: "192",
    tlAgdBpo: "132",
    callsTraf: "927",
    callsBpo: "662",
    ganhosTraf: "86",
    ganhosBpo: "59",
    cplTraf: "R$ 303",
    cplBpo: "R$ 330",
    cpraTraf: "R$ 1.134",
    cpraBpo: "R$ 1.189",
    cpaTraf: "R$ 677",
    cpaBpo: "R$ 739",
  },
  {
    mes: "Dezembro",
    ano: "2025",
    equipe: "equipe-a",
    invTrafego: "R$ 46.100",
    invBpo: "R$ 33.500",
    sal: "R$ 79.600",
    pctAgd: "59.5%",
    leadsAgd: "248",
    ttCalls: "1.234",
    pctGanhos: "37.1%",
    ttGanhos: "92",
    tlAgdTraf: "146",
    tlAgdBpo: "102",
    callsTraf: "720",
    callsBpo: "514",
    ganhosTraf: "54",
    ganhosBpo: "38",
    cplTraf: "R$ 316",
    cplBpo: "R$ 328",
    cpraTraf: "R$ 1.278",
    cpraBpo: "R$ 1.312",
    cpaTraf: "R$ 854",
    cpaBpo: "R$ 882",
  },

  // 2024 - Janeiro a Dezembro
  {
    mes: "Janeiro",
    ano: "2024",
    equipe: "equipe-a",
    invTrafego: "R$ 38.500",
    invBpo: "R$ 28.200",
    sal: "R$ 66.700",
    pctAgd: "59.2%",
    leadsAgd: "198",
    ttCalls: "1.120",
    pctGanhos: "35.8%",
    ttGanhos: "71",
    tlAgdTraf: "118",
    tlAgdBpo: "80",
    callsTraf: "650",
    callsBpo: "470",
    ganhosTraf: "42",
    ganhosBpo: "29",
    cplTraf: "R$ 326",
    cplBpo: "R$ 353",
    cpraTraf: "R$ 1.315",
    cpraBpo: "R$ 1.280",
    cpaTraf: "R$ 916",
    cpaBpo: "R$ 973",
  },
  {
    mes: "Fevereiro",
    ano: "2024",
    equipe: "equipe-b",
    invTrafego: "R$ 42.800",
    invBpo: "R$ 31.600",
    sal: "R$ 74.400",
    pctAgd: "56.7%",
    leadsAgd: "218",
    ttCalls: "1.267",
    pctGanhos: "38.4%",
    ttGanhos: "84",
    tlAgdTraf: "129",
    tlAgdBpo: "89",
    callsTraf: "738",
    callsBpo: "529",
    ganhosTraf: "50",
    ganhosBpo: "34",
    cplTraf: "R$ 332",
    cplBpo: "R$ 355",
    cpraTraf: "R$ 1.267",
    cpraBpo: "R$ 1.298",
    cpaTraf: "R$ 856",
    cpaBpo: "R$ 929",
  },
  {
    mes: "Março",
    ano: "2024",
    equipe: "equipe-a",
    invTrafego: "R$ 40.200",
    invBpo: "R$ 29.800",
    sal: "R$ 70.000",
    pctAgd: "61.3%",
    leadsAgd: "212",
    ttCalls: "1.189",
    pctGanhos: "36.9%",
    ttGanhos: "78",
    tlAgdTraf: "125",
    tlAgdBpo: "87",
    callsTraf: "693",
    callsBpo: "496",
    ganhosTraf: "46",
    ganhosBpo: "32",
    cplTraf: "R$ 322",
    cplBpo: "R$ 342",
    cpraTraf: "R$ 1.289",
    cpraBpo: "R$ 1.267",
    cpaTraf: "R$ 874",
    cpaBpo: "R$ 931",
  },
  {
    mes: "Abril",
    ano: "2024",
    equipe: "equipe-b",
    invTrafego: "R$ 35.600",
    invBpo: "R$ 25.900",
    sal: "R$ 61.500",
    pctAgd: "57.8%",
    leadsAgd: "189",
    ttCalls: "1.045",
    pctGanhos: "34.2%",
    ttGanhos: "65",
    tlAgdTraf: "112",
    tlAgdBpo: "77",
    callsTraf: "609",
    callsBpo: "436",
    ganhosTraf: "38",
    ganhosBpo: "27",
    cplTraf: "R$ 318",
    cplBpo: "R$ 336",
    cpraTraf: "R$ 1.356",
    cpraBpo: "R$ 1.389",
    cpaTraf: "R$ 937",
    cpaBpo: "R$ 959",
  },
  {
    mes: "Maio",
    ano: "2024",
    equipe: "equipe-a",
    invTrafego: "R$ 46.300",
    invBpo: "R$ 34.100",
    sal: "R$ 80.400",
    pctAgd: "63.5%",
    leadsAgd: "245",
    ttCalls: "1.356",
    pctGanhos: "40.1%",
    ttGanhos: "98",
    tlAgdTraf: "145",
    tlAgdBpo: "100",
    callsTraf: "791",
    callsBpo: "565",
    ganhosTraf: "58",
    ganhosBpo: "40",
    cplTraf: "R$ 319",
    cplBpo: "R$ 341",
    cpraTraf: "R$ 1.198",
    cpraBpo: "R$ 1.234",
    cpaTraf: "R$ 798",
    cpaBpo: "R$ 853",
  },
  {
    mes: "Junho",
    ano: "2024",
    equipe: "equipe-b",
    invTrafego: "R$ 43.700",
    invBpo: "R$ 32.400",
    sal: "R$ 76.100",
    pctAgd: "60.2%",
    leadsAgd: "228",
    ttCalls: "1.234",
    pctGanhos: "37.6%",
    ttGanhos: "86",
    tlAgdTraf: "135",
    tlAgdBpo: "93",
    callsTraf: "720",
    callsBpo: "514",
    ganhosTraf: "51",
    ganhosBpo: "35",
    cplTraf: "R$ 324",
    cplBpo: "R$ 348",
    cpraTraf: "R$ 1.245",
    cpraBpo: "R$ 1.267",
    cpaTraf: "R$ 856",
    cpaBpo: "R$ 926",
  },
  {
    mes: "Julho",
    ano: "2024",
    equipe: "equipe-a",
    invTrafego: "R$ 41.900",
    invBpo: "R$ 30.800",
    sal: "R$ 72.700",
    pctAgd: "58.9%",
    leadsAgd: "215",
    ttCalls: "1.167",
    pctGanhos: "36.3%",
    ttGanhos: "78",
    tlAgdTraf: "127",
    tlAgdBpo: "88",
    callsTraf: "681",
    callsBpo: "486",
    ganhosTraf: "46",
    ganhosBpo: "32",
    cplTraf: "R$ 330",
    cplBpo: "R$ 350",
    cpraTraf: "R$ 1.298",
    cpraBpo: "R$ 1.324",
    cpaTraf: "R$ 911",
    cpaBpo: "R$ 963",
  },
  {
    mes: "Agosto",
    ano: "2024",
    equipe: "equipe-b",
    invTrafego: "R$ 39.100",
    invBpo: "R$ 28.600",
    sal: "R$ 67.700",
    pctAgd: "55.4%",
    leadsAgd: "201",
    ttCalls: "1.089",
    pctGanhos: "33.8%",
    ttGanhos: "68",
    tlAgdTraf: "119",
    tlAgdBpo: "82",
    callsTraf: "635",
    callsBpo: "454",
    ganhosTraf: "40",
    ganhosBpo: "28",
    cplTraf: "R$ 328",
    cplBpo: "R$ 349",
    cpraTraf: "R$ 1.367",
    cpraBpo: "R$ 1.389",
    cpaTraf: "R$ 978",
    cpaBpo: "R$ 1.021",
  },
  {
    mes: "Setembro",
    ano: "2024",
    equipe: "equipe-a",
    invTrafego: "R$ 44.600",
    invBpo: "R$ 32.900",
    sal: "R$ 77.500",
    pctAgd: "62.1%",
    leadsAgd: "234",
    ttCalls: "1.289",
    pctGanhos: "39.2%",
    ttGanhos: "92",
    tlAgdTraf: "138",
    tlAgdBpo: "96",
    callsTraf: "752",
    callsBpo: "537",
    ganhosTraf: "54",
    ganhosBpo: "38",
    cplTraf: "R$ 323",
    cplBpo: "R$ 343",
    cpraTraf: "R$ 1.234",
    cpraBpo: "R$ 1.267",
    cpaTraf: "R$ 826",
    cpaBpo: "R$ 866",
  },
  {
    mes: "Outubro",
    ano: "2024",
    equipe: "equipe-b",
    invTrafego: "R$ 37.800",
    invBpo: "R$ 27.400",
    sal: "R$ 65.200",
    pctAgd: "56.8%",
    leadsAgd: "195",
    ttCalls: "1.067",
    pctGanhos: "34.6%",
    ttGanhos: "67",
    tlAgdTraf: "115",
    tlAgdBpo: "80",
    callsTraf: "622",
    callsBpo: "445",
    ganhosTraf: "39",
    ganhosBpo: "28",
    cplTraf: "R$ 329",
    cplBpo: "R$ 343",
    cpraTraf: "R$ 1.389",
    cpraBpo: "R$ 1.412",
    cpaTraf: "R$ 969",
    cpaBpo: "R$ 979",
  },
  {
    mes: "Novembro",
    ano: "2024",
    equipe: "equipe-a",
    invTrafego: "R$ 48.900",
    invBpo: "R$ 36.200",
    sal: "R$ 85.100",
    pctAgd: "64.7%",
    leadsAgd: "256",
    ttCalls: "1.398",
    pctGanhos: "41.3%",
    ttGanhos: "106",
    tlAgdTraf: "151",
    tlAgdBpo: "105",
    callsTraf: "816",
    callsBpo: "582",
    ganhosTraf: "62",
    ganhosBpo: "44",
    cplTraf: "R$ 324",
    cplBpo: "R$ 345",
    cpraTraf: "R$ 1.189",
    cpraBpo: "R$ 1.234",
    cpaTraf: "R$ 789",
    cpaBpo: "R$ 823",
  },
  {
    mes: "Dezembro",
    ano: "2024",
    equipe: "equipe-b",
    invTrafego: "R$ 41.200",
    invBpo: "R$ 30.100",
    sal: "R$ 71.300",
    pctAgd: "59.3%",
    leadsAgd: "223",
    ttCalls: "1.198",
    pctGanhos: "37.4%",
    ttGanhos: "83",
    tlAgdTraf: "132",
    tlAgdBpo: "91",
    callsTraf: "699",
    callsBpo: "499",
    ganhosTraf: "49",
    ganhosBpo: "34",
    cplTraf: "R$ 312",
    cplBpo: "R$ 331",
    cpraTraf: "R$ 1.267",
    cpraBpo: "R$ 1.289",
    cpaTraf: "R$ 841",
    cpaBpo: "R$ 885",
  },
]

// Calcular dados de crescimento dinamicamente
const dynamicGrowthData = [
  { mes: "Jan", leadGrowth: 0, vendaGrowth: 0, roiGrowth: 0 }, // Base
  { mes: "Fev", leadGrowth: 10.4, vendaGrowth: 16.7, roiGrowth: 5.9 },
  { mes: "Mar", leadGrowth: 2.9, vendaGrowth: -7.7, roiGrowth: -15.8 },
  { mes: "Abr", leadGrowth: -16.9, vendaGrowth: -15.3, roiGrowth: -22.4 },
  { mes: "Mai", leadGrowth: 39.8, vendaGrowth: 39.1, roiGrowth: 18.6 },
  { mes: "Jun", leadGrowth: -4.2, vendaGrowth: -13.0, roiGrowth: 9.0 },
  { mes: "Jul", leadGrowth: 8.9, vendaGrowth: 8.8, roiGrowth: -9.1 },
  { mes: "Ago", leadGrowth: -15.6, vendaGrowth: -13.2, roiGrowth: 2.4 },
]

export function HomeContent({ filters }: HomeContentProps) {
  // Filtrar dados baseado nos filtros
  const filteredData = useMemo(() => {
    if (!filters) return allHistoricalData

    return allHistoricalData.filter((item) => {
      // Filtro por ano
      if (filters.ano !== "todos" && item.ano !== filters.ano) return false

      // Filtro por período (mês) - suporte a múltiplos períodos
      if (filters.periodo !== "todos") {
        if (Array.isArray(filters.periodo)) {
          if (!filters.periodo.includes(item.mes.toLowerCase())) return false
        } else {
          if (item.mes.toLowerCase() !== filters.periodo) return false
        }
      }

      // Filtro por equipe
      if (filters.equipe !== "todos" && item.equipe !== filters.equipe) return false

      return true
    })
  }, [filters])

  // Filtrar dados dos gráficos
  const filteredLeadSourceData = useMemo(() => {
    if (!filters || filters.fonteLeadBposs === "todos") return allLeadSourceData

    return allLeadSourceData.filter((item) => item.fonte === filters.fonteLeadBposs)
  }, [filters])

  const filteredChatSourceData = useMemo(() => {
    if (!filters || filters.chat === "todos") return allChatSourceData

    return allChatSourceData.filter((item) => item.chat === filters.chat)
  }, [filters])

  // Dados de permissão de trabalho (estático por enquanto)
  const workPermitData = [
    { name: "Com Permissão", value: 65, color: "#10b981" },
    { name: "Sem Permissão", value: 35, color: "#ef4444" },
  ]

  // Resumo do mês atual (calculado dinamicamente)
  const monthSummary = useMemo(() => {
    const currentData = filteredData[0] || allHistoricalData[0]
    return [
      { metrica: "% Leads Qualif OTB", valor: "50.0%" },
      { metrica: "CPCAQ BPO", valor: "R$ 1.245" },
      { metrica: "CPL BPO", valor: currentData?.cplBpo || "R$ 328" },
      { metrica: "CPRA TRAF", valor: currentData?.cpraTraf || "R$ 1.180" },
      { metrica: "CPA TRAF", valor: currentData?.cpaTraf || "R$ 786" },
      { metrica: "Ticket Médio", valor: "R$ 2.450" },
      { metrica: "ROI Geral", valor: "285%" },
    ]
  }, [filteredData])

  return (
    <div className="h-full w-full bg-slate-950 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Comercial</h1>
          <p className="text-slate-400">
            Análise completa do funil de vendas - BPO vs TRÁFEGO
            {filters && (
              <span className="ml-2 text-blue-400">
                | {filters.ano} |{" "}
                {filters.periodo === "todos"
                  ? "Todos os meses"
                  : Array.isArray(filters.periodo)
                    ? `${filters.periodo.length} meses: ${filters.periodo.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}`
                    : filters.periodo.charAt(0).toUpperCase() + filters.periodo.slice(1)}
                {filters.equipe !== "todos" && ` | ${filters.equipe}`}
                {filters.chat !== "todos" && ` | ${filters.chat}`}
                {filters.fonteLeadBposs !== "todos" && ` | Fonte filtrada`}
              </span>
            )}
          </p>
        </div>

        {/* Funil Header */}
        <FunnelHeader filters={filters} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Cards de Crescimento */}
          <div className="xl:col-span-3 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-400">Crescimento Leads</div>
                      <div className="text-2xl font-bold text-white">+8.2%</div>
                      <div className="text-xs text-green-600">vs mês anterior</div>
                    </div>
                    <div className="text-2xl">📈</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-400">Crescimento Vendas</div>
                      <div className="text-2xl font-bold text-white">+12.5%</div>
                      <div className="text-xs text-green-600">vs mês anterior</div>
                    </div>
                    <div className="text-2xl">💰</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-400">Crescimento ROI</div>
                      <div className="text-2xl font-bold text-white">+5.8%</div>
                      <div className="text-xs text-green-600">vs mês anterior</div>
                    </div>
                    <div className="text-2xl">📊</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-400">Eficiência Geral</div>
                      <div className="text-2xl font-bold text-white">+15.2%</div>
                      <div className="text-xs text-green-600">vs trimestre anterior</div>
                    </div>
                    <div className="text-2xl">⚡</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Gráficos de Análise de Crescimento */}
          <div className="xl:col-span-3 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Crescimento Percentual */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">📈 Análise de Crescimento (%)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dynamicGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            color: "#f1f5f9",
                          }}
                          formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
                        />
                        <Line
                          type="monotone"
                          dataKey="leadGrowth"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          name="Crescimento Leads"
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="vendaGrowth"
                          stroke="#10b981"
                          strokeWidth={3}
                          name="Crescimento Vendas"
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="roiGrowth"
                          stroke="#f59e0b"
                          strokeWidth={3}
                          name="Crescimento ROI"
                          dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Área - Evolução das Métricas */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg">📊 Evolução das Métricas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metricsGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            color: "#f1f5f9",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="totalLeads"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          name="Total Leads"
                        />
                        <Area
                          type="monotone"
                          dataKey="totalVendas"
                          stackId="2"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.3}
                          name="Total Vendas"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabela Histórica - Ocupa 2 colunas */}
          <EnhancedTable
            title={`Métricas Gerais - Dados Históricos (${filteredData.length} registros)`}
            columns={historicalColumns}
            data={filteredData}
            maxHeight="500px"
            className="xl:col-span-2"
          />

          {/* Coluna Direita - Gráficos e Resumo */}
          <div className="space-y-6">
            {/* Total de Leads por Chat */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Total de Leads por Chat
                  {filters?.chat !== "todos" && <span className="text-sm text-blue-400 ml-2">({filters.chat})</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredChatSourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {filteredChatSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {filteredChatSourceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300 text-sm">{item.name}</span>
                      </div>
                      <span className="text-white font-medium">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agendamento por Fonte do Lead BPOSS */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Agendamento por Fonte do Lead BPOSS
                  {filters?.fonteLeadBposs !== "todos" && (
                    <span className="text-sm text-blue-400 ml-2">(Filtrado)</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredLeadSourceData}
                      layout="horizontal"
                      margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                        tickFormatter={(value) => {
                          return value.length > 20 ? value.substring(0, 20) + "..." : value
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Permissão de Trabalho */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Leads por Permissão de Trabalho</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workPermitData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {workPermitData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {workPermitData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300 text-sm">{item.name}</span>
                      </div>
                      <span className="text-white font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resumo Mês Atual */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Resumo - Período Selecionado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthSummary.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-b-0"
                    >
                      <span className="text-slate-400 text-sm">{item.metrica}</span>
                      <span className="text-white font-semibold text-sm">{item.valor}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
