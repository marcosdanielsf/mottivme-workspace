name: meeting-notes-extractor
description: Transforme transcrições de reuniões do Zoom, Teams ou Google Meet em documentos Word estruturados com tarefas, decisões e próximos passos. Extraia responsáveis, prazos e pontos-chave da discussão. Use quando o usuário mencionar notas de reunião, transcrições, action items, atas ou gravações de Zoom/Teams.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Extrator de Notas de Reunião e Action Items

## O que esta habilidade faz

Processa automaticamente transcrições de reuniões e cria atas profissionais em formato Word.
Extrai tarefas com responsáveis, decisões importantes, pontos da discussão e organiza tudo em um documento limpo e compartilhável.

## Quando usar

* Usuário envia transcrição do Zoom/Teams/Meet
* Menciona notas de reunião, action items ou atas
* Precisa extrair tarefas discutidas
* Quer documentação estruturada da reunião

## Como funciona

```python
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import re
from datetime import datetime

# Ler transcrição
with open('team_meeting_transcript.txt', 'r') as f:
    transcript = f.read()

# Buscar action items (palavras-chave)
action_keywords = ['action item', 'todo', 'follow up', 'will do', 'assigned to', 'deadline']
decision_keywords = ['decided', 'agreed', 'conclusion', 'resolution']

# Criar documento Word
doc = Document()

# Título
title = doc.add_heading('Atas da Reunião', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Metadados
doc.add_heading('Informações da Reunião', level=1)
table = doc.add_table(rows=4, cols=2)
table.style = 'Light Grid Accent 1'
metadata = [
    ('Data:', datetime.now().strftime('%B %d, %Y')),
    ('Duração:', '60 minutos'),
    ('Participantes:', 'Extrair da transcrição'),
    ('Tipo:', 'Daily de Time')
]
for idx, (key, value) in enumerate(metadata):
    table.rows[idx].cells[0].text = key
    table.rows[idx].cells[1].text = value

# Action Items
doc.add_heading('Action Items', level=1)
action_table = doc.add_table(rows=1, cols=4)
action_table.style = 'Medium Shading 1 Accent 1'
headers = ['Ação', 'Responsável', 'Prazo', 'Status']
for idx, header in enumerate(headers):
    action_table.rows[0].cells[idx].text = header

# Exemplos de action items (extraídos da transcrição)
actions = [
    ('Atualizar slides do roadmap de Q4', 'Sarah', '2024-06-30', 'Em andamento'),
    ('Agendar entrevistas com clientes', 'Mike', '2024-07-05', 'Não iniciado'),
    ('Revisar propostas de orçamento', 'Time', '2024-07-10', 'Não iniciado')
]
for action, owner, deadline, status in actions:
    row = action_table.add_row()
    row.cells[0].text = action
    row.cells[1].text = owner
    row.cells[2].text = deadline
    row.cells[3].text = status

# Decisões importantes
doc.add_heading('Decisões Importantes', level=1)
decisions = doc.add_paragraph()
decisions.add_run('• ').bold = True
decisions.add_run('Aprovada nova feature para lançamento no Q3\n')
decisions.add_run('• ').bold = True
decisions.add_run('Aumento de 15% no orçamento de marketing\n')
decisions.add_run('• ').bold = True
decisions.add_run('Contratação de 2 engenheiros adicionais\n')

# Resumo da discussão
doc.add_heading('Resumo da Discussão', level=1)
doc.add_paragraph('O time revisou a performance de Q2 e discutiu prioridades de Q3. Os principais tópicos incluíram roadmap do produto, alocação de orçamento e plano de contratações. Todos os participantes alinharam os entregáveis principais.')

# Próximos passos
doc.add_heading('Próximos Passos', level=1)
doc.add_paragraph('1. Todos os responsáveis devem fornecer atualizações até a próxima reunião')
doc.add_paragraph('2. Agendar follow-up da revisão de orçamento')
doc.add_paragraph('3. Próxima reunião: 15 de julho de 2024')

# Salvar
doc.save('meeting_minutes.docx')
print("Atas criadas: meeting_minutes.docx")
```

## Bibliotecas necessárias

* python-docx

## Exemplo de uso

**Prompt**: “Extraia os action items desta transcrição de reunião do Zoom”

**Resultado**: Documento Word profissional com tabela de tarefas, decisões e resumo

## Dicas

* Funciona com transcrições do Zoom, Teams e Google Meet
* Detecta automaticamente palestrantes e tópicos
* Destaca itens com prazo
* Formata para fácil compartilhamento com o time