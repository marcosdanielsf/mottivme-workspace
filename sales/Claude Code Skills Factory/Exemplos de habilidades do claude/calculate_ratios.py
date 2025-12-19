""" 
 Módulo de cálculo de razões financeiras. 
 Fornece funções para calcular principais métricas e razões financeiras. 
 """ 
 
 import json 
 from typing import Dict, Any 
 
 
 class CalculadoraRazoesFinanceiras: 
     """Calcula razões financeiras a partir de dados de demonstrações financeiras.""" 
 
     def __init__(self, dados_financeiros: Dict[str, Any]): 
         """ 
         Inicializa com dados de demonstrações financeiras. 
 
         Args: 
             dados_financeiros: Dicionário contendo demonstracao_resultados, balanco_patrimonial, 
                           fluxo_caixa e dados_mercado 
         """ 
         self.demonstracao_resultados = dados_financeiros.get("income_statement", {}) 
         self.balanco_patrimonial = dados_financeiros.get("balance_sheet", {}) 
         self.fluxo_caixa = dados_financeiros.get("cash_flow", {}) 
         self.dados_mercado = dados_financeiros.get("market_data", {}) 
         self.razoes = {} 
 
     def divisao_segura(self, numerador: float, denominador: float, padrao: float = 0.0) -> float: 
         """Divide dois números com segurança, retornando padrão se denominador for zero.""" 
         if denominador == 0: 
             return padrao 
         return numerador / denominador 
 
     def calcular_razoes_rentabilidade(self) -> Dict[str, float]: 
         """Calcula razões de rentabilidade.""" 
         razoes = {} 
 
         # ROE (Retorno sobre o Patrimônio Líquido) 
         lucro_liquido = self.demonstracao_resultados.get("net_income", 0) 
         patrimonio_liquido = self.balanco_patrimonial.get("shareholders_equity", 0) 
         razoes["roe"] = self.divisao_segura(lucro_liquido, patrimonio_liquido) 
 
         # ROA (Retorno sobre os Ativos) 
         total_ativos = self.balanco_patrimonial.get("total_assets", 0) 
         razoes["roa"] = self.divisao_segura(lucro_liquido, total_ativos) 
 
         # Margem Bruta 
         receita = self.demonstracao_resultados.get("revenue", 0) 
         cmv = self.demonstracao_resultados.get("cost_of_goods_sold", 0) 
         lucro_bruto = receita - cmv 
         razoes["margem_bruta"] = self.divisao_segura(lucro_bruto, receita) 
 
         # Margem Operacional 
         lucro_operacional = self.demonstracao_resultados.get("operating_income", 0) 
         razoes["margem_operacional"] = self.divisao_segura(lucro_operacional, receita) 
 
         # Margem Líquida 
         razoes["margem_liquida"] = self.divisao_segura(lucro_liquido, receita) 
 
         return razoes 
 
     def calcular_razoes_liquidez(self) -> Dict[str, float]: 
         """Calcula razões de liquidez.""" 
         razoes = {} 
 
         ativos_circulantes = self.balanco_patrimonial.get("current_assets", 0) 
         passivos_circulantes = self.balanco_patrimonial.get("current_liabilities", 0) 
 
         # Razão Corrente 
         razoes["razao_corrente"] = self.divisao_segura(ativos_circulantes, passivos_circulantes) 
 
         # Razão Rápida (Teste Ácido) 
         estoque = self.balanco_patrimonial.get("inventory", 0) 
         ativos_liquidos = ativos_circulantes - estoque 
         razoes["razao_rapida"] = self.divisao_segura(ativos_liquidos, passivos_circulantes) 
 
         # Razão de Caixa 
         caixa = self.balanco_patrimonial.get("cash_and_equivalents", 0) 
         razoes["razao_caixa"] = self.divisao_segura(caixa, passivos_circulantes) 
 
         return razoes 
 
     def calcular_razoes_alavancagem(self) -> Dict[str, float]: 
         """Calcula razões de alavancagem/solvência.""" 
         razoes = {} 
 
         divida_total = self.balanco_patrimonial.get("total_debt", 0) 
         patrimonio_liquido = self.balanco_patrimonial.get("shareholders_equity", 0) 
 
         # Razão Dívida sobre Patrimônio Líquido 
         razoes["divida_sobre_pl"] = self.divisao_segura(divida_total, patrimonio_liquido) 
 
         # Razão de Cobertura de Juros 
         ebit = self.demonstracao_resultados.get("ebit", 0) 
         despesa_juros = self.demonstracao_resultados.get("interest_expense", 0) 
         razoes["cobertura_juros"] = self.divisao_segura(ebit, despesa_juros) 
 
         # Razão de Cobertura de Serviço da Dívida 
         renda_operacional_liquida = self.demonstracao_resultados.get("operating_income", 0) 
         servico_divida_total = despesa_juros + self.balanco_patrimonial.get( 
             "current_portion_long_term_debt", 0 
         ) 
         razoes["cobertura_servico_divida"] = self.divisao_segura(renda_operacional_liquida, servico_divida_total) 
 
         return razoes 
 
     def calcular_razoes_eficiencia(self) -> Dict[str, float]: 
         """Calcula razões de eficiência/atividade.""" 
         razoes = {} 
 
         receita = self.demonstracao_resultados.get("revenue", 0) 
         total_ativos = self.balanco_patrimonial.get("total_assets", 0) 
 
         # Giro de Ativos 
         razoes["giro_ativos"] = self.divisao_segura(receita, total_ativos) 
 
         # Giro de Estoque 
         cmv = self.demonstracao_resultados.get("cost_of_goods_sold", 0) 
         estoque = self.balanco_patrimonial.get("inventory", 0) 
         razoes["giro_estoque"] = self.divisao_segura(cmv, estoque) 
 
         # Giro de Contas a Receber 
         contas_receber = self.balanco_patrimonial.get("accounts_receivable", 0) 
         razoes["giro_contas_receber"] = self.divisao_segura(receita, contas_receber) 
 
         # Dias de Vendas em Aberto 
         razoes["dias_vendas_aberto"] = self.divisao_segura(365, razoes["giro_contas_receber"]) 
 
         return razoes 
 
     def calcular_razoes_valoracao(self) -> Dict[str, float]: 
         """Calcula razões de valoração.""" 
         razoes = {} 
 
         preco_acao = self.dados_mercado.get("share_price", 0) 
         acoes_em_circulacao = self.dados_mercado.get("shares_outstanding", 0) 
         valor_mercado = preco_acao * acoes_em_circulacao 
 
         # Razão P/E 
         lucro_liquido = self.demonstracao_resultados.get("net_income", 0) 
         lpa = self.divisao_segura(lucro_liquido, acoes_em_circulacao) 
         razoes["razao_pe"] = self.divisao_segura(preco_acao, lpa) 
         razoes["lpa"] = lpa 
 
         # Razão P/B 
         valor_contabil = self.balanco_patrimonial.get("shareholders_equity", 0) 
         valor_contabil_por_acao = self.divisao_segura(valor_contabil, acoes_em_circulacao) 
         razoes["razao_pb"] = self.divisao_segura(preco_acao, valor_contabil_por_acao) 
         razoes["valor_contabil_por_acao"] = valor_contabil_por_acao 
 
         # Razão P/S 
         receita = self.demonstracao_resultados.get("revenue", 0) 
         razoes["razao_ps"] = self.divisao_segura(valor_mercado, receita) 
 
         # EV/EBITDA 
         ebitda = self.demonstracao_resultados.get("ebitda", 0) 
         divida_total = self.balanco_patrimonial.get("total_debt", 0) 
         caixa = self.balanco_patrimonial.get("cash_and_equivalents", 0) 
         valor_empresa = valor_mercado + divida_total - caixa 
         razoes["ev_ebitda"] = self.divisao_segura(valor_empresa, ebitda) 
 
         # Razão PEG (se taxa de crescimento disponível) 
         crescimento_lucros = self.dados_mercado.get("earnings_growth_rate", 0) 
         if crescimento_lucros > 0: 
             razoes["razao_peg"] = self.divisao_segura(razoes["razao_pe"], crescimento_lucros * 100) 
 
         return razoes 
 
     def calcular_todas_razoes(self) -> Dict[str, Any]: 
         """Calcula todas as razões financeiras.""" 
         return { 
             "rentabilidade": self.calcular_razoes_rentabilidade(), 
             "liquidez": self.calcular_razoes_liquidez(), 
             "alavancagem": self.calcular_razoes_alavancagem(), 
             "eficiencia": self.calcular_razoes_eficiencia(), 
             "valoracao": self.calcular_razoes_valoracao(), 
         } 
 
     def interpretar_razao(self, nome_razao: str, valor: float) -> str: 
         """Fornece interpretação para uma razão específica.""" 
         interpretacoes = { 
             "razao_corrente": lambda v: ( 
                 "Fort liquidez" 
                 if v > 2 
                 else "Liquidez adequada" 
                 if v > 1.5 
                 else "Possíveis preocupações de liquidez" 
                 if v > 1 
                 else "Problemas de liquidez" 
             ), 
             "divida_sobre_pl": lambda v: ( 
                 "Baixa alavancagem" 
                 if v < 0.5 
                 else "Alavancagem moderada" 
                 if v < 1 
                 else "Alavancagem alta" 
                 if v < 2 
                 else "Alavancagem muito alta" 
             ), 
             "roe": lambda v: ( 
                 "Retornos excelentes" 
                 if v > 0.20 
                 else "Bons retornos" 
                 if v > 0.15 
                 else "Retornos médios" 
                 if v > 0.10 
                 else "Retornos abaixo da média" 
                 if v > 0 
                 else "Retornos negativos" 
             ), 
             "razao_pe": lambda v: ( 
                 "Potencialmente subvalorizada" 
                 if 0 < v < 15 
                 else "Valor justo" 
                 if 15 <= v < 25 
                 else "Prêmio de crescimento" 
                 if 25 <= v < 40 
                 else "Valoração alta" 
                 if v >= 40 
                 else "N/A (lucros negativos)" 
                 if v <= 0 
                 else "N/A" 
             ), 
         } 
 
         if nome_razao in interpretacoes: 
             return interpretacoes[nome_razao](valor) 
         return "Interpretação não disponível" 
 
     def formatar_razao(self, nome: str, valor: float, tipo_formato: str = "razao") -> str: 
         """Formata valor da razão para exibição.""" 
         if tipo_formato == "percentual": 
             return f"{valor * 100:.2f}%" 
         elif tipo_formato == "vezes": 
             return f"{valor:.2f}x" 
         elif tipo_formato == "dias": 
             return f"{valor:.1f} dias" 
         elif tipo_formato == "moeda": 
             return f"R${valor:.2f}" 
         else: 
             return f"{valor:.2f}" 
 
 
 def calcular_razoes_a_partir_dados(dados_financeiros: Dict[str, Any]) -> Dict[str, Any]: 
     """ 
     Função principal para calcular todas as razões a partir de dados financeiros. 
 
     Args: 
         dados_financeiros: Dicionário com dados de demonstrações financeiras 
 
     Returns: 
         Dicionário com razões calculadas e interpretações 
     """ 
     calculadora = CalculadoraRazoesFinanceiras(dados_financeiros) 
     razoes = calculadora.calcular_todas_razoes() 
 
     # Adiciona interpretações 
     interpretacoes = {} 
     for categoria, razoes_categoria in razoes.items(): 
         interpretacoes[categoria] = {} 
         for nome_razao, valor in razoes_categoria.items(): 
             interpretacoes[categoria][nome_razao] = { 
                 "valor": valor, 
                 "formatado": calculadora.formatar_razao(nome_razao, valor), 
                 "interpretacao": calculadora.interpretar_razao(nome_razao, valor), 
             } 
 
     return { 
         "razoes": razoes, 
         "interpretacoes": interpretacoes, 
         "resumo": gerar_resumo(razoes), 
     } 
 
 
 def gerar_resumo(razoes: Dict[str, Any]) -> str: 
     """Gera um resumo em texto da análise financeira.""" 
     partes_resumo = [] 
 
     # Resumo de rentabilidade 
     prof = razoes.get("rentabilidade", {}) 
     if prof.get("roe", 0) > 0: 
         partes_resumo.append( 
             f"ROE de {prof['roe'] * 100:.1f}% indica {'fortes' if prof['roe'] > 0.15 else 'moderados'} retornos aos acionistas." 
         ) 
 
     # Resumo de liquidez 
     liq = razoes.get("liquidez", {}) 
     if liq.get("razao_corrente", 0) > 0: 
         partes_resumo.append( 
             f"Razão corrente de {liq['razao_corrente']:.2f} sugere {'boa' if liq['razao_corrente'] > 1.5 else 'possíveis'} posição de liquidez {'boa' if liq['razao_corrente'] > 1.5 else 'preocupantes'}." 
         ) 
 
     # Resumo de alavancagem 
     lev = razoes.get("alavancagem", {}) 
     if lev.get("divida_sobre_pl", 0) >= 0: 
         partes_resumo.append( 
             f"Dívida sobre PL de {lev['divida_sobre_pl']:.2f} indica alavancagem {'conservadora' if lev['divida_sobre_pl'] < 0.5 else 'moderada' if lev['divida_sobre_pl'] < 1 else 'alta'}." 
         ) 
 
     # Resumo de valoração 
     val = razoes.get("valoracao", {}) 
     if val.get("razao_pe", 0) > 0: 
         partes_resumo.append( 
             f"Razão P/E de {val['razao_pe']:.1f} sugere que a ação está negociando com {'desconto' if val['razao_pe'] < 15 else 'valor justo' if val['razao_pe'] < 25 else 'prêmio'}." 
         ) 
 
     return " ".join(partes_resumo) if partes_resumo else "Dados insuficientes para resumo." 
 
 
 # Exemplo de uso 
 if __name__ == "__main__": 
     # Dados financeiros de exemplo 
     dados_exemplo = { 
         "income_statement": { 
             "revenue": 1000000, 
             "cost_of_goods_sold": 600000, 
             "operating_income": 200000, 
             "ebit": 180000, 
             "ebitda": 250000, 
             "interest_expense": 20000, 
             "net_income": 150000, 
         }, 
         "balance_sheet": { 
             "total_assets": 2000000, 
             "current_assets": 800000, 
             "cash_and_equivalents": 200000, 
             "accounts_receivable": 150000, 
             "inventory": 250000, 
             "current_liabilities": 400000, 
             "total_debt": 500000, 
             "current_portion_long_term_debt": 50000, 
             "shareholders_equity": 1500000, 
         }, 
         "cash_flow": { 
             "operating_cash_flow": 180000, 
             "investing_cash_flow": -100000, 
             "financing_cash_flow": -50000, 
         }, 
         "market_data": { 
             "share_price": 50, 
             "shares_outstanding": 100000, 
             "earnings_growth_rate": 0.10, 
         }, 
     } 
 
     resultados = calcular_razoes_a_partir_dados(dados_exemplo) 
     print(json.dumps(resultados, indent=2)) 