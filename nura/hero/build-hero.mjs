import { writeFileSync } from 'node:fs';

const T = {
  ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
  ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61',
};

const LIGHT = `<div style="position: absolute; inset: 0; background: radial-gradient(82% 58% at 26% 0%, rgba(255,253,250,0.72) 0%, rgba(255,253,250,0.26) 44%, rgba(255,253,250,0) 74%);"></div>`;
const GRAIN = `<div style="position: absolute; inset: 0; opacity: 0.05; background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E&quot;);"></div>`;

const ROWS = [
  ['Six-week visit', 'Booked · Tue 10:00'],
  ['Dinners', 'Tue · Thu · Sat, from tonight'],
  ['The walk', 'Thursday 16:00 · sitter coming'],
];
const LEAD = 'For the months after the baby, when everyone is looking at the baby. Nura handles her appointments, her referrals, her recovery. She replies with one word.';
const H1 = 'A gift that does the work <em style="font-style: italic;">for her.</em>';
const EYEBROW = 'A gift for a new mother';
const CTA = 'See the gift';
const CAPTION = 'She did none of it.';
const HELLO = 'Hi Maya. It’s Nura. Is now a good time?';
const VISIT = 'Your six-week visit is Tuesday at 10. Someone will be there for the baby.';
const DINNER = 'Dinner lands at six tonight, then Thursday and Saturday.';
const WALK = 'Thursday at four is yours. I’ve asked Ana to come for the baby.';

const arrow = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="${T.ground}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h10M8 3l4 4-4 4"></path></svg>`;
const tick = (s=15) => `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="none" stroke="${T.moss}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M3 8.6 6.2 11.8 13 5"></path></svg>`;
const label = (t, mb) => `<div style="font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: ${mb}px;">${t}</div>`;

// The phone is back, but it is sized BY its content — there is no fixed height to
// half fill, so it can never read as an empty glass pane again.
const phone = (o) => {
  const bIn = t => `          <div style="max-width: ${o.bubbleMax}px; background: ${T.field}; border-radius: 14px 14px 14px 4px; padding: ${o.bubblePad}; font-size: ${o.bubble}px; line-height: 1.5; color: ${T.ink};">${t}</div>`;
  const bOut = t => `          <div style="align-self: flex-end; background: ${T.plum}; color: ${T.ground}; border-radius: 14px 14px 4px 14px; padding: ${o.bubblePadOut}; font-size: ${o.bubble}px; line-height: 1.5;">${t}</div>`;
  return `      <div style="width: ${o.phoneW}px; flex-shrink: 0; background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 30px; box-shadow: 0 24px 60px -30px rgba(28,26,23,0.30); padding: ${o.phonePad}; box-sizing: border-box; display: flex; flex-direction: column; align-items: flex-start; gap: ${o.bubbleGap}px;">
          <div style="font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 6px;">Nura</div>
${bIn(HELLO)}
${bOut('yes')}
${bIn(VISIT)}
${bOut('ok')}
${bIn(DINNER)}${o.shortThread ? '' : `
${bIn(WALK)}
${bOut('thank you')}`}
      </div>`;
};

// A ledger, not a dashboard: hairlines and type, no boxes, no shadows.
const ledger = (o) => ROWS.map(([t, s], i) => `
      <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 20px; padding: ${o.rowPad}px 0; border-top: 1px solid ${T.hairline};${i === ROWS.length - 1 ? ` border-bottom: 1px solid ${T.hairline};` : ''}">
        <div style="display: flex; align-items: center; gap: 13px;">${tick(o.tick)}<div style="font-size: ${o.rowTitle}px; color: ${T.ink};">${t}</div></div>
        <div style="font-size: ${o.rowMeta}px; color: ${T.ink3}; text-align: right; white-space: nowrap;">${s}</div>
      </div>`).join('');

const thread375 = (o) => {
  const bIn = t => `        <div style="max-width: ${o.bubbleMax}px; background: ${T.paper}; border-radius: 14px 14px 14px 4px; padding: ${o.bubblePad}; font-size: ${o.bubble}px; line-height: 1.52; color: ${T.ink};">${t}</div>`;
  const bOut = t => `        <div style="align-self: flex-end; background: ${T.plum}; color: ${T.ground}; border-radius: 14px 14px 4px 14px; padding: ${o.bubblePadOut}; font-size: ${o.bubble}px; line-height: 1.52;">${t}</div>`;
  return `      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: ${o.bubbleGap}px;">
${bIn(HELLO)}
${bOut('yes')}
${bIn(VISIT)}
${bOut('ok')}
${bIn(DINNER)}
      </div>`;
};

const caption = (o) => `      <div class="serif" style="font-size: ${o.capSize}px; line-height: 1.4; font-style: italic; color: ${T.ink2}; margin-top: ${o.capMt}px;">${CAPTION}</div>`;

const head = (w, minH) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Instrument+Sans:wght@400;500;600&display=swap">
  <style>
    body { margin: 0; font-family: 'Instrument Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: ${T.ink2}; text-decoration: none; }
    a:hover { color: ${T.ink}; }
    .serif { font-family: 'Newsreader', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif; }
  </style>
</helmet>

<div style="width: ${w}px; min-height: ${minH}px; background: ${T.ground}; color: ${T.ink}; display: flex; flex-direction: column;">`;

const tail = `
</div>
</x-dc>
</body>
</html>
`;

const navWide = (o) => `
  <div style="display: flex; align-items: center; justify-content: space-between; padding: ${o.navTop}px ${o.margin}px 0 ${o.margin}px;">
    <div class="serif" style="font-size: ${o.wordmark}px; font-weight: 400; letter-spacing: 0.02em; color: ${T.ink};">Nura</div>
    <div style="display: flex; align-items: center; gap: ${o.navGap}px;">
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">The gift</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">How it works</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">Packages</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">First Week Check</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em; color: ${T.plum}; border-bottom: 1px solid ${T.mute}; padding-bottom: 5px;">Start a gift</a>
    </div>
  </div>`;

const copyCol = (o) => `
      <div style="font-size: ${o.eyebrow}px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: ${T.moss}; margin-bottom: ${o.eyebrowMb}px;">${EYEBROW}</div>
      <h1 class="serif" style="margin: 0; font-size: ${o.h1}px; font-weight: 400; line-height: ${o.h1lh}; letter-spacing: ${o.h1ls}; color: ${T.ink};${o.h1Max ? ` max-width: ${o.h1Max}px;` : ''} text-wrap: pretty;">${H1}</h1>
      <p style="margin: ${o.leadMt}px 0 0 0; font-size: ${o.lead}px; line-height: 1.62; color: ${T.ink2};${o.leadMax ? ` max-width: ${o.leadMax}px;` : ''} text-wrap: pretty;">${LEAD}</p>`;

const cta = (o) => `      <a href="#" style="display: inline-flex; align-items: center; gap: 12px; background: ${T.plum}; color: ${T.ground}; font-size: ${o.btn}px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: ${o.btnPad}; border-radius: 2px;">${CTA} ${arrow}</a>`;

const cue = (o, l) => `
    <div style="display: flex; align-items: center; gap: 16px; margin-top: auto; padding-bottom: ${o.cueMb}px;">
      <div style="width: 48px; height: 1px; background: ${T.mute};"></div>
      <div style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3};">${l}</div>
    </div>`;

// ================= 1440 — media side bleeds to the right edge and off the bottom =================
{
  const o = { margin:96, navTop:36, navGap:40, wordmark:24, nav:14, eyebrow:11, eyebrowMb:32,
    h1:78, h1lh:1.03, h1ls:'-0.024em', lead:19, leadMt:32, leadMax:470, cueMb:48, btn:14, btnPad:'20px 40px',
    phoneW:268, phonePad:'22px 18px', bubble:13, bubbleMax:196, bubblePad:'11px 13px', bubblePadOut:'10px 14px', bubbleGap:9,
    rowPad:18, rowTitle:14.5, rowMeta:12, tick:15, capSize:20, capMt:32 };
  writeFileSync('Main.dc.html', head(1440, 840) + navWide(o) + `
  <div style="display: flex; align-items: stretch; flex: 1;">
    <div style="width: 700px; flex-shrink: 0; box-sizing: border-box; padding: 120px 64px 0 96px; display: flex; flex-direction: column;">${copyCol(o)}
      <div style="margin-top: 48px;">
${cta(o)}
      </div>
${cue(o, 'Next — the problem, in her words')}
    </div>
    <div style="flex: 1; position: relative; margin-top: 120px; background: ${T.field}; overflow: hidden;">${LIGHT}${GRAIN}
      <div style="position: relative; height: 100%; box-sizing: border-box; padding: 56px 96px 56px 64px; display: flex; align-items: center; gap: 48px;">
${phone(o)}
        <div style="flex: 1;">
${label('Handled', 10)}
${ledger(o)}
${caption(o)}
        </div>
      </div>
    </div>
  </div>` + tail);
}

// ================= 1280 =================
{
  const o = { margin:64, navTop:32, navGap:32, wordmark:22, nav:13.5, eyebrow:11, eyebrowMb:24,
    h1:63, h1lh:1.04, h1ls:'-0.022em', lead:17.5, leadMt:24, leadMax:430, cueMb:40, btn:13, btnPad:'20px 32px',
    phoneW:240, phonePad:'20px 16px', bubble:12.5, bubbleMax:186, bubblePad:'10px 12px', bubblePadOut:'9px 13px', bubbleGap:8,
    rowPad:16, rowTitle:14, rowMeta:11.5, tick:15, capSize:18.5, capMt:28 };
  writeFileSync('Hero1280.dc.html', head(1280, 780) + navWide(o) + `
  <div style="display: flex; align-items: stretch; flex: 1;">
    <div style="width: 620px; flex-shrink: 0; box-sizing: border-box; padding: 100px 56px 0 64px; display: flex; flex-direction: column;">${copyCol(o)}
      <div style="margin-top: 40px;">
${cta(o)}
      </div>
${cue(o, 'Next — the problem, in her words')}
    </div>
    <div style="flex: 1; position: relative; margin-top: 100px; background: ${T.field}; overflow: hidden;">${LIGHT}${GRAIN}
      <div style="position: relative; height: 100%; box-sizing: border-box; padding: 48px 64px 48px 56px; display: flex; align-items: center; gap: 36px;">
${phone(o)}
        <div style="flex: 1;">
${label('Handled', 10)}
${ledger(o)}
${caption(o)}
        </div>
      </div>
    </div>
  </div>` + tail);
}

// ================= 768 — stage bleeds edge to edge, thread and ledger side by side =================
{
  const o = { eyebrow:11, eyebrowMb:24, h1:51, h1lh:1.05, h1ls:'-0.02em', h1Max:560,
    lead:17, leadMt:24, leadMax:460, btn:13, btnPad:'20px 32px',
    shortThread:true, phoneW:264, phonePad:'22px 18px', bubble:13, bubbleMax:192, bubblePad:'11px 13px', bubblePadOut:'10px 14px', bubbleGap:9,
    rowPad:16, rowTitle:14, rowMeta:11.5, tick:15, capSize:18.5, capMt:28 };
  writeFileSync('Hero768.dc.html', head(768, 1080) + `
  <div style="display: flex; align-items: center; justify-content: space-between; padding: 24px 48px 0 48px;">
    <div class="serif" style="font-size: 21px; font-weight: 400; letter-spacing: 0.02em;">Nura</div>
    <div style="display: flex; align-items: center; gap: 24px;">
      <a href="#" style="font-size: 13.5px; color: ${T.plum}; border-bottom: 1px solid ${T.mute}; padding-bottom: 5px;">Start a gift</a>
      <div style="display: flex; flex-direction: column; gap: 5px; width: 22px;">
        <div style="height: 1px; background: ${T.ink};"></div>
        <div style="height: 1px; background: ${T.ink};"></div>
      </div>
    </div>
  </div>
  <div style="display: flex; flex-direction: column; padding: 84px 48px 0 48px;">${copyCol(o)}
    <div style="margin-top: 32px;">
${cta(o)}
    </div>
  </div>
  <div style="position: relative; background: ${T.field}; overflow: hidden; margin-top: 72px;">${LIGHT}${GRAIN}
    <div style="position: relative; padding: 56px 48px; display: flex; gap: 44px; align-items: center;">
${phone(o)}
      <div style="flex: 1;">
${label('Handled', 10)}
${ledger(o)}
${caption(o)}
      </div>
    </div>
  </div>
  <div style="display: flex; align-items: center; gap: 16px; margin-top: auto; padding: 0 48px 32px 48px;">
    <div style="width: 48px; height: 1px; background: ${T.mute};"></div>
    <div style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3};">Next — the problem, in her words</div>
  </div>` + tail);
}

// ================= 375 =================
{
  const o = { bubble:14, bubbleMax:252, bubblePad:'11px 14px', bubblePadOut:'10px 15px', bubbleGap:9, outIndent:24,
    rowPad:15, rowTitle:14, rowMeta:11.5, tick:15, capSize:17.5, capMt:26 };
  writeFileSync('Hero375.dc.html', head(375, 1180) + `
  <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px 0 24px;">
    <div class="serif" style="font-size: 20px; font-weight: 400; letter-spacing: 0.02em;">Nura</div>
    <div style="display: flex; flex-direction: column; gap: 5px; width: 22px; padding: 12px 0;">
      <div style="height: 1px; background: ${T.ink};"></div>
      <div style="height: 1px; background: ${T.ink};"></div>
    </div>
  </div>

  <div style="display: flex; flex-direction: column; padding: 48px 24px 0 24px;">
    <div style="font-size: 10.5px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: ${T.moss}; margin-bottom: 20px;">${EYEBROW}</div>
    <h1 class="serif" style="margin: 0; font-size: 40px; font-weight: 400; line-height: 1.07; letter-spacing: -0.018em; text-wrap: pretty;">${H1}</h1>
    <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.62; color: ${T.ink2}; text-wrap: pretty;">${LEAD}</p>
    <a href="#" style="display: flex; align-items: center; justify-content: center; gap: 12px; background: ${T.plum}; color: ${T.ground}; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; height: 56px; border-radius: 2px; margin-top: 32px;">${CTA} ${arrow}</a>
  </div>

  <div style="position: relative; background: ${T.field}; overflow: hidden; margin-top: 48px;">${LIGHT}${GRAIN}
    <div style="position: relative; padding: 40px 24px 44px 24px;">
${label('Nura', 20)}
${thread375(o)}
      <div style="height: 44px;"></div>
${label('Handled', 10)}
${ledger(o)}
${caption(o)}
    </div>
  </div>

  <div style="display: flex; align-items: center; gap: 14px; margin-top: auto; padding: 0 24px 32px 24px;">
    <div style="width: 36px; height: 1px; background: ${T.mute};"></div>
    <div style="font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3};">Next — in her words</div>
  </div>` + tail);
}

console.log('wrote 4 hero artboards');
