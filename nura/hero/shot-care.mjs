import { chromium } from 'playwright';
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const shots = [['Care1440',1440,1400],['Care1280',1280,1300],['Care768',768,1700],['Care375',375,1900]];
const b = await chromium.launch({ executablePath: EXEC });
for (const [n,w,h] of shots) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  await p.goto(`file://${process.cwd()}/.preview/${n}.html`);
  await p.waitForTimeout(2200);
  const box = await p.evaluate(() => document.body.firstElementChild.getBoundingClientRect().height);
  await p.screenshot({ path:`.preview/${n}.png`, fullPage:true });
  console.log(n, 'height', Math.ceil(box));
  await p.close();
}
await b.close();
