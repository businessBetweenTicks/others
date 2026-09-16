import { writeFileSync } from 'node:fs';

const T = { ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
            ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61' };

const arrow = `<svg width="14" height="9" viewBox="0 0 14 9" fill="none" style="display:block;"><path d="M0 4.5H12.5M9 1L12.8 4.5L9 8" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linejoin="round"/></svg>`;

const head = (w, minH) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,400&family=Instrument+Sans:wght@400;500&display=swap">
  <style>
    body { margin: 0; font-family: 'Instrument Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: ${T.ink2}; text-decoration: none; }
    .serif { font-family: 'Newsreader', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif; }
    .lbl { font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3}; }
  </style>
</helmet>

<div style="width:${w}px;min-height:${minH}px;background:${T.ground};color:${T.ink};box-sizing:border-box;">`;
const tail = `
</div>
</x-dc>
</body>
</html>
`;

// ============ 2 · The problem, in her words ============
const PROBLEM = [
  'Care mostly stops after the hospital.',
  'The six-week visit comes and goes. The referral nobody chased. The question nobody answered at 2am.',
  'In the months she is least herself, she is the one holding it all.',
];

const problem = (o) => `
  <div style="padding:${o.padY}px ${o.margin}px;background:${T.field};">
    <div style="display:flex;flex-direction:column;gap:${o.pGap}px;max-width:${o.pMax}px;">
${PROBLEM.map((t,i) => `      <div class="serif" style="font-size:${i===0?o.p1:o.p2}px;font-weight:400;line-height:1.24;letter-spacing:-0.018em;color:${i===1?T.ink2:T.ink};text-wrap:pretty;">${t}</div>`).join('\n')}
    </div>
  </div>`;

// ============ 3 · What Nura does, as a thread ============
const THREAD = [
  ['Two days home. Is now a good time?', 0],
  ['Feeding is hard', 1],
  ['A lactation nurse can come to you Thursday at ten. Booked.', 0],
  ['Your referral to the physio went this morning. They have you for the 9th.', 0],
  ['Six-week visit, Tuesday 10. Ana comes to hold the baby.', 0],
  ['There is a tea on Thursday, five minutes away. No reply needed.', 0],
];

const thread = (o) => `
  <div style="padding:${o.padY}px ${o.margin}px;">
    <div style="display:grid;grid-template-columns:${o.stack ? 'minmax(0,1fr)' : 'minmax(0,5fr) minmax(0,6fr)'};gap:${o.gap}px;align-items:${o.stack ? 'start' : 'center'};">
      <div>
        <div style="font-size:${o.eyebrow}px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.moss};">What Nura does</div>
        <h2 class="serif" style="margin:${o.headMt}px 0 0 0;font-size:${o.h2}px;font-weight:400;line-height:1.1;letter-spacing:-0.02em;max-width:${o.h2Max}px;text-wrap:pretty;">This is the whole thing.</h2>
        <p style="margin:${o.leadMt}px 0 0 0;font-size:${o.lead}px;line-height:1.66;color:${T.ink2};max-width:${o.leadMax}px;text-wrap:pretty;">A text thread, for as long as she needs it. Nothing to install, nothing to log into, nothing to check.</p>
        <div class="serif" style="margin-top:${o.noAppMt}px;font-size:${o.noApp}px;font-weight:400;line-height:1.2;letter-spacing:-0.015em;color:${T.ink};">No app.</div>
      </div>
      <div style="${o.stack ? '' : 'justify-self:end;'}width:${o.deviceW}px;max-width:100%;box-sizing:border-box;background:${T.paper};border:1px solid ${T.hairline};border-radius:30px;box-shadow:0 24px 60px -30px rgba(28,26,23,0.30);padding:${o.devicePad};display:flex;flex-direction:column;gap:${o.bubGap}px;">
${THREAD.map(([t,mine]) => mine
  ? `        <div style="align-self:flex-end;background:${T.plum};color:${T.ground};border-radius:14px 14px 3px 14px;padding:${o.bubPad};font-size:${o.bub}px;line-height:1.45;max-width:${o.bubMax}%;">${t}</div>`
  : `        <div style="align-self:flex-start;background:${T.field};border-radius:14px 14px 14px 3px;padding:${o.bubPad};font-size:${o.bub}px;line-height:1.45;color:${T.ink};max-width:${o.bubMax}%;">${t}</div>`).join('\n')}
      </div>
    </div>
  </div>`;

// ============ 9 · The physical gift ============
const gift = (o) => `
  <div style="padding:${o.padY}px 0 0 0;">
    <div style="display:grid;grid-template-columns:${o.stack ? 'minmax(0,1fr)' : 'minmax(0,5fr) minmax(0,6fr)'};gap:${o.gap}px;align-items:center;">
      <div style="padding:0 ${o.margin}px;${o.stack ? `margin-bottom:${o.gap}px;` : ''}">
        <div style="font-size:${o.eyebrow}px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.moss};">The physical gift</div>
        <h2 class="serif" style="margin:${o.headMt}px 0 0 0;font-size:${o.h2}px;font-weight:400;line-height:1.1;letter-spacing:-0.02em;max-width:${o.h2Max}px;">Something to hold.</h2>
        <p style="margin:${o.leadMt}px 0 0 0;font-size:${o.lead}px;line-height:1.66;color:${T.ink2};max-width:${o.leadMax}px;text-wrap:pretty;">The wrap, her name stitched inside, in a box with a card in your words.</p>
        <p style="margin:${o.leadMt2}px 0 0 0;font-size:${o.lead}px;line-height:1.66;color:${T.ink2};max-width:${o.leadMax}px;text-wrap:pretty;">That is the part you hand over. The companion is what is inside it.</p>
      </div>
      <div style="position:relative;height:${o.plateH}px;background:linear-gradient(118deg, #F3EEE6 0%, #E9E1D6 46%, #DCD2C4 100%);${o.stack ? '' : 'border-radius:2px 0 0 2px;'}overflow:hidden;">
        <div style="position:absolute;inset:0;opacity:0.055;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'160\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\'/></filter><rect width=\\'160\\' height=\\'160\\' filter=\\'url(%23n)\\'/></svg>');"></div>
        <div style="position:absolute;left:${o.platePad}px;bottom:${o.platePad}px;font-size:${o.plate}px;line-height:1.55;color:${T.ink2};max-width:${o.plateMax}px;">Shot 02 — the wrap as an object, 4:5, folded, her name just legible in the stitch. Art direction on page 1.</div>
      </div>
    </div>
  </div>`;

// ============ 10 · Chip in together, and close ============
const close = (o) => `
  <div style="padding:${o.padY}px ${o.margin}px ${o.closeB}px ${o.margin}px;">
    <div style="display:grid;grid-template-columns:${o.stack ? 'minmax(0,1fr)' : 'minmax(0,5fr) minmax(0,6fr)'};gap:${o.gap}px;align-items:start;">
      <div>
        <div style="font-size:${o.eyebrow}px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.moss};">Chip in together</div>
        <h2 class="serif" style="margin:${o.headMt}px 0 0 0;font-size:${o.h2}px;font-weight:400;line-height:1.1;letter-spacing:-0.02em;max-width:${o.h2Max}px;text-wrap:pretty;">Start it, then send the link.</h2>
      </div>
      <p style="margin:0;font-size:${o.lead}px;line-height:1.66;color:${T.ink2};max-width:${o.leadMax}px;text-wrap:pretty;">Her people add to the same one. Nobody assembles anything, nobody is chased for money, and nobody is shown what anyone gave.</p>
    </div>

    <div style="margin-top:${o.finalMt}px;padding-top:${o.finalPt}px;border-top:1px solid ${T.ink};">
      <div class="serif" style="font-size:${o.final}px;font-weight:400;line-height:1.08;letter-spacing:-0.025em;max-width:${o.finalMax}px;text-wrap:pretty;">Give her the months after, not just the gift.</div>
      <div style="margin-top:${o.ctaMt}px;">
        <a href="#" style="display:${o.ctaFull ? 'flex' : 'inline-flex'};align-items:center;justify-content:center;gap:12px;background:${T.plum};color:${T.ground};font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;padding:${o.ctaFull ? '0' : '19px 34px'};${o.ctaFull ? 'height:56px;' : ''}border-radius:2px;">Start a gift ${arrow}</a>
      </div>
      <div class="serif" style="margin-top:${o.fromMt}px;font-size:${o.from}px;font-style:italic;line-height:1.5;color:${T.ink2};max-width:${o.fromMax}px;text-wrap:pretty;">from a mother who spent seven months being told nothing was wrong</div>
    </div>
  </div>`;

// ============ footer ============
const footer = (o) => `
  <div style="padding:${o.footY}px ${o.margin}px;border-top:1px solid ${T.hairline};display:flex;flex-wrap:wrap;gap:${o.footGap}px;align-items:baseline;justify-content:space-between;">
    <div class="serif" style="font-size:${o.mark}px;letter-spacing:0.02em;color:${T.ink};">Nura</div>
    <div style="display:flex;flex-wrap:wrap;gap:${o.footGap}px;">
      <a href="#" style="font-size:${o.footLink}px;">First Week Check</a>
      <a href="#" style="font-size:${o.footLink}px;">Packages</a>
      <a href="#" style="font-size:${o.footLink}px;">What we do with her information</a>
      <a href="#" style="font-size:${o.footLink}px;">Contact</a>
    </div>
    <div style="font-size:${o.footLink}px;color:${T.ink3};">Grisaille Labs</div>
  </div>`;

export const PARTS = { problem, thread, gift, close, footer };

const OPTS = {
  1440: { margin:96, padY:72, gap:88, eyebrow:11, headMt:32, h2:46, h2Max:520, lead:19, leadMax:500, leadMt:28, leadMt2:18,
          pGap:24, p1:52, p2:36, pMax:1000,
          noAppMt:40, noApp:34, deviceW:520, devicePad:'34px 30px', bubGap:12, bub:15.5, bubPad:'14px 19px', bubMax:88,
          plateH:400, platePad:36, plate:13.5, plateMax:420,
          closeB:96, finalMt:64, finalPt:52, final:72, finalMax:1000, ctaMt:52, fromMt:36, from:19, fromMax:560,
          footY:44, footGap:32, mark:20, footLink:13.5 },
  1280: { margin:64, padY:64, gap:64, eyebrow:11, headMt:24, h2:40, h2Max:460, lead:17.5, leadMax:460, leadMt:24, leadMt2:16,
          pGap:26, p1:46, p2:31, pMax:880,
          noAppMt:36, noApp:30, deviceW:470, devicePad:'30px 26px', bubGap:11, bub:14.5, bubPad:'13px 17px', bubMax:88,
          plateH:372, platePad:30, plate:13, plateMax:380,
          closeB:80, finalMt:52, finalPt:44, final:60, finalMax:880, ctaMt:44, fromMt:30, from:17.5, fromMax:520,
          footY:38, footGap:26, mark:18, footLink:13 },
  768:  { margin:48, padY:56, gap:40, stack:true, eyebrow:11, headMt:24, h2:38, h2Max:520, lead:17, leadMax:560, leadMt:22, leadMt2:16,
          pGap:22, p1:40, p2:28, pMax:620,
          noAppMt:32, noApp:28, deviceW:480, devicePad:'28px 24px', bubGap:10, bub:14.5, bubPad:'13px 17px', bubMax:90,
          plateH:360, platePad:26, plate:13, plateMax:420,
          closeB:72, finalMt:48, finalPt:40, final:46, finalMax:620, ctaMt:40, fromMt:28, from:17, fromMax:520,
          footY:34, footGap:22, mark:18, footLink:13 },
  375:  { margin:24, padY:44, gap:28, stack:true, eyebrow:10.5, headMt:20, h2:31, h2Max:340, lead:16, leadMax:340, leadMt:20, leadMt2:14,
          pGap:18, p1:30, p2:22, pMax:340,
          noAppMt:26, noApp:25, deviceW:327, devicePad:'22px 18px', bubGap:9, bub:14, bubPad:'12px 15px', bubMax:92,
          plateH:280, platePad:20, plate:12.5, plateMax:300,
          closeB:56, finalMt:40, finalPt:32, final:34, finalMax:340, ctaMt:36, ctaFull:true, fromMt:24, from:16, fromMax:340,
          footY:30, footGap:16, mark:18, footLink:13 },
};
export const OPTIONS = OPTS;

if (process.argv[1].endsWith('build-rest.mjs')) {
  for (const w of [1440, 1280, 768, 375]) {
    const o = OPTS[w];
    writeFileSync(`Rest${w}.dc.html`, head(w, 100) + problem(o) + thread(o) + gift(o) + close(o) + footer(o) + tail);
  }
  console.log('wrote 4 remaining-section artboards');
}
