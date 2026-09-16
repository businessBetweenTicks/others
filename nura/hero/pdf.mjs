import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('.pdf', { recursive: true });
const LIST = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const item of LIST) {
  const [name, w] = item.split(':');
  const p = await b.newPage({ viewport: { width: +w, height: 900 } });
  await p.goto(`file://${process.cwd()}/.preview/${name}.html`);
  await p.waitForTimeout(2600);
  const h = Math.ceil(await p.evaluate(() => document.body.firstElementChild.getBoundingClientRect().height));
  await p.pdf({ path: `.pdf/${name}.pdf`, width: `${w}px`, height: `${h}px`, printBackground: true, pageRanges: '1' });
  console.log(name, w, h);
  await p.close();
}
await b.close();
