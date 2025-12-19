// Script para gerar PDF da landing page
// Execute: node gerar-pdf.js

const fs = require('fs');
const path = require('path');

// Detectar se está rodando via npx playwright
const isPlaywrightAvailable = () => {
    try {
        require.resolve('playwright');
        return true;
    } catch (e) {
        return false;
    }
};

async function generatePDF() {
    if (!isPlaywrightAvailable()) {
        console.log('❌ Playwright não está instalado.');
        console.log('📦 Instale com: npm install playwright');
        console.log('🌐 Ou instale o browser: npx playwright install chromium');
        process.exit(1);
    }

    const { chromium } = require('playwright');

    const htmlFile = path.join(__dirname, 'foundation-sprint-lp.html');
    const outputFile = path.join(__dirname, 'foundation-sprint-lp.pdf');

    console.log('🚀 Iniciando geração do PDF...');
    console.log('📄 Arquivo HTML:', htmlFile);

    if (!fs.existsSync(htmlFile)) {
        console.error('❌ Arquivo HTML não encontrado!');
        process.exit(1);
    }

    const htmlContent = fs.readFileSync(htmlFile, 'utf8');

    console.log('🌐 Abrindo navegador...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('📝 Carregando conteúdo...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    console.log('💾 Gerando PDF...');
    await page.pdf({
        path: outputFile,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
        }
    });

    await browser.close();

    console.log('✅ PDF gerado com sucesso!');
    console.log('📍 Localização:', outputFile);

    const stats = fs.statSync(outputFile);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log('📊 Tamanho:', sizeMB, 'MB');
}

generatePDF().catch(err => {
    console.error('❌ Erro:', err.message);
    process.exit(1);
});
