import { writeFileSync } from 'node:fs';

const T = { ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
            ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61' };

const EYEBROW = 'The packages';
const HEADING = 'Pick one thing to have handled.';
const LEAD = 'One package, not a basket. Each one is a single thing lifted off her — and every one of them can be changed, paused or refused once it is hers.';

// name, price, the one-line "she can change" note
const PACKS = [
  ['First weeks home',     300, 'Pause any week she says we have food.'],
  ['The Thursday afternoon', 220, 'Move the day, or skip it, with one word.'],
  ['Body back',            260, 'Change the practitioner, or stop when she is done.'],
  ['Head',                 240, 'Say no to a session without explaining why.'],
  ['Feed',                 180, 'However she is feeding, and she can end the check-ins.'],
  ['Out the door',         160, 'Cancel a ride the morning of.'],
  ['Her table',            200, 'Pick who comes, or keep it to herself.'],
  ['Paperwork',            140, 'Hand over only the forms she wants chased.'],
  ['Clean house',          190, 'Choose the rooms. Nobody goes upstairs unless she says.'],
  ['Sleep',                280, 'Swap the nights, or keep the hours short.'],
];

const arrow = `<svg width="14" height="9" viewBox="0 0 14 9" fill="none" style="display:block;"><path d="M0 4.5H12.5M9 1L12.8 4.5L9 8" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linejoin="round"/></svg>`;
const plus = (c, open) => `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" style="display:block;flex-shrink:0;"><path d="M0 6.5H13" stroke="${c}" stroke-width="1"/>${open ? '' : `<path d="M6.5 0V13" stroke="${c}" stroke-width="1"/>`}</svg>`;

// ---- closed card ----
const card = (o, [name, price, change]) => `
        <div style="background:${T.paper};border:1px solid ${T.hairline};border-radius:2px;padding:${o.cardPad};display:flex;flex-direction:column;gap:${o.cardGap}px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
            <div style="display:flex;flex-direction:column;gap:${o.priceGap}px;min-width:0;">
              <div class="serif" style="font-size:${o.name}px;font-weight:400;line-height:1.16;letter-spacing:-0.015em;color:${T.ink};text-wrap:pretty;">${name}</div>
              <div style="font-size:${o.price}px;color:${T.ink3};letter-spacing:0.02em;">from $${price}</div>
            </div>
            <div style="padding-top:${o.plusPt}px;">${plus(T.ink3, false)}</div>
          </div>
          <div style="font-size:${o.change}px;line-height:1.6;color:${T.ink2};text-wrap:pretty;">${change}</div>
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

const sectionHead = (o) => `
    <div style="display:grid;grid-template-columns:${o.stackHead ? 'minmax(0,1fr)' : 'minmax(0,5fr) minmax(0,6fr)'};gap:${o.headGap}px;align-items:start;">
      <div style="display:flex;flex-direction:column;">
        <div style="font-size:${o.eyebrow}px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.moss};">${EYEBROW}</div>
        <h2 class="serif" style="margin:${o.headMt}px 0 0 0;font-size:${o.h2}px;font-weight:400;line-height:1.12;letter-spacing:-0.02em;max-width:${o.h2Max}px;text-wrap:pretty;">${HEADING}</h2>
      </div>
      <p style="margin:0;font-size:${o.lead}px;line-height:1.66;color:${T.ink2};max-width:${o.leadMax}px;text-wrap:pretty;">${LEAD}</p>
    </div>`;

function buildClosed(file, W, H, o) {
  writeFileSync(file, head(W, H) + `
  <div style="padding:${o.padY}px ${o.margin}px;">
${sectionHead(o)}
    <div style="margin-top:${o.gridMt}px;display:grid;grid-template-columns:repeat(${o.cols},minmax(0,1fr));gap:${o.gridGap}px;">
${PACKS.map(p => card(o, p)).join('')}${o.spanNote ? `
        <div style="grid-column:span ${o.spanNote};display:flex;align-items:center;padding:0 ${o.notePadX}px;">
          <div class="serif" style="font-size:${o.note}px;font-weight:400;line-height:1.3;letter-spacing:-0.012em;color:${T.ink};max-width:${o.noteMax}px;text-wrap:pretty;">Ten in all. She only ever needs one.</div>
        </div>` : ''}
    </div>${o.spanNote ? '' : `
    <div style="margin-top:${o.noteMt}px;" class="serif"><span style="font-size:${o.note}px;font-weight:400;line-height:1.3;letter-spacing:-0.012em;color:${T.ink};">Ten in all. She only ever needs one.</span></div>`}
  </div>` + tail);
}

buildClosed('Pack1440.dc.html', 1440, 1320, {
  margin:96, padY:152, eyebrow:11, headGap:80, headMt:32, h2:46, h2Max:520, lead:19, leadMax:520,
  gridMt:88, cols:3, gridGap:20, cardPad:'34px 34px', cardGap:20, name:26, price:13.5, priceGap:9, change:14.5, plusPt:6,
  spanNote:2, notePadX:34, note:28, noteMax:420 });

buildClosed('Pack1280.dc.html', 1280, 1140, {
  margin:64, padY:128, eyebrow:11, headGap:56, headMt:24, h2:40, h2Max:460, lead:17.5, leadMax:470,
  gridMt:72, cols:3, gridGap:16, cardPad:'28px 28px', cardGap:18, name:23, price:13, priceGap:8, change:13.5, plusPt:5,
  spanNote:2, notePadX:28, note:24, noteMax:360 });

buildClosed('Pack768.dc.html', 768, 1420, {
  margin:48, padY:112, eyebrow:11, stackHead:true, headGap:28, headMt:24, h2:38, h2Max:520, lead:17, leadMax:560,
  gridMt:60, cols:2, gridGap:16, cardPad:'28px 28px', cardGap:18, name:23, price:13, priceGap:8, change:14, plusPt:5,
  noteMt:40, note:24 });

buildClosed('Pack375.dc.html', 375, 2170, {
  margin:24, padY:80, eyebrow:10.5, stackHead:true, headGap:22, headMt:20, h2:31, h2Max:340, lead:16, leadMax:340,
  gridMt:48, cols:1, gridGap:12, cardPad:'26px 24px', cardGap:16, name:24, price:13, priceGap:8, change:14.5, plusPt:6,
  noteMt:36, note:21 });

console.log('wrote 4 closed package artboards');

// ================= the open state, designed once =================
const OPEN = {
  name: 'First weeks home', price: 300,
  what: "Dinners arrive three evenings a week, starting the day she's home.",
  included: ['The wrap, with her name on it', 'The thread, and every check-in', 'A seat at a tea table', 'The dinners'],
  change: 'What the house eats, which evenings, and she can pause any week she says we have food.',
  ask: 'Skip the dinners this week?', reply: 'yes',
  caption: 'She never composes; she just replies.',
};

const dot = (c, s=5) => `<span style="display:inline-block;width:${s}px;height:${s}px;border-radius:50%;background:${c};flex-shrink:0;"></span>`;

const included = (o) => OPEN.included.map((t, i) => `
            <div style="display:flex;align-items:center;gap:14px;padding:${o.incPadY}px 0;border-top:1px solid ${i === 0 ? T.ink : T.hairline};font-size:${o.inc}px;color:${T.ink};">${dot(T.moss)}${t}</div>`).join('');

const exchange = (o) => `
          <div style="display:flex;flex-direction:column;align-items:flex-start;gap:9px;margin-top:${o.exMt}px;">
            <div style="background:${T.paper};border:1px solid ${T.hairline};border-radius:12px 12px 12px 3px;padding:${o.exPad};font-size:${o.ex}px;line-height:1.5;color:${T.ink};max-width:${o.exMax}px;">${OPEN.ask}</div>
            <div style="background:${T.plum};color:${T.ground};border-radius:12px 12px 3px 12px;padding:${o.exPad};font-size:${o.ex}px;">${OPEN.reply}</div>
          </div>
          <div style="font-size:${o.cap}px;line-height:1.6;color:${T.ink2};margin-top:${o.capMt}px;">${OPEN.caption}</div>`;

const openBody = (o) => `
      <div style="margin-top:${o.bodyMt}px;">
        <div class="lbl">What it is</div>
        <div class="serif" style="margin-top:${o.slotMt}px;font-size:${o.what}px;font-weight:400;line-height:1.3;letter-spacing:-0.012em;color:${T.ink};max-width:${o.whatMax}px;text-wrap:pretty;">${OPEN.what}</div>
      </div>

      <div style="margin-top:${o.colsMt}px;display:grid;grid-template-columns:${o.openCols};gap:${o.colsGap}px;">
        <div>
          <div class="lbl">Included</div>
          <div style="margin-top:${o.slotMt}px;">
${included(o)}
          </div>
        </div>
        <div>
          <div class="lbl">She can change</div>
          <div style="margin-top:${o.slotMt}px;font-size:${o.chg}px;line-height:1.62;color:${T.ink};max-width:${o.chgMax}px;text-wrap:pretty;">${OPEN.change}</div>
${exchange(o)}
        </div>
      </div>`;

const cta = (o, full) => `<a href="#" style="display:${full ? 'flex' : 'inline-flex'};align-items:center;justify-content:center;gap:12px;background:${T.plum};color:${T.ground};font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;padding:${full ? '0' : o.btnPad};${full ? 'height:56px;' : ''}border-radius:2px;">Choose this one ${arrow}</a>`;

function buildOpenDesktop(file, W, H, o) {
  writeFileSync(file, head(W, H) + `
  <div style="padding:${o.padY}px ${o.margin}px;">

    <div style="background:${T.field};border-radius:2px;padding:${o.openPad};">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:24px;">
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="serif" style="font-size:${o.openName}px;font-weight:400;line-height:1.1;letter-spacing:-0.02em;color:${T.ink};">${OPEN.name}</div>
          <div style="font-size:14px;color:${T.ink3};letter-spacing:0.02em;">from $${OPEN.price}</div>
        </div>
        <div style="padding-top:10px;">${plus(T.ink, true)}</div>
      </div>
${openBody(o)}
      <div style="margin-top:${o.footMt}px;padding-top:${o.footPt}px;border-top:1px solid ${T.hairline};display:flex;align-items:center;gap:32px;flex-wrap:wrap;">
${cta(o, false)}
        <a href="#" style="font-size:14px;color:${T.ink2};border-bottom:1px solid ${T.mute};padding-bottom:2px;">Add one more thing after this</a>
      </div>
    </div>

    <div style="margin-top:${o.gridGap}px;display:grid;grid-template-columns:repeat(${o.cols},minmax(0,1fr));gap:${o.gridGap}px;">
${PACKS.slice(1, 1 + o.cols).map(p => card(o, p)).join('')}
    </div>

  </div>` + tail);
}

buildOpenDesktop('PackOpen1440.dc.html', 1440, 1140, {
  margin:96, padY:96, openPad:'56px 64px', openName:42, bodyMt:44, slotMt:20, what:26, whatMax:760,
  colsMt:56, openCols:'minmax(0,5fr) minmax(0,6fr)', colsGap:96, inc:15.5, incPadY:16,
  chg:16, chgMax:460, ex:15, exPad:'12px 17px', exMax:300, exMt:32, cap:14, capMt:20,
  footMt:56, footPt:36, btnPad:'17px 30px',
  cols:3, gridGap:20, cardPad:'34px 34px', cardGap:20, name:26, price:13.5, priceGap:9, change:14.5, plusPt:6 });

function buildOpenPhone(file, W, H, o) {
  writeFileSync(file, head(W, H) + `
  <div style="display:flex;flex-direction:column;min-height:${H}px;box-sizing:border-box;">
    <div style="display:flex;align-items:center;gap:12px;padding:20px ${o.margin}px;border-bottom:1px solid ${T.hairline};">
      <svg width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M6 1L1.2 5.5L6 10" stroke="${T.ink2}" stroke-width="1.2" fill="none" stroke-linejoin="round"/></svg>
      <span style="font-size:13px;color:${T.ink2};">All packages</span>
    </div>

    <div style="padding:${o.padY}px ${o.margin}px ${o.padB}px ${o.margin}px;flex:1;">
      <div class="serif" style="font-size:${o.openName}px;font-weight:400;line-height:1.1;letter-spacing:-0.02em;color:${T.ink};">${OPEN.name}</div>
      <div style="font-size:13px;color:${T.ink3};letter-spacing:0.02em;margin-top:9px;">from $${OPEN.price}</div>
${openBody(o)}
    </div>

    <div style="position:sticky;bottom:0;background:${T.ground};border-top:1px solid ${T.hairline};padding:16px ${o.margin}px 20px ${o.margin}px;">
${cta(o, true)}
      <div style="text-align:center;margin-top:14px;"><a href="#" style="font-size:13px;color:${T.ink2};border-bottom:1px solid ${T.mute};padding-bottom:2px;">Add one more thing after this</a></div>
    </div>
  </div>` + tail);
}

buildOpenPhone('PackOpen375.dc.html', 375, 990, {
  margin:24, padY:36, padB:48, openName:31, bodyMt:36, slotMt:16, what:21, whatMax:340,
  colsMt:40, openCols:'minmax(0,1fr)', colsGap:40, inc:15, incPadY:15,
  chg:15.5, chgMax:340, ex:14.5, exPad:'11px 16px', exMax:280, exMt:26, cap:13.5, capMt:18 });

console.log('wrote 2 open state artboards');
