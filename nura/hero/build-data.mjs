import { writeFileSync } from 'node:fs';

const T = { ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
            ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61' };

const EYEBROW = 'How it knows';
const HEADING = 'It works because she lets it.';
// Trimmed. The second half of the brief's sentence — what it uses them FOR — is
// now carried by the diagram instead of restated under it.
const LEAD = 'Her delivery record and her insurance already exist. Nura reads them — only with her yes, only on her own login.';

const SOURCES = [
  ['My delivery record.', 'nothing to repeat'],
  ['My insurance.', 'everything booked, covered'],
];
const BACK = [
  'Your six-week visit is Tuesday at 10.',
  'Dinner lands at six tonight.',
  'Ana comes Thursday at four.',
];
const VOW = ['It is hers.',
             'It is read, not shared — not with the giver, not with her doctor, not with anyone.',
             'She can disconnect any time.'];

const dot = (c, s=6) => `<span style="display: inline-block; width: ${s}px; height: ${s}px; border-radius: 50%; background: ${c}; flex-shrink: 0;"></span>`;

// She gives two things. What comes back is the thread itself — real messages, not
// a description of messages. No arrowheads: nothing is being sent anywhere.
function diagram(o) {
  const src = ([mine, back], i) => `
          <div style="height: ${o.srcH}px; display: flex; align-items: center; justify-content: flex-end; gap: 14px;">
            <div style="text-align: right;">
              <div class="serif" style="font-size: ${o.srcSize}px; font-style: italic; line-height: 1.25; color: ${T.ink};">${mine}</div>
              <div style="font-size: ${o.srcMeta}px; line-height: 1.5; color: ${T.ink3}; margin-top: 7px;">${back}</div>
            </div>
            ${dot(T.ink3, 6)}
          </div>`;
  const c1 = o.srcH / 2, c2 = o.h - o.srcH / 2, mid = o.h / 2;
  const bubbles = BACK.map(t => `
            <div style="background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 14px 14px 14px 4px; padding: ${o.bubPad}; font-size: ${o.bub}px; line-height: 1.5; color: ${T.ink};">${t}</div>`).join('');

  return `
      <div style="display: flex; align-items: center; gap: ${o.gap}px;">
        <div style="width: ${o.srcW}px; flex-shrink: 0; height: ${o.h}px; display: flex; flex-direction: column; justify-content: space-between;">
${SOURCES.map(src).join('')}
        </div>
        <svg width="${o.curveW}" height="${o.h}" viewBox="0 0 ${o.curveW} ${o.h}" fill="none" style="flex-shrink: 0;">
          <path d="M0 ${c1} C ${o.curveW * 0.42} ${c1}, ${o.curveW * 0.56} ${mid - 4}, ${o.curveW} ${mid - 3}" stroke="${T.mute}" stroke-width="1" vector-effect="non-scaling-stroke"></path>
          <path d="M0 ${c2} C ${o.curveW * 0.42} ${c2}, ${o.curveW * 0.56} ${mid + 4}, ${o.curveW} ${mid + 3}" stroke="${T.mute}" stroke-width="1" vector-effect="non-scaling-stroke"></path>
        </svg>
        <div style="display: flex; align-items: center; gap: ${o.gap}px;">
          ${dot(T.moss, 7)}
          <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 10px;">${bubbles}
          </div>
        </div>
      </div>`;
}

// At 375 the same idea turns ninety degrees: two sources across the top, the thread below.
const diagramStacked = (o) => `
      <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
        <div style="display: flex; width: 100%;">
          <div style="width: 50%; height: ${o.stH}px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 9px; text-align: center;">
            <div class="serif" style="font-size: ${o.stLabel}px; font-style: italic; line-height: 1.25; color: ${T.ink};">My delivery record.</div>
            <div style="font-size: ${o.stMeta}px; color: ${T.ink3};">nothing to repeat</div>
            ${dot(T.ink3, 6)}
          </div>
          <div style="width: 50%; height: ${o.stH}px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 9px; text-align: center;">
            <div class="serif" style="font-size: ${o.stLabel}px; font-style: italic; line-height: 1.25; color: ${T.ink};">My insurance.</div>
            <div style="font-size: ${o.stMeta}px; color: ${T.ink3};">everything booked, covered</div>
            ${dot(T.ink3, 6)}
          </div>
        </div>
        <svg width="100%" height="${o.stSvgH}" viewBox="0 0 279 ${o.stSvgH}" fill="none" preserveAspectRatio="none">
          <path d="M70 0 C 70 ${o.stSvgH * 0.6}, 139 ${o.stSvgH * 0.36}, 139 ${o.stSvgH}" stroke="${T.mute}" stroke-width="1" vector-effect="non-scaling-stroke"></path>
          <path d="M209 0 C 209 ${o.stSvgH * 0.6}, 139 ${o.stSvgH * 0.36}, 139 ${o.stSvgH}" stroke="${T.mute}" stroke-width="1" vector-effect="non-scaling-stroke"></path>
        </svg>
        ${dot(T.moss, 7)}
        <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 9px; width: 100%; margin-top: 18px;">
${BACK.map(t => `          <div style="background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 14px 14px 14px 4px; padding: 11px 14px; font-size: ${o.stBub}px; line-height: 1.5; color: ${T.ink};">${t}</div>`).join('\n')}
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
const vow = (fs, gap) => `<div style="display: flex; flex-direction: column; gap: ${gap}px;">
${VOW.map(l => `      <div class="serif" style="font-size: ${fs}px; font-weight: 400; line-height: 1.4; letter-spacing: -0.01em; color: ${T.ink};">${l}</div>`).join('\n')}
    </div>`;

function build(file, W, H, o) {
  writeFileSync(file, head(W, H) + `
  <div style="padding: ${o.padY}px ${o.margin}px;">

    <div style="display: grid; grid-template-columns: ${o.stackHead ? 'minmax(0, 1fr)' : 'minmax(0, 5fr) minmax(0, 6fr)'}; gap: ${o.headGap}px; align-items: ${o.stackHead ? 'start' : 'end'};">
      <div style="display: flex; flex-direction: column;">
        ${eyebrow(o.eyebrow)}
        <h2 class="serif" style="margin: ${o.headMt}px 0 0 0; font-size: ${o.h2}px; font-weight: 400; line-height: 1.12; letter-spacing: -0.02em; max-width: ${o.h2Max}px; text-wrap: pretty;">${HEADING}</h2>
      </div>
      <p style="margin: 0; font-size: ${o.lead}px; line-height: 1.66; color: ${T.ink2}; max-width: ${o.leadMax}px; text-wrap: pretty;">${LEAD}</p>
    </div>

    <div style="margin-top: ${o.gap1}px; background: ${T.field}; border-radius: 2px; padding: ${o.panelPad};">
      <div style="display: flex; justify-content: flex-start;">
${o.stacked ? diagramStacked(o) : diagram(o)}
      </div>
      <div style="height: 1px; background: ${T.hairline}; margin: ${o.gap2}px 0;"></div>
      ${vow(o.vowSize, o.vowGap)}
    </div>

  </div>` + tail);
}

build('Data1440.dc.html', 1440, 1300, {
  margin:96, padY:152, eyebrow:11, headGap:96, headMt:32, h2:46, h2Max:460, lead:19, leadMax:480,
  gap1:88, panelPad:'80px 96px', srcW:340, srcH:82, srcSize:29, srcMeta:13, gap:28, curveW:330,
  h:312, bub:15, bubPad:'14px 18px', gap2:68, vowSize:26, vowGap:18 });

build('Data1280.dc.html', 1280, 1120, {
  margin:64, padY:128, eyebrow:11, headGap:72, headMt:24, h2:40, h2Max:400, lead:17.5, leadMax:440,
  gap1:72, panelPad:'68px 72px', srcW:300, srcH:76, srcSize:25, srcMeta:12.5, gap:24, curveW:250,
  h:286, bub:14, bubPad:'13px 16px', gap2:56, vowSize:23, vowGap:16 });

build('Data768.dc.html', 768, 1190, {
  margin:48, padY:112, eyebrow:11, stackHead:true, stacked:true, stH:112, stLabel:25, stMeta:12.5, stSvgH:96, stBub:14.5, headGap:28, headMt:24, h2:38, h2Max:480, lead:17, leadMax:560,
  gap1:64, panelPad:'52px 40px', srcW:212, srcH:70, srcSize:20, srcMeta:11.5, gap:18, curveW:130,
  h:262, bub:13, bubPad:'11px 14px', gap2:44, vowSize:21, vowGap:14 });

// ---------------- 375 ----------------
writeFileSync('Data375.dc.html', head(375, 1070) + `
  <div style="padding: 80px 24px;">
    <div style="display: flex; flex-direction: column;">
      ${eyebrow(10.5)}
      <h2 class="serif" style="margin: 20px 0 0 0; font-size: 31px; font-weight: 400; line-height: 1.14; letter-spacing: -0.018em; text-wrap: pretty;">${HEADING}</h2>
      <p style="margin: 22px 0 0 0; font-size: 16px; line-height: 1.66; color: ${T.ink2}; text-wrap: pretty;">${LEAD}</p>
    </div>

    <div style="margin-top: 48px; background: ${T.field}; border-radius: 2px; padding: 36px 24px;">
${diagramStacked({stH:104, stLabel:19, stMeta:11.5, stSvgH:72, stBub:13.5})}
      <div style="height: 1px; background: ${T.hairline}; margin: 40px 0;"></div>
      ${vow(21, 16)}
    </div>
  </div>` + tail);

console.log('wrote 4 data forward artboards');
