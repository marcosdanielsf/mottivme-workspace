#!/bin/bash
# =============================================================================
# Script para criar Custom Fields faltantes no GHL
# Mottivme Sales - Dezembro 2025
# =============================================================================

LOCATION_ID="cd1uyzpJox6XPt4Vct8Y"
API_KEY="pit-fe627027-b9cb-4ea3-aaa4-149459e66a03"
BASE_URL="https://services.leadconnectorhq.com/locations/${LOCATION_ID}/customFields"

echo "🚀 Criando Custom Fields no GHL..."
echo "================================================"

# -----------------------------------------------------------------------------
# LEAD ENRICHED - Campo: Vertical
# -----------------------------------------------------------------------------
echo "1/8 - Criando campo: Vertical..."
curl -s -X POST "$BASE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vertical",
    "fieldKey": "contact.vertical",
    "dataType": "SINGLE_OPTIONS",
    "placeholder": "Selecione a vertical",
    "position": 200,
    "options": ["clinica", "financeiro", "mentor", "servico"]
  }' | jq -r '.id // "❌ Erro ou já existe"'

# -----------------------------------------------------------------------------
# LEAD ENRICHED - Campo: Lead Score
# -----------------------------------------------------------------------------
echo "2/8 - Criando campo: Lead Score..."
curl -s -X POST "$BASE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lead Score",
    "fieldKey": "contact.lead_score",
    "dataType": "NUMBER",
    "placeholder": "0-100",
    "position": 201
  }' | jq -r '.id // "❌ Erro ou já existe"'

# -----------------------------------------------------------------------------
# LEAD ENRICHED - Campo: Source (Origem)
# -----------------------------------------------------------------------------
echo "3/8 - Criando campo: Source..."
curl -s -X POST "$BASE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Source (Origem)",
    "fieldKey": "contact.source_channel",
    "dataType": "SINGLE_OPTIONS",
    "placeholder": "Selecione a origem",
    "position": 202,
    "options": ["ads_meta", "ads_google", "organico", "indicacao", "whatsapp", "instagram", "linkedin", "email", "site"]
  }' | jq -r '.id // "❌ Erro ou já existe"'

# -----------------------------------------------------------------------------
# LEAD ENRICHED - Campo: Last Agent Action
# -----------------------------------------------------------------------------
echo "4/8 - Criando campo: Last Agent Action..."
curl -s -X POST "$BASE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Última Ação do Agente",
    "fieldKey": "contact.last_agent_action",
    "dataType": "TEXT",
    "placeholder": "Ex: Enviou mensagem de follow-up",
    "position": 203
  }' | jq -r '.id // "❌ Erro ou já existe"'

# -----------------------------------------------------------------------------
# PROPOSTA - Campo: Proposal URL
# -----------------------------------------------------------------------------
echo "5/8 - Criando campo: Proposal URL..."
curl -s -X POST "$BASE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Link da Proposta",
    "fieldKey": "contact.proposal_url",
    "dataType": "TEXT",
    "placeholder": "https://propostal.vercel.app/...",
    "position": 300
  }' | jq -r '.id // "❌ Erro ou já existe"'

# -----------------------------------------------------------------------------
# PROPOSTA - Campo: Proposal Score
# -----------------------------------------------------------------------------
echo "6/8 - Criando campo: Proposal Score..."
curl -s -X POST "$BASE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Score da Proposta",
    "fieldKey": "contact.proposal_score",
    "dataType": "NUMBER",
    "placeholder": "0-100",
    "position": 301
  }' | jq -r '.id // "❌ Erro ou já existe"'

# -----------------------------------------------------------------------------
# PROPOSTA - Campo: Proposal Status
# -----------------------------------------------------------------------------
echo "7/8 - Criando campo: Proposal Status..."
curl -s -X POST "$BASE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Status da Proposta",
    "fieldKey": "contact.proposal_status",
    "dataType": "SINGLE_OPTIONS",
    "placeholder": "Selecione o status",
    "position": 302,
    "options": ["nao_enviada", "enviada", "vista", "quente", "aceita", "recusada"]
  }' | jq -r '.id // "❌ Erro ou já existe"'

# -----------------------------------------------------------------------------
# AGENT - Campo: Current Agent
# -----------------------------------------------------------------------------
echo "8/8 - Criando campo: Current Agent..."
curl -s -X POST "$BASE_URL" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agente Atual",
    "fieldKey": "contact.current_agent",
    "dataType": "SINGLE_OPTIONS",
    "placeholder": "Selecione o agente",
    "position": 102,
    "options": ["none", "secretaria", "sdr", "qualifier", "scheduler", "closer", "onboarder"]
  }' | jq -r '.id // "❌ Erro ou já existe"'

echo "================================================"
echo "✅ Script finalizado!"
echo ""
echo "Campos criados:"
echo "  - Vertical (Lead Enriched)"
echo "  - Lead Score (Lead Enriched)"
echo "  - Source Channel (Lead Enriched)"
echo "  - Last Agent Action (Lead Enriched)"
echo "  - Proposal URL (Proposta)"
echo "  - Proposal Score (Proposta)"
echo "  - Proposal Status (Proposta)"
echo "  - Current Agent (Agent)"
