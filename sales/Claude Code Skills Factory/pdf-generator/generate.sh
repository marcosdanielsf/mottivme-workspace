#!/bin/bash

INPUT_HTML="/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/SAAS/7. Projeto total/Mottivme Strategy 2026/03-Sales-Assets/Landing-Pages/foundation-sprint-lp.html"
OUTPUT_PDF="/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/SAAS/7. Projeto total/Mottivme Strategy 2026/03-Sales-Assets/Landing-Pages/foundation-sprint-lp.pdf"

echo "🚀 Gerando PDF usando Chrome..."

# Usando Chrome/Chromium headless
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless \
  --disable-gpu \
  --print-to-pdf="$OUTPUT_PDF" \
  --print-to-pdf-no-header \
  --no-pdf-header-footer \
  "$INPUT_HTML"

if [ -f "$OUTPUT_PDF" ]; then
    echo "✅ PDF gerado com sucesso!"
    echo "📍 Localização: $OUTPUT_PDF"
    ls -lh "$OUTPUT_PDF"
else
    echo "❌ Erro ao gerar PDF"
    exit 1
fi
