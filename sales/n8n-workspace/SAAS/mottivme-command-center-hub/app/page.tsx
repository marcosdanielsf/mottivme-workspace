'use client'

import Link from 'next/link'
import {
  Target,
  TrendingUp,
  Calculator,
  BarChart3,
  Users,
  Settings,
  Activity,
  ExternalLink,
  FileText,
  DollarSign,
  PieChart,
  Zap,
  Database,
  LineChart
} from 'lucide-react'

export default function Home() {
  // Dashboards Externos (links para outros projetos Vercel)
  const externalDashboards = [
    {
      icon: BarChart3,
      title: 'Admin Dashboard',
      description: 'Dashboard administrativo completo com metricas gerais e visao executiva.',
      href: 'https://admin-dashboard-zeta-umber.vercel.app/dashboard',
      color: 'from-purple-500 to-purple-600',
      tag: 'Externo'
    },
    {
      icon: LineChart,
      title: 'Dashboard Analytics',
      description: 'Overview de metricas e analytics em tempo real.',
      href: 'https://dashboard-nextjs-nu-five.vercel.app/overview',
      color: 'from-blue-500 to-blue-600',
      tag: 'Externo'
    },
    {
      icon: PieChart,
      title: 'Dashboard Comercial',
      description: 'Metricas comerciais, funil de vendas e performance de vendedores.',
      href: 'https://v0-comercial-dashboard-metr-git-8cab08-marcosdanielsfs-projects.vercel.app/',
      color: 'from-green-500 to-green-600',
      tag: 'Externo'
    },
  ]

  // Ferramentas Internas
  const internalTools = [
    {
      icon: Calculator,
      title: 'Sales Planner',
      description: 'Planeje suas vendas com calculos forward e reverse. Defina metas ou investimento e veja os resultados.',
      href: '/sales-planner',
      color: 'from-blue-500 to-blue-600',
      available: true
    },
    {
      icon: BarChart3,
      title: 'META vs REALIZADO',
      description: 'Acompanhe o desempenho do seu planejamento com dados sincronizados do GoHighLevel.',
      href: '/dashboard-comparativo',
      color: 'from-purple-500 to-purple-600',
      available: true
    },
    {
      icon: Users,
      title: 'Portal do Closer',
      description: 'Calculadoras, scripts de vendas e ferramentas para sua equipe comercial.',
      href: '/closer-portal',
      color: 'from-green-500 to-green-600',
      available: true
    },
    {
      icon: Activity,
      title: 'N8N Monitor',
      description: 'Monitore workflows e integracoes automaticas em tempo real.',
      href: '/n8n-monitor',
      color: 'from-orange-500 to-orange-600',
      available: false
    },
    {
      icon: TrendingUp,
      title: 'Relatorios',
      description: 'Analises detalhadas de performance, conversao e ROI.',
      href: '/reports',
      color: 'from-pink-500 to-pink-600',
      available: false
    },
    {
      icon: Settings,
      title: 'Configuracoes',
      description: 'Configure produtos, metas, integracoes e preferencias.',
      href: '/settings',
      color: 'from-gray-500 to-gray-600',
      available: false
    }
  ]

  // Calculadoras Rapidas
  const quickCalculators = [
    {
      icon: DollarSign,
      title: 'ROI Calculator',
      href: '/closer-portal/roi-calculator',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Target,
      title: 'Meta de Vendas',
      href: '/closer-portal/sales-goals',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: FileText,
      title: 'Comissoes',
      href: '/closer-portal/commission-calculator',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Zap,
      title: 'LTV Calculator',
      href: '/closer-portal/ltv-calculator',
      color: 'from-violet-500 to-violet-600'
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#0F1419] to-[#0B0F19]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 mb-6">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Mottivme Command Center</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Central de Comando
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mottivme Sales
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Acesse todos os dashboards, calculadoras e ferramentas em um unico lugar.
            Gerencie suas vendas com precisao e previsibilidade.
          </p>
        </div>

        {/* External Dashboards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Database className="w-6 h-6 text-purple-400" />
            Dashboards Externos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {externalDashboards.map((dashboard, index) => {
              const Icon = dashboard.icon
              return (
                <a
                  key={index}
                  href={dashboard.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4">
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {dashboard.tag}
                    </span>
                  </div>

                  <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${dashboard.color} shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{dashboard.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{dashboard.description}</p>

                  <div className="mt-4 flex items-center text-purple-400 font-medium group-hover:gap-2 transition-all">
                    Abrir Dashboard
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        {/* Quick Actions - Calculadoras */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-400" />
            Acoes Rapidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickCalculators.map((calc, index) => {
              const Icon = calc.icon
              return (
                <Link
                  key={index}
                  href={calc.href}
                  className={`group relative bg-gradient-to-br ${calc.color} rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-white" />
                    <span className="text-white font-semibold">{calc.title}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Internal Tools Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-400" />
            Ferramentas Internas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internalTools.map((feature, index) => {
              const Icon = feature.icon
              const content = (
                <div className={`
                  relative group h-full
                  bg-gradient-to-br from-white/5 to-white/[0.02]
                  border border-white/10
                  rounded-2xl p-6
                  transition-all duration-300
                  ${feature.available
                    ? 'hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                  }
                `}>
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    bg-gradient-to-br ${feature.color} rounded-2xl
                    ${feature.available ? 'blur-3xl -z-10' : ''}
                  `} />

                  <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    {feature.title}
                    {!feature.available && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                        Em breve
                      </span>
                    )}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                  {feature.available && (
                    <div className="mt-4 flex items-center text-blue-400 font-medium group-hover:gap-2 transition-all">
                      Acessar
                      <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  )}
                </div>
              )

              if (feature.available) {
                return (
                  <Link key={index} href={feature.href}>
                    {content}
                  </Link>
                )
              }

              return (
                <div key={index}>
                  {content}
                </div>
              )
            })}
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">3</div>
            <div className="text-gray-400">Dashboards</div>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">6+</div>
            <div className="text-gray-400">Calculadoras</div>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-400">Automatizado</div>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">Real-time</div>
            <div className="text-gray-400">Sincronizacao</div>
          </div>
        </div>
      </div>
    </main>
  )
}
