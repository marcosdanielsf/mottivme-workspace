import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
let supabaseInstance: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Database types
export interface Produto {
  id: string
  empresa_id: string
  nome: string
  ticket_medio: number
  taxas_estimadas: {
    cpl: number
    qualificacao: number
    agendamento_sdr: number
    comparecimento: number
    conversao_closer: number
  }
  taxas_historicas?: {
    cpl: number
    qualificacao: number
    agendamento_sdr: number
    comparecimento: number
    conversao_closer: number
    atualizado_em: string
  }
  ativo: boolean
  created_at: string
}

export interface Planejamento {
  id: string
  empresa_id: string
  produto_id: string
  mes: number
  ano: number
  dia_inicio: number
  dia_fim: number
  modo_calculo: 'forward' | 'reverse'

  // Inputs
  investimento_diario?: number
  meta_faturamento?: number
  cpl: number
  taxa_qualificacao: number
  taxa_agendamento: number
  taxa_comparecimento: number
  taxa_conversao: number
  ticket_medio: number

  // Costs
  custo_sdr: number
  custo_closer: number
  comissao_closer: number
  custo_ferramentas: number
  outros_custos: number

  // Results
  leads_projetados: number
  mqls_projetados: number
  calls_agendadas: number
  calls_realizadas: number
  vendas_projetadas: number
  faturamento_projetado: number
  sdrs_necessarios: number
  closers_necessarios: number
  investimento_total: number
  cac_projetado: number
  roas_projetado: number
  lucro_projetado: number
  margem_projetada: number

  origem_dados: 'estimated' | 'historical'
  created_at: string
  updated_at: string
}

export interface ResultadoDiario {
  id: string
  empresa_id: string
  produto_id: string
  data: string
  leads_gerados: number
  mqls_gerados: number
  calls_agendadas: number
  calls_realizadas: number
  no_shows: number
  vendas_fechadas: number
  faturamento_dia: number
  investimento_dia: number
  fonte: string
  sincronizado_em: string
}

// Export supabase getter (for direct access if needed)
export const supabase = { getClient: getSupabase }

// Helper functions
export async function getProdutos(empresaId: string): Promise<Produto[]> {
  const client = getSupabase()
  const { data, error } = await client
    .from('produtos')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('ativo', true)
    .order('nome')

  if (error) throw error
  return data || []
}

export async function getProduto(produtoId: string): Promise<Produto | null> {
  const client = getSupabase()
  const { data, error } = await client
    .from('produtos')
    .select('*')
    .eq('id', produtoId)
    .single()

  if (error) return null
  return data
}

export async function salvarPlanejamento(planejamento: Omit<Planejamento, 'id' | 'created_at' | 'updated_at'>): Promise<Planejamento> {
  const client = getSupabase()
  const { data, error } = await client
    .from('planejamentos')
    .upsert(
      {
        ...planejamento,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: 'empresa_id,produto_id,mes,ano'
      }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function carregarPlanejamento(
  empresaId: string,
  produtoId: string,
  mes: number,
  ano: number
): Promise<Planejamento | null> {
  const client = getSupabase()
  const { data, error } = await client
    .from('planejamentos')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('produto_id', produtoId)
    .eq('mes', mes)
    .eq('ano', ano)
    .single()

  if (error) return null
  return data
}

export async function getResultadosMes(
  empresaId: string,
  produtoId: string,
  mes: number,
  ano: number
): Promise<ResultadoDiario[]> {
  const client = getSupabase()
  const startDate = new Date(ano, mes, 1).toISOString().split('T')[0]
  const endDate = new Date(ano, mes + 1, 0).toISOString().split('T')[0]

  const { data, error } = await client
    .from('resultados_diarios')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('produto_id', produtoId)
    .gte('data', startDate)
    .lte('data', endDate)
    .order('data')

  if (error) throw error
  return data || []
}

export async function getTaxasHistoricas(
  empresaId: string,
  produtoId: string
): Promise<{
  cpl: number
  qualificacao: number
  agendamento: number
  comparecimento: number
  conversao: number
  meses_dados: number
} | null> {
  const client = getSupabase()
  const { data, error } = await client
    .from('taxas_historicas')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('produto_id', produtoId)
    .single()

  if (error) return null

  return {
    cpl: data.cpl_medio,
    qualificacao: data.taxa_qualificacao_media,
    agendamento: data.taxa_agendamento_media,
    comparecimento: data.taxa_comparecimento_media,
    conversao: data.taxa_conversao_media,
    meses_dados: data.meses_com_dados
  }
}

export async function getComparativoMetaReal(
  empresaId: string,
  produtoId: string,
  mes: number,
  ano: number
) {
  const client = getSupabase()
  const { data, error } = await client
    .from('vw_planejamento_vs_real')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('produto_id', produtoId)
    .eq('mes', mes)
    .eq('ano', ano)
    .single()

  if (error) return null
  return data
}
