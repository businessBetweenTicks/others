import { writeFileSync } from 'node:fs';

const T = { ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
            ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61' };

const EYEBROW = 'How it knows';
const HEADING = 'It works because she lets it.';
const LEAD = 'Her delivery record and her insurance already exist. Nura reads them — only with her yes, only on her own login — and uses them to know what to check, and who her plan covers.';

// Her side is set in the serif, because the serif is her voice. What it takes off
// her is set in the sans, because the sans is the work. Nothing is explained.
const EXCHANGE = [
  ['My delivery record.', 'So Nura knows what to check, and when. Nothing to repeat, and no forms on her side.'],
  ['My insurance.', 'So every appointment it books is one her plan already covers. No call afterwards to find out it wasn’t.'],
];

const VOW = ['It is hers.',
             'It is read, not shared — not with the giver, not with her doctor, not with anyone.',
             'She can disconnect any time.'];

const dot = (c) => `<span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: ${c}; flex-shrink: 0;"></span>`;

// Two hairlines converging into one bubble. No arrowheads, no boxes, no icons,
// no padlocks. Laid out in flow so the curves start exactly at the dots.
const diagram = (h, label, bub) => `
      <div style="display: flex; align-items: center;">
        <div style="display: flex; flex-direction: column; justify-content: space-between; height: ${h}px; padding-right: 9px;">
          <div style="display: flex; align-items: center; gap: 9px; font-size: ${label}px; color: ${T.ink2}; white-space: nowrap;">Her delivery record ${dot(T.ink3)}</div>
          <div style="display: flex; align-items: center; gap: 9px; font-size: ${label}px; color: ${T.ink2}; white-space: nowrap;">Her insurance ${dot(T.ink3)}</div>
        </div>
        <svg width="${Math.round(h * 1.05)}" height="${h}" viewBox="0 0 200 ${h}" fill="none" preserveAspectRatio="none" style="flex-shrink: 0;">
          <path d="M0 3 C 74 3, 96 ${h / 2 - 5}, 200 ${h / 2 - 3}" stroke="${T.mute}" stroke-width="1" vector-effect="non-scaling-stroke"></path>
          <path d="M0 ${h - 3} C 74 ${h - 3}, 96 ${h / 2 + 5}, 200 ${h / 2 + 3}" stroke="${T.mute}" stroke-width="1" vector-effect="non-scaling-stroke"></path>
        </svg>
        <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
          ${dot(T.moss)}
          <div style="background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 14px 14px 14px 4px; padding: 11px 15px; font-size: ${bub}px; color: ${T.ink}; white-space: nowrap;">One thread.</div>
        </div>
      </div>`;

// At 375 the same idea turns ninety degrees: two sources at the top, one thread below.
const diagramStacked = () => `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
        <div style="display: flex; width: 100%;">
          <div style="width: 50%; display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 11.5px; color: ${T.ink2};">Her delivery record ${dot(T.ink3)}</div>
          <div style="width: 50%; display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 11.5px; color: ${T.ink2};">Her insurance ${dot(T.ink3)}</div>
        </div>
        <svg width="100%" height="76" viewBox="0 0 279 76" fill="none" preserveAspectRatio="none">
          <path d="M70 0 C 70 46, 139 28, 139 76" stroke="${T.mute}" stroke-width="1" vector-effect="non-scaling-stroke"></path>
          <path d="M209 0 C 209 46, 139 28, 139 76" stroke="${T.mute}" stroke-width="1" vector-effect="non-scaling-stroke"></path>
        </svg>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
          ${dot(T.moss)}
          <div style="background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 14px 14px 14px 4px; padding: 11px 15px; font-size: 13px; color: ${T.ink};">One thread.</div>
        </div>
      </div>`;

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
    a:hover { color: ${T.ink}; }
    .serif { font-family: 'Newsreader', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif; }
  </style>
</helmet>

<div style="width: ${w}px; min-height: ${minH}px; background: ${T.ground}; color: ${T.ink}; box-sizing: border-box;">`;
const tail = `
</div>
</x-dc>
</body>
</html>
`;

const eyebrow = (fs) => `<div style="font-size: ${fs}px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: ${T.moss};">${EYEBROW}</div>`;
const colHead = (t) => `<div style="font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3};">${t}</div>`;

const vow = (fs) => VOW.map(l =>
  `        <div class="serif" style="font-size: ${fs}px; font-weight: 400; line-height: 1.42; letter-spacing: -0.01em; color: ${T.ink};">${l}</div>`).join('\n');

// ---------------- 1440 / 1280 share a structure ----------------
function desktop(file, W, H, o) {
  const rows = EXCHANGE.map(([mine, back], i) => `
      <div style="display: grid; grid-template-columns: ${o.exLeft}px minmax(0, 1fr); gap: ${o.exGap}px; padding: ${o.rowPad}px 0; border-top: 1px solid ${T.hairline};${i === EXCHANGE.length - 1 ? ` border-bottom: 1px solid ${T.hairline};` : ''}">
        <div class="serif" style="font-size: ${o.mine}px; font-weight: 400; font-style: italic; line-height: 1.3; letter-spacing: -0.01em; color: ${T.ink};">${mine}</div>
        <div style="font-size: ${o.back}px; line-height: 1.62; color: ${T.ink2}; max-width: ${o.backMax}px; text-wrap: pretty;">${back}</div>
      </div>`).join('');

  writeFileSync(file, head(W, H) + `
  <div style="padding: ${o.padY}px ${o.margin}px;">

    <div style="display: grid; grid-template-columns: minmax(0, ${o.headL}fr) minmax(0, ${o.headR}fr); gap: ${o.headGap}px; align-items: start;">
      <div style="display: flex; flex-direction: column;">
        ${eyebrow(11)}
        <h2 class="serif" style="margin: ${o.headMt}px 0 0 0; font-size: ${o.h2}px; font-weight: 400; line-height: 1.12; letter-spacing: -0.02em; max-width: ${o.h2Max}px; text-wrap: pretty;">${HEADING}</h2>
      </div>
      <p style="margin: ${o.leadMt}px 0 0 0; font-size: ${o.lead}px; line-height: 1.66; color: ${T.ink2}; text-wrap: pretty;">${LEAD}</p>
    </div>

    <div style="margin-top: ${o.gap1}px;">
      <div style="display: grid; grid-template-columns: ${o.exLeft}px minmax(0, 1fr); gap: ${o.exGap}px; padding-bottom: ${o.colHeadPb}px;">
        ${colHead('What she shares')}
        ${colHead('What it takes off her')}
      </div>
${rows}
    </div>

    <div style="margin-top: ${o.gap2}px; background: ${T.field}; border-radius: 2px; padding: ${o.panelPad}; display: grid; grid-template-columns: minmax(0, ${o.panL}fr) minmax(0, ${o.panR}fr); gap: ${o.panelGap}px; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 22px;">
${diagram(o.diagH, 12.5, 13)}
        <div style="font-size: 12px; line-height: 1.6; color: ${T.ink3}; max-width: 460px;">Her record and her plan, becoming one thread. Drawn once, slowly, as the section arrives.</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: ${o.vowGap}px;">
${vow(o.vowSize)}
      </div>
    </div>

  </div>` + tail);
}

desktop('Data1440.dc.html', 1440, 1340, {
  margin:96, padY:152, headL:5, headR:6, headGap:96, headMt:32, h2:46, h2Max:460, lead:19, leadMt:6,
  gap1:104, exLeft:420, exGap:96, colHeadPb:20, rowPad:34, mine:30, back:17, backMax:560,
  gap2:104, panelPad:'64px 72px', panL:5, panR:6, panelGap:88, diagW:420, diagH:200, vowSize:27, vowGap:20 });

desktop('Data1280.dc.html', 1280, 1160, {
  margin:64, padY:128, headL:5, headR:6, headGap:72, headMt:24, h2:40, h2Max:400, lead:17.5, leadMt:4,
  gap1:88, exLeft:360, exGap:72, colHeadPb:18, rowPad:30, mine:26, back:16, backMax:500,
  gap2:88, panelPad:'56px 60px', panL:5, panR:6, panelGap:64, diagW:380, diagH:186, vowSize:24, vowGap:18 });

// ---------------- 768 ----------------
{
  const rows = EXCHANGE.map(([mine, back], i) => `
      <div style="display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 40px; padding: 28px 0; border-top: 1px solid ${T.hairline};${i === EXCHANGE.length - 1 ? ` border-bottom: 1px solid ${T.hairline};` : ''}">
        <div class="serif" style="font-size: 24px; font-weight: 400; font-style: italic; line-height: 1.3; color: ${T.ink};">${mine}</div>
        <div style="font-size: 16px; line-height: 1.62; color: ${T.ink2}; text-wrap: pretty;">${back}</div>
      </div>`).join('');

  writeFileSync('Data768.dc.html', head(768, 1290) + `
  <div style="padding: 112px 48px;">
    <div style="display: flex; flex-direction: column;">
      ${eyebrow(11)}
      <h2 class="serif" style="margin: 24px 0 0 0; font-size: 38px; font-weight: 400; line-height: 1.12; letter-spacing: -0.02em; max-width: 480px; text-wrap: pretty;">${HEADING}</h2>
      <p style="margin: 28px 0 0 0; font-size: 17px; line-height: 1.66; color: ${T.ink2}; max-width: 560px; text-wrap: pretty;">${LEAD}</p>
    </div>

    <div style="margin-top: 80px;">
      <div style="display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 40px; padding-bottom: 18px;">
        ${colHead('What she shares')}
        ${colHead('What it takes off her')}
      </div>
${rows}
    </div>

    <div style="margin-top: 80px; background: ${T.field}; border-radius: 2px; padding: 56px 48px; display: flex; flex-direction: column; gap: 52px;">
      <div style="display: flex; flex-direction: column; gap: 20px;">
${diagram(180, 12.5, 13)}
        <div style="font-size: 12px; line-height: 1.6; color: ${T.ink3};">Her record and her plan, becoming one thread. Drawn once, slowly, as the section arrives.</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 18px;">
${vow(24)}
      </div>
    </div>
  </div>` + tail);
}

// ---------------- 375 — each pair stacks, her line first ----------------
{
  const rows = EXCHANGE.map(([mine, back], i) => `
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 24px 0; border-top: 1px solid ${T.hairline};${i === EXCHANGE.length - 1 ? ` border-bottom: 1px solid ${T.hairline};` : ''}">
        <div class="serif" style="font-size: 23px; font-weight: 400; font-style: italic; line-height: 1.3; color: ${T.ink};">${mine}</div>
        <div style="font-size: 15.5px; line-height: 1.62; color: ${T.ink2}; text-wrap: pretty;">${back}</div>
      </div>`).join('');

  writeFileSync('Data375.dc.html', head(375, 1300) + `
  <div style="padding: 80px 24px;">
    <div style="display: flex; flex-direction: column;">
      ${eyebrow(10.5)}
      <h2 class="serif" style="margin: 20px 0 0 0; font-size: 31px; font-weight: 400; line-height: 1.14; letter-spacing: -0.018em; text-wrap: pretty;">${HEADING}</h2>
      <p style="margin: 22px 0 0 0; font-size: 16px; line-height: 1.66; color: ${T.ink2}; text-wrap: pretty;">${LEAD}</p>
    </div>

    <div style="margin-top: 56px;">
      <div style="padding-bottom: 14px;">${colHead('What she shares')}</div>
${rows}
    </div>

    <div style="margin-top: 56px; background: ${T.field}; border-radius: 2px; padding: 36px 24px; display: flex; flex-direction: column; gap: 40px;">
      <div style="display: flex; flex-direction: column; gap: 18px;">
${diagramStacked()}
        <div style="font-size: 11.5px; line-height: 1.6; color: ${T.ink3};">Her record and her plan, becoming one thread.</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 16px;">
${vow(21)}
      </div>
    </div>
  </div>` + tail);
}

console.log('wrote 4 data forward artboards');
