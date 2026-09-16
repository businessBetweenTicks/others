import { writeFileSync } from 'node:fs';

const T = { ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
            ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61' };

const arrow = `<svg width="14" height="9" viewBox="0 0 14 9" fill="none" style="display:block;"><path d="M0 4.5H12.5M9 1L12.8 4.5L9 8" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linejoin="round"/></svg>`;
const back = `<svg width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M6 1L1.2 5.5L6 10" stroke="${T.ink2}" stroke-width="1.2" fill="none" stroke-linejoin="round"/></svg>`;
const chev = `<svg width="9" height="6" viewBox="0 0 9 6" fill="none"><path d="M1 1L4.5 4.5L8 1" stroke="${T.ink2}" stroke-width="1.2" fill="none" stroke-linejoin="round"/></svg>`;
const tick = `<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.6L4 7.6L10 1.4" stroke="${T.ground}" stroke-width="1.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
const copy = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="0.5" y="3.5" width="8" height="9" stroke="${T.ink2}"/><path d="M3.5 3V0.5H12.5V9.5H10" stroke="${T.ink2}"/></svg>`;
const token = (fill) => `<span style="display:inline-block;width:12px;height:16px;border-radius:2px;${fill ? `background:${T.plum};` : `border:1px solid ${T.mute};box-sizing:border-box;`}"></span>`;

const lbl = (t) => `<div style="font-size:11px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:${T.ink3};">${t}</div>`;
const H = (t) => `<h2 class="serif" style="margin:0;font-size:28px;font-weight:400;line-height:1.16;letter-spacing:-0.018em;color:${T.ink};text-wrap:pretty;">${t}</h2>`;
const sub = (t) => `<p style="margin:10px 0 0 0;font-size:15px;line-height:1.62;color:${T.ink2};text-wrap:pretty;">${t}</p>`;
const rule = `<div style="height:1px;background:${T.hairline};"></div>`;

// hairline field
const field = (label, value, reason, placeholder) => `
        <div style="display:flex;flex-direction:column;gap:9px;">
          ${lbl(label)}
          <div style="font-size:16.5px;color:${placeholder ? T.ink3 : T.ink};padding-bottom:11px;border-bottom:1px solid ${placeholder ? T.mute : T.ink};">${value}</div>
          ${reason ? `<div style="font-size:12.5px;line-height:1.55;color:${T.ink3};">${reason}</div>` : ''}
        </div>`;

// selection row with a circle
const pick = (name, line, price, on) => `
        <div style="display:flex;align-items:flex-start;gap:16px;padding:20px 0;border-top:1px solid ${T.hairline};">
          <div style="flex:1;min-width:0;">
            <div class="serif" style="font-size:20px;font-weight:400;line-height:1.2;color:${T.ink};">${name}</div>
            <div style="font-size:13.5px;line-height:1.55;color:${T.ink2};margin-top:7px;">${line}</div>
            <div style="font-size:13px;color:${T.ink3};margin-top:8px;">${price}</div>
          </div>
          <div style="width:22px;height:22px;border-radius:50%;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;${on ? `background:${T.moss};` : `border:1px solid ${T.mute};box-sizing:border-box;`}">${on ? tick : ''}</div>
        </div>`;

// ---------------- screen chrome ----------------
function screen(file, step, title, lead, body, ctaText, secondary, minH) {
  writeFileSync(file, `<!doctype html>
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
  </style>
</helmet>

<div style="width:375px;min-height:${minH}px;background:${T.ground};color:${T.ink};box-sizing:border-box;display:flex;flex-direction:column;">

  <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px 24px;">
    <div style="display:flex;align-items:center;gap:11px;">${back}<span style="font-size:13px;color:${T.ink2};">Back</span></div>
    <div style="font-size:12px;color:${T.ink3};letter-spacing:0.06em;">${step} of 6</div>
  </div>
  <div style="height:1px;background:${T.mute};position:relative;">
    <div style="position:absolute;left:0;top:0;height:1px;width:${(step / 6 * 100).toFixed(2)}%;background:${T.ink};"></div>
  </div>

  <div style="padding:32px 24px 44px 24px;flex:1;display:flex;flex-direction:column;gap:28px;">
    <div>${H(title)}${lead ? sub(lead) : ''}</div>
${body}
  </div>

  <div style="position:sticky;bottom:0;background:${T.ground};border-top:1px solid ${T.hairline};padding:16px 24px 20px 24px;">
    <a href="#" style="display:flex;align-items:center;justify-content:center;gap:12px;background:${T.plum};color:${T.ground};font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;height:56px;border-radius:2px;">${ctaText} ${arrow}</a>
${secondary ? `    <div style="text-align:center;margin-top:14px;"><a href="#" style="font-size:13px;color:${T.ink2};border-bottom:1px solid ${T.mute};padding-bottom:2px;">${secondary}</a></div>` : ''}
  </div>
</div>
</x-dc>
</body>
</html>
`);
}

// ---------------- 1 · Pick a package ----------------
const openCard = `
    <div style="background:${T.field};border-radius:2px;padding:26px 24px;display:flex;flex-direction:column;gap:22px;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
        <div>
          <div class="serif" style="font-size:25px;font-weight:400;line-height:1.14;letter-spacing:-0.015em;">First weeks home</div>
          <div style="font-size:13px;color:${T.ink3};margin-top:8px;">from $300</div>
        </div>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style="margin-top:7px;flex-shrink:0;"><path d="M0 6.5H13" stroke="${T.ink}" stroke-width="1"/></svg>
      </div>
      <div>${lbl('What it is')}
        <div class="serif" style="margin-top:12px;font-size:19px;font-weight:400;line-height:1.34;letter-spacing:-0.008em;">Dinners arrive three evenings a week, starting the day she's home.</div>
      </div>
      <div>${lbl('She can change')}
        <div style="margin-top:12px;font-size:15px;line-height:1.6;color:${T.ink};">What the house eats, which evenings, and she can pause any week she says we have food.</div>
        <div style="display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin-top:20px;">
          <div style="background:${T.paper};border:1px solid ${T.hairline};border-radius:12px 12px 12px 3px;padding:11px 15px;font-size:14px;line-height:1.5;">Skip the dinners this week?</div>
          <div style="background:${T.plum};color:${T.ground};border-radius:12px 12px 3px 12px;padding:11px 15px;font-size:14px;">yes</div>
        </div>
        <div style="font-size:13px;line-height:1.6;color:${T.ink2};margin-top:16px;">She never composes; she just replies.</div>
      </div>
    </div>`;

const smallCard = (name, price, change) => `
    <div style="background:${T.paper};border:1px solid ${T.hairline};border-radius:2px;padding:22px 22px;display:flex;flex-direction:column;gap:14px;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;">
        <div>
          <div class="serif" style="font-size:21px;font-weight:400;line-height:1.16;">${name}</div>
          <div style="font-size:12.5px;color:${T.ink3};margin-top:7px;">from $${price}</div>
        </div>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style="margin-top:5px;flex-shrink:0;"><path d="M0 6.5H13M6.5 0V13" stroke="${T.ink3}" stroke-width="1"/></svg>
      </div>
      <div style="font-size:13.5px;line-height:1.55;color:${T.ink2};">${change}</div>
    </div>`;

screen('Flow1.dc.html', 1, 'Pick one thing to have handled.', null, `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-top:1px solid ${T.ink};border-bottom:1px solid ${T.hairline};">
      <span style="font-size:13px;color:${T.ink3};">Prices for</span>
      <span style="display:flex;align-items:center;gap:9px;font-size:15px;color:${T.ink};">United States ${chev}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
${openCard}
${smallCard('The Thursday afternoon', 300, 'Move the day, or skip it, with one word.')}
${smallCard('Body back', 300, 'Change the practitioner, or stop when she is done.')}
    </div>`, 'Choose this one', 'See all ten', 1190);

// ---------------- 2 · Set the amount and open a pool ----------------
const tokenRow = (n, filled, label) => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 0;border-top:1px solid ${T.hairline};">
          <span style="font-size:15px;color:${T.ink};">${label}</span>
          <span style="display:flex;align-items:center;gap:7px;">${Array.from({length:n},(_,i)=>token(i<filled)).join('')}</span>
        </div>`;

screen('Flow2.dc.html', 2, 'Set the amount, and open it to her people.', null, `
    <div>
      ${lbl('Your part')}
      <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:14px;padding-bottom:14px;border-bottom:1px solid ${T.ink};">
        <span class="serif" style="font-size:48px;font-weight:300;line-height:1;letter-spacing:-0.02em;">$300</span>
        <span style="display:flex;align-items:center;gap:10px;">
          <span style="width:34px;height:34px;border:1px solid ${T.mute};border-radius:50%;display:flex;align-items:center;justify-content:center;"><svg width="11" height="1" viewBox="0 0 11 1"><path d="M0 0.5H11" stroke="${T.ink2}"/></svg></span>
          <span style="width:34px;height:34px;border:1px solid ${T.ink};border-radius:50%;display:flex;align-items:center;justify-content:center;"><svg width="11" height="11" viewBox="0 0 11 11"><path d="M0 5.5H11M5.5 0V11" stroke="${T.ink}"/></svg></span>
        </span>
      </div>
    </div>

    <div>
      ${lbl('What that buys')}
      <div style="margin-top:6px;">
${tokenRow(6, 6, 'Dinners that arrive')}
${tokenRow(3, 2, 'A sitter who comes')}
${tokenRow(2, 1, 'A visit that gets booked')}
      </div>
      <div style="font-size:13.5px;line-height:1.62;color:${T.ink2};margin-top:18px;">Three evenings a week for two weeks, two afternoons, and her six-week visit booked.</div>
    </div>

    ${rule}

    <div>
      <div class="serif" style="font-size:22px;font-weight:400;line-height:1.26;letter-spacing:-0.012em;">Her people can add to this one.</div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:18px;background:${T.paper};border:1px solid ${T.hairline};border-radius:2px;padding:15px 16px;">
        <span style="font-size:14px;color:${T.ink2};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">nura.gift/for-maya-8fd2</span>
        ${copy}
      </div>
      <div style="font-size:13px;line-height:1.62;color:${T.ink3};margin-top:14px;">Anyone with the link can add. Nobody is shown what anyone gave, her least of all.</div>
    </div>`, 'Continue', null, 870);

// ---------------- 3 · Add one more thing ----------------
screen('Flow3.dc.html', 3, 'Add one more thing.', 'Or do not. One package is a whole gift.', `
    <div>
${pick('An extra week of dinners', 'Three more evenings, tacked on to the end.', '$60', true)}
${pick('One more sitter afternoon', 'Another Thursday, whenever she wants it.', '$45', false)}
${pick('A lactation visit', 'At home, and Nura books it around her.', '$55', false)}
      <div style="height:1px;background:${T.hairline};"></div>
    </div>
    <div style="font-size:13.5px;line-height:1.62;color:${T.ink3};">She can move any of these, or decline them, once it is hers.</div>`,
  'Add it', 'Skip this', 815);

// ---------------- 4 · Tell Nura about her ----------------
screen('Flow4.dc.html', 4, 'Tell Nura about her.', null, `
    <div style="display:flex;flex-direction:column;gap:30px;">
${field('Her name', 'Maya Osei')}
${field('Her mobile', '+44 7700 900142')}
${field('The date she is due', '14 March')}
${field('Where the box goes', 'Add an address', null, true)}
    </div>

    ${rule}

    <div style="display:flex;flex-direction:column;gap:30px;">
      <div>
        ${lbl('Optional')}
        <div style="font-size:13.5px;line-height:1.62;color:${T.ink2};margin-top:10px;">Each one makes Nura better at one thing. Leave any of them blank.</div>
      </div>
${field('How she is feeding', 'Add', 'So it never asks her the wrong question.', true)}
${field('Anything she is already dreading', 'Add', 'So that one gets handled first.', true)}
${field('Her doctor, if you know', 'Add', 'So referrals can be chased without asking her.', true)}
    </div>

    <div style="font-size:13px;line-height:1.62;color:${T.ink2};padding-top:20px;border-top:1px solid ${T.hairline};">Only the mobile is used to reach her. None of this is shown to anyone else who adds to the gift.</div>`,
  'Continue', null, 1130);

// ---------------- 5 · Write the card ----------------
screen('Flow5.dc.html', 5, 'Write the card.', null, `
    <div>
      ${lbl('Your words')}
      <div style="margin-top:12px;background:${T.paper};border:1px solid ${T.ink};border-radius:2px;padding:16px 16px;min-height:104px;font-size:15px;line-height:1.62;color:${T.ink};">Thought of you at three in the morning. This is me, feeding you.</div>
      <div style="font-size:12.5px;color:${T.ink3};margin-top:10px;">Printed, not emailed. It goes in the box.</div>
    </div>

    <div>
      ${lbl('How it prints')}
      <div style="margin-top:14px;background:${T.paper};border:1px solid ${T.hairline};border-radius:2px;padding:34px 28px;box-shadow:0 12px 34px -22px rgba(28,26,23,0.30);">
        <div class="serif" style="font-size:19px;font-weight:400;line-height:1.5;letter-spacing:-0.004em;color:${T.ink};">Thought of you at three in the morning. This is me, feeding you.</div>
        <div class="serif" style="font-size:17px;font-style:italic;color:${T.ink2};margin-top:24px;">— Priya</div>
      </div>
    </div>

    ${rule}

    <div>
      ${lbl('Where the box goes')}
      <div style="margin-top:6px;">
${pick('Send it to me', 'You hand it over yourself.', 'Arrives in 3 days', true)}
${pick('Send it to her', 'Straight to her door, with your card inside.', 'Arrives on the 14th', false)}
      </div>
      <div style="height:1px;background:${T.hairline};"></div>
    </div>`, 'Continue', null, 1010);

// ---------------- 6 · Pay ----------------
const line = (a, b, heavy) => `
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:15px 0;border-top:1px solid ${heavy ? T.ink : T.hairline};">
          <span style="font-size:${heavy ? 16 : 15}px;color:${T.ink};">${a}</span>
          <span class="${heavy ? 'serif' : ''}" style="font-size:${heavy ? 22 : 15}px;color:${T.ink};">${b}</span>
        </div>`;

screen('Flow6.dc.html', 6, 'Pay.', null, `
    <div>
      ${lbl('What you are sending')}
      <div style="margin-top:6px;">
${line('First weeks home', '$300')}
${line('An extra week of dinners', '$60')}
${line('Total', '$360', true)}
      </div>
      <div style="height:1px;background:${T.hairline};"></div>
    </div>

    <div style="display:flex;flex-direction:column;gap:26px;">
${field('Card number', '4242 4242 4242 4242')}
      <div style="display:flex;gap:20px;">
        <div style="flex:1;">${field('Expiry', '04 / 28')}</div>
        <div style="flex:1;">${field('CVC', '123')}</div>
      </div>
${field('Name on card', 'P. Raman')}
    </div>

    <div style="font-size:13px;line-height:1.62;color:${T.ink2};padding-top:20px;border-top:1px solid ${T.hairline};">Stripe takes the payment. Nura never sees your card, and her people never see what you gave.</div>`,
  'Pay $360', null, 815);

console.log('wrote 6 flow screens');

// ================= desktop treatment, shown on step 2 =================
const STEPS = ['Package','Amount','Add-ons','About her','The card','Pay'];
const stepNav = STEPS.map((n, i) => {
  const on = i === 1;
  const name = `<span style="font-size:12.5px;color:${on ? T.ink : T.ink3};${on ? `border-bottom:1px solid ${T.ink};padding-bottom:4px;` : ''}">${n}</span>`;
  const bar = i < STEPS.length - 1 ? `<span style="width:26px;height:1px;background:${T.mute};"></span>` : '';
  return name + bar;
}).join('');

writeFileSync('FlowDesktop.dc.html', `<!doctype html>
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
  </style>
</helmet>

<div style="width:1280px;min-height:820px;background:${T.ground};color:${T.ink};box-sizing:border-box;">

  <div style="display:flex;align-items:center;justify-content:space-between;padding:26px 64px;border-bottom:1px solid ${T.hairline};">
    <div class="serif" style="font-size:20px;letter-spacing:0.02em;">Nura</div>
    <div style="display:flex;align-items:center;gap:14px;">${stepNav}</div>
    <div style="display:flex;align-items:center;gap:11px;">${back}<span style="font-size:13px;color:${T.ink2};">Back</span></div>
  </div>

  <div style="padding:72px 64px 88px 64px;display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:112px;align-items:start;">

    <div style="display:flex;flex-direction:column;gap:56px;">
      <h2 class="serif" style="margin:0;font-size:42px;font-weight:400;line-height:1.1;letter-spacing:-0.02em;max-width:560px;">Set the amount, and open it to her people.</h2>

      <div>
        ${lbl('Your part')}
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:18px;padding-bottom:18px;border-bottom:1px solid ${T.ink};max-width:520px;">
          <span class="serif" style="font-size:64px;font-weight:300;line-height:1;letter-spacing:-0.025em;">$300</span>
          <span style="display:flex;align-items:center;gap:12px;">
            <span style="width:38px;height:38px;border:1px solid ${T.mute};border-radius:50%;display:flex;align-items:center;justify-content:center;"><svg width="12" height="1" viewBox="0 0 12 1"><path d="M0 0.5H12" stroke="${T.ink2}"/></svg></span>
            <span style="width:38px;height:38px;border:1px solid ${T.ink};border-radius:50%;display:flex;align-items:center;justify-content:center;"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M0 6H12M6 0V12" stroke="${T.ink}"/></svg></span>
          </span>
        </div>
      </div>

      <div style="max-width:520px;">
        ${lbl('What that buys')}
        <div style="margin-top:8px;">
${tokenRow(6, 6, 'Dinners that arrive')}
${tokenRow(3, 2, 'A sitter who comes')}
${tokenRow(2, 1, 'A visit that gets booked')}
        </div>
        <div style="font-size:14.5px;line-height:1.62;color:${T.ink2};margin-top:22px;">Three evenings a week for two weeks, two afternoons, and her six-week visit booked.</div>
      </div>
    </div>

    <div style="background:${T.field};border-radius:2px;padding:36px 34px;display:flex;flex-direction:column;gap:30px;">
      <div>
        ${lbl('The gift so far')}
        <div style="margin-top:14px;">
${line('First weeks home', '$300')}
${line('An extra week of dinners', 'Not yet')}
        </div>
        <div style="height:1px;background:${T.hairline};"></div>
      </div>

      <div>
        <div class="serif" style="font-size:22px;font-weight:400;line-height:1.26;letter-spacing:-0.012em;">Her people can add to this one.</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:18px;background:${T.paper};border:1px solid ${T.hairline};border-radius:2px;padding:15px 16px;">
          <span style="font-size:13.5px;color:${T.ink2};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">nura.gift/for-maya-8fd2</span>
          ${copy}
        </div>
        <div style="font-size:12.5px;line-height:1.62;color:${T.ink3};margin-top:14px;">Anyone with the link can add. Nobody is shown what anyone gave, her least of all.</div>
      </div>

      <a href="#" style="display:flex;align-items:center;justify-content:center;gap:12px;background:${T.plum};color:${T.ground};font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;height:56px;border-radius:2px;">Continue ${arrow}</a>
    </div>

  </div>
</div>
</x-dc>
</body>
</html>
`);
console.log('wrote desktop treatment');
