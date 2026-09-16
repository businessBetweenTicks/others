import { writeFileSync } from 'node:fs';

const GROUND='#F7F3ED', FIELD='#EFE9E0', PAPER='#FFFDFA', HAIRLINE='#E2DAD0', MUTE='#D9CFC3',
      INK='#1C1A17', INK2='#55504A', INK3='#8A8279', PLUM='#4E2A44', MOSS='#6E7A61';

const scene = (op) => `
      <div style="position: relative; width: 180px; height: 300px; background: ${HAIRLINE}; border: 1px dashed ${MUTE}; border-radius: 2px; opacity: ${op}; display: flex; flex-direction: column; justify-content: flex-end; padding: 14px; box-sizing: border-box;">
        <div style="font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: ${INK3}; line-height: 1.6;">Photography<br>her, low light,<br>no baby in frame</div>
      </div>`;

const bIn = (t, op=1) => `
        <div style="max-width: 172px; background: ${PAPER}; border: 1px solid ${HAIRLINE}; border-radius: 14px 14px 14px 4px; padding: 9px 11px; font-size: 11px; line-height: 1.45; color: ${INK}; opacity: ${op};">${t}</div>`;
const bOut = (t, op=1) => `
        <div style="align-self: flex-end; background: ${PLUM}; color: ${GROUND}; border-radius: 14px 14px 4px 14px; padding: 8px 12px; font-size: 11px; line-height: 1.45; opacity: ${op};">${t}</div>`;
const bGrey = (t, op=1) => `
        <div style="align-self: flex-end; background: ${MUTE}; color: ${INK3}; border-radius: 14px 14px 4px 14px; padding: 8px 12px; font-size: 11px; line-height: 1.45; font-style: italic; opacity: ${op};">${t}</div>`;

const tick = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="${MOSS}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.6 6.2 11.8 13 5"></path></svg>`;
const ring = `<div style="width: 14px; height: 14px; border: 1px dashed ${MUTE}; border-radius: 50%;"></div>`;

const card = (title, sub, done, rot=0) => `
        <div style="background: ${done ? PAPER : FIELD}; border: 1px ${done ? 'solid ' + HAIRLINE : 'dashed ' + MUTE}; border-radius: 2px; padding: 11px 12px; display: flex; align-items: center; gap: 10px; transform: rotate(${rot}deg);">
          ${done ? tick : ring}
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <div style="font-size: 11px; color: ${done ? INK : INK3};">${title}</div>
            <div style="font-size: 9.5px; color: ${INK3};">${sub}</div>
          </div>
        </div>`;

const OPEN  = [['Six-week visit','no date yet',-0.8], ['Dinners','nobody asked',0.6], ['The walk','not since Tuesday',-0.5]];
const DONE  = [['Six-week visit','Booked · Tue 10:00'], ['Dinners','Tue · Thu · Sat, from tonight'], ['The walk','Thursday 16:00 · sitter coming']];
const open  = n => OPEN.map((c,i) => i < n ? card(...DONE[i], true) : card(c[0], c[1], false, c[2])).join('');
const allDone = DONE.map(c => card(c[0], c[1], true)).join('');

const HELLO = 'Hi Maya. It’s Nura. Is now a good time?';
const VISIT = 'Your six-week visit is Tuesday at 10. Someone will be there for the baby.';

const frames = [
  { n:'01', title:'Before', time:'0.00 — 1.40s', dur:'1400ms', ease:'—', sceneOp:0.55, thread:'', items:'',
    onScreen:'The warm field, empty. The photography plate sits low and unlit at the left. Nothing else is on screen — no logo, no chrome, no caption.',
    motion:'Nothing moves. The frame holds so the arrival in Frame 02 has something to interrupt. A 1.4s stillness reads as intentional; anything shorter reads as loading.',
    note:'Do not shorten this frame to save time. It is the only reason the rest lands.' },

  { n:'02', title:'A message arrives with her name', time:'1.40 — 2.60s', dur:'1200ms', ease:'ease-rise', sceneOp:0.55,
    thread:bIn(HELLO), items:'',
    onScreen:'One incoming bubble, left-aligned, in the thread column. Her first name is in it. No sender avatar, no notification badge, no application frame of any kind.',
    motion:'Bubble: opacity 0 → 1 over 620ms, y +14px → 0, on ease-rise. It does not scale and it does not bounce. Its shadow settles from 0 to its resting value over 420ms on ease-soft, offset 420ms behind the bubble — that delayed shadow is what makes it read as arriving rather than appearing.',
    note:'No typing indicator, no chime. Sound is off by default and the piece must work silent.' },

  { n:'03', title:'The scene beside it', time:'2.60 — 4.20s', dur:'1600ms', ease:'ease-soft / ease-rise', sceneOp:1,
    thread:bIn(HELLO), items:open(0),
    onScreen:'The photography plate comes up to full. Three unresolved items appear at the right as dashed, un-ticked cards, each fractionally off-axis. Their copy is Ink 3, not Ink.',
    motion:'Plate: opacity 0.55 → 1 over 900ms on ease-soft, with a 1.02 → 1.00 scale on the same curve — a settle, not a zoom. Cards: staggered 130ms apart, opacity 0 → 1, y +14px → 0, 620ms each on ease-rise. Their rotation (−0.8°, +0.6°, −0.5°) is the load; it is removed later, not here.',
    note:'The tilt is the only place the piece is allowed to look untidy. Keep it under 1°.' },

  { n:'04', title:'She replies with one word', time:'4.20 — 5.20s', dur:'1000ms', ease:'ease-rise', sceneOp:1,
    thread:bIn(HELLO, 0.55) + bOut('yes'), items:open(0),
    onScreen:'A single outgoing plum bubble: “yes”. The bubble above it drops to 55% so the reply is the only lit thing in the column.',
    motion:'Reply: opacity 0 → 1, y +14px → 0, 420ms on ease-rise. The bubble above dims 1 → 0.55 over 420ms on ease-soft, running at the same time. Then the frame holds 580ms before anything resolves.',
    note:'This is the product claim in one gesture — her whole contribution is three letters. Give the hold its full 580ms.' },

  { n:'05', title:'The appointment ticks booked', time:'5.20 — 6.80s', dur:'1600ms', ease:'ease-settle', sceneOp:1,
    thread:bIn(HELLO, 0.4) + bOut('yes', 0.55) + bIn(VISIT), items:open(1),
    onScreen:'The first card turns over: dashed border to hairline, Field fill to Paper, Ink 3 copy to Ink, and a moss tick where the empty ring was. A third bubble explains it in her thread.',
    motion:'Card: fill and border cross-fade 420ms on ease-soft; rotation −0.8° → 0° over 620ms on ease-settle. Tick: SVG stroke-dashoffset draws in 420ms on ease-settle, starting 220ms after the fill changes, so the tick reads as the last thing to happen. Bubble: 620ms on ease-rise, starting 220ms after the card.',
    note:'The tick is the only moss on screen so far. It is a 14px stroke, never a filled badge.' },

  { n:'06', title:'A dinner arrives', time:'6.80 — 8.20s', dur:'1400ms', ease:'ease-settle', sceneOp:1,
    thread:bIn(HELLO, 0.3) + bOut('yes', 0.4) + bIn(VISIT, 0.55) + bIn('Dinner lands at six, Tuesday, Thursday, Saturday.'), items:open(2),
    onScreen:'Second card resolves the same way. The thread has begun to scroll: the oldest bubbles are down to 30% and drifting up out of frame.',
    motion:'Identical card sequence to Frame 05 — same durations, same curves, no variation. Thread column translates y −14px over 620ms on ease-settle while the top bubble fades 0.4 → 0.3.',
    note:'Reuse the resolve sequence exactly. The repetition is what makes it feel like a system rather than a set of tricks.' },

  { n:'07', title:'A walk happens', time:'8.20 — 9.60s', dur:'1400ms', ease:'ease-settle', sceneOp:1,
    thread:bIn(VISIT, 0.3) + bIn('Dinner lands at six, Tuesday, Thursday, Saturday.', 0.5) + bIn('Thursday at four is yours. Someone is coming for the baby.') + bGrey('is this normal?'), items:allDone,
    onScreen:'Third card resolves. All three are now Paper, hairline, ticked and square to the grid. In the same beat her own grey question arrives at the bottom of the thread, unanswered — it is the only thing left open on screen.',
    motion:'Same resolve sequence as 05 and 06. Her grey bubble enters last, 620ms on ease-rise, 220ms after the card settles, and is deliberately left hanging into Frame 08.',
    note:'The grey bubble must appear here, not in 08. An answer with no question in front of it reads as a feature, not a reply.' },

  { n:'08', title:'The worry clears', time:'9.60 — 11.40s', dur:'1800ms', ease:'ease-soft', sceneOp:1,
    thread:bIn('Dinner lands at six, Tuesday, Thursday, Saturday.', 0.3) + bGrey('is this normal?', 0.55) + bIn('It is. It usually eases by week three. If it doesn’t, I’ll get you seen.'), items:allDone,
    onScreen:'Her question from Frame 07 — the 2am one — is answered directly beneath it. Nothing is booked here. This beat is about an answer, not a task.',
    motion:'Reply enters 620ms on ease-rise. Her grey bubble then warms from Mute to the Paper fill over 900ms on ease-soft — the worry does not disappear, it stops being heavy. Hold 280ms. 620 + 900 + 280 = 1800ms.',
    note:'The only frame where nothing is ticked. Resist adding a tick here; being answered is not a task completing.' },

  { n:'09', title:'Weight lifting — rest state', time:'11.40 — 14.00s', dur:'2600ms', ease:'ease-settle / ease-soft', sceneOp:1,
    thread:bIn(HELLO, 0.45) + bOut('yes', 0.6) + bIn(VISIT, 0.75) + bOut('ok'), items:allDone,
    onScreen:'Everything square, everything quiet. The thread settles back to its opening and its close — the first message and the last word — and the three cards hold. “She did none of it.” fades up beneath them in the serif, italic. This composition is the hero poster frame, card for card and bubble for bubble.',
    motion:'Intermediate bubbles fade out over 620ms on ease-soft as the column resolves to four. The whole composition then lifts y −14px over 1200ms on ease-settle — the weight coming off, read as the scene rising rather than anything falling — and shadows soften about 20% on the same curve. Caption fades in at 1.10s, 900ms on ease-soft, ending at 2.00s. The final 600ms is dead still. 2000 + 600 = 2600ms.',
    note:'End here and hold. Plays once on load; a quiet Replay appears bottom-right of the stage after the hold, never an auto-loop — a loop turns a moment of relief into a nervous tic.' },
];

const specRow = (label, body) => `
      <div style="display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 16px; align-items: start;">
        <div style="font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: ${INK3}; padding-top: 2px;">${label}</div>
        <div style="font-size: 11.5px; line-height: 1.62; color: ${INK2}; text-wrap: pretty;">${body}</div>
      </div>`;

for (const f of frames) {
  writeFileSync(`Frame${f.n}.dc.html`, `<!doctype html>
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
    a { color: ${INK2}; text-decoration: none; }
    a:hover { color: ${INK}; }
    .serif { font-family: 'Newsreader', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif; }
  </style>
</helmet>

<div style="width: 680px; min-height: 880px; background: ${GROUND}; color: ${INK}; padding: 32px; box-sizing: border-box; display: flex; flex-direction: column; gap: 24px;">

  <div style="display: flex; align-items: baseline; justify-content: space-between;">
    <div style="display: flex; align-items: baseline; gap: 14px;">
      <div class="serif" style="font-size: 30px; font-weight: 300; color: ${MUTE};">${f.n}</div>
      <div class="serif" style="font-size: 23px; font-weight: 400; letter-spacing: -0.01em;">${f.title}</div>
    </div>
    <div style="font-size: 10px; letter-spacing: 0.1em; color: ${INK3}; border: 1px solid ${HAIRLINE}; border-radius: 2px; padding: 5px 9px;">${f.time}</div>
  </div>

  <div style="background: ${FIELD}; border-radius: 2px; padding: 24px; display: flex; gap: 18px; align-items: stretch;">
${scene(f.sceneOp)}
    <div style="width: 200px; display: flex; flex-direction: column; gap: 7px;">
      <div style="font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; color: ${INK3}; margin-bottom: 3px;">Thread</div>
${f.thread || `      <div style="font-size: 10.5px; color: ${INK3}; font-style: italic; padding-top: 4px;">empty</div>`}
    </div>
    <div style="width: 200px; display: flex; flex-direction: column; gap: 7px;">
      <div style="font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; color: ${INK3}; margin-bottom: 3px;">Around her</div>
${f.items || `      <div style="font-size: 10.5px; color: ${INK3}; font-style: italic; padding-top: 4px;">nothing yet</div>`}
    </div>
  </div>

  <div style="display: flex; flex-direction: column; gap: 16px; padding-top: 4px;">
${specRow('On screen', f.onScreen)}
    <div style="height: 1px; background: ${HAIRLINE};"></div>
${specRow('Motion', f.motion)}
    <div style="height: 1px; background: ${HAIRLINE};"></div>
${specRow('Timing', `${f.dur} · easing ${f.ease}`)}
    <div style="height: 1px; background: ${HAIRLINE};"></div>
${specRow('Note', f.note)}
  </div>

</div>
</x-dc>
</body>
</html>
`);
}
console.log('wrote', frames.length, 'frames');
