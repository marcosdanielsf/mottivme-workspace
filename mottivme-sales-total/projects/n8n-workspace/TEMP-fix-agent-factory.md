# FIX para Agent Factory - Criar Agent Version

## SOLUÇÃO: Adicionar nó Code antes do INSERT

Adicione um nó **Code** chamado "Preparar JSON para SQL" ENTRE:
- "Preparar Dados do Agente" → **[NOVO NÓ CODE]** → "Criar Agent Version no Supabase"

### Código do novo nó:

```javascript
const dados = $input.first().json;

// Converter JSONs para strings escapadas corretamente para PostgreSQL
function pgEscape(obj) {
  if (obj === null || obj === undefined) return '{}';
  const jsonStr = JSON.stringify(obj);
  // Escapar aspas simples duplicando-as (padrão SQL)
  return jsonStr.replace(/'/g, "''");
}

return [{
  json: {
    ...dados,
    // Strings SQL-safe
    tools_config_sql: pgEscape(dados.tools_config),
    compliance_rules_sql: pgEscape(dados.compliance_rules),
    personality_config_sql: pgEscape(dados.personality_config),
    business_config_sql: pgEscape(dados.business_context)
  }
}];
```

### Depois altere a query do "Criar Agent Version no Supabase":

Mude as 4 linhas de:
```sql
'{{ JSON.stringify($json.tools_config).replace(/'/g, "''") }}'::jsonb,
'{{ JSON.stringify($json.compliance_rules).replace(/'/g, "''") }}'::jsonb,
'{{ JSON.stringify($json.personality_config).replace(/'/g, "''") }}'::jsonb,
'{{ JSON.stringify($json.business_config).replace(/'/g, "''") }}'::jsonb,
```

Para:
```sql
'{{ $json.tools_config_sql }}'::jsonb,
'{{ $json.compliance_rules_sql }}'::jsonb,
'{{ $json.personality_config_sql }}'::jsonb,
'{{ $json.business_config_sql }}'::jsonb,
```

Isso vai resolver o problema de escape!
