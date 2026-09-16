import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
const URL_RAW = process.argv[2] || 'https://nura-gift.netlify.app';
const display = URL_RAW.replace(/^https?:\/\//, '');
const html = readFileSync('poster/poster.html', 'utf8')
  .replaceAll('__URL__', URL_RAW).replaceAll('__URL_DISPLAY__', display);
writeFileSync('poster/.out.html', html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1400, height: 1640 } });
await p.goto(`file://${process.cwd()}/poster/.out.html`);
await p.waitForTimeout(2800);
await p.pdf({ path: 'Nura-poster.pdf', width: '1400px', height: '1640px', printBackground: true, pageRanges: '1' });
await p.screenshot({ path: 'Nura-poster.png' });
await b.close();
console.log('poster built for', URL_RAW);
