import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto(`file://${process.cwd()}/index.html`);
await p.waitForTimeout(1500);
const H = await p.evaluate(()=>document.body.scrollHeight);
for(let y=0;y<H;y+=600){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(80);}
await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{
  const c=document.querySelector('.turn__cap');
  const r=c.getBoundingClientRect();
  const tops=[...document.querySelectorAll('.step h3')].map(h=>Math.round(h.getBoundingClientRect().top));
  return { cap: c.textContent.slice(0,30), capOpacity: getComputedStyle(c).opacity, capH: Math.round(r.height),
           stepTitleTops: tops, aligned: new Set(tops).size===1 };
}));
await b.close();
