#!/usr/bin/env python3
"""
Script de Migração SEGURO: Excel → Supabase
Versão melhorada com proteção contra duplicatas
"""

import pandas as pd
from supabase import create_client, Client
from datetime import datetime
import re
from typing import Dict, List, Optional
import sys

# ===================================
# CONFIGURAÇÃO SUPABASE
# ===================================

SUPABASE_URL = "https://xbqxivqzetaoptuyykmx.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXhpdnF6ZXRhb3B0dXl5a214Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDUyNjExOCwiZXhwIjoyMDgwMTAyMTE4fQ.ayQwT-p5L84AXaKYWe_bHUjmwSRjdKsFfKohlLEVmVU"

# Inicializar cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ===================================
# CAMINHOS DOS ARQUIVOS
# ===================================

BASE_PATH = "/Users/marcosdaniels/n8n-mcp/Fluxos para modelar/BPO Financeiro - Mottivme Sales/Relatórios/"

ARQUIVOS = {
    'despesas_pf_pj': BASE_PATH + "DESPESAS PF E PJ.xlsx",
}

# ===================================
# VERIFICAR SE JÁ EXISTEM DADOS
# ===================================

def verificar_dados_existentes():
    """Verifica se já existem dados no banco"""
    print("🔍 Verificando dados existentes no banco...")

    contagens = {}
    tabelas = [
        'movimentacoes_financeiras',
        'clientes_fornecedores',
        'categorias',
        'contas_bancarias'
    ]

    for tabela in tabelas:
        try:
            resultado = supabase.table(tabela).select('id', count='exact').limit(1).execute()
            count = resultado.count if hasattr(resultado, 'count') else len(resultado.data)
            contagens[tabela] = count
            print(f"  📊 {tabela}: {count} registros")
        except Exception as e:
            print(f"  ⚠️  Erro ao verificar {tabela}: {e}")
            contagens[tabela] = 0

    total = sum(contagens.values())

    if total > 0:
        print(f"\n⚠️  ATENÇÃO: Banco já contém {total} registros!")
        print("\nOpções:")
        print("  1. Continuar (pode criar duplicatas)")
        print("  2. Limpar banco e recomeçar")
        print("  3. Cancelar")

        escolha = input("\nEscolha (1/2/3): ").strip()

        if escolha == '2':
            print("\n🗑️  Limpando banco de dados...")
            limpar_banco()
            return True
        elif escolha == '3':
            print("\n❌ Migração cancelada.")
            sys.exit(0)
        else:
            print("\n⚠️  Continuando (duplicatas possíveis)...")
            return True
    else:
        print("  ✅ Banco vazio, pronto para migração!")
        return True

def limpar_banco():
    """Limpa todas as tabelas"""
    tabelas = [
        'historico_cobrancas',
        'inadimplencias',
        'documentos_financeiros',
        'extratos_bancarios',
        'movimentacoes_financeiras',
        'clientes_fornecedores',
        'categorias',
        'contas_bancarias'
    ]

    for tabela in tabelas:
        try:
            # Deletar todos os registros
            supabase.table(tabela).delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
            print(f"  ✅ {tabela} limpa")
        except Exception as e:
            print(f"  ⚠️  Erro ao limpar {tabela}: {e}")

# ===================================
# FUNÇÕES AUXILIARES (mesmas do script original)
# ===================================

def limpar_documento(doc: str) -> Optional[str]:
    """Remove caracteres especiais de CPF/CNPJ"""
    if pd.isna(doc) or doc == '':
        return None
    doc_limpo = re.sub(r'[^\d]', '', str(doc))
    return doc_limpo if doc_limpo else None

def extrair_categoria_subcategoria(categoria_str: str) -> tuple:
    """Separa 'Categoria / Subcategoria' em duas partes"""
    if pd.isna(categoria_str):
        return None, None
    partes = str(categoria_str).split('/')
    categoria = partes[0].strip() if len(partes) > 0 else None
    subcategoria = partes[1].strip() if len(partes) > 1 else None
    return categoria, subcategoria

def extrair_valor_dolar(observacao: str) -> Optional[float]:
    """Extrai valor em dólar da observação"""
    if pd.isna(observacao):
        return None
    matches = re.findall(r'\$?\s?(\d+\.?\d*)\s?(?:\$|dolares|dolar)', str(observacao), re.IGNORECASE)
    if matches:
        return float(matches[0])
    return None

def converter_data(data_str) -> Optional[str]:
    """Converte string de data para formato ISO"""
    if pd.isna(data_str):
        return None
    try:
        if isinstance(data_str, str):
            dt = datetime.strptime(data_str, '%d/%m/%Y')
            return dt.strftime('%Y-%m-%d')
        elif isinstance(data_str, datetime):
            return data_str.strftime('%Y-%m-%d')
    except:
        return None

# ===================================
# CRIAR CONTAS BANCÁRIAS
# ===================================

def criar_contas_bancarias():
    """Cria as contas bancárias padrão"""
    print("📊 Criando contas bancárias...")

    contas = [
        {'nome': 'BTG MOTTIVME', 'banco': 'BTG Pactual', 'tipo_conta': 'pj', 'ativo': True},
        {'nome': 'BTG MARCOS PF', 'banco': 'BTG Pactual', 'tipo_conta': 'pf', 'ativo': True},
        {'nome': 'BTG HALLEN PF', 'banco': 'BTG Pactual', 'tipo_conta': 'pf', 'ativo': True}
    ]

    for conta in contas:
        try:
            # Verificar se já existe
            existe = supabase.table('contas_bancarias').select('id').eq('nome', conta['nome']).execute()

            if existe.data:
                print(f"  ⏭️  Conta já existe: {conta['nome']}")
            else:
                supabase.table('contas_bancarias').insert(conta).execute()
                print(f"  ✅ Conta criada: {conta['nome']}")
        except Exception as e:
            print(f"  ⚠️  Erro ao criar {conta['nome']}: {e}")

# ===================================
# MIGRAR CATEGORIAS (COM DEDUPLICAÇÃO)
# ===================================

def migrar_categorias(df: pd.DataFrame):
    """Extrai e cria categorias únicas sem duplicatas"""
    print("📁 Migrando categorias...")

    categorias_unicas = set()

    for _, row in df.iterrows():
        cat, subcat = extrair_categoria_subcategoria(row['Categoria'])
        if cat:
            categorias_unicas.add((cat, None, row.get('Tipo', 'despesa')))
        if subcat:
            categorias_unicas.add((subcat, cat, row.get('Tipo', 'despesa')))

    categorias_criadas = {}

    # Primeiro, criar categorias principais
    for cat, pai, tipo in sorted(categorias_unicas, key=lambda x: (x[1] is not None, x[0])):
        if pai is None:
            try:
                # Verificar se já existe
                existe = supabase.table('categorias').select('id').eq('nome', cat).eq('tipo', tipo).is_('categoria_pai_id', 'null').execute()

                if existe.data:
                    categorias_criadas[cat] = existe.data[0]['id']
                    print(f"  ⏭️  Categoria já existe: {cat}")
                else:
                    data = {'nome': cat, 'tipo': tipo, 'ativo': True}
                    resultado = supabase.table('categorias').insert(data).execute()
                    if resultado.data:
                        categorias_criadas[cat] = resultado.data[0]['id']
                        print(f"  ✅ Categoria criada: {cat}")
            except Exception as e:
                print(f"  ⚠️  Erro ao criar categoria {cat}: {e}")

    # Depois, criar subcategorias
    for cat, pai, tipo in sorted(categorias_unicas, key=lambda x: (x[1] is not None, x[0])):
        if pai is not None:
            try:
                pai_id = categorias_criadas.get(pai)

                # Verificar se já existe
                existe = supabase.table('categorias').select('id').eq('nome', cat).eq('categoria_pai_id', pai_id).execute()

                if existe.data:
                    categorias_criadas[f"{pai}/{cat}"] = existe.data[0]['id']
                    print(f"  ⏭️  Subcategoria já existe: {pai} / {cat}")
                else:
                    data = {'nome': cat, 'categoria_pai_id': pai_id, 'tipo': tipo, 'ativo': True}
                    resultado = supabase.table('categorias').insert(data).execute()
                    if resultado.data:
                        categorias_criadas[f"{pai}/{cat}"] = resultado.data[0]['id']
                        print(f"  ✅ Subcategoria criada: {pai} / {cat}")
            except Exception as e:
                print(f"  ⚠️  Erro ao criar subcategoria {cat}: {e}")

    return categorias_criadas

# ===================================
# MIGRAR CLIENTES/FORNECEDORES
# ===================================

def migrar_clientes_fornecedores(df: pd.DataFrame):
    """Extrai e cria clientes/fornecedores únicos"""
    print("👥 Migrando clientes e fornecedores...")

    clientes_unicos = {}

    for _, row in df.iterrows():
        nome = row.get('Cliente/Fornecedor')
        if pd.isna(nome) or nome == '':
            continue

        nome = str(nome).strip()

        if nome not in clientes_unicos:
            # Verificar se já existe
            try:
                existe = supabase.table('clientes_fornecedores').select('id').eq('nome', nome).execute()

                if existe.data:
                    clientes_unicos[nome] = existe.data[0]['id']
                    print(f"  ⏭️  Cliente já existe: {nome}")
                else:
                    obs = str(row.get('Observação', ''))
                    doc = limpar_documento(re.search(r'CPF[:\s]*([0-9.\-]+)', obs, re.IGNORECASE).group(1) if re.search(r'CPF', obs, re.IGNORECASE) else None)

                    if not doc:
                        doc = f"00000{hash(nome) % 100000000:08d}"

                    tipo = 'pessoa_fisica' if len(doc) == 11 else 'pessoa_juridica'

                    data = {'nome': nome, 'documento': doc, 'tipo': tipo, 'ativo': True}

                    resultado = supabase.table('clientes_fornecedores').insert(data).execute()
                    if resultado.data:
                        clientes_unicos[nome] = resultado.data[0]['id']
                        print(f"  ✅ Cliente/Fornecedor criado: {nome}")
            except Exception as e:
                print(f"  ⚠️  Erro ao criar {nome}: {e}")

    return clientes_unicos

# ===================================
# MIGRAR MOVIMENTAÇÕES (RESTO DO CÓDIGO IGUAL)
# ===================================

def migrar_movimentacoes(df: pd.DataFrame, tipo_mov: str, tipo_entidade: str, categorias_map: Dict, clientes_map: Dict):
    """Migra movimentações financeiras"""
    print(f"💰 Migrando movimentações ({tipo_mov} - {tipo_entidade})...")

    conta_btg_pj = supabase.table('contas_bancarias').select('id').eq('nome', 'BTG MOTTIVME').execute()
    conta_id = conta_btg_pj.data[0]['id'] if conta_btg_pj.data else None

    migradas = 0
    erros = 0

    for idx, row in df.iterrows():
        try:
            data_vencimento = converter_data(row.get('Vencimento'))
            if not data_vencimento:
                erros += 1
                continue

            valor = float(row.get('Valor (R$)', 0))
            if valor <= 0:
                erros += 1
                continue

            cat_full = str(row.get('Categoria', ''))
            cat, subcat = extrair_categoria_subcategoria(cat_full)
            categoria_key = f"{cat}/{subcat}" if subcat else cat
            categoria_id = categorias_map.get(categoria_key)

            cliente_nome = str(row.get('Cliente/Fornecedor', '')).strip()
            cliente_id = clientes_map.get(cliente_nome)

            obs = str(row.get('Observação', ''))
            valor_dolar = extrair_valor_dolar(obs)

            data = {
                'tipo': tipo_mov,
                'tipo_entidade': tipo_entidade,
                'data_competencia': data_vencimento,
                'data_vencimento': data_vencimento,
                'valor_previsto': valor,
                'categoria_id': categoria_id,
                'cliente_fornecedor_id': cliente_id,
                'conta_bancaria_id': conta_id,
                'observacao': obs if not pd.isna(obs) else None,
                'quitado': False,
                'tipo_repeticao': 'unica'
            }

            if valor_dolar:
                data['moeda_estrangeira'] = 'USD'
                data['valor_moeda_estrangeira'] = valor_dolar
                data['cotacao'] = valor / valor_dolar if valor_dolar > 0 else None

            supabase.table('movimentacoes_financeiras').insert(data).execute()
            migradas += 1

            if migradas % 10 == 0:
                print(f"  📝 {migradas} movimentações migradas...")

        except Exception as e:
            erros += 1

    print(f"  ✅ Total migrado: {migradas} | Erros: {erros}")
    return migradas, erros

# ===================================
# MAIN
# ===================================

def main():
    print("🚀 Iniciando migração de dados (VERSÃO SEGURA)...\n")

    try:
        # 1. Verificar dados existentes
        verificar_dados_existentes()
        print()

        # 2. Criar contas bancárias
        criar_contas_bancarias()
        print()

        # 3. Ler Excel
        print("📖 Lendo arquivos Excel...")
        df_despesas_pf_pj = pd.read_excel(ARQUIVOS['despesas_pf_pj'], sheet_name=None)
        print(f"  ✅ DESPESAS PF E PJ.xlsx carregado")
        print()

        # 4. Preparar DataFrames
        df_receitas = df_despesas_pf_pj.get('RECEITAS', pd.DataFrame())
        df_despesas_pj = df_despesas_pf_pj.get('DESPESAS PJ', pd.DataFrame())
        df_despesas_pf = df_despesas_pf_pj.get('DESPESAS PF', pd.DataFrame())

        df_receitas['Tipo'] = 'receita'
        df_despesas_pj['Tipo'] = 'despesa'
        df_despesas_pf['Tipo'] = 'despesa'

        df_all = pd.concat([df_receitas, df_despesas_pj, df_despesas_pf], ignore_index=True)

        # 5. Migrar categorias
        categorias_map = migrar_categorias(df_all)
        print()

        # 6. Migrar clientes/fornecedores
        clientes_map = migrar_clientes_fornecedores(df_all)
        print()

        # 7. Migrar movimentações
        total_migradas = 0
        total_erros = 0

        m, e = migrar_movimentacoes(df_receitas, 'receita', 'pj', categorias_map, clientes_map)
        total_migradas += m
        total_erros += e
        print()

        m, e = migrar_movimentacoes(df_despesas_pj, 'despesa', 'pj', categorias_map, clientes_map)
        total_migradas += m
        total_erros += e
        print()

        m, e = migrar_movimentacoes(df_despesas_pf, 'despesa', 'pf', categorias_map, clientes_map)
        total_migradas += m
        total_erros += e
        print()

        # 8. Resumo final
        print("=" * 60)
        print("✅ MIGRAÇÃO CONCLUÍDA!")
        print("=" * 60)
        print(f"Total de movimentações migradas: {total_migradas}")
        print(f"Total de erros: {total_erros}")
        print(f"Categorias criadas: {len(categorias_map)}")
        print(f"Clientes/Fornecedores criados: {len(clientes_map)}")
        print()
        print("🎯 Próximos passos:")
        print("  1. Verificar dados no Supabase Dashboard")
        print("  2. Ajustar manualmente documentos de clientes se necessário")
        print("  3. Marcar movimentações quitadas")
        print("  4. Importar extratos bancários")

    except Exception as e:
        print(f"❌ ERRO FATAL: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
