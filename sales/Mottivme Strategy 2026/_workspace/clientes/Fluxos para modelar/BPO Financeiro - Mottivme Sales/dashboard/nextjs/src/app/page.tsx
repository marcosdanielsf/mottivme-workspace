import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, TrendingUp, TrendingDown, Calculator, AlertCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard Financeiro</h1>
        <p className="text-muted-foreground text-lg">
          Gestão completa do financeiro da Mottivme Sales
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="hover:bg-dashboard-accent transition-colors cursor-pointer">
          <Link href="/overview">
            <CardHeader>
              <LayoutDashboard className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Visão geral dos indicadores financeiros
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:bg-dashboard-accent transition-colors cursor-pointer">
          <Link href="/faturamento">
            <CardHeader>
              <TrendingUp className="h-8 w-8 mb-2 text-green-500" />
              <CardTitle>Faturamento</CardTitle>
              <CardDescription>
                Receitas e análise por categoria
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:bg-dashboard-accent transition-colors cursor-pointer">
          <Link href="/despesas">
            <CardHeader>
              <TrendingDown className="h-8 w-8 mb-2 text-red-500" />
              <CardTitle>Despesas</CardTitle>
              <CardDescription>
                Controle de despesas PF e PJ
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:bg-dashboard-accent transition-colors cursor-pointer">
          <Link href="/simulador">
            <CardHeader>
              <Calculator className="h-8 w-8 mb-2 text-blue-500" />
              <CardTitle>Simulador</CardTitle>
              <CardDescription>
                Simulação de fluxo de caixa
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:bg-dashboard-accent transition-colors cursor-pointer">
          <Link href="/inadimplencia">
            <CardHeader>
              <AlertCircle className="h-8 w-8 mb-2 text-yellow-500" />
              <CardTitle>Inadimplência</CardTitle>
              <CardDescription>
                Gestão de cobranças e inadimplentes
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/overview">
            <Button>Ver Dashboard Completo</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
