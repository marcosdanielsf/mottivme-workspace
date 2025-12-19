import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xbqxivqzetaoptuyykmx.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXhpdnF6ZXRhb3B0dXl5a214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDUyNjExOCwiZXhwIjoyMDgwMTAyMTE4fQ.ayQwT-p5L84AXaKYWe_bHUjmwSRjdKsFfKohlLEVmVU'

const supabase = createClient(supabaseUrl, supabaseKey)

// Cache de clientes e categorias
const clientesCache = new Map<string, string>()
const categoriasCache = new Map<string, string>()

async function getOrCreateCliente(nome: string, pais?: string): Promise<string | null> {
  // Verificar cache
  if (clientesCache.has(nome)) {
    return clientesCache.get(nome)!
  }

  // Buscar no banco
  const { data: existente } = await supabase
    .from('clientes_fornecedores')
    .select('id')
    .eq('nome', nome)
    .single()

  if (existente) {
    clientesCache.set(nome, existente.id)
    return existente.id
  }

  // Criar novo cliente
  const tipo = nome.includes('Funcionários') || nome.includes('Impostos') ? 'fornecedor' : 'cliente'
  const tipoPessoa = pais === 'Brasil' ? 'pessoa_fisica' : pais === 'EUA' ? 'pessoa_juridica' : null

  const { data: novo, error } = await supabase
    .from('clientes_fornecedores')
    .insert({
      nome,
      tipo,
      tipo_pessoa: tipoPessoa,
      ativo: true,
    })
    .select('id')
    .single()

  if (error) {
    console.error(`Erro ao criar cliente ${nome}:`, error.message)
    return null
  }

  clientesCache.set(nome, novo.id)
  return novo.id
}

async function getOrCreateCategoria(nome: string, tipo: 'receita' | 'despesa'): Promise<string | null> {
  const key = `${tipo}-${nome}`

  // Verificar cache
  if (categoriasCache.has(key)) {
    return categoriasCache.get(key)!
  }

  // Buscar no banco
  const { data: existente } = await supabase
    .from('categorias')
    .select('id')
    .eq('nome', nome)
    .eq('tipo', tipo)
    .single()

  if (existente) {
    categoriasCache.set(key, existente.id)
    return existente.id
  }

  // Criar nova categoria
  const cores = {
    receita: '#10B981',
    despesa: '#EF4444',
  }

  const { data: nova, error } = await supabase
    .from('categorias')
    .insert({
      nome,
      tipo,
      descricao: `${tipo === 'receita' ? 'Receita' : 'Despesa'} - ${nome}`,
      cor: cores[tipo],
      ativo: true,
    })
    .select('id')
    .single()

  if (error) {
    console.error(`Erro ao criar categoria ${nome}:`, error.message)
    return null
  }

  categoriasCache.set(key, nova.id)
  return nova.id
}

async function importarEntradas() {
  console.log('💰 Importando RECEITAS (entradas)...\n')

  const csvPath = path.join(__dirname, '../../../entradas_rows - entradas_rows.csv.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  const records = parse(csvContent, {
    skip_empty_lines: true,
    columns: true,
    trim: true,
  }) as Array<{
    cliente: string
    pais: string
    produto: string
    'valor em real': string
    data_cobranca: string
    data_pagamento: string
    status: string
  }>

  let importadas = 0
  let erros = 0

  for (const row of records) {
    const valor = parseFloat(row['valor em real'] || '0')
    if (!valor || valor === 0) {
      continue
    }

    const clienteId = await getOrCreateCliente(row.cliente, row.pais)
    const categoriaId = await getOrCreateCategoria(row.produto || 'Outros', 'receita')

    if (!clienteId || !categoriaId) {
      erros++
      continue
    }

    const dataPagamento = row.data_pagamento ? row.data_pagamento.substring(0, 10) : null
    const dataVencimento = row.data_cobranca ? row.data_cobranca.substring(0, 10) : dataPagamento
    const dataCompetencia = dataVencimento
    const quitado = row.status === 'PAGO'

    const { error } = await supabase
      .from('movimentacoes_financeiras')
      .insert({
        tipo: 'receita',
        descricao: `${row.produto} - ${row.cliente}`,
        valor_previsto: valor,
        valor_realizado: quitado ? valor : null,
        data_vencimento: dataVencimento,
        data_realizado: quitado ? dataPagamento : null,
        data_competencia: dataCompetencia,
        quitado,
        cliente_fornecedor_id: clienteId,
        categoria_id: categoriaId,
        observacao: `País: ${row.pais} | Status: ${row.status}`,
        tipo_entidade: row.pais === 'Brasil' ? 'pf' : 'pj',
      })

    if (error) {
      console.error(`❌ Erro ao importar: ${row.cliente} - ${row.produto}:`, error.message)
      erros++
    } else {
      console.log(`✅ ${row.cliente} - ${row.produto}: R$ ${valor.toFixed(2)} [${row.status}]`)
      importadas++
    }
  }

  console.log(`\n📊 Receitas: ${importadas} importadas, ${erros} erros\n`)
  return { importadas, erros }
}

async function importarDespesas() {
  console.log('💸 Importando DESPESAS (saídas)...\n')

  const csvPath = path.join(__dirname, '../../../despesas_rows - despesas_rows.csv.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  const records = parse(csvContent, {
    skip_empty_lines: true,
    columns: true,
    trim: true,
  }) as Array<{
    tipo: string
    categoria: string
    valor: string
    data_pagamento: string
    status: string
  }>

  let importadas = 0
  let erros = 0

  for (const row of records) {
    const valor = parseFloat(row.valor || '0')
    if (!valor || valor === 0) {
      continue
    }

    // Usar 'tipo' como nome do fornecedor e 'categoria' como categoria
    const fornecedorNome = row.tipo || 'Diversos'
    const categoriaNome = row.categoria || row.tipo || 'Outras Despesas'

    const fornecedorId = await getOrCreateCliente(fornecedorNome)
    const categoriaId = await getOrCreateCategoria(categoriaNome, 'despesa')

    if (!categoriaId) {
      erros++
      continue
    }

    const dataPagamento = row.data_pagamento ? row.data_pagamento.substring(0, 10) : null
    const dataVencimento = dataPagamento
    const dataCompetencia = dataPagamento
    const quitado = row.status === 'PAGO'

    const { error } = await supabase
      .from('movimentacoes_financeiras')
      .insert({
        tipo: 'despesa',
        descricao: row.categoria ? `${row.tipo} - ${row.categoria}` : row.tipo,
        valor_previsto: valor,
        valor_realizado: quitado ? valor : null,
        data_vencimento: dataVencimento,
        data_realizado: quitado ? dataPagamento : null,
        data_competencia: dataCompetencia,
        quitado,
        cliente_fornecedor_id: fornecedorId,
        categoria_id: categoriaId,
        observacao: `Status: ${row.status}`,
      })

    if (error) {
      console.error(`❌ Erro ao importar: ${row.tipo}:`, error.message)
      erros++
    } else {
      console.log(`✅ ${row.tipo}: R$ ${valor.toFixed(2)} [${row.status}]`)
      importadas++
    }
  }

  console.log(`\n📊 Despesas: ${importadas} importadas, ${erros} erros\n`)
  return { importadas, erros }
}

async function main() {
  console.log('🚀 Iniciando importação detalhada de dados financeiros...\n')

  const receitas = await importarEntradas()
  const despesas = await importarDespesas()

  console.log('==================================================')
  console.log('📈 RESUMO FINAL DA IMPORTAÇÃO')
  console.log('==================================================')
  console.log(`✅ Receitas importadas: ${receitas.importadas}`)
  console.log(`❌ Erros em receitas: ${receitas.erros}`)
  console.log(`✅ Despesas importadas: ${despesas.importadas}`)
  console.log(`❌ Erros em despesas: ${despesas.erros}`)
  console.log(`📊 Total: ${receitas.importadas + despesas.importadas} movimentações`)
  console.log('==================================================')
  console.log('\n✨ Importação concluída!')
}

main().catch(console.error)
