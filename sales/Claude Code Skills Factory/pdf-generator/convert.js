const { chromium } = require('playwright');
const fs = require('fs');

async function generatePDF() {
    const htmlPath = '/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/SAAS/7. Projeto total/Mottivme Strategy 2026/03-Sales-Assets/Landing-Pages/foundation-sprint-lp.html';
    const outputPath = '/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/SAAS/7. Projeto total/Mottivme Strategy 2026/03-Sales-Assets/Landing-Pages/foundation-sprint-lp.pdf';

    console.log('🚀 Iniciando conversão...');

    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
    });

    await browser.close();

    console.log('✅ PDF criado:', outputPath);
    const stats = fs.statSync(outputPath);
    console.log('📊 Tamanho:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
}

generatePDF().catch(console.error);
