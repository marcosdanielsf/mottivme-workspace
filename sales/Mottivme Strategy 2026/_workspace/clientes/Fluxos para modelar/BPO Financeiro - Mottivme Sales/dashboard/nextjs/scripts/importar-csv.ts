import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xbqxivqzetaoptuyykmx.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXhpdnF6ZXRhb3B0dXl5a214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDUyNjExOCwiZXhwIjoyMDgwMTAyMTE4fQ.ayQwT-p5L84AXaKYWe_bHUjmwSRjdKsFfKohlLEVmVU'

const supabase = createClient(supabaseUrl, supabaseKey)

// Função para converter valor brasileiro (R$ 1.234,56) para número
function parseValorBrasileiro(valor: string): number {
  if (!valor || valor.trim() === '' || valor.includes('-')) {
    return 0
  }

  // Remove R$, espaços e pontos (separadores de milhar)
  // Troca vírgula por ponto (decimal)
  const numero = valor
    .replace(/R\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .trim()

  return parseFloat(numero) || 0
}

// Mapeamento de meses
const meses: { [key: string]: number } = {
  'Janeiro': 1,
  'Fevereiro': 2,
  'Março': 3,
  'Abril': 4,
  'Maio': 5,
  'Junho': 6,
  'Julho': 7,
  'Agosto': 8,
  'Setembro': 9,
  'Outubro': 10,
  'Novembro': 11,
  'Dezembro': 12,
}

interface MovimentacaoCSV {
  ano: number
  mes: string
  entradas: number
  saidas: number
  balanco: number
  margem?: number
}

async function importarDados() {
  console.log('🚀 Iniciando importação de dados financeiros...\n')

  // Ler arquivo CSV
  const csvPath = path.join(__dirname, '../../../n8n-workflows/Financeiro BPO 2025 - Central.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  // Parse CSV com suporte a aspas
  const records = parse(csvContent, {
    skip_empty_lines: true,
    relax_quotes: true,
    trim: true,
  }) as string[][]

  const movimentacoes: MovimentacaoCSV[] = []

  // Processar cada linha (pular header)
  for (let i = 1; i < records.length; i++) {
    const colunas = records[i]
    if (!colunas || colunas.length === 0) continue

    // 2024 (colunas 0-5)
    const mes2024 = colunas[0]?.trim()
    const entradas2024 = parseValorBrasileiro(colunas[2] || '')
    const saidas2024 = parseValorBrasileiro(colunas[3] || '')
    const balanco2024 = parseValorBrasileiro(colunas[4] || '')

    if (mes2024 && meses[mes2024] && (entradas2024 > 0 || saidas2024 > 0)) {
      movimentacoes.push({
        ano: 2024,
        mes: mes2024,
        entradas: entradas2024,
        saidas: saidas2024,
        balanco: balanco2024,
      })
    }

    // 2025 (colunas 6-11)
    const mes2025 = colunas[6]?.trim()
    const entradas2025 = parseValorBrasileiro(colunas[8] || '')
    const saidas2025 = parseValorBrasileiro(colunas[9] || '')
    const balanco2025 = parseValorBrasileiro(colunas[10] || '')
    const margem2025 = colunas[11]?.replace('%', '').trim()

    if (mes2025 && meses[mes2025] && (entradas2025 > 0 || saidas2025 > 0)) {
      movimentacoes.push({
        ano: 2025,
        mes: mes2025,
        entradas: entradas2025,
        saidas: saidas2025,
        balanco: balanco2025,
        margem: margem2025 ? parseFloat(margem2025) : undefined,
      })
    }
  }

  console.log(`📊 Total de movimentações encontradas: ${movimentacoes.length}\n`)

  // Buscar ou criar categorias
  const { data: categoriaReceita } = await supabase
    .from('categorias')
    .select('id')
    .eq('nome', 'Receita Geral')
    .eq('tipo', 'receita')
    .single()

  const { data: categoriaDespesa } = await supabase
    .from('categorias')
    .select('id')
    .eq('nome', 'Despesa Geral')
    .eq('tipo', 'despesa')
    .single()

  let categoriaReceitaId = categoriaReceita?.id
  let categoriaDespesaId = categoriaDespesa?.id

  // Criar categorias se não existirem
  if (!categoriaReceitaId) {
    const { data } = await supabase
      .from('categorias')
      .insert({
        nome: 'Receita Geral',
        descricao: 'Receitas importadas do CSV',
        tipo: 'receita',
        cor: '#10B981',
        ativo: true,
      })
      .select('id')
      .single()
    categoriaReceitaId = data?.id
  }

  if (!categoriaDespesaId) {
    const { data } = await supabase
      .from('categorias')
      .insert({
        nome: 'Despesa Geral',
        descricao: 'Despesas importadas do CSV',
        tipo: 'despesa',
        cor: '#EF4444',
        ativo: true,
      })
      .select('id')
      .single()
    categoriaDespesaId = data?.id
  }

  // Importar movimentações
  let importadas = 0
  let erros = 0

  for (const mov of movimentacoes) {
    const mesNumero = meses[mov.mes]
    const dataCompetencia = `${mov.ano}-${String(mesNumero).padStart(2, '0')}-01`
    const dataVencimento = `${mov.ano}-${String(mesNumero).padStart(2, '0')}-15`

    console.log(`📅 Importando: ${mov.mes}/${mov.ano}`)

    // Importar RECEITAS (Entradas)
    if (mov.entradas > 0) {
      const { error } = await supabase
        .from('movimentacoes_financeiras')
        .insert({
          descricao: `Faturamento - ${mov.mes}/${mov.ano}`,
          tipo: 'receita',
          categoria_id: categoriaReceitaId,
          valor_previsto: mov.entradas,
          valor_realizado: mov.entradas,
          data_competencia: dataCompetencia,
          data_vencimento: dataVencimento,
          data_realizado: dataVencimento,
          quitado: true,
          observacao: `Importado do CSV - Margem: ${mov.margem || 0}%`,
        })

      if (error) {
        console.error(`  ❌ Erro ao importar receita:`, error.message)
        erros++
      } else {
        console.log(`  ✅ Receita: R$ ${mov.entradas.toFixed(2)}`)
        importadas++
      }
    }

    // Importar DESPESAS (Saídas)
    if (mov.saidas > 0) {
      const { error } = await supabase
        .from('movimentacoes_financeiras')
        .insert({
          descricao: `Despesas - ${mov.mes}/${mov.ano}`,
          tipo: 'despesa',
          categoria_id: categoriaDespesaId,
          valor_previsto: mov.saidas,
          valor_realizado: mov.saidas,
          data_competencia: dataCompetencia,
          data_vencimento: dataVencimento,
          data_realizado: dataVencimento,
          quitado: true,
          observacao: `Importado do CSV - Balanço: R$ ${mov.balanco.toFixed(2)}`,
        })

      if (error) {
        console.error(`  ❌ Erro ao importar despesa:`, error.message)
        erros++
      } else {
        console.log(`  ✅ Despesa: R$ ${mov.saidas.toFixed(2)}`)
        importadas++
      }
    }

    console.log('')
  }

  console.log('\n' + '='.repeat(50))
  console.log('📈 RESUMO DA IMPORTAÇÃO')
  console.log('='.repeat(50))
  console.log(`✅ Movimentações importadas: ${importadas}`)
  console.log(`❌ Erros: ${erros}`)
  console.log(`📊 Total processado: ${importadas + erros}`)
  console.log('='.repeat(50))
  console.log('\n✨ Importação concluída!')
}

// Executar importação
importarDados().catch(console.error)
