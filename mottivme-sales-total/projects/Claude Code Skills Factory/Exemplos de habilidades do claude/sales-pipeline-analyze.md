
name: **sales-pipeline-analyzer**
description: Analisa dados de pipeline de vendas para identificar gargalos de conversão, taxas de ganho por origem, prever receita e otimizar processos comerciais. Use quando o usuário mencionar pipeline de vendas, dados de CRM, conversão de leads, funil de vendas ou quando quiser analisar fluxo de negócios.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# **Analisador de Saúde do Pipeline de Vendas**

Analisa dados do CRM/pipeline para diagnosticar saúde e otimizar conversão.

```python
import pandas as pd
import matplotlib.pyplot as plt
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference

df = pd.read_csv('sales_pipeline.csv')
df['close_date'] = pd.to_datetime(df['close_date'])
df['days_in_pipeline'] = (df['close_date'] - pd.to_datetime(df['created_date'])).dt.days

# Taxas de conversão por estágio
stage_counts = df['stage'].value_counts()
total_leads = len(df)
conversion_funnel = {
    'Lead': total_leads,
    'Qualified': len(df[df['stage'].isin(['Qualified', 'Proposal', 'Negotiation', 'Closed Won'])]),
    'Proposal': len(df[df['stage'].isin(['Proposal', 'Negotiation', 'Closed Won'])]),
    'Negotiation': len(df[df['stage'].isin(['Negotiation', 'Closed Won'])]),
    'Closed Won': len(df[df['stage'] == 'Closed Won'])
}

# Taxa de ganho por origem
source_performance = df.groupby('lead_source').agg({
    'deal_value': ['sum', 'mean', 'count'],
    'stage': lambda x: (x == 'Closed Won').sum()
}).round(2)
source_performance['win_rate'] = (source_performance[('stage', '<lambda>')] / source_performance[('deal_value', 'count')] * 100).round(1)

# Visualizações
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Funil de conversão
stages = list(conversion_funnel.keys())
counts = list(conversion_funnel.values())
axes[0,0].barh(stages, counts, color=['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#27ae60'])
axes[0,0].set_title('Conversão no Funil de Vendas', fontsize=14)
axes[0,0].set_xlabel('Número de Oportunidades')
for i, (stage, count) in enumerate(conversion_funnel.items()):
    if i > 0:
        prev_count = list(conversion_funnel.values())[i-1]
        conversion_rate = (count / prev_count * 100) if prev_count > 0 else 0
        axes[0,0].text(count, i, f'  {conversion_rate:.0f}%', va='center')

# Taxa de ganho por origem de lead
top_sources = source_performance.nlargest(5, 'win_rate')
axes[0,1].barh(top_sources.index, top_sources['win_rate'], color='steelblue')
axes[0,1].set_title('Taxa de Ganho por Origem do Lead', fontsize=14)
axes[0,1].set_xlabel('Win Rate (%)')

# Distribuição do valor dos negócios
axes[1,0].hist(df['deal_value'], bins=20, color='coral', edgecolor='black')
axes[1,0].set_title('Distribuição do Valor dos Negócios', fontsize=14)
axes[1,0].set_xlabel('Valor da Oportunidade ($)')

# Dias no pipeline
closed_won = df[df['stage'] == 'Closed Won']
axes[1,1].hist(closed_won['days_in_pipeline'], bins=15, color='mediumseagreen', edgecolor='black')
axes[1,1].set_title('Duração do Ciclo de Vendas (Negócios Ganhos)', fontsize=14)
axes[1,1].set_xlabel('Dias no Pipeline')

plt.tight_layout()
plt.savefig('pipeline_analysis.png', dpi=300)

# Criar relatório Excel
wb = Workbook()
ws = wb.active
ws.title = "Saúde do Pipeline"
ws['A1'] = 'Valor Total no Pipeline'
ws['B1'] = df['deal_value'].sum()
ws['A2'] = 'Tamanho Médio das Oportunidades'
ws['B2'] = df['deal_value'].mean()
ws['A3'] = 'Taxa Geral de Ganho'
ws['B3'] = f"{(len(df[df['stage'] == 'Closed Won']) / total_leads * 100):.1f}%"
ws['A4'] = 'Ciclo Médio de Vendas'
ws['B4'] = f"{closed_won['days_in_pipeline'].mean():.0f} dias"

wb.save('pipeline_report.xlsx')
print(f"Saúde do pipeline: {(len(df[df['stage'] == 'Closed Won']) / total_leads * 100):.1f}% de taxa de ganho")
```

## **Requisitos**

* pandas
* matplotlib
* openpyxl

## **Exemplo**

**Prompt:** “Quais origens de lead convertem melhor?”
**Resultado:** Funil de conversão, taxas de ganho e análise de ciclo