'use client'

import Link from 'next/link'
import {
  Target,
  TrendingUp,
  Calculator,
  BarChart3,
  Users,
  Settings,
  Activity
} from 'lucide-react'

export default function Home() {
  const features = [
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
      available: false
    },
    {
      icon: Activity,
      title: 'N8N Monitor',
      description: 'Monitore workflows e integrações automáticas em tempo real.',
      href: '/n8n-monitor',
      color: 'from-orange-500 to-orange-600',
      available: false
    },
    {
      icon: TrendingUp,
      title: 'Relatórios',
      description: 'Análises detalhadas de performance, conversão e ROI.',
      href: '/reports',
      color: 'from-pink-500 to-pink-600',
      available: false
    },
    {
      icon: Settings,
      title: 'Configurações',
      description: 'Configure produtos, metas, integrações e preferências.',
      href: '/settings',
      color: 'from-gray-500 to-gray-600',
      available: false
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#0F1419] to-[#0B0F19]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 mb-6">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Mottivme Command Center</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transforme Dados em
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Resultados Previsíveis
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Central de comando para planejamento, análise e execução de estratégias de vendas.
            Conecte suas ferramentas, trace metas e acompanhe resultados em tempo real.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
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
                {/* Gradient Overlay */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  bg-gradient-to-br ${feature.color} rounded-2xl
                  ${feature.available ? 'blur-3xl -z-10' : ''}
                `} />

                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-xl mb-4
                  flex items-center justify-center
                  bg-gradient-to-br ${feature.color}
                  shadow-lg
                `}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  {feature.title}
                  {!feature.available && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                      Em breve
                    </span>
                  )}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow */}
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

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-400">Automatizado</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">Real-time</div>
            <div className="text-gray-400">Sincronização</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">0</div>
            <div className="text-gray-400">Trabalho Manual</div>
          </div>
        </div>
      </div>
    </main>
  )
}
