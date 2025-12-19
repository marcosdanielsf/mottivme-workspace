# MOTTIVME WORKSPACE

> Ponto de entrada para todos os projetos. Sempre comece por aqui.

---

## ESTRUTURA

```
mottivme-workspace/
├── INDICE.md              ← VOCE ESTA AQUI
├── sales/                 ← Projeto principal (MOTTIVME Sales)
├── ghl/                   ← Seus projetos GHL
├── referencias/           ← Repos de terceiros para consulta
├── docs/                  ← Documentacao e sessoes
└── MIS Sentinel/          ← Projeto Sentinel
```

---

## PROJETOS ATIVOS

| Projeto | Descricao | Status | Entrada |
|---------|-----------|--------|---------|
| **Sales** | SDR Isabella, Concierge, n8n workflows | Ativo | [sales/](sales/) |
| **GHL Agency AI** | Integracao GHL customizada | Ativo | [ghl/ghl-agency-ai/](ghl/ghl-agency-ai/) |
| **GHL WhatsApp Gateway** | QR Code WhatsApp + GHL | Ativo | [ghl/GHL-Whatsapp-qr-gateway/](ghl/GHL-Whatsapp-qr-gateway/) |
| **MIS Sentinel** | Monitoramento | Parado | [MIS Sentinel/](MIS%20Sentinel/) |

---

## ACESSO RAPIDO - SALES

### Arquivos Importantes
- **Credenciais**: [sales/CONTEXTOS/CREDENCIAIS/CREDENCIAIS-MASTER.md](sales/CONTEXTOS/CREDENCIAIS/CREDENCIAIS-MASTER.md)
- **Contexto Master**: [sales/MOTTIVME-MASTER-CONTEXT.md](sales/MOTTIVME-MASTER-CONTEXT.md)
- **Scripts**: [sales/scripts/](sales/scripts/)

### Workflows n8n
- **Fluxo Principal EUA**: [sales/n8n-workspace/Fluxos n8n/Fluxos BASE/...](sales/n8n-workspace/)
- **Tools SDR**: [sales/n8n-workspace/.../Tools Agentes SDR/](sales/n8n-workspace/)

### Ultima Sessao
- [docs/sessoes/SESSAO-CONCIERGE-ISABELLA-DEZEMBRO-2025.md](docs/sessoes/SESSAO-CONCIERGE-ISABELLA-DEZEMBRO-2025.md)

---

## REFERENCIAS (Terceiros)

Repos clonados para estudo/consulta:

| Repo | Descricao | Link Original |
|------|-----------|---------------|
| open-ghl-mcp | MCP Server para GHL | [basicmachines-co](https://github.com/basicmachines-co/open-ghl-mcp) |
| ghl-app-template | Template de app GHL | [cbnsndwch](https://github.com/cbnsndwch/ghl-app-template) |
| api-laravel-gohighlevel | API Laravel + GHL | [lucenarenato](https://github.com/lucenarenato/api-laravel-gohighlevel) |
| MetroFlex-Events-AI-Agent | Agente AI para eventos | [drive-brand-growth](https://github.com/drive-brand-growth/MetroFlex-Events-AI-Agent) |

Ver todos: [referencias/ghl-terceiros/](referencias/ghl-terceiros/)

---

## PENDENCIAS ATUAIS

### Alta Prioridade
- [ ] Corrigir erro Instagram/SMS - source no fluxo principal
- [ ] Finalizar tool Last Appointment (Carreira/Consultoria)
- [ ] Testar fluxo Concierge Isabella

### Media Prioridade
- [ ] Criar Sets para followuper e rescheduler
- [ ] Subir tudo pro GitHub organizado

---

## COMO RETOMAR TRABALHO

1. Abra este arquivo (INDICE.md)
2. Veja "Ultima Sessao" em docs/sessoes/
3. Leia o resumo e pendencias
4. Continue de onde parou

---

## CREDENCIAIS RAPIDAS

### Lappe Finance (GHL)
```yaml
location_id: EKHxHl3KLPN0iRc69GNU
api_key: pit-3d61b334-690f-46ad-a6be-54c5efce1f46
```

### Mottivme Central (GHL)
```yaml
location_id: cd1uyzpJox6XPt4Vct8Y
api_key: pit-fe627027-b9cb-4ea3-aaa4-149459e66a03
```

> Credenciais completas em: [sales/CONTEXTOS/CREDENCIAIS/](sales/CONTEXTOS/CREDENCIAIS/)

---

*Atualizado em: Dezembro 2025*
