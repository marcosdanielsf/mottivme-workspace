import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xbqxivqzetaoptuyykmx.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXhpdnF6ZXRhb3B0dXl5a214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDUyNjExOCwiZXhwIjoyMDgwMTAyMTE4fQ.ayQwT-p5L84AXaKYWe_bHUjmwSRjdKsFfKohlLEVmVU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function validarDados() {
  console.log('🔍 Validando dados importados...\n')

  // Buscar todas as movimentações
  const { data: movimentacoes, error } = await supabase
    .from('movimentacoes_financeiras')
    .select('*')
    .order('data_competencia', { ascending: true })

  if (error) {
    console.error('❌ Erro ao buscar movimentações:', error)
    return
  }

  if (!movimentacoes || movimentacoes.length === 0) {
    console.log('⚠️  Nenhuma movimentação encontrada!')
    return
  }

  console.log(`📊 Total de movimentações: ${movimentacoes.length}`)

  // Agrupar por tipo
  const receitas = movimentacoes.filter(m => m.tipo === 'receita')
  const despesas = movimentacoes.filter(m => m.tipo === 'despesa')

  console.log(`💰 Receitas: ${receitas.length}`)
  console.log(`💸 Despesas: ${despesas.length}\n`)

  // Calcular totais
  const totalReceitas = receitas.reduce((acc, m) => acc + Number(m.valor_realizado || 0), 0)
  const totalDespesas = despesas.reduce((acc, m) => acc + Number(m.valor_realizado || 0), 0)
  const balanco = totalReceitas - totalDespesas

  console.log('==================================================')
  console.log('💵 RESUMO FINANCEIRO')
  console.log('==================================================')
  console.log(`Total Receitas:  R$ ${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
  console.log(`Total Despesas:  R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
  console.log(`Balanço:         R$ ${balanco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
  console.log('==================================================\n')

  // Agrupar por ano e mês
  type ResumoMensal = { receitas: number; despesas: number }
  const porMes = movimentacoes.reduce((acc, m) => {
    const mes = m.data_competencia?.substring(0, 7) || 'sem-data'
    if (!acc[mes]) {
      acc[mes] = { receitas: 0, despesas: 0 }
    }
    if (m.tipo === 'receita') {
      acc[mes].receitas += Number(m.valor_realizado || 0)
    } else {
      acc[mes].despesas += Number(m.valor_realizado || 0)
    }
    return acc
  }, {} as Record<string, ResumoMensal>)

  console.log('📅 RESUMO POR MÊS:')
  console.log('==================================================')
  const mesesOrdenados = Object.entries(porMes) as [string, ResumoMensal][]
  mesesOrdenados
    .sort()
    .forEach(([mes, valores]) => {
      const balanco = valores.receitas - valores.despesas
      console.log(`${mes}:`)
      console.log(`  Receitas: R$ ${valores.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      console.log(`  Despesas: R$ ${valores.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      console.log(`  Balanço:  R$ ${balanco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      console.log('')
    })

  console.log('✅ Validação concluída!')
}

validarDados().catch(console.error)
