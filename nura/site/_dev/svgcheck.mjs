import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'node:fs';
const [name, w, y, h] = process.argv.slice(2);
const svg = readFileSync(`../figma-svg/${name}.svg`, 'utf8');
writeFileSync('.shots/_wrap.html', `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,400&family=Instrument+Sans:wght@400;500&display=swap">
<style>body{margin:0}</style></head><body>${svg}</body></html>`);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport:{width:+w,height:+h} });
await p.goto(`file://${process.cwd()}/.shots/_wrap.html`);
await p.waitForTimeout(3000);
await p.evaluate(v => window.scrollTo(0, v), +y);
await p.waitForTimeout(400);
await p.screenshot({ path:`.shots/svg-${name}.png` });
await b.close(); console.log('ok');
