import { writeFileSync } from 'node:fs';

const T = { ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
            ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61' };

const arrow = `<svg width="14" height="9" viewBox="0 0 14 9" fill="none" style="display:block;"><path d="M0 4.5H12.5M9 1L12.8 4.5L9 8" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linejoin="round"/></svg>`;

// Her voice — verbatim from the First Week Check sheet.
const VOICE = [
  ['p', "Two days after I got home, a message came. Not an app, just a text with my name on it. It asked if now was a good time. It already knew the basics from the hospital, so it did not make me repeat anything. It asked me four things I could tap: how I was feeling down there, how feeding was going, whether the pediatrician wanted the baby back for a weight check, and who was with me that day."],
  ['lift', "I said feeding was hard and the pediatrician wanted us back in two days to weigh her again. I did not have to explain more."],
  ['p', "It wrote back that I did not have to keep going in. It asked if it could find someone to come to me instead. I said yes. By that evening it had checked what my insurance covered, found a lactation nurse who does home visits and takes my plan, and booked her for the next morning. It told me my state has a free nurse who comes to the house in my county and signed me up for that too. And it sent my pediatrician a note saying we would weigh the baby at home and report the numbers, so nobody was waiting on us to drive in. It asked me to confirm the pediatrician was fine with it, and once they were, it told me in one line: nurse coming at ten, weights by text, your doctor said okay."],
  ['p', "For the next two weeks I just texted the baby's weight when I had it. It watched the trend. It told me when we were past the worst of it. I did not fill out a single form. I did not make a single call. I did not sit on a directory at two in the morning trying to figure out who took my insurance."],
  ['lift', "That was the week I understood what this was. It was not an app I had to check. It was someone handling the part I did not have the room to handle."],
];

const BEHIND = [
  ['Day two, one message',
   "Nura has already read the discharge summary — birth weight, discharge weight, feeding plan, tear degree, the next appointment. It asks only what it cannot read, in four taps, with no typing. Every answer creates a follow-up Nura owns and never raises again."],
  ['When the weight needs watching',
   "It offers to find someone who can come to her, then does it: checks what her insurance covers for home visits and lactation, checks the hospital's own programme and the free newborn nurse visit her state runs, and books an in-network home visit. If nobody can come within forty-eight hours, a scale goes to her door and the weights come back by reply. It sends the pediatrician a one-page note saying the family will report weights from home, and asks them to confirm. Then it watches the trend."],
  ['When something is wrong',
   "If she reports worsening pain, a fever, foul discharge or trouble passing urine, Nura tells her to call the obstetrician now, gives her the number, and offers the ride and someone to cover the baby. If it is mild, it is a recheck in two days and a sitz bath kit in the next delivery."],
];

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

function build(file, W, H, o) {
  const voice = VOICE.map(([kind, t]) => kind === 'lift'
    ? `        <p class="serif" style="margin:${o.liftMy}px 0;font-size:${o.lift}px;font-weight:400;line-height:1.36;letter-spacing:-0.014em;color:${T.ink};max-width:${o.liftMax}px;text-wrap:pretty;">${t}</p>`
    : `        <p class="serif" style="margin:0 0 ${o.pMb}px 0;font-size:${o.body}px;font-weight:400;line-height:1.62;letter-spacing:-0.004em;color:${T.ink};text-wrap:pretty;">${t}</p>`).join('\n');

  const behind = BEHIND.map(([h, t], i) => `
        <div style="display:grid;grid-template-columns:${o.behindCols};gap:${o.behindGap}px;padding:${o.behindPad}px 0;border-top:1px solid ${i === 0 ? T.ink : T.hairline};">
          <div class="serif" style="font-size:${o.behindH}px;font-weight:400;line-height:1.24;letter-spacing:-0.012em;color:${T.ink};text-wrap:pretty;">${h}</div>
          <div style="font-size:${o.behindB}px;line-height:1.68;color:${T.ink2};max-width:${o.behindMax}px;text-wrap:pretty;">${t}</div>
        </div>`).join('');

  writeFileSync(file, head(W, H) + `
  <div style="display:flex;align-items:center;justify-content:space-between;padding:${o.navY}px ${o.margin}px;border-bottom:1px solid ${T.hairline};">
    <div class="serif" style="font-size:${o.mark}px;letter-spacing:0.02em;">Nura</div>
    <a href="#" style="font-size:${o.navLink}px;color:${T.ink2};border-bottom:1px solid ${T.mute};padding-bottom:2px;">Start a gift</a>
  </div>

  <div style="padding:${o.padT}px ${o.margin}px ${o.padB}px ${o.margin}px;">

    <div style="max-width:${o.headMax}px;">
      <div style="font-size:${o.eyebrow}px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.moss};">First Week Check</div>
      <h1 class="serif" style="margin:${o.headMt}px 0 0 0;font-size:${o.h1}px;font-weight:400;line-height:1.08;letter-spacing:-0.024em;text-wrap:pretty;">The first week, handled.</h1>
      <p style="margin:${o.standMt}px 0 0 0;font-size:${o.stand}px;line-height:1.66;color:${T.ink2};max-width:${o.standMax}px;text-wrap:pretty;">One week in one mother's life, written the way she told it. Then, plainly, the work that went on behind it.</p>
    </div>

    <div style="margin-top:${o.gap1}px;display:grid;grid-template-columns:${o.voiceCols};gap:${o.voiceGap}px;align-items:start;">
      <div style="${o.stickyLabel ? 'position:sticky;top:48px;' : ''}"><div class="lbl">In her words</div></div>
      <div style="max-width:${o.voiceMax}px;">
${voice}
      </div>
    </div>

    <div style="margin-top:${o.gap2}px;">
      <div class="lbl" style="margin-bottom:${o.behindMb}px;">What was happening behind it</div>
${behind}
      <div style="height:1px;background:${T.hairline};"></div>
    </div>

    <div class="serif" style="margin-top:${o.gap3}px;font-size:${o.closer}px;font-weight:400;line-height:1.28;letter-spacing:-0.016em;color:${T.ink};max-width:${o.closerMax}px;text-wrap:pretty;">That is the whole thing. One message to her, and a week of work behind it that she never sees.</div>

    <div style="margin-top:${o.ctaMt}px;">
      <a href="#" style="display:${o.ctaFull ? 'flex' : 'inline-flex'};align-items:center;justify-content:center;gap:12px;background:${T.plum};color:${T.ground};font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;${o.ctaFull ? 'height:56px;' : 'padding:17px 30px;'}border-radius:2px;">Start a gift ${arrow}</a>
    </div>
  </div>

  <div style="border-top:1px solid ${T.hairline};padding:${o.footY}px ${o.margin}px;display:flex;flex-wrap:wrap;gap:${o.footGap}px;align-items:baseline;justify-content:space-between;">
    <div style="font-size:${o.foot}px;color:${T.ink3};">Grisaille Labs</div>
    <div style="display:flex;gap:${o.footGap}px;flex-wrap:wrap;">
      <a href="#" style="font-size:${o.foot}px;color:${T.ink2};">The gift</a>
      <a href="#" style="font-size:${o.foot}px;color:${T.ink2};">First Week Check</a>
      <a href="#" style="font-size:${o.foot}px;color:${T.ink2};">Privacy</a>
    </div>
  </div>` + tail);
}

build('FWC1440.dc.html', 1440, 2400, {
  margin:96, navY:26, mark:20, navLink:14, padT:120, padB:120,
  headMax:900, eyebrow:11, headMt:28, h1:62, standMt:32, stand:19, standMax:560,
  gap1:104, voiceCols:'minmax(0,2fr) minmax(0,9fr)', voiceGap:56, stickyLabel:true, voiceMax:720,
  body:21, pMb:28, lift:29, liftMax:700, liftMy:44,
  gap2:112, behindMb:36, behindCols:'minmax(0,4fr) minmax(0,7fr)', behindGap:64, behindPad:34, behindH:25, behindB:15.5, behindMax:640,
  gap3:96, closer:38, closerMax:800, ctaMt:64, footY:40, foot:13.5, footGap:32 });

build('FWC1280.dc.html', 1280, 2300, {
  margin:64, navY:24, mark:19, navLink:13.5, padT:104, padB:104,
  headMax:820, eyebrow:11, headMt:24, h1:54, standMt:28, stand:18, standMax:520,
  gap1:88, voiceCols:'minmax(0,2fr) minmax(0,9fr)', voiceGap:48, stickyLabel:true, voiceMax:680,
  body:20, pMb:26, lift:27, liftMax:660, liftMy:40,
  gap2:96, behindMb:32, behindCols:'minmax(0,4fr) minmax(0,7fr)', behindGap:52, behindPad:30, behindH:23, behindB:15, behindMax:600,
  gap3:84, closer:34, closerMax:740, ctaMt:56, footY:36, foot:13, footGap:28 });

build('FWC768.dc.html', 768, 2700, {
  margin:48, navY:22, mark:18, navLink:13, padT:80, padB:88,
  headMax:600, eyebrow:11, headMt:22, h1:44, standMt:24, stand:17, standMax:540,
  gap1:64, voiceCols:'minmax(0,1fr)', voiceGap:24, voiceMax:600,
  body:19, pMb:24, lift:25, liftMax:600, liftMy:36,
  gap2:80, behindMb:28, behindCols:'minmax(0,1fr)', behindGap:14, behindPad:26, behindH:23, behindB:15, behindMax:620,
  gap3:72, closer:30, closerMax:600, ctaMt:48, footY:32, foot:13, footGap:24 });

build('FWC375.dc.html', 375, 3400, {
  margin:24, navY:18, mark:17, navLink:12.5, padT:56, padB:64,
  headMax:340, eyebrow:10.5, headMt:18, h1:36, standMt:20, stand:16, standMax:340,
  gap1:48, voiceCols:'minmax(0,1fr)', voiceGap:20, voiceMax:340,
  body:17.5, pMb:22, lift:23, liftMax:340, liftMy:32,
  gap2:60, behindMb:24, behindCols:'minmax(0,1fr)', behindGap:12, behindPad:24, behindH:21, behindB:14.5, behindMax:340,
  gap3:56, closer:25, closerMax:340, ctaMt:40, ctaFull:true, footY:28, foot:12.5, footGap:18 });

console.log('wrote 4 First Week Check artboards');
