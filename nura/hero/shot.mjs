import { chromium } from 'playwright';
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const shots = [
  ['Main', 1440, 860], ['Hero1280', 1280, 800], ['Hero768', 768, 1020], ['Hero375', 375, 1180],
];
const b = await chromium.launch({ executablePath: EXEC });
for (const [name, w, h] of shots) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto(`file://${process.cwd()}/.preview/${name}.html`);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `.preview/${name}.png` });
  await p.close();
  console.log('shot', name);
}
await b.close();
