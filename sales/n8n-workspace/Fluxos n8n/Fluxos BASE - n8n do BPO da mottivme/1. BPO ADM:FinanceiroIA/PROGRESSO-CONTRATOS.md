# Progresso: Sistema de Contratos Automaticos

**Ultima atualizacao:** 10/12/2024 (v4 - Busca flexivel + batchUpdate placeholders)
**Status:** Em desenvolvimento

---

## Objetivo

Criar um sistema completo de geracao automatica de contratos que:
1. Recebe formularios preenchidos por clientes via Monday.com
2. Notifica o admin (Marcos) sobre novos formularios
3. Permite ao admin informar os termos da negociacao via WhatsApp
4. Gera o contrato automaticamente no Google Docs
5. Envia para assinatura digital via Autentique

---

## O Que Ja Foi Feito

### 1. Banco de Dados (Supabase)

| SQL | Descricao | Status |
|-----|-----------|--------|
| `17-criar-tabela-contratos-pendentes.sql` | Tabela para armazenar formularios aguardando termos | Executado |
| `18-atualizar-contratos-pendentes-v2.sql` | Novos campos: produto, pais, nicho, moeda, budget_trafego, dias_onboarding, condicoes_especiais | Executado |
| `19-criar-tabela-templates-contrato.sql` | Tabela de templates por produto/pais/nicho | Executado |

### 2. Workflows n8n

| Workflow | Descricao | Status |
|----------|-----------|--------|
| `4-monday-forms-contrato-pendente.json` | Recebe webhook do Monday e salva em contratos_pendentes | Criado |
| `8-agente-contratos.json` | Agente IA com deteccao admin/cliente | Atualizado |
| `9-gerar-contrato-automatico.json` | Gera contrato via Google Docs + Autentique | **v4** - busca flexivel (UUID/monday_item_id/nome/email), batchUpdate para substituicoes, export PDF + Autentique |

### 3. Tools do Agente

| Tool | Descricao | Status |
|------|-----------|--------|
| `tool-buscar-cliente-contato.json` | Busca cliente por contact_id ou telefone | Corrigido |
| `tool-buscar-contrato-pendente.json` | Busca contratos aguardando termos | **Corrigido** - lista todos se sem filtro |
| `tool-atualizar-termos-contrato.json` | Atualiza termos com novos campos | Atualizado |
| `tool-gerar-contrato.json` | Gera contrato simples (texto) | Trigger atualizado |
| `tool-atualizar-cliente.json` | Atualiza dados do cliente | Trigger atualizado |

### 4. Templates de Contrato

| Arquivo | Descricao |
|---------|-----------|
| `templates/contrato-bposs-clinicas-brasil-v2.txt` | Template atualizado com novos campos |

---

## Campos Novos no Contrato

Os seguintes campos foram adicionados ao sistema:

### Dados da Negociacao (Admin informa)
- `produto` - BPOSS, BPOSS Evolution, BPOLG, Trafego, etc.
- `pais` - Brasil ou EUA (define a moeda automaticamente)
- `nicho` - Clinicas, Agente Financeiro, Mentor, etc.
- `moeda` - BRL ou USD (inferido do pais)
- `budget_trafego` - Investimento mensal em midia paga
- `dias_onboarding` - Prazo de setup (padrao 15 dias)
- `condicoes_especiais` - Acordos da call de vendas
- `observacoes_negociacao` - Anotacoes livres

### Clausulas Novas no Contrato
- SLA de comunicacao (48h)
- Prazo de onboarding
- Investimento em midia paga (se aplicavel)
- Condicoes especiais
- ANEXO I com escopo detalhado

---

## Fluxo Completo

```
[Cliente preenche formulario no Monday]
           |
           v
[Webhook dispara workflow 4-monday-forms]
           |
           v
[Salva em contratos_pendentes]
           |
           v
[Notifica Marcos via WhatsApp]
           |
           v
[Marcos informa termos ao Agente de Contratos]
           |
           v
[Agente usa tool atualizar_termos_contrato]
           |
           v
[Marcos confirma e pede para gerar]
           |
           v
[Workflow 9 copia template do Google Docs]
           |
           v
[Substitui placeholders pelos dados]
           |
           v
[Exporta como PDF]
           |
           v
[Envia ao Autentique para assinatura]
           |
           v
[Atualiza status em contratos_pendentes]
```

---

## Proximos Passos

### Pendente de Configuracao

1. **Configurar telefone do admin**
   - Arquivo: `workflows/8-agente-contratos.json`
   - Local: Node "Preparar Entrada", array `admins`
   - Substituir `'5511999999999'` pelo telefone real do Marcos

2. **Cadastrar IDs dos templates no banco**
   - Tabela: `templates_contrato`
   - Substituir `'SEU_GOOGLE_DOC_ID_AQUI'` pelos IDs reais

3. **Configurar credenciais no n8n**
   - Google Docs OAuth2
   - Autentique API (Header Auth com token)
   - Monday.com API

4. **Configurar webhook no Monday.com**
   - Board: "1. Forms contrato cliente - BPOSS"
   - URL: Pegar do workflow 4 ou 9 apos ativar

### Pendente de Desenvolvimento

1. ~~**Integrar Autentique corretamente**~~ FEITO
   - ~~O envio atual precisa ser ajustado para multipart/form-data~~
   - ~~Necessario enviar o PDF como arquivo binario~~
   - Adicionado no "Exportar como PDF" que exporta o Google Doc e envia Base64 para Autentique

2. ~~**Corrigir busca de contrato**~~ FEITO (v4)
   - Busca flexivel por: UUID, monday_item_id (numerico), nome parcial, email parcial
   - Prioriza match exato por ID, depois nome/email

3. ~~**Corrigir substituicao de placeholders**~~ FEITO (v4)
   - Alterado de no Google Docs nativo (1 substituicao) para HTTP Request com batchUpdate
   - Agora substitui TODOS os 20+ placeholders de uma vez

4. **Adicionar workflow de notificacao**
   - Quando Autentique confirmar assinatura, atualizar contratos_pendentes
   - Notificar Marcos que contrato foi assinado

5. ~~**Criar tool gerar_contrato_google_docs**~~ FEITO
   - Tool ja existe no agente: `gerar_contrato_google_docs`
   - Conectado ao workflow 9

---

## Estrutura de Arquivos

```
BPO FinanceiroIA/
├── workflows/
│   ├── 8-agente-contratos.json          # Agente principal (admin/cliente)
│   ├── 9-gerar-contrato-automatico.json # Geracao via Google Docs
│   ├── 4-monday-forms-contrato-pendente.json
│   ├── tool-buscar-contrato-pendente.json
│   ├── tool-atualizar-termos-contrato.json
│   └── tool-buscar-cliente-contato.json
├── sql/
│   ├── 17-criar-tabela-contratos-pendentes.sql
│   ├── 18-atualizar-contratos-pendentes-v2.sql
│   └── 19-criar-tabela-templates-contrato.sql
├── templates/
│   ├── contrato-bposs-clinicas-brasil-v2.txt    # Versao atualizada
│   └── contrato-bposs-clinicas-brasil-original.txt # Original
├── referencias/
│   └── make-blueprint-contratos.json    # Blueprint Make.com original
└── PROGRESSO-CONTRATOS.md (este arquivo)
```

---

## Produtos e Templates

| Produto | Pais | Nicho | Moeda | Template |
|---------|------|-------|-------|----------|
| BPOSS | Brasil | Clinicas | BRL | A cadastrar |
| BPOSS | EUA | Clinicas | USD | A cadastrar |
| BPOSS Evolution | Brasil | - | BRL | A cadastrar |
| BPOLG | Brasil | - | BRL | A cadastrar |
| Trafego | Brasil | - | BRL | A cadastrar |
| Trafego + Social Media | Brasil | - | BRL | A cadastrar |
| Implementacao CRM | Brasil | - | BRL | A cadastrar |

---

## Como Retomar o Trabalho

Quando voltar a trabalhar neste projeto:

1. **Leia este documento** para entender o contexto
2. **Verifique a lista de proximos passos** acima
3. **Execute os SQLs** se ainda nao foram executados
4. **Configure as credenciais** no n8n
5. **Teste o fluxo** enviando uma mensagem de admin ao agente

### Comandos Uteis

```sql
-- Ver contratos pendentes
SELECT nome, status, produto, pais, valor_mensal, created_at
FROM contratos_pendentes
ORDER BY created_at DESC;

-- Ver templates cadastrados
SELECT nome, produto, pais, nicho, moeda, ativo
FROM templates_contrato;
```

---

## Referencias

- Blueprint Make.com original: `referencias/make-blueprint-contratos.json`
- Template original: `templates/contrato-bposs-clinicas-brasil-original.txt`
- Template atualizado: `templates/contrato-bposs-clinicas-brasil-v2.txt`
