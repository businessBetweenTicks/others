import { chromium } from 'playwright';
const [name, w, y, h] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport:{width:+w, height:900} });
await p.goto(`file://${process.cwd()}/.preview/${name}.html`);
await p.waitForTimeout(2200);
await p.screenshot({ path:`.preview/${name}-clip.png`, clip:{x:0, y:+y, width:+w, height:+h} });
await b.close();
console.log('clipped');
