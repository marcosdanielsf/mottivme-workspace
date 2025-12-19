# Gerar PDF da Landing Page

## Método 1: Usando o Script Node.js (Recomendado)

### Passo 1: Instalar Playwright
```bash
cd "/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/SAAS/7. Projeto total/Mottivme Strategy 2026/03-Sales-Assets/Landing-Pages"
npm install playwright
npx playwright install chromium
```

### Passo 2: Gerar o PDF
```bash
node gerar-pdf.js
```

O PDF será criado como `foundation-sprint-lp.pdf` no mesmo diretório.

---

## Método 2: Usando o Navegador (Mais Simples)

1. Abra o arquivo `foundation-sprint-lp.html` no seu navegador (Chrome, Firefox, Safari, etc.)
2. Pressione `Cmd + P` (ou vá em Arquivo > Imprimir)
3. Na janela de impressão, selecione "Salvar como PDF"
4. Ajuste as configurações:
   - Tamanho: A4
   - Margens: Mínimas
   - Opções: Marcar "Gráficos de fundo"
5. Salve o arquivo

---

## Método 3: Usando Ferramenta Online

1. Acesse: https://www.html2pdf.com/ ou https://www.web2pdfconvert.com/
2. Faça upload do arquivo `foundation-sprint-lp.html`
3. Clique em "Convert" e baixe o PDF gerado

---

## Troubleshooting

**Erro: "Playwright não está instalado"**
- Execute: `npm install playwright`
- Execute: `npx playwright install chromium`

**PDF sem cores/backgrounds**
- No navegador: Certifique-se de marcar "Gráficos de fundo" na impressão
- No script: Já está configurado automaticamente

**Tamanho do arquivo muito grande**
- O PDF terá aproximadamente 1-2 MB devido às imagens e estilos
- Para reduzir, use ferramentas online de compressão de PDF

---

## Script Disponível

O arquivo `gerar-pdf.js` está pronto para uso e faz todo o processo automaticamente.
