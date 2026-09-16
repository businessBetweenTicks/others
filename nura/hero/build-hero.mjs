import { writeFileSync } from 'node:fs';

// --- the ten tokens, one source of truth ---
const T = {
  ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
  ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61',
  plate:'#E2DAD0',
};
const LIFT = '0 14px 34px -22px rgba(28,26,23,0.32)';
const LIFT_DEEP = '0 24px 60px -30px rgba(28,26,23,0.30)';

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

// --- desktop / laptop stage: photography plate + phone + resolving cards ---
function stageWide(o) {
  const cards = CARDS.map(([t, s], i) => `
      <div style="position: absolute; left: ${o.cardX[i]}px; top: ${o.cardY[i]}px; width: ${o.cardW[i]}px; background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 2px; padding: ${o.cardPad}; display: flex; align-items: center; gap: 12px; box-shadow: ${LIFT};">
        ${tick}
        <div style="display: flex; flex-direction: column; gap: 3px;">
          <div style="font-size: ${o.cardTitle}px; color: ${T.ink};">${t}</div>
          <div style="font-size: ${o.cardSub}px; color: ${T.ink3};">${s}</div>
        </div>
      </div>`).join('');

  return `
      <div style="position: absolute; left: 0; top: 0; width: ${o.plateW}px; height: 100%; background: ${T.plate}; border-right: 1px dashed ${T.mute};"></div>
      <div style="position: absolute; left: 20px; top: 20px; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; line-height: 1.6;">Photography<br>her, low light, no baby in frame</div>

      <div style="position: absolute; left: ${o.phoneX}px; top: ${o.phoneY}px; width: ${o.phoneW}px; height: ${o.phoneH}px; background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 24px; box-shadow: ${LIFT_DEEP}; padding: ${o.phonePad}; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px;">
        <div style="font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 4px;">Nura</div>
        <div style="max-width: ${o.bubbleMax}px; background: ${T.field}; border-radius: 14px 14px 14px 4px; padding: 11px 13px; font-size: ${o.bubble}px; line-height: 1.5; color: ${T.ink};">Hi Maya. It’s Nura. Is now a good time?</div>
        <div style="align-self: flex-end; background: ${T.plum}; color: ${T.ground}; border-radius: 14px 14px 4px 14px; padding: 9px 14px; font-size: ${o.bubble}px; line-height: 1.5;">yes</div>
        <div style="max-width: ${o.bubbleMax}px; background: ${T.field}; border-radius: 14px 14px 14px 4px; padding: 11px 13px; font-size: ${o.bubble}px; line-height: 1.5; color: ${T.ink};">Your six-week visit is Tuesday at 10. Someone will be there for the baby.</div>
        <div style="align-self: flex-end; background: ${T.plum}; color: ${T.ground}; border-radius: 14px 14px 4px 14px; padding: 9px 14px; font-size: ${o.bubble}px; line-height: 1.5;">ok</div>
      </div>
${cards}
      <div class="serif" style="position: absolute; left: ${o.cardX[0]}px; top: ${o.capY}px; width: ${o.cardW[0]}px; font-size: ${o.capSize}px; line-height: 1.45; font-style: italic; color: ${T.ink3};">${CAPTION}</div>`;
}

function navWide(o) {
  return `
  <div style="display: flex; align-items: center; justify-content: space-between; padding: ${o.navTop}px ${o.margin}px 0 ${o.margin}px;">
    <div class="serif" style="font-size: ${o.wordmark}px; font-weight: 400; letter-spacing: 0.01em; color: ${T.ink};">Nura</div>
    <div style="display: flex; align-items: center; gap: ${o.navGap}px;">
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">The gift</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">How it works</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">Packages</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em;">First Week Check</a>
      <a href="#" style="font-size: ${o.nav}px; letter-spacing: 0.01em; color: ${T.plum}; border-bottom: 1px solid ${T.mute}; padding-bottom: 2px;">Start a gift</a>
    </div>
  </div>`;
}

function copyCol(o) {
  return `
      <div style="font-size: ${o.eyebrow}px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: ${T.moss}; margin-bottom: ${o.eyebrowMb}px;">${EYEBROW}</div>
      <h1 class="serif" style="margin: 0; font-size: ${o.h1}px; font-weight: 400; line-height: ${o.h1lh}; letter-spacing: ${o.h1ls}; color: ${T.ink};${o.h1Max ? ` max-width: ${o.h1Max}px;` : ''} text-wrap: pretty;">${H1}</h1>
      <p style="margin: ${o.leadMt}px 0 0 0; font-size: ${o.lead}px; line-height: 1.62; color: ${T.ink2};${o.leadMax ? ` max-width: ${o.leadMax}px;` : ''} text-wrap: pretty;">${LEAD}</p>`;
}

const cue = (o, label) => `
  <div style="display: flex; align-items: center; gap: 16px; padding: 0 ${o.margin}px; margin-top: auto; margin-bottom: ${o.cueMb}px;">
    <div style="width: 48px; height: 1px; background: ${T.mute};"></div>
    <div style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3};">${label}</div>
  </div>`;

// ---------- 1440 ----------
{
  const o = { margin:96, navTop:32, navGap:40, wordmark:23, nav:14, eyebrow:11, eyebrowMb:32,
    h1:76, h1lh:1.04, h1ls:'-0.021em', lead:19, leadMt:32, leadMax:470, cueMb:48,
    plateW:352, phoneX:64, phoneY:80, phoneW:224, phoneH:452, phonePad:'24px 18px', bubble:12.5, bubbleMax:176,
    cardX:[344,368,336], cardY:[112,226,340], cardW:[248,224,240], cardPad:'15px 17px', cardTitle:13, cardSub:11.5,
    capY:456, capSize:18 };
  writeFileSync('Main.dc.html', head(1440, 920) + navWide(o) + `
  <div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 32px; padding: 96px ${o.margin}px 0 ${o.margin}px; align-items: start;">
    <div style="grid-column: 1 / span 5; display: flex; flex-direction: column; padding-top: 16px;">${copyCol(o)}
      <div style="margin-top: 48px;">
        <a href="#" style="display: inline-flex; align-items: center; gap: 12px; background: ${T.plum}; color: ${T.ground}; font-size: 14px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 20px 40px; border-radius: 2px;">${CTA} ${arrow}</a>
      </div>
    </div>
    <div style="grid-column: 7 / span 6; position: relative; height: 600px; background: ${T.field}; border-radius: 2px; overflow: hidden;">${stageWide(o)}
    </div>
  </div>` + cue(o, 'Next — the problem, in her words') + tail);
}

// ---------- 1280 ----------
{
  const o = { margin:64, navTop:32, navGap:32, wordmark:22, nav:13.5, eyebrow:11, eyebrowMb:24,
    h1:62, h1lh:1.05, h1ls:'-0.02em', lead:17.5, leadMt:24, leadMax:430, cueMb:40,
    plateW:320, phoneX:48, phoneY:66, phoneW:210, phoneH:404, phonePad:'22px 16px', bubble:12.5, bubbleMax:162,
    cardX:[300,320,292], cardY:[96,196,296], cardW:[236,214,228], cardPad:'13px 15px', cardTitle:12.5, cardSub:11,
    capY:400, capSize:17 };
  writeFileSync('Hero1280.dc.html', head(1280, 840) + navWide(o) + `
  <div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 24px; padding: 80px ${o.margin}px 0 ${o.margin}px; align-items: start;">
    <div style="grid-column: 1 / span 5; display: flex; flex-direction: column; padding-top: 12px;">${copyCol(o)}
      <div style="margin-top: 40px;">
        <a href="#" style="display: inline-flex; align-items: center; gap: 12px; background: ${T.plum}; color: ${T.ground}; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 20px 32px; border-radius: 2px;">${CTA} ${arrow}</a>
      </div>
    </div>
    <div style="grid-column: 7 / span 6; position: relative; height: 520px; background: ${T.field}; border-radius: 2px; overflow: hidden;">${stageWide(o)}
    </div>
  </div>` + cue(o, 'Next — the problem, in her words') + tail);
}

// ---------- 768 ----------
{
  const o = { margin:48, cueMb:32, eyebrow:11, eyebrowMb:24,
    h1:50, h1lh:1.06, h1ls:'-0.018em', h1Max:560, lead:17, leadMt:24, leadMax:440,
    plateW:344, phoneX:72, phoneY:64, phoneW:216, phoneH:416, phonePad:'22px 17px', bubble:12.5, bubbleMax:168,
    cardX:[352,376,344], cardY:[92,196,300], cardW:[248,224,240], cardPad:'13px 15px', cardTitle:12.5, cardSub:11,
    capY:412, capSize:17 };
  writeFileSync('Hero768.dc.html', head(768, 1140) + `
  <div style="display: flex; align-items: center; justify-content: space-between; padding: 24px 48px 0 48px;">
    <div class="serif" style="font-size: 21px; font-weight: 400;">Nura</div>
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
  <div style="position: relative; height: 480px; margin: 64px 48px 0 48px; background: ${T.field}; border-radius: 2px; overflow: hidden;">${stageWide(o)}
  </div>` + cue(o, 'Next — the problem, in her words') + tail);
}

// ---------- 375 ----------
{
  const bub = (t, out) => out
    ? `      <div style="align-self: flex-end; background: ${T.plum}; color: ${T.ground}; border-radius: 14px 14px 4px 14px; padding: 9px 14px; font-size: 13px; line-height: 1.5;">${t}</div>`
    : `      <div style="max-width: 236px; background: ${T.paper}; border-radius: 14px 14px 14px 4px; padding: 11px 13px; font-size: 13px; line-height: 1.5; color: ${T.ink};">${t}</div>`;
  const card = ([t, s]) => `
      <div style="background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 2px; padding: 13px 14px; display: flex; align-items: center; gap: 12px;">
        ${tick}
        <div style="display: flex; flex-direction: column; gap: 3px;">
          <div style="font-size: 13px; color: ${T.ink};">${t}</div>
          <div style="font-size: 11.5px; color: ${T.ink3};">${s}</div>
        </div>
      </div>`;
  const o = { margin:24, cueMb:32 };
  writeFileSync('Hero375.dc.html', head(375, 1180) + `
  <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px 0 24px;">
    <div class="serif" style="font-size: 20px; font-weight: 400;">Nura</div>
    <div style="display: flex; flex-direction: column; gap: 5px; width: 22px; padding: 12px 0;">
      <div style="height: 1px; background: ${T.ink};"></div>
      <div style="height: 1px; background: ${T.ink};"></div>
    </div>
  </div>

  <div style="display: flex; flex-direction: column; padding: 48px 24px 0 24px;">
    <div style="font-size: 10.5px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: ${T.moss}; margin-bottom: 20px;">${EYEBROW}</div>
    <h1 class="serif" style="margin: 0; font-size: 39px; font-weight: 400; line-height: 1.08; letter-spacing: -0.015em; text-wrap: pretty;">${H1}</h1>
    <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.62; color: ${T.ink2}; text-wrap: pretty;">${LEAD}</p>
    <a href="#" style="display: flex; align-items: center; justify-content: center; gap: 12px; background: ${T.plum}; color: ${T.ground}; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; height: 56px; border-radius: 2px; margin-top: 32px;">${CTA} ${arrow}</a>
  </div>

  <!-- 375: no phone inside a phone, and no photography plate. The thread plays straight on the field. -->
  <div style="margin: 48px 24px 0 24px; background: ${T.field}; border-radius: 2px; padding: 24px 20px; display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 4px;">Nura</div>
${bub('Hi Maya. It’s Nura. Is now a good time?', false)}
${bub('yes', true)}
${bub('Your six-week visit is Tuesday at 10. Someone will be there for the baby.', false)}
${bub('ok', true)}
      <div style="height: 1px; background: ${T.hairline}; margin: 16px 0;"></div>
      <div style="display: flex; flex-direction: column; gap: 8px;">${CARDS.map(card).join('')}
      </div>
      <div class="serif" style="font-size: 17px; font-style: italic; color: ${T.ink3}; margin-top: 16px;">${CAPTION}</div>
  </div>` + cue(o, 'Next — in her words') + tail);
}

console.log('wrote 4 hero artboards');
