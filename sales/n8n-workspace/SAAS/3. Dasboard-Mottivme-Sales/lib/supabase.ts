import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a dummy client for build time if env vars are not set
let supabase: SupabaseClient

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Placeholder for build time - will be properly initialized at runtime
  supabase = null as unknown as SupabaseClient
}

export { supabase }

// Types for our database tables
export interface Lead {
  id: number
  nome: string
  email: string | null
  telefone: string | null
  fonte_lead: string
  canal_chat: "instagram" | "whatsapp" | null
  tem_permissao_trabalho: boolean
  status: "prospectado" | "lead" | "qualificado" | "agendado" | "no_show" | "call_realizada" | "ganho" | "perdido"
  usuario_responsavel_id: number | null
  equipe: "equipe-a" | "equipe-b"
  data_prospeccao: string
  data_qualificacao: string | null
  data_agendamento: string | null
  data_call: string | null
  data_fechamento: string | null
  ticket_medio: number | null
  valor_fechamento: number | null
  data_criacao: string
  data_atualizacao: string
}

export interface Usuario {
  id: number
  nome: string
  email: string
  avatar_url: string | null
  tipo_usuario: "SDR" | "CLOSER" | "ADMIN"
  equipe: "equipe-a" | "equipe-b"
  ativo: boolean
  data_criacao: string
  data_atualizacao: string
}

export interface LeadWithUser extends Lead {
  usuario_responsavel?: Usuario
}
