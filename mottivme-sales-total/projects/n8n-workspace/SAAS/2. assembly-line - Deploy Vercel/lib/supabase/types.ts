export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          phone: string | null
          timezone: string
          plan: 'free' | 'pro' | 'business'
          plan_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          phone?: string | null
          timezone?: string
          plan?: 'free' | 'pro' | 'business'
          plan_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          phone?: string | null
          timezone?: string
          plan?: 'free' | 'pro' | 'business'
          plan_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'briefing' | 'generating' | 'complete' | 'archived'
          current_phase: string
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'briefing' | 'generating' | 'complete' | 'archived'
          current_phase?: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: 'briefing' | 'generating' | 'complete' | 'archived'
          current_phase?: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      briefings: {
        Row: {
          id: string
          project_id: string
          produto: string | null
          avatar_descricao: string | null
          dor_principal: string | null
          desejo_principal: string | null
          transformacao: string | null
          diferencial: string | null
          ticket_medio: string | null
          tipo_funil: string | null
          nicho: string | null
          canais_principais: string[] | null
          tom_comunicacao: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          produto?: string | null
          avatar_descricao?: string | null
          dor_principal?: string | null
          desejo_principal?: string | null
          transformacao?: string | null
          diferencial?: string | null
          ticket_medio?: string | null
          tipo_funil?: string | null
          nicho?: string | null
          canais_principais?: string[] | null
          tom_comunicacao?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          produto?: string | null
          avatar_descricao?: string | null
          dor_principal?: string | null
          desejo_principal?: string | null
          transformacao?: string | null
          diferencial?: string | null
          ticket_medio?: string | null
          tipo_funil?: string | null
          nicho?: string | null
          canais_principais?: string[] | null
          tom_comunicacao?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clone_experts: {
        Row: {
          id: string
          project_id: string
          dna_psicologico: Json | null
          engenharia_reversa: Json | null
          configuracao_clone: Json | null
          system_prompt: string | null
          analise_concorrentes: Json | null
          oportunidades_diferenciacao: Json | null
          tendencias_nicho: Json | null
          concorrentes_internacionais: Json | null
          concorrentes_brasileiros: Json | null
          sintese_estrategica: Json | null
          quality_score: number
          status: 'pending' | 'processing' | 'ready' | 'error'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          dna_psicologico?: Json | null
          engenharia_reversa?: Json | null
          configuracao_clone?: Json | null
          system_prompt?: string | null
          analise_concorrentes?: Json | null
          oportunidades_diferenciacao?: Json | null
          tendencias_nicho?: Json | null
          concorrentes_internacionais?: Json | null
          concorrentes_brasileiros?: Json | null
          sintese_estrategica?: Json | null
          quality_score?: number
          status?: 'pending' | 'processing' | 'ready' | 'error'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          dna_psicologico?: Json | null
          engenharia_reversa?: Json | null
          configuracao_clone?: Json | null
          system_prompt?: string | null
          analise_concorrentes?: Json | null
          oportunidades_diferenciacao?: Json | null
          tendencias_nicho?: Json | null
          concorrentes_internacionais?: Json | null
          concorrentes_brasileiros?: Json | null
          sintese_estrategica?: Json | null
          quality_score?: number
          status?: 'pending' | 'processing' | 'ready' | 'error'
          created_at?: string
          updated_at?: string
        }
      }
      clone_materials: {
        Row: {
          id: string
          clone_id: string
          type: 'video' | 'audio' | 'text' | 'pdf' | 'transcript'
          name: string
          file_path: string | null
          url: string | null
          duration_seconds: number | null
          size_bytes: number | null
          status: 'processing' | 'ready' | 'error'
          transcript: string | null
          extracted_traits: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          clone_id: string
          type: 'video' | 'audio' | 'text' | 'pdf' | 'transcript'
          name: string
          file_path?: string | null
          url?: string | null
          duration_seconds?: number | null
          size_bytes?: number | null
          status?: 'processing' | 'ready' | 'error'
          transcript?: string | null
          extracted_traits?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          clone_id?: string
          type?: 'video' | 'audio' | 'text' | 'pdf' | 'transcript'
          name?: string
          file_path?: string | null
          url?: string | null
          duration_seconds?: number | null
          size_bytes?: number | null
          status?: 'processing' | 'ready' | 'error'
          transcript?: string | null
          extracted_traits?: Json | null
          created_at?: string
        }
      }
      contents: {
        Row: {
          id: string
          project_id: string
          type: 'post' | 'reel' | 'story' | 'carrossel' | 'email' | 'ad' | 'vsl_script' | 'webinar_script'
          title: string | null
          body: string | null
          hook: string | null
          cta: string | null
          slides: Json | null
          subject: string | null
          preview_text: string | null
          sequence_name: string | null
          sequence_day: number | null
          ad_type: string | null
          target_audience: string | null
          status: 'draft' | 'approved' | 'rejected' | 'published'
          approved_at: string | null
          published_at: string | null
          generated_by: string | null
          generation_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: 'post' | 'reel' | 'story' | 'carrossel' | 'email' | 'ad' | 'vsl_script' | 'webinar_script'
          title?: string | null
          body?: string | null
          hook?: string | null
          cta?: string | null
          slides?: Json | null
          subject?: string | null
          preview_text?: string | null
          sequence_name?: string | null
          sequence_day?: number | null
          ad_type?: string | null
          target_audience?: string | null
          status?: 'draft' | 'approved' | 'rejected' | 'published'
          approved_at?: string | null
          published_at?: string | null
          generated_by?: string | null
          generation_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: 'post' | 'reel' | 'story' | 'carrossel' | 'email' | 'ad' | 'vsl_script' | 'webinar_script'
          title?: string | null
          body?: string | null
          hook?: string | null
          cta?: string | null
          slides?: Json | null
          subject?: string | null
          preview_text?: string | null
          sequence_name?: string | null
          sequence_day?: number | null
          ad_type?: string | null
          target_audience?: string | null
          status?: 'draft' | 'approved' | 'rejected' | 'published'
          approved_at?: string | null
          published_at?: string | null
          generated_by?: string | null
          generation_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      funnels: {
        Row: {
          id: string
          project_id: string
          name: string
          type: 'vsl' | 'webinar' | 'challenge' | 'quiz' | 'lead_magnet' | 'direct' | 'nurture'
          description: string | null
          nodes: Json
          edges: Json
          viewport: Json | null
          status: 'draft' | 'active' | 'paused' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          type: 'vsl' | 'webinar' | 'challenge' | 'quiz' | 'lead_magnet' | 'direct' | 'nurture'
          description?: string | null
          nodes?: Json
          edges?: Json
          viewport?: Json | null
          status?: 'draft' | 'active' | 'paused' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          type?: 'vsl' | 'webinar' | 'challenge' | 'quiz' | 'lead_magnet' | 'direct' | 'nurture'
          description?: string | null
          nodes?: Json
          edges?: Json
          viewport?: Json | null
          status?: 'draft' | 'active' | 'paused' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          provider: 'gohighlevel' | 'n8n' | 'meta' | 'google' | 'zapier' | 'airtable' | 'mailchimp' | 'webhook'
          name: string | null
          access_token: string | null
          refresh_token: string | null
          expires_at: string | null
          webhook_url: string | null
          api_key: string | null
          metadata: Json | null
          status: 'connected' | 'disconnected' | 'expired' | 'error'
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'gohighlevel' | 'n8n' | 'meta' | 'google' | 'zapier' | 'airtable' | 'mailchimp' | 'webhook'
          name?: string | null
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: string | null
          webhook_url?: string | null
          api_key?: string | null
          metadata?: Json | null
          status?: 'connected' | 'disconnected' | 'expired' | 'error'
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: 'gohighlevel' | 'n8n' | 'meta' | 'google' | 'zapier' | 'airtable' | 'mailchimp' | 'webhook'
          name?: string | null
          access_token?: string | null
          refresh_token?: string | null
          expires_at?: string | null
          webhook_url?: string | null
          api_key?: string | null
          metadata?: Json | null
          status?: 'connected' | 'disconnected' | 'expired' | 'error'
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          project_id: string
          phase: string | null
          agent_name: string
          agent_number: number | null
          input: Json | null
          output: Json | null
          model: string | null
          tokens_input: number | null
          tokens_output: number | null
          duration_ms: number | null
          cost_usd: number | null
          status: 'pending' | 'running' | 'complete' | 'error'
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          phase?: string | null
          agent_name: string
          agent_number?: number | null
          input?: Json | null
          output?: Json | null
          model?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          duration_ms?: number | null
          cost_usd?: number | null
          status?: 'pending' | 'running' | 'complete' | 'error'
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          phase?: string | null
          agent_name?: string
          agent_number?: number | null
          input?: Json | null
          output?: Json | null
          model?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          duration_ms?: number | null
          cost_usd?: number | null
          status?: 'pending' | 'running' | 'complete' | 'error'
          error_message?: string | null
          created_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          project_id: string
          avatar: Json | null
          avatar_detalhado: Json | null
          promessas: Json | null
          big_idea: Json | null
          mecanismo_unico: string | null
          headline_principal: string | null
          subheadlines: string[] | null
          high_ticket: Json | null
          mid_ticket: Json | null
          low_ticket: Json | null
          backend: Json | null
          frontend: Json | null
          lead_magnet: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          avatar?: Json | null
          avatar_detalhado?: Json | null
          promessas?: Json | null
          big_idea?: Json | null
          mecanismo_unico?: string | null
          headline_principal?: string | null
          subheadlines?: string[] | null
          high_ticket?: Json | null
          mid_ticket?: Json | null
          low_ticket?: Json | null
          backend?: Json | null
          frontend?: Json | null
          lead_magnet?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          avatar?: Json | null
          avatar_detalhado?: Json | null
          promessas?: Json | null
          big_idea?: Json | null
          mecanismo_unico?: string | null
          headline_principal?: string | null
          subheadlines?: string[] | null
          high_ticket?: Json | null
          mid_ticket?: Json | null
          low_ticket?: Json | null
          backend?: Json | null
          frontend?: Json | null
          lead_magnet?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      competitors: {
        Row: {
          id: string
          project_id: string
          name: string
          platform: string | null
          profile_url: string | null
          avatar_emoji: string | null
          total_ads: number
          active_ads: number
          avg_duration_days: number | null
          last_scanned_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          platform?: string | null
          profile_url?: string | null
          avatar_emoji?: string | null
          total_ads?: number
          active_ads?: number
          avg_duration_days?: number | null
          last_scanned_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          platform?: string | null
          profile_url?: string | null
          avatar_emoji?: string | null
          total_ads?: number
          active_ads?: number
          avg_duration_days?: number | null
          last_scanned_at?: string | null
          created_at?: string
        }
      }
      competitor_ads: {
        Row: {
          id: string
          competitor_id: string
          type: 'video' | 'image' | 'carousel'
          thumbnail_url: string | null
          headline: string | null
          hook: string | null
          cta: string | null
          platform: string | null
          status: string
          days_running: number | null
          engagement_level: 'high' | 'medium' | 'low' | null
          ad_url: string | null
          first_seen_at: string
          last_seen_at: string
        }
        Insert: {
          id?: string
          competitor_id: string
          type: 'video' | 'image' | 'carousel'
          thumbnail_url?: string | null
          headline?: string | null
          hook?: string | null
          cta?: string | null
          platform?: string | null
          status?: string
          days_running?: number | null
          engagement_level?: 'high' | 'medium' | 'low' | null
          ad_url?: string | null
          first_seen_at?: string
          last_seen_at?: string
        }
        Update: {
          id?: string
          competitor_id?: string
          type?: 'video' | 'image' | 'carousel'
          thumbnail_url?: string | null
          headline?: string | null
          hook?: string | null
          cta?: string | null
          platform?: string | null
          status?: string
          days_running?: number | null
          engagement_level?: 'high' | 'medium' | 'low' | null
          ad_url?: string | null
          first_seen_at?: string
          last_seen_at?: string
        }
      }
      patterns: {
        Row: {
          id: string
          project_id: string
          category: 'ganchos' | 'ctas' | 'estrutura' | 'visual' | 'copy'
          pattern_name: string
          usage_percentage: number | null
          trend: 'up' | 'down' | 'stable' | null
          examples: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          category: 'ganchos' | 'ctas' | 'estrutura' | 'visual' | 'copy'
          pattern_name: string
          usage_percentage?: number | null
          trend?: 'up' | 'down' | 'stable' | null
          examples?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          category?: 'ganchos' | 'ctas' | 'estrutura' | 'visual' | 'copy'
          pattern_name?: string
          usage_percentage?: number | null
          trend?: 'up' | 'down' | 'stable' | null
          examples?: string[] | null
          created_at?: string
        }
      }
      exports: {
        Row: {
          id: string
          project_id: string
          user_id: string | null
          destination: string
          export_type: string | null
          items_count: number | null
          file_url: string | null
          status: 'pending' | 'processing' | 'complete' | 'failed'
          error_message: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id?: string | null
          destination: string
          export_type?: string | null
          items_count?: number | null
          file_url?: string | null
          status?: 'pending' | 'processing' | 'complete' | 'failed'
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string | null
          destination?: string
          export_type?: string | null
          items_count?: number | null
          file_url?: string | null
          status?: 'pending' | 'processing' | 'complete' | 'failed'
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      dna_traits: {
        Row: {
          id: string
          clone_id: string
          category: 'tom_voz' | 'vocabulario' | 'estrutura' | 'gatilhos' | 'personalidade'
          trait: string
          examples: string[] | null
          confidence: number
          created_at: string
        }
        Insert: {
          id?: string
          clone_id: string
          category: 'tom_voz' | 'vocabulario' | 'estrutura' | 'gatilhos' | 'personalidade'
          trait: string
          examples?: string[] | null
          confidence?: number
          created_at?: string
        }
        Update: {
          id?: string
          clone_id?: string
          category?: 'tom_voz' | 'vocabulario' | 'estrutura' | 'gatilhos' | 'personalidade'
          trait?: string
          examples?: string[] | null
          confidence?: number
          created_at?: string
        }
      }
      funnel_steps: {
        Row: {
          id: string
          funnel_id: string
          type: 'abordagem' | 'ativacao' | 'qualificacao' | 'sondagem' | 'pitch' | 'rescue' | 'start' | 'end'
          title: string | null
          message: string | null
          channel: 'instagram' | 'whatsapp' | 'email' | 'sms' | null
          delay_hours: number
          position_x: number
          position_y: number
          config: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          funnel_id: string
          type: 'abordagem' | 'ativacao' | 'qualificacao' | 'sondagem' | 'pitch' | 'rescue' | 'start' | 'end'
          title?: string | null
          message?: string | null
          channel?: 'instagram' | 'whatsapp' | 'email' | 'sms' | null
          delay_hours?: number
          position_x?: number
          position_y?: number
          config?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          funnel_id?: string
          type?: 'abordagem' | 'ativacao' | 'qualificacao' | 'sondagem' | 'pitch' | 'rescue' | 'start' | 'end'
          title?: string | null
          message?: string | null
          channel?: 'instagram' | 'whatsapp' | 'email' | 'sms' | null
          delay_hours?: number
          position_x?: number
          position_y?: number
          config?: Json | null
          created_at?: string
        }
      }
      editorial_calendar: {
        Row: {
          id: string
          project_id: string
          content_id: string | null
          scheduled_date: string
          scheduled_time: string | null
          platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter' | 'facebook' | null
          status: 'scheduled' | 'published' | 'failed' | 'cancelled'
          published_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          content_id?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter' | 'facebook' | null
          status?: 'scheduled' | 'published' | 'failed' | 'cancelled'
          published_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          content_id?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          platform?: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter' | 'facebook' | null
          status?: 'scheduled' | 'published' | 'failed' | 'cancelled'
          published_at?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_project_progress: {
        Args: { p_project_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
