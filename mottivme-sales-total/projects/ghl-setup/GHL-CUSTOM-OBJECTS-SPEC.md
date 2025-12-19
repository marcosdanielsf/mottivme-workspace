# GHL Custom Objects - Especificacao Completa

> **Projeto**: MOTTIVME AI Factory
> **Location ID**: cd1uyzpJox6XPt4Vct8Y
> **Data**: 2025-12-17
> **Status**: CONCLUIDO - TODOS OS CAMPOS CRIADOS VIA API

---

## 1. VISAO GERAL

Este documento especifica todos os Custom Objects necessarios para o sistema AI Factory da Mottivme.

### Status dos Custom Objects (COMPLETO - 2025-12-17)

| # | Custom Object | Key | ID | Status |
|---|---------------|-----|----|--------|
| 1 | Analises de Call | `custom_objects.anlises_de_call` | `6941f85884c73a7cf76310e4` | COMPLETO (12 campos) |
| 2 | Objecoes | `custom_objects.objecoes` | `69423eb51735be80afb8a85b` | COMPLETO (7 campos) |
| 3 | Agentes | `custom_objects.agentes` | `69423ebe4fdaa542b61176bc` | COMPLETO (10 campos) |
| 4 | Revisoes de Agente | `custom_objects.revisoes_agente` | `69423ec7e9d69dfb39d33c56` | COMPLETO (7 campos) |

> **NOTA**: Todos os Custom Objects e seus campos foram criados com sucesso via API.

---

## 2. CUSTOM OBJECT: ANALISES DE CALL

**Key**: `custom_objects.anlises_de_call`
**ID**: `6941f85884c73a7cf76310e4`
**parentId**: `A0CWgOMSEsd0WxIExo6y`

### 2.1 Campos Criados

| Campo | fieldKey | Tipo | ID |
|-------|----------|------|-----|
| Resumo da Call | `resumo_da_call` | TEXT | WxancfTg4TO5DOIfdNeO |
| Data Call | `data_call` | DATE | iREvgYffDRKUtNqO6ghk |
| Tipo | `tipo` | SINGLE_OPTIONS | ouob7FOFBIHCQpYNOkwV |
| Sentimento | `sentimento` | SINGLE_OPTIONS | LmSvwiWdwwjrPcFIQvA7 |
| Pontuacao Geral | `pontuacao_geral` | NUMERICAL | dA1UQv433FE06xndQvSj |
| Participantes | `participantes` | TEXT | c6ArSNU9LtM8m7NMNBji |
| Duracao (minutos) | `duracao_minutos` | NUMERICAL | wwVfY2RuVu8fjdepdvvf |
| Proximos Passos | `proximos_passos` | LARGE_TEXT | iJIlAFggVVrfDFUhIWlZ |
| Pontos Positivos | `pontos_positivos` | LARGE_TEXT | XPPswZU6Wf78T0lsTMZs |
| Pontos de Atencao | `pontos_atencao` | LARGE_TEXT | 1iKsMb7MMPzVr8WrKwI0 |
| Objecoes Identificadas | `objecoes_identificadas` | LARGE_TEXT | 1IIyBm3d0s2as7FlPRxh |
| Link Gravacao | `link_gravacao` | TEXT | FxdTYNX8hO3GiQ2YbaD2 |

### 2.2 Valores do Campo `tipo`

| Valor | Label |
|-------|-------|
| `diagnostico` | Diagnostico |
| `kickoff` | Kickoff |
| `acompanhamento` | Acompanhamento |
| `suporte` | Suporte |
| `alinhamento` | Alinhamento |

### 2.3 Valores do Campo `sentimento`

| Valor | Label |
|-------|-------|
| `positivo` | Positivo |
| `neutro` | Neutro |
| `negativo` | Negativo |
| `misto` | Misto |

---

## 3. CUSTOM OBJECT: OBJECOES

**Key**: `custom_objects.objecoes`
**ID**: `69423eb51735be80afb8a85b`
**parentId**: `LZ31hkt7tM8RhzyGpMzd`

### 3.1 Campos Criados

| Campo | fieldKey | Tipo | ID |
|-------|----------|------|-----|
| Tipo Objecao | `tipo_objecao` | TEXT | (primario) |
| Intensidade | `intensidade` | SINGLE_OPTIONS | RKA1VY9ck79PUf0YODZY |
| Origem | `origem` | SINGLE_OPTIONS | 9CsYHqnrMrm3zKc2luL4 |
| Status | `status` | SINGLE_OPTIONS | pJEXG2dDUVbl1CGz6wJF |
| Proxima Acao | `proxima_acao` | TEXT | Q4DrdzckwYcLObJre7Sx |
| Contexto | `contexto` | SINGLE_OPTIONS | Qz3VcNJ6mPMKkYqn8CMU |
| Descricao | `descricao` | LARGE_TEXT | EVJdZQPNzLN6iup7wQWp |

### 3.2 Valores do Campo `intensidade`

| Valor | Label |
|-------|-------|
| `1_leve` | 1 - Leve |
| `2_moderada` | 2 - Moderada |
| `3_forte` | 3 - Forte |
| `4_bloqueante` | 4 - Bloqueante |
| `5_definitiva` | 5 - Definitiva |

### 3.3 Valores do Campo `origem`

| Valor | Label |
|-------|-------|
| `call_diagnostico` | Call de Diagnostico |
| `call_followup` | Call de Follow-up |
| `whatsapp` | WhatsApp |
| `email` | Email |
| `proposta` | Proposta |

### 3.4 Valores do Campo `status`

| Valor | Label |
|-------|-------|
| `identificada` | Identificada |
| `em_tratamento` | Em Tratamento |
| `contornada` | Contornada |
| `nao_contornada` | Nao Contornada |

### 3.5 Valores do Campo `contexto`

| Valor | Label |
|-------|-------|
| `venda` | Venda |
| `renovacao` | Renovacao |
| `cancelamento` | Cancelamento |

---

## 4. CUSTOM OBJECT: AGENTES

**Key**: `custom_objects.agentes`
**ID**: `69423ebe4fdaa542b61176bc`
**parentId**: `3mjHGwJLfdnthGGXhKNo`

### 4.1 Campos Criados

| Campo | fieldKey | Tipo | ID |
|-------|----------|------|-----|
| Versao | `versao` | TEXT | (primario) |
| Status | `status` | SINGLE_OPTIONS | nlei2U4jWY0jst0iJKQd |
| Deploy Date | `deploy_date` | DATE | DcHuvVRzEHUpyOCfySX4 |
| Supabase ID | `supabase_id` | TEXT | csFpXLtnBXELSuD4fUKd |
| Prompt Summary | `prompt_summary` | LARGE_TEXT | r9f5mGion0qmzFA2DjN2 |
| Tools Enabled | `tools_enabled` | MULTIPLE_OPTIONS | LWBEalcsgQilXFHYaHUR |
| Performance Score | `performance_score` | NUMERICAL | Bd41dBPAmgtWrpQSJbXe |
| Total Conversas | `total_conversas` | NUMERICAL | z4Dw1CjzxBBSdYQaIdWw |
| Taxa Resolucao | `taxa_resolucao` | NUMERICAL | K3f29KxDc2CFvL9hmQ27 |
| Satisfacao Media | `satisfacao_media` | NUMERICAL | 8a3ZZ49XGS7jzXTMWKh0 |

### 4.2 Valores do Campo `status`

| Valor | Label |
|-------|-------|
| `draft` | Draft |
| `pending_approval` | Aguardando Aprovacao |
| `active` | Ativo |
| `deprecated` | Deprecado |
| `paused` | Pausado |

### 4.3 Valores do Campo `tools_enabled`

| Valor | Label |
|-------|-------|
| `busca_disponibilidade` | Busca Disponibilidade |
| `agendar` | Agendar |
| `enviar_arquivo` | Enviar Arquivo |
| `escalar_humano` | Escalar Humano |
| `lembretes` | Lembretes |
| `recuperacao_leads` | Recuperacao Leads |
| `cancelamento` | Cancelamento |

---

## 5. CUSTOM OBJECT: REVISOES DE AGENTE

**Key**: `custom_objects.revisoes_agente`
**ID**: `69423ec7e9d69dfb39d33c56`
**parentId**: `bjsov85nsqCqnn43naUu`

### 5.1 Campos Criados

| Campo | fieldKey | Tipo | ID |
|-------|----------|------|-----|
| Mudancas Resumo | `mudancas_resumo` | TEXT | (primario) |
| Versao Anterior | `versao_anterior` | TEXT | UOPBVwa1t2b2fgh97NPd |
| Versao Nova | `versao_nova` | TEXT | pN8QqyJvKu2SXZPNJlLw |
| Aprovado Por | `aprovado_por` | TEXT | mSmkqfJd85BnD3DYAZUX |
| Aprovado Em | `aprovado_em` | DATE | h3VyNWtqtOUsS11LnKTS |
| Motivo | `motivo` | SINGLE_OPTIONS | qL0FMySNPJRvbhaceoMj |
| Impacto Esperado | `impacto_esperado` | LARGE_TEXT | qp7rhllae4TZdXITQ5Ax |

### 5.2 Valores do Campo `motivo`

| Valor | Label |
|-------|-------|
| `melhoria` | Melhoria |
| `bug` | Bug |
| `cliente_pediu` | Cliente Pediu |
| `performance` | Performance |
| `compliance` | Compliance |
| `novo_servico` | Novo Servico |

---

## 6. ENDPOINTS API (para workflows n8n)

### Base URL
```
https://services.leadconnectorhq.com
```

### Headers Obrigatorios
```json
{
  "Authorization": "Bearer pit-fe627027-b9cb-4ea3-aaa4-149459e66a03",
  "Version": "2021-07-28",
  "Content-Type": "application/json"
}
```

### Criar Registro em Custom Object
```
POST /objects/{objectKey}/records
```

**Body exemplo para Analises de Call:**
```json
{
  "locationId": "cd1uyzpJox6XPt4Vct8Y",
  "properties": {
    "resumo_da_call": "Resumo da analise...",
    "data_call": "2025-12-17",
    "tipo": "diagnostico",
    "sentimento": "positivo",
    "pontuacao_geral": 85,
    "participantes": "Marcos, CS Team",
    "duracao_minutos": 30,
    "proximos_passos": "1. Acao 1\n2. Acao 2",
    "pontos_positivos": "Pontos positivos aqui",
    "pontos_atencao": "Pontos de atencao",
    "objecoes_identificadas": "Objecoes encontradas",
    "link_gravacao": "https://drive.google.com/..."
  }
}
```

> **IMPORTANTE**: Use os nomes curtos dos campos (ex: `resumo_da_call`), nao os fieldKeys completos.

### Buscar Registros
```
GET /objects/{objectKey}/records?locationId=cd1uyzpJox6XPt4Vct8Y
```

### Buscar Objeto com Campos
```
GET /objects/{objectId}?locationId=cd1uyzpJox6XPt4Vct8Y
```

### Atualizar Registro
```
PUT /objects/{objectKey}/records/{recordId}
```

---

## 7. REGISTRO DE TESTE CRIADO

Um registro de teste foi criado com sucesso em "Analises de Call":
- **Record ID**: `69426d2f4af39d51d5b78c04`
- **Data**: 2025-12-17T08:43:27.965Z

---

## 8. CHECKLIST DE IMPLEMENTACAO - CONCLUIDO

### Custom Objects (VIA API) - CONCLUIDO
- [x] Criar "Analises de Call" - ID: `6941f85884c73a7cf76310e4`
- [x] Criar "Objecoes" - ID: `69423eb51735be80afb8a85b`
- [x] Criar "Agentes" - ID: `69423ebe4fdaa542b61176bc`
- [x] Criar "Revisoes de Agente" - ID: `69423ec7e9d69dfb39d33c56`

### Campos (VIA API) - CONCLUIDO
- [x] Adicionar campos em "Analises de Call" (12 campos)
- [x] Adicionar campos em "Objecoes" (7 campos)
- [x] Adicionar campos em "Agentes" (10 campos)
- [x] Adicionar campos em "Revisoes de Agente" (7 campos)

### Validacao - CONCLUIDO
- [x] Testar criacao de registro via API - Record ID: `69426d2f4af39d51d5b78c04`

---

## 9. PROXIMOS PASSOS

1. Atualizar workflows n8n para usar os Custom Objects
2. Configurar associacoes com Contact quando necessario
3. Testar integracao completa com os workflows

---

**Documento atualizado por**: Claude + Marcos
**Data conclusao**: 2025-12-17
**Versao**: 3.0 - COMPLETO
