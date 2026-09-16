import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errs = [];
for (const [page, w, h] of [['index',1440,900],['index',1280,900],['index',768,900],['index',375,812],
                            ['first-week-check',1440,900],['gift-flow',1440,900]]) {
  const p = await b.newPage({ viewport:{width:w,height:h} });
  p.on('console', m => { if (m.type()==='error') errs.push(`${page}@${w}: ${m.text()}`); });
  p.on('pageerror', e => errs.push(`${page}@${w}: ${e.message}`));
  await p.goto(`file://${process.cwd()}/${page}.html`);
  await p.waitForTimeout(1200);
  // scroll through so every observer fires
  const H = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 600) { await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(90); }
  await p.waitForTimeout(1400);
  const unrevealed = await p.evaluate(() => document.querySelectorAll('[data-reveal]:not(.in),[data-fade]:not(.in)').length);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  console.log(`${page} @${w}  height ${H}  unrevealed ${unrevealed}  h-overflow ${overflow}`);
  await p.screenshot({ path:`.shots/${page}-${w}.png`, fullPage:true });
  await p.close();
}
// packages interaction
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto(`file://${process.cwd()}/index.html`);
await p.waitForTimeout(1000);
await p.evaluate(() => document.getElementById('packages').scrollIntoView());
await p.waitForTimeout(900);
await p.click('.pkg:nth-child(3) .pkg__head');
await p.waitForTimeout(900);
const openH = await p.evaluate(() => document.querySelector('.pkg.is-open .pkg__panel').getBoundingClientRect().height);
const expanded = await p.evaluate(() => document.querySelector('.pkg.is-open .pkg__head').getAttribute('aria-expanded'));
console.log('open panel height', Math.round(openH), 'aria-expanded', expanded);
await p.screenshot({ path:'.shots/pkg-open.png', fullPage:false });
await p.close();
await b.close();
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no console errors');
