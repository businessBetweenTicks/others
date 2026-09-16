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

const bubble = (t, o) => `<div style="background:${T.paper};border:1px solid ${T.hairline};border-radius:14px 14px 14px 3px;padding:${o.bubPad};font-size:${o.bub}px;line-height:1.5;color:${T.ink};max-width:${o.bubMax}px;display:inline-block;">${t}</div>`;

const link = (t, o) => `<a href="#" style="display:inline-flex;align-items:center;gap:12px;font-size:${o.link}px;color:${T.ink};border-bottom:1px solid ${T.mute};padding-bottom:4px;">${t} ${arrow}</a>`;

// ============ section 8 on the landing page ============
const SHORT = [
  'Two days after I got home, a message came. Not an app, just a text with my name on it. It already knew the basics from the hospital, so it did not make me repeat anything.',
  'It asked me four things I could tap. I said feeding was hard. I did not have to explain more.',
  'By that evening it had checked what my insurance covered, found a lactation nurse who comes to the house and takes it, and booked her for the next morning. It told my doctor we would do the weights at home.',
];
const PAYOFF = 'nurse coming at ten, weights by text, your doctor said okay';
const PULL = 'It was not an app I had to check. It was someone handling the part I did not have the room to handle.';

function buildSection(file, W, H, o) {
  writeFileSync(file, head(W, H) + `
  <div style="padding:${o.padY}px ${o.margin}px;">

    <div style="display:grid;grid-template-columns:${o.stack ? 'minmax(0,1fr)' : 'minmax(0,4fr) minmax(0,7fr)'};gap:${o.headGap}px;align-items:start;">
      <div>
        <div style="font-size:${o.eyebrow}px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.moss};">First Week Check</div>
        <h2 class="serif" style="margin:${o.headMt}px 0 0 0;font-size:${o.h2}px;font-weight:400;line-height:1.1;letter-spacing:-0.02em;max-width:${o.h2Max}px;text-wrap:pretty;">The first week, handled.</h2>
      </div>

      <div>
        <div class="lbl">How the first week goes</div>
        <div style="margin-top:${o.wordsMt}px;display:flex;flex-direction:column;gap:${o.paraGap}px;">
${SHORT.map(p => `          <p class="serif" style="margin:0;font-size:${o.para}px;font-weight:400;line-height:1.52;letter-spacing:-0.006em;color:${T.ink};max-width:${o.paraMax}px;text-wrap:pretty;">${p}</p>`).join('\n')}
        </div>
        <div style="margin-top:${o.bubMt}px;">${bubble(PAYOFF, o)}</div>
      </div>
    </div>

    <div style="margin-top:${o.pullMt}px;padding-top:${o.pullPt}px;border-top:1px solid ${T.ink};display:grid;grid-template-columns:${o.stack ? 'minmax(0,1fr)' : 'minmax(0,4fr) minmax(0,7fr)'};gap:${o.headGap}px;align-items:end;">
      <div class="serif" style="font-size:${o.pull}px;font-weight:400;line-height:1.28;letter-spacing:-0.015em;color:${T.ink};max-width:${o.pullMax}px;text-wrap:pretty;${o.stack ? '' : 'grid-column:2;'}">${PULL}</div>
    </div>

    <div style="margin-top:${o.discMt}px;font-size:${o.disc}px;line-height:1.6;color:${T.ink3};max-width:${o.discMax}px;${o.stack ? '' : `margin-left:calc((100% - ${o.headGap}px) * 4 / 11 + ${o.headGap}px);`}">Written in the first person because that is how it is lived. Nura is new — this is the week it is built to handle, not a customer's account.</div>

    <div style="margin-top:${o.linkMt}px;${o.stack ? '' : `margin-left:calc((100% - ${o.headGap}px) * 4 / 11 + ${o.headGap}px);`}">${link('Read her whole first week', o)}</div>

  </div>` + tail);
}

buildSection('FWC1440.dc.html', 1440, 1130, {
  margin:96, padY:152, eyebrow:11, headGap:96, headMt:32, h2:46, h2Max:340,
  wordsMt:26, paraGap:26, para:25, paraMax:720, bubMt:36, bub:16, bubPad:'15px 20px', bubMax:440,
  pullMt:88, pullPt:52, pull:36, pullMax:780, discMt:40, disc:14, discMax:700, linkMt:36, link:16 });

buildSection('FWC1280.dc.html', 1280, 980, {
  margin:64, padY:128, eyebrow:11, headGap:72, headMt:24, h2:40, h2Max:300,
  wordsMt:22, paraGap:22, para:22, paraMax:660, bubMt:30, bub:15, bubPad:'14px 18px', bubMax:370,
  pullMt:72, pullPt:44, pull:31, pullMax:700, discMt:32, disc:13.5, discMax:640, linkMt:30, link:15 });

buildSection('FWC768.dc.html', 768, 1040, {
  margin:48, padY:112, eyebrow:11, stack:true, headGap:36, headMt:24, h2:38, h2Max:420,
  wordsMt:20, paraGap:22, para:22, paraMax:620, bubMt:30, bub:15, bubPad:'14px 18px', bubMax:360,
  pullMt:64, pullPt:40, pull:29, pullMax:620, discMt:32, disc:13.5, discMax:600, linkMt:28, link:15 });

buildSection('FWC375.dc.html', 375, 1035, {
  margin:24, padY:80, eyebrow:10.5, stack:true, headGap:28, headMt:20, h2:31, h2Max:340,
  wordsMt:18, paraGap:20, para:19, paraMax:340, bubMt:26, bub:14.5, bubPad:'13px 17px', bubMax:300,
  pullMt:48, pullPt:32, pull:24, pullMax:340, discMt:26, disc:13, discMax:340, linkMt:24, link:15 });

console.log('wrote 4 first week check sections');

// ================= the separate page =================
const SCENE = [
  'Two days after I got home, a message came. Not an app, just a text with my name on it. It asked if now was a good time. It already knew the basics from the hospital, so it did not make me repeat anything. It asked me four things I could tap: how I was feeling down there, how feeding was going, whether the pediatrician wanted the baby back for a weight check, and who was with me that day.',
  'I said feeding was hard and the pediatrician wanted us back in two days to weigh her again. I did not have to explain more.',
  'It wrote back that I did not have to keep going in. It asked if it could find someone to come to me instead. I said yes. By that evening it had checked what my insurance covered, found a lactation nurse who does home visits and takes my plan, and booked her for the next morning. It told me my state has a free nurse who comes to the house in my county and signed me up for that too. And it sent my pediatrician a note saying we would weigh the baby at home and report the numbers, so nobody was waiting on us to drive in. It asked me to confirm the pediatrician was fine with it, and once they were, it told me in one line: nurse coming at ten, weights by text, your doctor said okay.',
  'For the next two weeks I just texted the baby’s weight when I had it. It watched the trend. It told me when we were past the worst of it. I did not fill out a single form. I did not make a single call. I did not sit on a directory at two in the morning trying to figure out who took my insurance.',
  'That was the week I understood what this was. It was not an app I had to check. It was someone handling the part I did not have the room to handle.',
];

const HERS = [
  'Answered four questions, by tapping',
  'Said feeding was hard',
  'Said yes to someone coming',
  'Texted a weight when she had it',
];

const ITS = [
  'Read the hospital discharge summary before asking her anything',
  'Asked only the four things it could not already know',
  'Offered to find someone who could come to her instead',
  'Checked what her insurance actually covered',
  'Found a lactation nurse who visits at home and takes it',
  'Booked her for the next morning',
  'Found the free nurse visit her county runs, and signed her up',
  'Sent her pediatrician a note about weighing at home',
  'Waited until the pediatrician agreed',
  'Sent her one line: nurse at ten, weights by text, your doctor said okay',
  'Watched the weights for two weeks, and told her when it was over',
];

const list = (items, o, heavyFirst) => items.map((t, i) => `
          <div style="padding:${o.rowPadY}px 0;border-top:1px solid ${i === 0 && heavyFirst ? T.ink : T.hairline};font-size:${o.row}px;line-height:1.5;color:${T.ink};text-wrap:pretty;">${t}</div>`).join('');

function buildPage(file, W, H, o) {
  writeFileSync(file, head(W, H) + `
  <div style="display:flex;align-items:center;justify-content:space-between;padding:${o.navY}px ${o.margin}px;border-bottom:1px solid ${T.hairline};">
    <div class="serif" style="font-size:${o.mark}px;letter-spacing:0.02em;">Nura</div>
    <a href="#" style="font-size:${o.navLink}px;color:${T.ink2};border-bottom:1px solid ${T.mute};padding-bottom:3px;">Start a gift</a>
  </div>

  <div style="padding:${o.padY}px ${o.margin}px ${o.padB}px ${o.margin}px;">

    <div style="font-size:${o.eyebrow}px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${T.moss};">First Week Check</div>
    <h1 class="serif" style="margin:${o.headMt}px 0 0 0;font-size:${o.h1}px;font-weight:400;line-height:1.06;letter-spacing:-0.024em;max-width:${o.h1Max}px;text-wrap:pretty;">The first week, handled.</h1>
    <p style="margin:${o.standMt}px 0 0 0;font-size:${o.stand}px;line-height:1.62;color:${T.ink2};max-width:${o.standMax}px;text-wrap:pretty;">One week, told from the inside. Then, plainly, what happened behind it.</p>
    <p style="margin:${o.discMtP}px 0 0 0;font-size:${o.discP}px;line-height:1.6;color:${T.ink3};max-width:${o.standMax}px;text-wrap:pretty;">Written in the first person because that is how it is lived. Nura is new, so this is the week it is built to handle rather than a customer\u2019s account. When there are real ones, they will run here instead, with her name on them.</p>

    <div style="margin-top:${o.sceneMt}px;padding-top:${o.scenePt}px;border-top:1px solid ${T.ink};">
      <div class="lbl">How the first week goes</div>
      <div style="margin-top:${o.wordsMt}px;display:flex;flex-direction:column;gap:${o.paraGap}px;">
${SCENE.map(p => `        <p class="serif" style="margin:0;font-size:${o.para}px;font-weight:400;line-height:1.56;letter-spacing:-0.006em;color:${T.ink};max-width:${o.paraMax}px;text-wrap:pretty;">${p}</p>`).join('\n')}
      </div>
    </div>

    <div style="margin-top:${o.behindMt}px;padding-top:${o.scenePt}px;border-top:1px solid ${T.ink};">
      <div class="lbl">What happened behind that</div>
      <p style="margin:${o.wordsMt}px 0 0 0;font-size:${o.stand}px;line-height:1.62;color:${T.ink2};max-width:${o.standMax}px;text-wrap:pretty;">Everything above took her four small actions. Here they are beside the week of work they set off.</p>

      <div style="margin-top:${o.colsMt}px;display:grid;grid-template-columns:${o.ledgerCols};gap:${o.colsGap}px;align-items:start;">
        <div>
          <div style="font-size:11px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:${T.ink3};margin-bottom:${o.listMb}px;">She did four things</div>
${list(HERS, o, true)}
        </div>
        <div>
          <div style="font-size:11px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:${T.plum};margin-bottom:${o.listMb}px;">Nura did eleven</div>
${list(ITS, o, true)}
        </div>
      </div>

      <div style="margin-top:${o.noteMt}px;padding:${o.notePad};background:${T.field};border-radius:2px;font-size:${o.note}px;line-height:1.66;color:${T.ink2};max-width:${o.noteMax}px;text-wrap:pretty;">If she had said something that needed a doctor that day, the week would have gone differently. It would have told her to call, given her the number, and sorted the ride and someone to hold the baby while she went.</div>
    </div>

    <div style="margin-top:${o.closeMt}px;padding-top:${o.scenePt}px;border-top:1px solid ${T.ink};">
      <div class="serif" style="font-size:${o.close}px;font-weight:400;line-height:1.24;letter-spacing:-0.018em;color:${T.ink};max-width:${o.closeMax}px;text-wrap:pretty;">One message to her. A week of work behind it that she never sees.</div>
    </div>

    <div style="margin-top:${o.ctaMt}px;">
      <a href="#" style="display:${o.ctaFull ? 'flex' : 'inline-flex'};align-items:center;justify-content:center;gap:12px;background:${T.plum};color:${T.ground};font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;padding:${o.ctaFull ? '0' : '18px 32px'};${o.ctaFull ? 'height:56px;' : ''}border-radius:2px;">Start a gift ${arrow}</a>
    </div>

  </div>` + tail);
}

buildPage('FWCPage1440.dc.html', 1440, 3140, {
  margin:96, navY:26, mark:20, navLink:14, padY:112, padB:152, eyebrow:11, headMt:30, h1:64, h1Max:820,
  standMt:28, stand:19, standMax:620, discMtP:22, discP:14,
  sceneMt:96, scenePt:56, wordsMt:30, paraGap:28, para:23, paraMax:820,
  behindMt:112, colsMt:56, ledgerCols:'minmax(0,4fr) minmax(0,7fr)', colsGap:112, listMb:22, rowPadY:17, row:16.5,
  noteMt:56, notePad:'32px 36px', note:16, noteMax:820,
  closeMt:96, close:42, closeMax:880, ctaMt:56 });

buildPage('FWCPage375.dc.html', 375, 3650, {
  margin:24, navY:20, mark:18, navLink:13, padY:56, padB:80, eyebrow:10.5, headMt:20, h1:36, h1Max:340,
  standMt:20, stand:16, standMax:340, discMtP:18, discP:13.5,
  sceneMt:56, scenePt:36, wordsMt:22, paraGap:22, para:18.5, paraMax:340,
  behindMt:64, colsMt:40, ledgerCols:'minmax(0,1fr)', colsGap:44, listMb:16, rowPadY:15, row:15.5,
  noteMt:40, notePad:'24px 22px', note:15, noteMax:340,
  closeMt:64, close:27, closeMax:340, ctaMt:40, ctaFull:true });

console.log('wrote 2 first week check page artboards');
