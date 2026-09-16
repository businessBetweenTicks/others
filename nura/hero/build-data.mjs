import { writeFileSync } from 'node:fs';

const T = { ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
            ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61' };

const EYEBROW = 'How it knows';
const HEADING = 'It works because she lets it.';
const LEAD = 'Her delivery record and her insurance already exist. Here is exactly what Nura does with them, and what it never does.';

const dot = (c, s=6) => `<span style="display:inline-block;width:${s}px;height:${s}px;border-radius:50%;background:${c};flex-shrink:0;"></span>`;
const dash = (c) => `<span style="display:inline-block;width:11px;height:1px;background:${c};flex-shrink:0;"></span>`;

// ---- the three steps, each led by its picture ----
function steps(o) {
  const chip = (t) => `<div style="display:flex;align-items:center;gap:10px;background:${T.paper};border:1px solid ${T.hairline};border-radius:2px;padding:${o.chipPad};font-size:${o.chip}px;color:${T.ink};">${dot(T.ink3, 5)}${t}</div>`;
  const bub = (t) => `<div style="background:${T.paper};border:1px solid ${T.hairline};border-radius:12px 12px 12px 3px;padding:${o.chipPad};font-size:${o.chip}px;color:${T.ink};">${t}</div>`;

  const VIS = [
    `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:9px;">
       <div style="background:${T.paper};border:1px solid ${T.hairline};border-radius:12px 12px 12px 3px;padding:${o.chipPad};font-size:${o.chip}px;line-height:1.5;color:${T.ink};max-width:${o.askMax}px;">Can I read your record and your insurance?</div>
       <div style="background:${T.plum};color:${T.ground};border-radius:12px 12px 3px 12px;padding:${o.yesPad};font-size:${o.yes}px;">yes</div>
     </div>`,
    `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:8px;">${chip('Her delivery record')}${chip('Her insurance')}</div>`,
    `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:7px;">${bub('Six-week visit, Tuesday 10')}${bub('Dinner at six tonight')}${bub('Ana comes Thursday')}</div>`,
  ];
  const COPY = [
    ['She says yes.', 'Nothing is read until she does. The gift works without it; it just works harder with it.'],
    ['Nura reads two things.', 'Only these two, and only on her own login. It reads them — it does not take a copy.'],
    ['It knows what to check.', 'The right check on the right day, and every appointment booked is one her plan covers.'],
  ];

  return [0,1,2].map(i => `
        <div style="display:flex;flex-direction:column;gap:${o.stepGap}px;border-top:1px solid ${T.ink};padding-top:${o.stepPadT}px;">
          <div class="serif" style="font-size:${o.num}px;font-weight:300;color:${T.mute};line-height:1;">0${i+1}</div>
          <div style="min-height:${o.visH}px;display:flex;align-items:flex-start;">${VIS[i]}</div>
          <div>
            <div class="serif" style="font-size:${o.stepTitle}px;font-weight:400;line-height:1.24;letter-spacing:-0.01em;color:${T.ink};">${COPY[i][0]}</div>
            <div style="font-size:${o.stepBody}px;line-height:1.6;color:${T.ink2};margin-top:${o.stepBodyMt}px;text-wrap:pretty;">${COPY[i][1]}</div>
          </div>
        </div>`).join('');
}

// ---- the boundary: what stays, and who never sees it ----
function boundary(o, stacked) {
  const stays = ['Her delivery record', 'Her insurance', 'Every message between them']
    .map(t => `<div style="display:flex;align-items:center;gap:12px;font-size:${o.bItem}px;color:${T.ink};">${dot(T.moss, 6)}${t}</div>`).join('');
  const never = ['The giver', 'Her doctor', 'Anyone else']
    .map(t => `<div style="display:flex;align-items:center;gap:12px;font-size:${o.bItem}px;color:${T.ink3};">${dash(T.mute)}${t}</div>`).join('');
  const col = (lbl, items, pad) => `
          <div style="flex:1;${pad}display:flex;flex-direction:column;gap:${o.bGap}px;">
            <div style="font-size:11px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:${T.ink3};">${lbl}</div>
${items}
          </div>`;
  if (stacked) return `
        <div style="display:flex;flex-direction:column;gap:${o.bStackGap}px;">
${col('Stays with her', stays, '')}
          <div style="height:1px;border-top:1px dashed ${T.mute};"></div>
${col('Never sees any of it', never, '')}
        </div>`;
  return `
        <div style="display:flex;align-items:stretch;">
${col('Stays with her', stays, `padding-right:${o.bPad}px;`)}
          <div style="width:1px;border-left:1px dashed ${T.mute};flex-shrink:0;"></div>
${col('Never sees any of it', never, `padding-left:${o.bPad}px;`)}
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

    <div style="display:grid;grid-template-columns:${o.stackHead ? 'minmax(0,1fr)' : 'minmax(0,5fr) minmax(0,6fr)'};gap:${o.headGap}px;align-items:${o.stackHead ? 'start' : 'end'};">
      <div style="display:flex;flex-direction:column;">
        <div style="font-size:${o.eyebrow}px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.moss};">${EYEBROW}</div>
        <h2 class="serif" style="margin:${o.headMt}px 0 0 0;font-size:${o.h2}px;font-weight:400;line-height:1.12;letter-spacing:-0.02em;max-width:${o.h2Max}px;text-wrap:pretty;">${HEADING}</h2>
      </div>
      <p style="margin:0;font-size:${o.lead}px;line-height:1.66;color:${T.ink2};max-width:${o.leadMax}px;text-wrap:pretty;">${LEAD}</p>
    </div>

    <div style="margin-top:${o.gap1}px;background:${T.field};border-radius:2px;padding:${o.panelPad};">
      <div style="display:grid;grid-template-columns:${o.stepCols};gap:${o.colGap}px ${o.colGapX}px;">
${steps(o)}
      </div>
    </div>

    <div style="margin-top:${o.gap2}px;padding:${o.bPadY}px 0;border-top:1px solid ${T.ink};border-bottom:1px solid ${T.hairline};">
${boundary(o, o.bStacked)}
      <div style="font-size:${o.bNote}px;line-height:1.6;color:${T.ink2};margin-top:${o.bNoteMt}px;">It is read, never shared. Nothing crosses that line, in either direction.</div>
    </div>

    <div class="serif" style="margin-top:${o.gap3}px;font-size:${o.closer}px;font-weight:400;line-height:1.3;letter-spacing:-0.012em;color:${T.ink};">She can disconnect any time.</div>

  </div>` + tail);
}

build('Data1440.dc.html', 1440, 1240, {
  margin:96, padY:152, eyebrow:11, headGap:96, headMt:32, h2:46, h2Max:460, lead:19, leadMax:500,
  gap1:88, panelPad:'72px 80px', stepCols:'repeat(3, minmax(0,1fr))', colGap:0, colGapX:56,
  stepGap:24, stepPadT:22, num:22, visH:132, chip:13.5, chipPad:'11px 14px', yes:15, yesPad:'11px 18px',
  askMax:240, stepTitle:26, stepBody:14.5, stepBodyMt:12,
  gap2:88, bPadY:48, bItem:16.5, bGap:18, bPad:72, bNote:14.5, bNoteMt:40, bStacked:false,
  gap3:72, closer:34 });

build('Data1280.dc.html', 1280, 1140, {
  margin:64, padY:128, eyebrow:11, headGap:72, headMt:24, h2:40, h2Max:400, lead:17.5, leadMax:460,
  gap1:72, panelPad:'60px 64px', stepCols:'repeat(3, minmax(0,1fr))', colGap:0, colGapX:44,
  stepGap:20, stepPadT:20, num:20, visH:122, chip:12.5, chipPad:'10px 13px', yes:14, yesPad:'10px 16px',
  askMax:210, stepTitle:23, stepBody:13.5, stepBodyMt:10,
  gap2:72, bPadY:40, bItem:15.5, bGap:16, bPad:56, bNote:13.5, bNoteMt:34, bStacked:false,
  gap3:56, closer:30 });

build('Data768.dc.html', 768, 1500, {
  margin:48, padY:112, eyebrow:11, stackHead:true, headGap:28, headMt:24, h2:38, h2Max:480, lead:17, leadMax:560,
  gap1:64, panelPad:'52px 48px', stepCols:'minmax(0,1fr)', colGap:44, colGapX:0,
  stepGap:20, stepPadT:20, num:20, visH:0, chip:13, chipPad:'11px 14px', yes:14, yesPad:'10px 16px',
  askMax:300, stepTitle:25, stepBody:15, stepBodyMt:10,
  gap2:64, bPadY:40, bItem:16, bGap:16, bPad:48, bNote:13.5, bNoteMt:32, bStacked:false,
  gap3:56, closer:28 });

build('Data375.dc.html', 375, 1600, {
  margin:24, padY:80, eyebrow:10.5, stackHead:true, headGap:22, headMt:20, h2:31, h2Max:340, lead:16, leadMax:340,
  gap1:48, panelPad:'36px 24px', stepCols:'minmax(0,1fr)', colGap:36, colGapX:0,
  stepGap:18, stepPadT:18, num:18, visH:0, chip:13, chipPad:'10px 13px', yes:14, yesPad:'10px 16px',
  askMax:250, stepTitle:23, stepBody:14.5, stepBodyMt:10,
  gap2:48, bPadY:32, bItem:15.5, bGap:14, bPad:0, bStackGap:28, bNote:13, bNoteMt:26, bStacked:true,
  gap3:40, closer:25 });

console.log('wrote 4 data forward artboards');
