'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react'

interface ExtratoPendente {
  extrato_id: string
  data_transacao: string
  descricao_extrato: string
  valor_extrato: number
  tipo_extrato: string
  conta_bancaria: string
  movimentacao_id: string | null
  descricao_movimentacao: string | null
  valor_movimentacao: number | null
  diferenca_valor: number | null
}

interface ContaBancaria {
  id: string
  nome: string
  saldo_atual: number
}

export default function ConciliacaoPage() {
  const [pendentes, setPendentes] = useState<ExtratoPendente[]>([])
  const [contas, setContas] = useState<ContaBancaria[]>([])
  const [loading, setLoading] = useState(true)
  const [conciliando, setConciliando] = useState<string | null>(null)

  async function loadData() {
    setLoading(true)

    // Carregar itens pendentes de conciliacao
    const { data: pendentesData } = await supabase
      .from('vw_conciliacao_pendente')
      .select('*')
      .order('data_transacao', { ascending: false })
      .limit(50)

    setPendentes(pendentesData || [])

    // Carregar contas bancarias
    const { data: contasData } = await supabase
      .from('contas_bancarias')
      .select('id, nome, saldo_atual')
      .eq('ativo', true)

    setContas(contasData || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function conciliar(extratoId: string, movimentacaoId: string) {
    setConciliando(extratoId)

    const { error } = await supabase
      .from('extrato_bancario')
      .update({
        conciliado: true,
        movimentacao_id: movimentacaoId,
        conciliado_em: new Date().toISOString(),
      })
      .eq('id', extratoId)

    if (error) {
      console.error('Erro ao conciliar:', error)
      alert('Erro ao conciliar item')
    } else {
      // Recarregar dados
      loadData()
    }

    setConciliando(null)
  }

  async function ignorar(extratoId: string) {
    setConciliando(extratoId)

    const { error } = await supabase
      .from('extrato_bancario')
      .update({
        conciliado: true,
        conciliado_em: new Date().toISOString(),
      })
      .eq('id', extratoId)

    if (error) {
      console.error('Erro ao ignorar:', error)
      alert('Erro ao ignorar item')
    } else {
      loadData()
    }

    setConciliando(null)
  }

  const totalPendentes = pendentes.length
  const totalValorCreditos = pendentes
    .filter(p => p.tipo_extrato === 'credito')
    .reduce((sum, p) => sum + (p.valor_extrato || 0), 0)
  const totalValorDebitos = pendentes
    .filter(p => p.tipo_extrato === 'debito')
    .reduce((sum, p) => sum + (p.valor_extrato || 0), 0)
  const comMatch = pendentes.filter(p => p.movimentacao_id).length

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Conciliacao Bancaria</h1>
          <p className="text-muted-foreground">
            Compare os extratos bancarios com as movimentacoes do sistema
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Itens Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">{totalPendentes}</p>
            <p className="text-xs text-muted-foreground mt-1">Aguardando conciliacao</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Com Match Sugerido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{comMatch}</p>
            <p className="text-xs text-muted-foreground mt-1">Correspondencias encontradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Creditos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(totalValorCreditos)}</p>
            <p className="text-xs text-muted-foreground mt-1">Total de entradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Debitos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalValorDebitos)}</p>
            <p className="text-xs text-muted-foreground mt-1">Total de saidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Saldos das Contas */}
      <Card>
        <CardHeader>
          <CardTitle>Saldos das Contas Bancarias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {contas.map(conta => (
              <div
                key={conta.id}
                className="p-4 bg-dashboard-card rounded-lg border border-dashboard-border"
              >
                <p className="text-sm text-muted-foreground">{conta.nome}</p>
                <p className={`text-xl font-bold ${(conta.saldo_atual || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(conta.saldo_atual || 0)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pendentes */}
      <Card>
        <CardHeader>
          <CardTitle>Itens Pendentes de Conciliacao</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pendentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Check className="h-12 w-12 mb-4 text-green-500" />
              <p>Todos os itens estao conciliados!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dashboard-border">
                    <th className="text-left py-3 px-4">Data</th>
                    <th className="text-left py-3 px-4">Conta</th>
                    <th className="text-left py-3 px-4">Descricao Extrato</th>
                    <th className="text-right py-3 px-4">Valor</th>
                    <th className="text-left py-3 px-4">Match Sugerido</th>
                    <th className="text-center py-3 px-4">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {pendentes.map((item) => (
                    <tr key={item.extrato_id} className="border-b border-dashboard-border/50 hover:bg-dashboard-card/50">
                      <td className="py-3 px-4">
                        {new Date(item.data_transacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">{item.conta_bancaria}</td>
                      <td className="py-3 px-4 max-w-[200px] truncate">
                        {item.descricao_extrato}
                      </td>
                      <td className={`text-right py-3 px-4 font-medium ${item.tipo_extrato === 'credito' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.tipo_extrato === 'credito' ? '+' : '-'}
                        {formatCurrency(item.valor_extrato || 0)}
                      </td>
                      <td className="py-3 px-4">
                        {item.movimentacao_id ? (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {item.descricao_movimentacao}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs">Sem match</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {item.movimentacao_id && (
                            <button
                              onClick={() => conciliar(item.extrato_id, item.movimentacao_id!)}
                              disabled={conciliando === item.extrato_id}
                              className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 disabled:opacity-50"
                              title="Confirmar conciliacao"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => ignorar(item.extrato_id)}
                            disabled={conciliando === item.extrato_id}
                            className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 disabled:opacity-50"
                            title="Ignorar item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
