'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Calculator,
  AlertCircle,
  Home,
  LogOut,
  User,
  FileText,
  Target,
  PieChart,
  ArrowLeftRight,
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Faturamento', href: '/faturamento', icon: TrendingUp },
  { name: 'Despesas', href: '/despesas', icon: TrendingDown },
  { name: 'DRE', href: '/dre', icon: FileText },
  { name: 'Orcamento', href: '/orcamento', icon: Target },
  { name: 'Centros de Custo', href: '/centros-custo', icon: PieChart },
  { name: 'Conciliacao', href: '/conciliacao', icon: ArrowLeftRight },
  { name: 'Simulador', href: '/simulador', icon: Calculator },
  { name: 'Inadimplencia', href: '/inadimplencia', icon: AlertCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <div className="flex w-64 flex-col bg-dashboard-card border-r border-dashboard-border">
      <div className="flex h-16 items-center justify-center border-b border-dashboard-border">
        <h1 className="text-xl font-bold text-white">Mottivme Sales</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-dashboard-border p-4 space-y-2">
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  )
}
