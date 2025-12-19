#!/bin/bash

# 🚀 Script de Deploy Rápido - Vercel
# Proposta Carol & Luiz - v4

echo "🚀 DEPLOY VERCEL - Proposta Carol & Luiz"
echo "========================================"
echo ""

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI não encontrado!"
    echo ""
    echo "Instalando Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI instalado!"
    echo ""
fi

# Confirmar antes de fazer deploy
echo "📋 Checklist rápido:"
echo "   [ ] Editou o link do Calendly?"
echo "   [ ] Editou o WhatsApp (se necessário)?"
echo "   [ ] Testou localmente?"
echo ""
read -p "Tudo pronto? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado. Faça as edições necessárias e rode novamente."
    exit 1
fi

echo ""
echo "🚀 Iniciando deploy..."
echo ""

# Fazer deploy
vercel --prod

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Copie o URL gerado acima"
echo "   2. Envie pra Carol & Luiz"
echo "   3. Acompanhe acessos no dashboard Vercel"
echo ""
echo "🔗 Dashboard: https://vercel.com/dashboard"
echo ""
