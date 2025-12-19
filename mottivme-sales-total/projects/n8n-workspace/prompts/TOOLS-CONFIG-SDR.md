# TOOLS CONFIG - Agente SDR

> **Versão**: 1.0
> **Objetivo**: Definir as ferramentas (tools) disponíveis para cada tipo de agente SDR

---

## TOOLS UNIVERSAIS (Todos os agentes)

### 1. Busca_disponibilidade
**Obrigatório**: Sim
**Descrição**: Buscar horários disponíveis no calendário antes de oferecer opções ao lead

```json
{
  "name": "Busca_disponibilidade",
  "description": "Buscar/consultar por horários disponíveis antes de agendar. OBRIGATÓRIO usar antes de oferecer qualquer horário.",
  "workflow_id": "ID_DO_WORKFLOW",
  "inputs": {
    "calendar": "ID do calendário (não o nome)",
    "API_KEY": "API Key do GHL",
    "startDate": "Timestamp início (ex: 1735689600000)",
    "endDate": "Timestamp fim (ex: 1736294400000)",
    "lead_id": "ID do lead",
    "usuario_responsavel": "Nome do responsável"
  }
}
```

### 2. Agendar_reuniao
**Obrigatório**: Sim
**Descrição**: Criar agendamento no GHL após lead confirmar horário

```json
{
  "name": "Agendar_reuniao",
  "description": "Agendar uma nova reunião. Use apenas APÓS o lead confirmar o horário.",
  "workflow_id": "ID_DO_WORKFLOW",
  "inputs": {
    "API_KEY": "API Key do GHL",
    "email": "Email do lead",
    "telefone": "Telefone do lead",
    "location_id": "Location ID do GHL",
    "calendar_id": "ID do calendário",
    "startTime": "ISO 8601 (2021-06-23T03:30:00+05:30)",
    "firstName": "Primeiro nome",
    "lastName": "Sobrenome",
    "lead_id": "ID do lead",
    "tipo_reuniao": "Tipo (avaliação, consultoria, etc)",
    "usuario_responsavel": "Responsável"
  }
}
```

### 3. Adicionar_tag
**Obrigatório**: Sim
**Descrição**: Adicionar tags no contato para categorização

```json
{
  "name": "Adicionar_tag",
  "description": "Adicionar tag no contato. Use para marcar status do lead.",
  "method": "PUT",
  "url": "https://services.leadconnectorhq.com/contacts/{contact_Id}",
  "body": {
    "tags": ["tag_name"]
  },
  "tags_disponiveis": {
    "qualificado": "Lead passou nos critérios de qualificação",
    "perdido": "Lead desqualificado ou sem interesse",
    "agendou": "Lead agendou reunião",
    "no-show": "Lead não compareceu",
    "quente": "Lead com alta probabilidade de conversão"
  }
}
```

### 4. Think (Raciocínio)
**Obrigatório**: Sim
**Descrição**: Ferramenta de raciocínio interno para estruturar pensamentos

```json
{
  "name": "Think",
  "description": "Ferramenta de raciocínio interno. Use para estruturar pensamentos e lógica antes de responder. O conteúdo NÃO é mostrado ao usuário.",
  "type": "internal"
}
```

### 5. Escalar_humano
**Obrigatório**: Sim
**Descrição**: Transferir conversa para atendimento humano

```json
{
  "name": "Escalar_humano",
  "description": "Transferir para atendimento humano. Use em situações de reclamação, hostilidade ou pedidos específicos.",
  "workflow_id": "ID_DO_WORKFLOW",
  "inputs": {
    "contact_id": "ID do contato",
    "motivo": "Motivo da escalação",
    "urgencia": "baixa | media | alta | critica",
    "contexto": "Resumo da conversa até o momento"
  }
}
```

---

## TOOLS POR SEGMENTO

### CLÍNICAS MÉDICAS/ESTÉTICAS

```json
{
  "tools_adicionais": [
    {
      "name": "Atualizar_procedimento_interesse",
      "description": "Registrar qual procedimento o lead tem interesse",
      "field_id": "ID_CAMPO_GHL",
      "opcoes": ["Botox", "Preenchimento", "Harmonização", "Bioestimulador", "Outros"]
    },
    {
      "name": "Atualizar_experiencia_anterior",
      "description": "Registrar se já fez procedimento estético antes",
      "field_id": "ID_CAMPO_GHL",
      "opcoes": ["Sim - na clínica", "Sim - outro lugar", "Não"]
    },
    {
      "name": "Buscar_casos_similares",
      "description": "Buscar fotos de casos similares para mostrar ao lead (com autorização)",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "procedimento": "Tipo de procedimento",
        "faixa_etaria": "Idade aproximada"
      }
    },
    {
      "name": "Enviar_preparacao_consulta",
      "description": "Enviar orientações pré-consulta ao lead",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "tipo_consulta": "avaliação | procedimento",
        "telefone": "WhatsApp do lead"
      }
    }
  ]
}
```

### AGENTES FINANCEIROS

```json
{
  "tools_adicionais": [
    {
      "name": "Atualizar_work_permit",
      "description": "Registrar se possui work permit (EUA)",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "contact_id": "ID do contato",
        "workPermitValue": "sim | nao | em_processo"
      }
    },
    {
      "name": "Atualizar_estado",
      "description": "Registrar estado onde mora (EUA)",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "contact_id": "ID do contato",
        "estadoValue": "Nome do estado"
      }
    },
    {
      "name": "Atualizar_profissao",
      "description": "Registrar profissão/ocupação do lead",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "contact_id": "ID do contato",
        "profissaoValue": "Profissão"
      }
    },
    {
      "name": "Buscar_historias",
      "description": "Buscar histórias de sucesso de agentes para compartilhar",
      "type": "mcp",
      "endpoint": "https://mcp-endpoint/busca_historias/sse"
    },
    {
      "name": "Verificar_agendamento_existente",
      "description": "Verificar se lead já tem agendamento marcado",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "contact_id": "ID do contato",
        "telefone": "Telefone"
      }
    }
  ]
}
```

### MENTORIAS/COACHING

```json
{
  "tools_adicionais": [
    {
      "name": "Atualizar_momento_atual",
      "description": "Registrar momento atual do lead na jornada",
      "field_id": "ID_CAMPO_GHL",
      "opcoes": ["Iniciante", "Intermediário", "Avançado", "Em transição"]
    },
    {
      "name": "Atualizar_objetivo_principal",
      "description": "Registrar objetivo principal do lead",
      "field_id": "ID_CAMPO_GHL",
      "tipo": "texto_livre"
    },
    {
      "name": "Enviar_material_gratuito",
      "description": "Enviar material gratuito como isca",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "tipo_material": "ebook | video | checklist",
        "telefone": "WhatsApp"
      }
    },
    {
      "name": "Buscar_depoimentos",
      "description": "Buscar depoimentos de alunos para prova social",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "nicho": "Nicho do lead",
        "resultado_buscado": "Tipo de resultado"
      }
    }
  ]
}
```

### SERVIÇOS GERAIS

```json
{
  "tools_adicionais": [
    {
      "name": "Atualizar_tipo_servico",
      "description": "Registrar tipo de serviço desejado",
      "field_id": "ID_CAMPO_GHL",
      "opcoes": ["Consultoria", "Projeto", "Suporte", "Treinamento"]
    },
    {
      "name": "Atualizar_urgencia",
      "description": "Registrar urgência do projeto",
      "field_id": "ID_CAMPO_GHL",
      "opcoes": ["Urgente (< 1 semana)", "Normal (1-4 semanas)", "Planejado (> 1 mês)"]
    },
    {
      "name": "Enviar_portfolio",
      "description": "Enviar portfólio/cases de projetos similares",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "tipo_projeto": "Categoria do projeto",
        "telefone": "WhatsApp"
      }
    },
    {
      "name": "Gerar_proposta_inicial",
      "description": "Gerar proposta comercial inicial automatizada",
      "workflow_id": "ID_WORKFLOW",
      "inputs": {
        "tipo_servico": "Tipo",
        "escopo_resumido": "Escopo",
        "contact_id": "ID"
      }
    }
  ]
}
```

---

## ESTRUTURA JSON FINAL (tools_config.json)

```json
{
  "version": "1.0",
  "agent_id": "UUID_DO_AGENTE",
  "client_id": "UUID_DO_CLIENTE",
  "segmento": "clinica_estetica",

  "tools_universais": {
    "busca_disponibilidade": {
      "enabled": true,
      "workflow_id": "pZIcRI1PGMzbQHZZ",
      "required": true
    },
    "agendar_reuniao": {
      "enabled": true,
      "workflow_id": "u1UsmjNNpaEiwIsp",
      "required": true
    },
    "adicionar_tag": {
      "enabled": true,
      "tags_permitidas": ["qualificado", "perdido", "agendou", "no-show", "quente"],
      "required": true
    },
    "think": {
      "enabled": true,
      "required": true
    },
    "escalar_humano": {
      "enabled": true,
      "workflow_id": "ID_ESCALAR",
      "required": true
    }
  },

  "tools_segmento": {
    "atualizar_procedimento_interesse": {
      "enabled": true,
      "field_id": "campo_ghl_id",
      "opcoes": ["Botox", "Preenchimento", "Harmonização"]
    },
    "atualizar_experiencia_anterior": {
      "enabled": true,
      "field_id": "campo_ghl_id"
    },
    "buscar_casos_similares": {
      "enabled": false,
      "motivo": "Cliente não tem banco de fotos"
    },
    "enviar_preparacao_consulta": {
      "enabled": true,
      "workflow_id": "ID_WORKFLOW"
    }
  },

  "configuracoes": {
    "max_tentativas_tool": 3,
    "timeout_segundos": 30,
    "log_todas_chamadas": true,
    "fallback_humano_em_erro": true
  },

  "ghl_config": {
    "location_id": "cd1uyzpJox6XPt4Vct8Y",
    "api_key": "pit-xxx",
    "calendarios": [
      {
        "nome": "Avaliação",
        "id": "cal_123",
        "duracao": 30,
        "responsavel": "Dra. Carol"
      }
    ],
    "pipeline_id": "pipe_123",
    "estagio_inicial": "stage_123"
  },

  "created_at": "2025-12-17T00:00:00Z",
  "updated_at": "2025-12-17T00:00:00Z"
}
```

---

## MAPEAMENTO AUTOMÁTICO

A IA analisadora deve usar esta lógica para definir tools:

```javascript
function definirTools(segmento, dadosExtraidos) {
  const toolsBase = {
    busca_disponibilidade: true,
    agendar_reuniao: true,
    adicionar_tag: true,
    think: true,
    escalar_humano: true
  };

  const toolsPorSegmento = {
    clinica_medica: ['atualizar_procedimento', 'enviar_preparacao', 'buscar_casos'],
    clinica_estetica: ['atualizar_procedimento', 'enviar_preparacao', 'buscar_casos'],
    financeiro: ['atualizar_work_permit', 'atualizar_estado', 'atualizar_profissao', 'buscar_historias'],
    mentoria: ['atualizar_momento', 'atualizar_objetivo', 'enviar_material', 'buscar_depoimentos'],
    servicos: ['atualizar_tipo_servico', 'atualizar_urgencia', 'enviar_portfolio', 'gerar_proposta']
  };

  return {
    ...toolsBase,
    ...toolsPorSegmento[segmento]
  };
}
```

---

## NOTAS DE IMPLEMENTAÇÃO

1. **Tools universais** são SEMPRE habilitadas
2. **Tools de segmento** são habilitadas conforme tipo de negócio
3. **Tools customizadas** podem ser adicionadas manualmente pelo CS
4. Todas as tools devem ter **fallback para humano** em caso de erro
5. **Logs** de todas as chamadas para auditoria e melhoria
