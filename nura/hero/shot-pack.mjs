import { chromium } from 'playwright';
const shots = process.argv.slice(2).map(a => a.split(':'));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [n,w,h] of shots) {
  const p = await b.newPage({ viewport:{width:+w,height:+h}, deviceScaleFactor:1 });
  await p.goto(`file://${process.cwd()}/.preview/${n}.html`);
  await p.waitForTimeout(2200);
  console.log(n, Math.ceil(await p.evaluate(() => document.body.firstElementChild.getBoundingClientRect().height)));
  await p.screenshot({ path:`.preview/${n}.png`, fullPage:true });
  await p.close();
}
await b.close();
