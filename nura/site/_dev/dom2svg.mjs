import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const SERIALIZE = () => {
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const px = n => Math.round(n * 100) / 100;
  const SX = window.scrollX, SY = window.scrollY;

  // colour -> {hex, alpha}; null when fully transparent
  const col = v => {
    if (!v || v === 'transparent' || v === 'none') return null;
    const m = v.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(s => parseFloat(s));
    const a = p.length > 3 ? p[3] : 1;
    if (a === 0) return null;
    const hex = '#' + p.slice(0,3).map(n => Math.round(n).toString(16).padStart(2,'0')).join('');
    return { hex, a };
  };

  // baseline offset, measured from the real font rather than guessed
  const cv = document.createElement('canvas').getContext('2d');
  const ascentOf = (font, sample) => { cv.font = font; const m = cv.measureText(sample || 'Hxy'); return m.actualBoundingBoxAscent || 0; };

  const out = [];
  const defs = [];
  let gid = 0;
  function gradientFill(cs) {
    const bi = cs.backgroundImage || '';
    if (!bi.startsWith('linear-gradient')) return null;
    const inner = bi.slice(bi.indexOf('(') + 1, bi.lastIndexOf(')'));
    const parts = []; let depth = 0, cur = '';
    for (const ch of inner) {
      if (ch === '(') depth++; if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
    }
    parts.push(cur.trim());
    let angle = 180;
    if (/deg\s*$/.test(parts[0])) angle = parseFloat(parts.shift());
    else if (/^to /.test(parts[0])) { const d = parts.shift();
      angle = /top/.test(d) ? (/right/.test(d) ? 45 : /left/.test(d) ? 315 : 0)
            : /bottom/.test(d) ? (/right/.test(d) ? 135 : /left/.test(d) ? 225 : 180)
            : /right/.test(d) ? 90 : 270; }
    const stops = parts.map((t, i) => {
      const m = t.match(/(rgba?\([^)]+\)|#[0-9a-f]+)\s*([\d.]+%)?/i);
      if (!m) return null;
      const c = col(m[1]);
      const off = m[2] || (i / Math.max(1, parts.length - 1) * 100) + '%';
      return c ? `<stop offset="${off}" stop-color="${c.hex}"${c.a<1?` stop-opacity="${c.a}"`:''}/>` : null;
    }).filter(Boolean);
    if (!stops.length) return null;
    const rad = angle * Math.PI / 180;
    const dx = Math.sin(rad), dy = -Math.cos(rad);
    const k = 1 / (Math.abs(dx) + Math.abs(dy));
    const id = 'grad' + (gid++);
    defs.push(`<linearGradient id="${id}" x1="${px(0.5-dx*k/2)}" y1="${px(0.5-dy*k/2)}" x2="${px(0.5+dx*k/2)}" y2="${px(0.5+dy*k/2)}">${stops.join('')}</linearGradient>`);
    return `url(#${id})`;
  }
  const nameOf = el => {
    const dn = el.getAttribute('data-name'); if (dn) return dn;
    const id = el.id; if (id) return id;
    const cls = (el.getAttribute('class') || '').split(' ').filter(Boolean)[0];
    return (cls || el.tagName.toLowerCase()).replace(/[^\w-]/g, '');
  };

  function rectFor(cs, r, el) {
    const grad = gradientFill(cs);
    const bg = col(cs.backgroundColor);
    const radius = ['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius']
      .map(k => parseFloat(cs[k]) || 0);
    const rMax = Math.max(...radius);
    if (grad || bg) {
      const fill = grad || bg.hex;
      const op = (!grad && bg.a < 1) ? ` fill-opacity="${px(bg.a)}"` : '';
      out.push(`<rect x="${px(r.left+SX)}" y="${px(r.top+SY)}" width="${px(r.width)}" height="${px(r.height)}"${rMax ? ` rx="${px(rMax)}"` : ''} fill="${fill}"${op}/>`);
    }
    // borders as their own rects — this design uses single-side hairlines constantly
    const sides = [['Top',r.left,r.top,r.width,0],['Bottom',r.left,r.bottom,r.width,0],
                   ['Left',r.left,r.top,0,r.height],['Right',r.right,r.top,0,r.height]];
    for (const [side,x,y,w,h] of sides) {
      const bw = parseFloat(cs['border'+side+'Width']) || 0;
      if (!bw) continue;
      const bc = col(cs['border'+side+'Color']); if (!bc) continue;
      if (cs['border'+side+'Style'] === 'none') continue;
      const dash = cs['border'+side+'Style'] === 'dashed' ? ` stroke-dasharray="3 3"` : '';
      const isH = w > 0;
      out.push(`<rect x="${px((isH?x:x-bw/2)+SX)}" y="${px((isH?y-bw/2:y)+SY)}" width="${px(isH?w:bw)}" height="${px(isH?bw:h)}" fill="${bc.hex}"${dash}/>`);
    }
  }

  function textFor(node, cs) {
    const raw = node.textContent;
    if (!raw || !raw.trim()) return;
    const range = document.createRange();
    const groups = [];
    for (let i = 0; i < raw.length; i++) {
      range.setStart(node, i); range.setEnd(node, i + 1);
      const rc = range.getBoundingClientRect();
      if (!rc.width && !rc.height) continue;
      const key = Math.round(rc.top);
      let g = groups.find(g => Math.abs(g.top - key) < 2);
      if (!g) { g = { top: key, from: i, to: i }; groups.push(g); }
      g.to = i;
    }
    const size = parseFloat(cs.fontSize);
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const weight = cs.fontWeight;
    const style = cs.fontStyle === 'italic' ? ' font-style="italic"' : '';
    const fill = col(cs.color); if (!fill) return;
    const ls = parseFloat(cs.letterSpacing);
    const font = `${cs.fontStyle} ${weight} ${size}px ${cs.fontFamily}`;

    for (const g of groups) {
      let s = g.from, e = g.to;
      while (s <= e && /\s/.test(raw[s])) s++;
      while (e >= s && /\s/.test(raw[e])) e--;
      if (e < s) continue;
      range.setStart(node, s); range.setEnd(node, e + 1);
      const rc = range.getBoundingClientRect();
      let txt = raw.slice(s, e + 1);
      const tt = cs.textTransform;
      if (tt === 'uppercase') txt = txt.toUpperCase();
      else if (tt === 'lowercase') txt = txt.toLowerCase();
      else if (tt === 'capitalize') txt = txt.replace(/\b\w/g, c => c.toUpperCase());
      const asc = ascentOf(font, txt) || size * 0.74;
      out.push(`<text x="${px(rc.left+SX)}" y="${px(rc.top+SY+asc)}" font-family="${esc(fam)}" font-size="${px(size)}" font-weight="${weight}"${style}${ls?` letter-spacing="${px(ls)}"`:''} fill="${fill.hex}"${fill.a<1?` fill-opacity="${px(fill.a)}"`:''}>${esc(txt)}</text>`);
    }
  }

  function walk(el, depth) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return;

    if (el.tagName.toLowerCase() === 'svg') {
      const clone = el.cloneNode(true);
      clone.removeAttribute('style');
      out.push(`<g transform="translate(${px(r.left+SX)},${px(r.top+SY)})">${clone.outerHTML}</g>`);
      return;
    }

    const named = depth <= 3;
    if (named) out.push(`<g id="${nameOf(el)}">`);
    rectFor(cs, r, el);
    for (const child of el.childNodes) {
      if (child.nodeType === 3) textFor(child, cs);
      else if (child.nodeType === 1) walk(child, depth + 1);
    }
    if (named) out.push(`</g>`);
  }

  const root = document.body;
  const W = root.scrollWidth, H = root.scrollHeight;
  for (const child of root.children) walk(child, 1);
  return { body: out.join('\n'), defs: defs.join('\n'), W, H };
};

const FREEZE = `
  *,*::before,*::after{transition:none!important;animation:none!important}
  [data-reveal],[data-fade]{opacity:1!important;transform:none!important}
  [data-draw],[data-draw-y]{transform:none!important}
`;

const JOBS = [
  ['index', 1440, 'Landing-1440'], ['index', 1280, 'Landing-1280'],
  ['index', 768, 'Landing-768'],  ['index', 375, 'Landing-375'],
  ['first-week-check', 1440, 'FirstWeekCheck-1440'], ['first-week-check', 375, 'FirstWeekCheck-375'],
  ['gift-flow', 1440, 'GiftFlow-1440'], ['gift-flow', 375, 'GiftFlow-375'],
];

mkdirSync('../figma-svg', { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [file, w, name] of JOBS) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(`file://${process.cwd()}/${file}.html`);
  await p.waitForTimeout(2500);
  await p.addStyleTag({ content: FREEZE });
  // open the first package so the open state ships as its own layer set
  if (file === 'index') { await p.evaluate(() => { const h = document.querySelector('.pkg .pkg__head'); if (h) h.click(); }); await p.waitForTimeout(700); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  const { body, defs, W, H } = await p.evaluate(SERIALIZE);
  writeFileSync(`../figma-svg/${name}.svg`,
`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.ceil(H)}" viewBox="0 0 ${w} ${Math.ceil(H)}">
<defs>\n${defs}\n</defs>
<rect width="${w}" height="${Math.ceil(H)}" fill="#F7F3ED"/>
${body}
</svg>`);
  console.log(name, w + '×' + Math.ceil(H), (body.match(/<text/g)||[]).length + ' text', (body.match(/<rect/g)||[]).length + ' rect');
  await p.close();
}
await b.close();
