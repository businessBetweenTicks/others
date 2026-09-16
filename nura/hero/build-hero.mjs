import { writeFileSync } from 'node:fs';

const T = {
  ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
  ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61',
};
const LIFT = '0 14px 34px -22px rgba(28,26,23,0.32)';
const LIFT_DEEP = '0 24px 60px -30px rgba(28,26,23,0.30)';

// window light falling from the upper left, and 35mm grain. Warm only, no hue shift.
const LIGHT = `<div style="position: absolute; inset: 0; background: radial-gradient(76% 62% at 20% 8%, rgba(255,253,250,0.92) 0%, rgba(255,253,250,0.34) 42%, rgba(255,253,250,0) 72%);"></div>`;
const GRAIN = `<div style="position: absolute; inset: 0; opacity: 0.055; background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E&quot;);"></div>`;

const CARDS = [
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

const arrow = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="${T.ground}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h10M8 3l4 4-4 4"></path></svg>`;
const tick = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="${T.moss}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.6 6.2 11.8 13 5"></path></svg>`;

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

// The stage: window light on a warm field, the thread bleeding off the bottom edge,
// the things she is no longer chasing settled on the open right.
function stage(o) {
  const bubble = (t, out) => out
    ? `        <div style="align-self: flex-end; background: ${T.plum}; color: ${T.ground}; border-radius: 14px 14px 4px 14px; padding: 9px 14px; font-size: ${o.bubble}px; line-height: 1.5;">${t}</div>`
    : `        <div style="max-width: ${o.bubbleMax}px; background: ${T.field}; border-radius: 14px 14px 14px 4px; padding: 11px 13px; font-size: ${o.bubble}px; line-height: 1.5; color: ${T.ink};">${t}</div>`;

  const cards = CARDS.map(([t, s], i) => `
      <div style="position: absolute; left: ${o.cardX}px; top: ${o.cardY[i]}px; width: ${o.cardW}px; background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 2px; padding: ${o.cardPad}; box-sizing: border-box; display: flex; align-items: center; gap: 13px; box-shadow: ${LIFT};">
        ${tick}
        <div style="display: flex; flex-direction: column; gap: 3px;">
          <div style="font-size: ${o.cardTitle}px; color: ${T.ink};">${t}</div>
          <div style="font-size: ${o.cardSub}px; color: ${T.ink3};">${s}</div>
        </div>
      </div>`).join('');

  return `${LIGHT}${GRAIN}
      <div style="position: absolute; left: ${o.phoneX}px; top: ${o.phoneY}px; width: ${o.phoneW}px; height: ${o.phoneH}px; background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 28px 28px 0 0; box-shadow: ${LIFT_DEEP}; padding: ${o.phonePad}; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px;">
        <div style="font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 6px;">Nura</div>
${bubble(HELLO, false)}
${bubble('yes', true)}
${bubble(VISIT, false)}
${bubble('ok', true)}
      </div>
${cards}
      <div class="serif" style="position: absolute; left: ${o.cardX}px; top: ${o.capY}px; width: ${o.cardW}px; font-size: ${o.capSize}px; line-height: 1.4; font-style: italic; color: ${T.ink3};">${CAPTION}</div>`;
}

const navWide = (o) => `
  <div style="display: flex; align-items: center; justify-content: space-between; padding: ${o.navTop}px ${o.margin}px 0 ${o.margin}px;">
    <div class="serif" style="font-size: ${o.wordmark}px; font-weight: 400; letter-spacing: 0.02em; color: ${T.ink};">Nura</div>
    <div style="display: flex; align-items: center; gap: ${o.navGap}px;">
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">The gift</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">How it works</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">Packages</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">First Week Check</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em; color: ${T.plum}; border-bottom: 1px solid ${T.mute}; padding-bottom: 2px;">Start a gift</a>
    </div>
  </div>`;

const copyCol = (o) => `
      <div style="font-size: ${o.eyebrow}px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: ${T.moss}; margin-bottom: ${o.eyebrowMb}px;">${EYEBROW}</div>
      <h1 class="serif" style="margin: 0; font-size: ${o.h1}px; font-weight: 400; line-height: ${o.h1lh}; letter-spacing: ${o.h1ls}; color: ${T.ink};${o.h1Max ? ` max-width: ${o.h1Max}px;` : ''} text-wrap: pretty;">${H1}</h1>
      <p style="margin: ${o.leadMt}px 0 0 0; font-size: ${o.lead}px; line-height: 1.62; color: ${T.ink2};${o.leadMax ? ` max-width: ${o.leadMax}px;` : ''} text-wrap: pretty;">${LEAD}</p>`;

const cue = (o, label) => `
  <div style="display: flex; align-items: center; gap: 16px; padding: 0 ${o.margin}px; margin-top: auto; margin-bottom: ${o.cueMb}px;">
    <div style="width: 48px; height: 1px; background: ${T.mute};"></div>
    <div style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3};">${label}</div>
  </div>`;

// ---------- 1440 ----------
{
  const o = { margin:96, navTop:32, navGap:40, wordmark:24, nav:14, eyebrow:11, eyebrowMb:32,
    h1:78, h1lh:1.03, h1ls:'-0.024em', lead:19, leadMt:32, leadMax:470, cueMb:48,
    phoneX:36, phoneY:92, phoneW:236, phoneH:560, phonePad:'26px 20px', bubble:12.5, bubbleMax:184,
    cardX:320, cardW:252, cardY:[132,244,356], cardPad:'16px 18px', cardTitle:13, cardSub:11.5,
    capY:462, capSize:19 };
  writeFileSync('Main.dc.html', head(1440, 920) + navWide(o) + `
  <div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 32px; padding: 96px ${o.margin}px 0 ${o.margin}px; align-items: start;">
    <div style="grid-column: 1 / span 5; display: flex; flex-direction: column; padding-top: 16px;">${copyCol(o)}
      <div style="margin-top: 48px;">
        <a href="#" style="display: inline-flex; align-items: center; gap: 12px; background: ${T.plum}; color: ${T.ground}; font-size: 14px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 20px 40px; border-radius: 2px;">${CTA} ${arrow}</a>
      </div>
    </div>
    <div style="grid-column: 7 / span 6; position: relative; height: 600px; background: ${T.field}; border-radius: 2px; overflow: hidden;">${stage(o)}
    </div>
  </div>` + cue(o, 'Next — the problem, in her words') + tail);
}

// ---------- 1280 ----------
{
  const o = { margin:64, navTop:32, navGap:32, wordmark:22, nav:13.5, eyebrow:11, eyebrowMb:24,
    h1:63, h1lh:1.04, h1ls:'-0.022em', lead:17.5, leadMt:24, leadMax:430, cueMb:40,
    phoneX:30, phoneY:80, phoneW:220, phoneH:480, phonePad:'24px 18px', bubble:12.5, bubbleMax:170,
    cardX:288, cardW:240, cardY:[114,216,318], cardPad:'14px 16px', cardTitle:12.5, cardSub:11,
    capY:418, capSize:17.5 };
  writeFileSync('Hero1280.dc.html', head(1280, 840) + navWide(o) + `
  <div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 24px; padding: 80px ${o.margin}px 0 ${o.margin}px; align-items: start;">
    <div style="grid-column: 1 / span 5; display: flex; flex-direction: column; padding-top: 12px;">${copyCol(o)}
      <div style="margin-top: 40px;">
        <a href="#" style="display: inline-flex; align-items: center; gap: 12px; background: ${T.plum}; color: ${T.ground}; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 20px 32px; border-radius: 2px;">${CTA} ${arrow}</a>
      </div>
    </div>
    <div style="grid-column: 7 / span 6; position: relative; height: 520px; background: ${T.field}; border-radius: 2px; overflow: hidden;">${stage(o)}
    </div>
  </div>` + cue(o, 'Next — the problem, in her words') + tail);
}

// ---------- 768 ----------
{
  const o = { margin:48, cueMb:32, eyebrow:11, eyebrowMb:24,
    h1:51, h1lh:1.05, h1ls:'-0.02em', h1Max:560, lead:17, leadMt:24, leadMax:440,
    phoneX:48, phoneY:72, phoneW:228, phoneH:450, phonePad:'24px 18px', bubble:12.5, bubbleMax:178,
    cardX:320, cardW:300, cardY:[104,208,312], cardPad:'14px 16px', cardTitle:12.5, cardSub:11,
    capY:412, capSize:17.5 };
  writeFileSync('Hero768.dc.html', head(768, 1140) + `
  <div style="display: flex; align-items: center; justify-content: space-between; padding: 24px 48px 0 48px;">
    <div class="serif" style="font-size: 21px; font-weight: 400; letter-spacing: 0.02em;">Nura</div>
    <div style="display: flex; align-items: center; gap: 24px;">
      <a href="#" style="font-size: 13.5px; color: ${T.plum}; border-bottom: 1px solid ${T.mute}; padding-bottom: 2px;">Start a gift</a>
      <div style="display: flex; flex-direction: column; gap: 5px; width: 22px;">
        <div style="height: 1px; background: ${T.ink};"></div>
        <div style="height: 1px; background: ${T.ink};"></div>
      </div>
    </div>
  </div>
  <div style="display: flex; flex-direction: column; padding: 80px 48px 0 48px;">${copyCol(o)}
    <div style="margin-top: 32px;">
      <a href="#" style="display: inline-flex; align-items: center; gap: 12px; background: ${T.plum}; color: ${T.ground}; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 20px 32px; border-radius: 2px;">${CTA} ${arrow}</a>
    </div>
  </div>
  <div style="position: relative; height: 480px; margin: 64px 48px 0 48px; background: ${T.field}; border-radius: 2px; overflow: hidden;">${stage(o)}
  </div>` + cue(o, 'Next — the problem, in her words') + tail);
}

// ---------- 375 ----------
{
  const bub = (t, out) => out
    ? `      <div style="align-self: flex-end; background: ${T.plum}; color: ${T.ground}; border-radius: 14px 14px 4px 14px; padding: 9px 14px; font-size: 13px; line-height: 1.5;">${t}</div>`
    : `      <div style="max-width: 236px; background: ${T.paper}; border-radius: 14px 14px 14px 4px; padding: 11px 13px; font-size: 13px; line-height: 1.5; color: ${T.ink};">${t}</div>`;
  const card = ([t, s]) => `
        <div style="background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 2px; padding: 14px 15px; display: flex; align-items: center; gap: 13px;">
          ${tick}
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <div style="font-size: 13px; color: ${T.ink};">${t}</div>
            <div style="font-size: 11.5px; color: ${T.ink3};">${s}</div>
          </div>
        </div>`;
  const o = { margin:24, cueMb:32 };
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

  <!-- 375: no phone inside a phone. The thread plays straight on the field. -->
  <div style="position: relative; margin: 48px 24px 0 24px; background: ${T.field}; border-radius: 2px; overflow: hidden;">${LIGHT}${GRAIN}
    <div style="position: relative; padding: 24px 20px; display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 4px;">Nura</div>
${bub(HELLO, false)}
${bub('yes', true)}
${bub(VISIT, false)}
${bub('ok', true)}
      <div style="height: 1px; background: ${T.hairline}; margin: 16px 0;"></div>
      <div style="display: flex; flex-direction: column; gap: 8px;">${CARDS.map(card).join('')}
      </div>
      <div class="serif" style="font-size: 17px; font-style: italic; color: ${T.ink3}; margin-top: 16px;">${CAPTION}</div>
    </div>
  </div>` + cue(o, 'Next — in her words') + tail);
}

console.log('wrote 4 hero artboards');
