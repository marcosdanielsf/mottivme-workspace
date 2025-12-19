# Guia de Instalação e Uso - Agente Financeiro IA

## 📋 Visão Geral

O Agente Financeiro IA é um assistente inteligente que processa movimentações financeiras via WhatsApp. Ele utiliza GPT-4 para entender comandos em linguagem natural e realizar operações no banco de dados Supabase.

## 🎯 Funcionalidades

- ✅ Consultar clientes/fornecedores
- ✅ Listar categorias financeiras
- ✅ Buscar movimentações financeiras
- ✅ Salvar novas movimentações (com confirmação do usuário)
- ✅ Criar novos clientes/fornecedores (com confirmação do usuário)
- ✅ Processar comprovantes de pagamento
- ✅ Validar dados antes de salvar

## 📦 Arquivos do Sistema

### Workflows Principais
1. **4-agente-financeiro-ia.json** - Agente principal com IA
2. **tool-buscar-cliente.json** - Ferramenta para buscar clientes
3. **tool-salvar-movimentacao.json** - Ferramenta para salvar movimentações
4. **tool-criar-cliente.json** - Ferramenta para criar clientes

### Workflows Existentes (já importados)
- Workflow 1: Recepção de mensagens WhatsApp
- Workflow 2: Processamento de comprovantes
- Workflow 3: Consultas e relatórios

## 🔧 Instalação

### Passo 1: Importar Tool Workflows

Importe os 3 workflows de ferramentas na seguinte ordem:

```
1. tool-buscar-cliente.json
2. tool-criar-cliente.json
3. tool-salvar-movimentacao.json
```

**Como importar:**
1. Acesse n8n
2. Clique em "Import from File"
3. Selecione o arquivo JSON
4. Clique em "Import"
5. Salve o workflow (Ctrl + S)

### Passo 2: Importar Agente Principal

Importe o arquivo principal:

```
4-agente-financeiro-ia.json
```

### Passo 3: Configurar Credenciais

O agente necessita de 2 credenciais:

#### a) OpenAI API
1. No workflow do agente, clique no nó "OpenAI GPT-4"
2. Clique em "Create New Credential"
3. Insira sua API Key da OpenAI
4. Salve

#### b) Supabase PostgreSQL
1. Nos nós PostgreSQL, clique em "Credential to connect with"
2. Selecione a credencial existente "Supabase - BPO Financeiro"
3. Ou crie uma nova com:
   - **Host**: Seu projeto Supabase
   - **Database**: postgres
   - **User**: postgres
   - **Password**: Sua senha do Supabase
   - **Port**: 5432
   - **SSL**: Enabled

### Passo 4: Ativar Workflows

Ative todos os workflows importados:
1. Abra cada workflow
2. Clique no toggle "Active" no canto superior direito
3. Confirme a ativação

## 🚀 Como Usar

### Via WhatsApp

O agente responde a comandos em linguagem natural. Exemplos:

#### Consultar Cliente
```
Buscar cliente com CPF 123.456.789-00
Qual o telefone da empresa XYZ?
```

#### Registrar Receita
```
Recebi R$ 1.500,00 do cliente João Silva hoje
Venda de consultoria para empresa ABC, R$ 5.000,00, vencimento 15/12/2024
```

#### Registrar Despesa
```
Paguei R$ 350,00 de internet hoje
Despesa com fornecedor XYZ, R$ 2.000,00, vence dia 20
```

#### Consultar Movimentações
```
Mostrar movimentações de dezembro
Quais são as despesas pendentes?
Receitas pagas este mês
```

### Fluxo de Confirmação

Para operações de escrita (salvar movimentação, criar cliente), o agente:

1. ✅ Extrai os dados da mensagem
2. ✅ Valida os dados obrigatórios
3. ✅ Envia mensagem de confirmação ao usuário
4. ⏳ Aguarda confirmação ("sim", "confirma", "ok")
5. ✅ Executa a operação
6. ✅ Retorna mensagem de sucesso

**Exemplo de confirmação:**
```
Agente: Confirmo os dados para salvar:
- Tipo: Receita
- Descrição: Venda consultoria
- Valor: R$ 5.000,00
- Vencimento: 15/12/2024
- Cliente: João Silva

Confirma? (Responda sim/não)

Usuário: sim

Agente: ✅ Movimentação salva com sucesso! ID: abc-123-def
```

## 🛠️ Ferramentas do Agente

### 1. Buscar Cliente/Fornecedor
- **Tipo**: PostgreSQL Tool (read-only)
- **Parâmetros**: nome_busca, documento_busca, telefone_busca
- **Retorna**: id, nome, documento, telefone, email, tipo, ativo

### 2. Listar Categorias Financeiras
- **Tipo**: PostgreSQL Tool (read-only)
- **Parâmetros**: tipo_categoria (receita/despesa)
- **Retorna**: id, nome, tipo, descrição, cor, ícone

### 3. Buscar Movimentações
- **Tipo**: PostgreSQL Tool (read-only)
- **Parâmetros**: tipo, quitado, data_inicial, data_final
- **Retorna**: id, tipo, descrição, valor_previsto, data_vencimento, quitado, cliente

### 4. Salvar Movimentação
- **Tipo**: Workflow Tool (write)
- **Parâmetros**: tipo, descrição, valor_previsto, data_vencimento, quitado, tipo_entidade, categoria_id, cliente_fornecedor_id
- **Retorna**: success, message, movimentacao_id

### 5. Criar Cliente/Fornecedor
- **Tipo**: Workflow Tool (write)
- **Parâmetros**: nome, documento, telefone, email, tipo, endereco
- **Retorna**: success, message, cliente_id, nome, documento

## 📊 Validações Automáticas

O agente valida automaticamente:

### Valores
- ✅ Valores devem ser positivos
- ✅ Formato: R$ 1.234,56

### Datas
- ✅ Formato: DD/MM/YYYY ou YYYY-MM-DD
- ✅ Datas futuras permitidas para vencimentos
- ✅ Datas passadas permitidas para quitações

### Tipo de Entidade
- ✅ "PF" ou "pf" para Pessoa Física
- ✅ "PJ" ou "pj" para Pessoa Jurídica

### Documentos
- ✅ CPF: 11 dígitos (XXX.XXX.XXX-XX)
- ✅ CNPJ: 14 dígitos (XX.XXX.XXX/XXXX-XX)

### Duplicatas
- ✅ Verifica se movimentação já existe antes de salvar
- ✅ Compara: descrição, valor, data, cliente

### Categorias
- ✅ Valida se categoria existe e está ativa
- ✅ Valida se tipo da categoria corresponde ao tipo da movimentação

## 🔍 Casos Especiais

### Dados Incompletos
Se faltarem dados obrigatórios, o agente solicita:
```
Agente: Para salvar a movimentação, preciso das seguintes informações:
- Valor da movimentação
- Data de vencimento
- Descrição detalhada

Por favor, forneça esses dados.
```

### Cliente Não Encontrado
```
Agente: Não encontrei nenhum cliente com esse documento. Deseja cadastrar um novo cliente?

Usuário: sim

Agente: Por favor, forneça os dados do cliente:
- Nome completo
- CPF/CNPJ
- Telefone
- Email (opcional)
```

### Categoria Não Especificada
O agente sugere categorias disponíveis:
```
Agente: Não identifiquei a categoria. Categorias disponíveis para despesas:
1. Folha de Pagamento
2. Utilities
3. Marketing
4. Infraestrutura

Qual categoria deseja usar?
```

## 📝 Logs e Monitoramento

Todas as operações são registradas em `logs_automacao`:
- ✅ Tipo de workflow
- ✅ Status (sucesso/erro)
- ✅ Dados de entrada
- ✅ Dados de saída
- ✅ Tempo de execução
- ✅ Tokens usados (GPT-4)
- ✅ Custo estimado

**Consultar logs:**
```sql
SELECT * FROM logs_automacao
WHERE tipo_workflow = 'agente_financeiro'
ORDER BY created_at DESC
LIMIT 10;
```

## 🐛 Troubleshooting

### Agente não responde
1. Verifique se o workflow está ativo
2. Verifique credenciais OpenAI
3. Verifique conexão com Supabase
4. Consulte logs de execução no n8n

### Erro ao salvar movimentação
1. Verifique se cliente_id existe (se fornecido)
2. Verifique se categoria_id existe
3. Verifique formato de data (YYYY-MM-DD)
4. Verifique se tipo_entidade é "PF" ou "PJ"

### Tool Workflow não encontrado
1. Verifique se os 3 tool workflows foram importados
2. Verifique se os workflows estão salvos
3. Verifique se os nomes dos workflows correspondem exatamente:
   - `[TOOL] Buscar Cliente/Fornecedor`
   - `[TOOL] Salvar Movimentação Financeira`
   - `[TOOL] Criar Cliente/Fornecedor`

### Credenciais inválidas
1. OpenAI: Verifique se API Key está correta e tem saldo
2. Supabase: Verifique host, database, user, password
3. Teste conexão manualmente em cada nó

## 🔐 Segurança

### Permissões de Leitura (Read-Only Tools)
- ✅ Buscar Cliente/Fornecedor
- ✅ Listar Categorias
- ✅ Buscar Movimentações

Estes tools usam PostgreSQL direto (read-only). Não podem alterar dados.

### Permissões de Escrita (Write Tools)
- ⚠️ Salvar Movimentação (requer confirmação)
- ⚠️ Criar Cliente (requer confirmação)

Estes tools usam Workflow Tools com validação e confirmação obrigatória do usuário.

### Row Level Security (RLS)
O Supabase possui RLS ativado. Certifique-se de que as políticas permitem:
- SELECT em todas as tabelas para o usuário do agente
- INSERT em `movimentacoes_financeiras` e `clientes_fornecedores`
- INSERT em `logs_automacao`

## 📈 Otimizações

### Cache de Categorias
As categorias são consultadas frequentemente. Considere:
- Armazenar em memória (Redis)
- Atualizar cache apenas quando categorias mudarem

### Limites de Consulta
Todas as queries têm LIMIT:
- Clientes: LIMIT 10
- Categorias: LIMIT 50
- Movimentações: LIMIT 20

Ajuste conforme necessário.

### Tokens GPT-4
O agente usa GPT-4 com:
- Max tokens: 4000
- Temperature: 0.3 (mais preciso)

Monitore custos em `logs_automacao.tokens_usados` e `logs_automacao.custo_estimado`.

## 🎓 Exemplos Avançados

### Processar Comprovante de Pagamento
```
Usuário: [envia foto do comprovante]

Agente:
- Extrai dados do comprovante (OCR via workflow 2)
- Busca cliente no banco
- Confirma dados com usuário
- Salva movimentação
- Marca como quitado
```

### Relatório Mensal
```
Usuário: Relatório de dezembro

Agente:
- Consulta movimentações do mês
- Calcula totais de receitas e despesas
- Lista receitas pendentes
- Lista despesas pendentes
- Retorna resumo formatado
```

### Cadastro Completo
```
Usuário: Nova receita de R$ 10.000 da empresa Tech Solutions CNPJ 12.345.678/0001-90, vence dia 30/12

Agente:
1. Busca cliente por CNPJ
2. Não encontra
3. Solicita confirmação para criar cliente
4. Cria cliente
5. Solicita confirmação para criar movimentação
6. Salva movimentação vinculada ao cliente
7. Retorna IDs de cliente e movimentação
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte logs em `logs_automacao`
2. Verifique execuções no n8n (Executions)
3. Teste tools individualmente no n8n
4. Verifique dados no Supabase diretamente

## ✅ Checklist de Instalação

- [ ] Banco de dados Supabase com todas as 8 tabelas criadas
- [ ] Tool workflow: tool-buscar-cliente.json importado e salvo
- [ ] Tool workflow: tool-criar-cliente.json importado e salvo
- [ ] Tool workflow: tool-salvar-movimentacao.json importado e salvo
- [ ] Agente principal: 4-agente-financeiro-ia.json importado e salvo
- [ ] Credencial OpenAI configurada no agente
- [ ] Credencial Supabase configurada em todos os nós Postgres
- [ ] Todos os 4 workflows ativados
- [ ] Teste manual: "Buscar cliente teste"
- [ ] Teste manual: "Listar categorias de receita"
- [ ] Teste completo: Criar movimentação com confirmação
- [ ] Verificar logs em logs_automacao

## 🎉 Pronto!

Seu Agente Financeiro IA está configurado e pronto para uso via WhatsApp!
