import { chromium } from 'playwright';
const [f,w,y,h,name] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport:{width:+w,height:900} });
await p.goto(`file://${process.cwd()}/${f}.html`);
await p.waitForTimeout(2500);
const H = await p.evaluate(() => document.body.scrollHeight);
for (let v=0; v<H; v+=600){ await p.evaluate(s=>window.scrollTo(0,s), v); await p.waitForTimeout(80); }
await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(1500);
await p.screenshot({ path:`.shots/${name}.png`, clip:{x:0,y:+y,width:+w,height:+h}, fullPage:true });
await b.close(); console.log('ok');
