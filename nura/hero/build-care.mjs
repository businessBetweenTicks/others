import { writeFileSync } from 'node:fs';

const T = { ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
            ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61' };

const EYEBROW = 'Care balance';
const HEADING = 'She never sees an amount. She sees dinner.';
const LEAD = 'Her circle adds to the gift whenever they want to. Nothing reaches her as money. It arrives as the thing itself, and the balance stays with them.';

// ---- the turn: what someone adds becomes a thing that shows up ----
function turn(o) {
  const chip = `<div style="display:inline-flex;align-items:center;gap:10px;background:${T.paper};border:1px solid ${T.hairline};border-radius:2px;padding:${o.chipPad};font-size:${o.chip}px;color:${T.ink};white-space:nowrap;">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${T.moss};"></span>Priya adds, on Tuesday</div>`;
  const bubble = `<div style="background:${T.paper};border:1px solid ${T.hairline};border-radius:14px 14px 14px 3px;padding:${o.bubPad};font-size:${o.bub}px;line-height:1.5;color:${T.ink};max-width:${o.bubMax}px;">Dinner at six tonight, from Priya.</div>`;
  const arrowH = `<svg width="${o.arrow}" height="9" viewBox="0 0 ${o.arrow} 9" fill="none" style="flex-shrink:0;display:block;">
          <path d="M0 4.5H${o.arrow - 1}" stroke="${T.ink3}" stroke-width="1"/>
          <path d="M${o.arrow - 6} 1.2L${o.arrow - 1} 4.5L${o.arrow - 6} 7.8" stroke="${T.ink3}" stroke-width="1" fill="none" stroke-linejoin="round"/>
        </svg>`;
  const arrowV = `<svg width="9" height="34" viewBox="0 0 9 34" fill="none" style="flex-shrink:0;display:block;margin-left:22px;">
          <path d="M4.5 0V33" stroke="${T.ink3}" stroke-width="1"/>
          <path d="M1.2 27.5L4.5 33L7.8 27.5" stroke="${T.ink3}" stroke-width="1" fill="none" stroke-linejoin="round"/>
        </svg>`;
  const body = o.turnStack
    ? `<div style="display:flex;flex-direction:column;align-items:flex-start;">${chip}${arrowV}${bubble}</div>`
    : `<div style="display:flex;align-items:center;gap:${o.turnGap}px;">${chip}${arrowH}${bubble}</div>`;
  return `
${body}
      <div style="font-size:${o.cap}px;line-height:1.62;color:${T.ink2};margin-top:${o.capMt}px;max-width:${o.capMax}px;text-wrap:pretty;">She is told who it came from. She is never told what it cost.</div>`;
}

// ---- the balance itself, counted in things ----
const ROWS = [
  ['Dinners', 2, 4, 'Priya, and three others'],
  ['An hour in the house', 1, 2, 'Her mum'],
  ['A ride to the clinic', 0, 3, 'Dev'],
  ['Pelvic floor physio', 1, 1, 'The Thursday group'],
];

function marks(gone, left, o) {
  const one = (fill) => `<span style="display:inline-block;width:${o.mw}px;height:${o.mh}px;border-radius:2px;${fill ? `background:${T.plum};` : `border:1px solid ${T.mute};box-sizing:border-box;`}"></span>`;
  return `<div style="display:flex;align-items:center;gap:${o.mGap}px;">${
    Array.from({length: gone}, () => one(false)).join('') +
    Array.from({length: left}, () => one(true)).join('')}</div>`;
}

function shelf(o) {
  const rows = ROWS.map(([label, gone, left, who], i) => o.shelfStack ? `
        <div style="display:flex;flex-direction:column;gap:${o.rowStackGap}px;padding:${o.rowPadY}px 0;border-top:1px solid ${i === 0 ? T.ink : T.hairline};">
          <div class="serif" style="font-size:${o.rowLabel}px;font-weight:400;line-height:1.25;color:${T.ink};">${label}</div>
${marks(gone, left, o)}
          <div style="font-size:${o.rowWho}px;color:${T.ink3};">${who}</div>
        </div>` : `
        <div style="display:flex;align-items:center;gap:${o.rowGapX}px;padding:${o.rowPadY}px 0;border-top:1px solid ${i === 0 ? T.ink : T.hairline};">
          <div class="serif" style="flex:1;min-width:0;font-size:${o.rowLabel}px;font-weight:400;line-height:1.25;color:${T.ink};">${label}</div>
          <div style="font-size:${o.rowWho}px;color:${T.ink3};text-align:right;flex-shrink:0;">${who}</div>
          <div style="width:${o.colB}px;flex-shrink:0;display:flex;justify-content:flex-end;">${marks(gone, left, o)}</div>
        </div>`).join('');

  const key = (fill, t) => `<div style="display:flex;align-items:center;gap:8px;font-size:${o.key}px;color:${T.ink3};">
            <span style="display:inline-block;width:${o.mw}px;height:${o.mh}px;border-radius:2px;${fill ? `background:${T.plum};` : `border:1px solid ${T.mute};box-sizing:border-box;`}"></span>${t}</div>`;

  return `
    <div style="margin-top:${o.gap2}px;background:${T.field};border-radius:2px;padding:${o.panelPad};">
      <div style="display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:${o.keyGap}px;margin-bottom:${o.keyMb}px;">
        <div style="font-size:11px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:${T.ink3};">What is in it now</div>
        <div style="display:flex;align-items:center;gap:${o.keyGap}px;">
${key(false, 'already arrived')}
${key(true, 'still waiting for her')}
        </div>
      </div>
${rows}
      <div style="border-top:1px solid ${T.hairline};padding-top:${o.footPadT}px;margin-top:0;display:flex;flex-wrap:wrap;gap:${o.keyGap}px;justify-content:space-between;align-items:baseline;">
        <div class="serif" style="font-size:${o.foot}px;font-weight:400;color:${T.ink};">Eleven people have put something in.</div>
        <div style="font-size:${o.rowWho}px;color:${T.ink3};">No one is shown what anyone gave</div>
      </div>
    </div>`;
}

// ---- how the balance behaves ----
const RULES = [
  'She is never shown what is left.',
  'She is never asked to add to it.',
  'When it runs low, her circle is told. Only them, and quietly.',
];

function rules(o) {
  return `
    <div style="margin-top:${o.gap3}px;">
      <div style="font-size:11px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:${T.ink3};margin-bottom:${o.rulesMb}px;">How the balance behaves</div>
${RULES.map((t, i) => `      <div class="serif" style="font-size:${o.rule}px;font-weight:400;line-height:1.36;letter-spacing:-0.01em;color:${T.ink};padding:${o.rulePadY}px 0;border-top:1px solid ${i === 0 ? T.ink : T.hairline};${i === RULES.length - 1 ? `border-bottom:1px solid ${T.hairline};` : ''}text-wrap:pretty;">${t}</div>`).join('\n')}
    </div>`;
}

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

<div style="width:${w}px;min-height:${minH}px;background:${T.ground};color:${T.ink};box-sizing:border-box;">`;
const tail = `
</div>
</x-dc>
</body>
</html>
`;

function build(file, W, H, o) {
  writeFileSync(file, head(W, H) + `
  <div style="padding:${o.padY}px ${o.margin}px;">

    <div style="display:grid;grid-template-columns:${o.stackHead ? 'minmax(0,1fr)' : 'minmax(0,5fr) minmax(0,6fr)'};gap:${o.headGap}px;align-items:start;">
      <div style="display:flex;flex-direction:column;">
        <div style="font-size:${o.eyebrow}px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.moss};">${EYEBROW}</div>
        <h2 class="serif" style="margin:${o.headMt}px 0 0 0;font-size:${o.h2}px;font-weight:400;line-height:1.12;letter-spacing:-0.02em;max-width:${o.h2Max}px;text-wrap:pretty;">${HEADING}</h2>
      </div>
      <div>
        <p style="margin:0;font-size:${o.lead}px;line-height:1.66;color:${T.ink2};max-width:${o.leadMax}px;text-wrap:pretty;">${LEAD}</p>
${o.stackHead ? '' : `<div style="margin-top:${o.gap1}px;">${turn(o)}</div>`}
      </div>
    </div>
${o.stackHead ? `<div style="margin-top:${o.gap1}px;">${turn(o)}</div>` : ''}
${shelf(o)}
${rules(o)}

    <div class="serif" style="margin-top:${o.gap4}px;font-size:${o.closer}px;font-weight:400;line-height:1.28;letter-spacing:-0.012em;color:${T.ink};max-width:${o.closerMax}px;text-wrap:pretty;">The only number she ever sees is the time dinner arrives.</div>

  </div>` + tail);
}

build('Care1440.dc.html', 1440, 1660, {
  margin:96, padY:152, eyebrow:11, headGap:80, headMt:32, h2:46, h2Max:520, lead:19, leadMax:500,
  gap1:56, chip:13.5, chipPad:'12px 16px', bub:16, bubPad:'14px 20px', bubMax:300, turnGap:20, arrow:60,
  cap:14.5, capMt:22, capMax:560,
  gap2:72, panelPad:'52px 60px', key:12.5, keyGap:24, keyMb:28,
  colB:210, rowGapX:40, rowPadY:24, rowLabel:24, rowWho:13.5,
  mw:13, mh:17, mGap:8, footPadT:26, foot:20,
  gap3:72, rulesMb:26, rule:27, rulePadY:22,
  gap4:72, closer:34, closerMax:700 });

build('Care1280.dc.html', 1280, 1470, {
  margin:64, padY:128, eyebrow:11, headGap:56, headMt:24, h2:40, h2Max:460, lead:17.5, leadMax:460,
  gap1:48, chip:13, chipPad:'11px 14px', bub:15, bubPad:'13px 18px', bubMax:270, turnGap:16, arrow:48,
  cap:13.5, capMt:20, capMax:520,
  gap2:68, panelPad:'48px 56px', key:12, keyGap:20, keyMb:24,
  colB:185, rowGapX:32, rowPadY:21, rowLabel:21, rowWho:13,
  mw:12, mh:16, mGap:7, footPadT:22, foot:18,
  gap3:68, rulesMb:22, rule:24, rulePadY:20,
  gap4:56, closer:30, closerMax:620 });

build('Care768.dc.html', 768, 1540, {
  margin:48, padY:112, eyebrow:11, stackHead:true, headGap:28, headMt:24, h2:38, h2Max:520, lead:17, leadMax:560,
  gap1:60, chip:13, chipPad:'11px 14px', bub:15, bubPad:'13px 18px', bubMax:280, turnGap:18, arrow:52,
  cap:14, capMt:24, capMax:560,
  gap2:60, panelPad:'44px 44px', key:12, keyGap:18, keyMb:24,
  colB:165, rowGapX:22, rowPadY:20, rowLabel:21, rowWho:12.5,
  mw:12, mh:16, mGap:7, footPadT:22, foot:18,
  gap3:60, rulesMb:22, rule:24, rulePadY:20,
  gap4:56, closer:28, closerMax:600 });

build('Care375.dc.html', 375, 1775, {
  margin:24, padY:80, eyebrow:10.5, stackHead:true, headGap:22, headMt:20, h2:31, h2Max:340, lead:16, leadMax:340,
  gap1:48, turnStack:true, chip:13, chipPad:'10px 14px', bub:14.5, bubPad:'12px 16px', bubMax:280,
  cap:13.5, capMt:22, capMax:340,
  gap2:48, panelPad:'32px 24px', key:11.5, keyGap:14, keyMb:22, shelfStack:true,
  rowStackGap:13, rowPadY:20, rowLabel:20, rowWho:12.5,
  mw:12, mh:16, mGap:7, footPadT:20, foot:17,
  gap3:48, rulesMb:20, rule:21, rulePadY:18,
  gap4:44, closer:25, closerMax:340 });

console.log('wrote 4 care balance artboards');
