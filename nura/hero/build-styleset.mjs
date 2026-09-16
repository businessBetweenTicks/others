import { writeFileSync } from 'node:fs';

const T = { ground:'#F7F3ED', field:'#EFE9E0', paper:'#FFFDFA', hairline:'#E2DAD0', mute:'#D9CFC3',
            ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279', plum:'#4E2A44', moss:'#6E7A61' };

const SWATCHES = [
  ['Ground', T.ground, '#F7F3ED · oklch .966 .010 79', 'Every page background. Warm off-white, never pure white — white reads clinical, and this is not a health product.', true],
  ['Field', T.field, '#EFE9E0 · oklch .933 .015 79', 'Raised surfaces and the fill of anything not yet handled: the animation stage, the data-forward panel, an unresolved card, a message from Nura.', false],
  ['Paper', T.paper, '#FFFDFA · oklch .992 .004 90', 'Only for a real object or a settled fact: a card that is booked, the printed card, a message that has been answered.', true],
  ['Hairline', T.hairline, '#E2DAD0 · oklch .881 .018 75', 'Borders on anything resolved, and the photography plate. 1px, always. There are no 2px borders anywhere on the site.', false],
  ['Mute', T.mute, '#D9CFC3 · oklch .855 .019 75', 'Dashed edges on what is unresolved, rules under secondary links, and the section cue. The only line lighter than Hairline.', false],
  ['Ink', T.ink, '#1C1A17 · oklch .212 .006 75', 'Headlines, her words, anything settled. Near-black, warm-shifted. 14.9:1 on Ground.', false],
  ['Ink 2', T.ink2, '#55504A · oklch .437 .010 75', 'Body copy. 7.4:1 on Ground — past AA at every size on the ramp.', false],
  ['Ink 3', T.ink3, '#8A8279 · oklch .610 .014 75', 'Meta, captions, labels, and the copy on anything not yet handled. 4.6:1 on Ground, so never below 11px.', false],
  ['Plum', T.plum, '#4E2A44 · oklch .330 .070 340', 'The act of giving, and her voice in a thread. The primary button, her outgoing bubbles, one editorial mark per page. Pressed state #3B1F33. Nothing else.', false],
  ['Moss', T.moss, '#6E7A61 · oklch .545 .035 130', 'Something is handled. The tick, and the eyebrow above a headline. Never a fill, never a badge, never a large area.', false],
];

const RAMP = [
  ['Display / h1', '39', '50', '62', '76', 'Newsreader 400 · lh 1.08 → 1.04 · tracking −0.015em → −0.021em as it grows'],
  ['Section head / h2', '28', '34', '40', '46', 'Newsreader 400 · lh 1.14 · tracking −0.015em · first used below the hero'],
  ['Lead paragraph', '16', '17', '17.5', '19', 'Instrument Sans 400 · lh 1.62 · measure 41–52 characters'],
  ['Body', '15', '15.5', '16', '16', 'Instrument Sans 400 · lh 1.65 · measure 62–68 characters · first used below the hero'],
  ['Stage caption', '17.5', '18.5', '18.5', '20', 'Newsreader 400 italic · Ink 2 · the payoff line, and the one italic in the stage'],
  ['Nav / UI label', '—', '13.5', '13.5', '14', 'Instrument Sans 400 · at 375 the nav is the wordmark and a two-rule menu only'],
  ['Ledger row', '14', '14', '14', '14.5', 'Instrument Sans 400 · Ink when handled, Ink 3 when not · one hairline above each row'],
  ['Caption / meta', '11.5', '11.5', '11.5', '12', 'Instrument Sans 400 · lh 1.55 · Ink 3 only · never smaller than 11'],
  ['Thread bubble', '14', '13', '12.5', '13', 'Instrument Sans 400 · lh 1.5 · 14 at 375 where the thread is on the page itself, smaller inside the device where it is at device scale'],
  ['Eyebrow', '10.5', '11', '11', '11', 'Instrument Sans 500 · uppercase · tracking 0.18em · Moss'],
  ['Button', '13', '13', '13', '14', 'Instrument Sans 500 · uppercase · tracking 0.06em · 56px tall on phone'],
];

const GRID = [
  ['375', '24', '4 col · gutter 16'],
  ['768', '48', '8 col · gutter 24'],
  ['1280', '64', '12 col · gutter 24'],
  ['1440+', '96', '12 col · gutter 32 · content caps at 1440'],
];

const swatch = ([name, hex, mono, desc, border]) => `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="height: 104px; background: ${hex};${border ? ` border: 1px solid ${T.hairline};` : ''} border-radius: 2px;"></div>
        <div style="font-size: 12.5px;">${name}</div>
        <div style="font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 10.5px; color: ${T.ink3};">${mono}</div>
        <div style="font-size: 10.5px; line-height: 1.55; color: ${T.ink3};">${desc}</div>
      </div>`;

const rampRow = ([style, a, b, c, d, spec], last) => `
      <div style="font-size: 12px; padding: 12px 0;">${style}</div>
      <div class="serif" style="font-size: 17px; padding: 12px 0;">${a}</div>
      <div class="serif" style="font-size: 17px; padding: 12px 0;">${b}</div>
      <div class="serif" style="font-size: 17px; padding: 12px 0;">${c}</div>
      <div class="serif" style="font-size: 17px; padding: 12px 0;">${d}</div>
      <div style="font-size: 11px; color: ${T.ink3}; padding: 12px 0; line-height: 1.5;">${spec}</div>
      <div style="grid-column: 1 / -1; height: 1px; background: ${last ? T.ink : T.hairline};"></div>`;

const gridRow = ([w, m, g], last) => `
        <div style="display: grid; grid-template-columns: 74px 1fr 1fr; gap: 16px; padding: 10px 0; border-top: 1px solid ${T.hairline};${last ? ` border-bottom: 1px solid ${T.ink};` : ''}"><div style="font-size: 11.5px;">${w}</div><div style="font-size: 11.5px; color: ${T.ink2};">${m}</div><div style="font-size: 11.5px; color: ${T.ink2};">${g}</div></div>`;

const surfaceRow = (demo, title, body) => `
      <div style="display: flex; gap: 16px; align-items: center;">
        ${demo}
        <div style="font-size: 11.5px; line-height: 1.6; color: ${T.ink2};"><strong style="font-weight: 500; color: ${T.ink};">${title}</strong> — ${body}</div>
      </div>`;

const html = `<!doctype html>
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
    .lbl { font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3}; }
  </style>
</helmet>

<div style="width: 1200px; min-height: 3000px; background: ${T.ground}; color: ${T.ink}; padding: 56px; box-sizing: border-box; display: flex; flex-direction: column; gap: 48px;">

  <div style="display: flex; align-items: flex-end; justify-content: space-between;">
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: ${T.moss};">Nura · consumer gift site</div>
      <h2 class="serif" style="margin: 0; font-size: 42px; font-weight: 400; letter-spacing: -0.02em;">Style set</h2>
    </div>
    <div style="font-size: 12px; line-height: 1.6; color: ${T.ink3}; max-width: 380px; text-align: right;">Everything the hero establishes. Each value below becomes one named Figma variable or style. Ten colours, two families, three easing curves, four durations, two shadows, three radii.</div>
  </div>

  <div style="height: 1px; background: ${T.hairline};"></div>

  <div style="display: flex; flex-direction: column; gap: 20px;">
    <div class="lbl">Colour · the complete set</div>
    <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 20px;">${SWATCHES.map(swatch).join('')}
    </div>

    <div style="background: ${T.field}; border-radius: 2px; padding: 20px 24px; display: flex; gap: 32px; align-items: center;">
      <div style="width: 200px; height: 10px; background: ${T.ground}; border: 1px solid ${T.hairline}; border-radius: 1px; display: flex; overflow: hidden; flex-shrink: 0;">
        <div style="width: 3.5%; background: ${T.plum};"></div>
        <div style="width: 1.5%; background: ${T.moss};"></div>
      </div>
      <div style="font-size: 12px; line-height: 1.65; color: ${T.ink2};"><strong style="font-weight: 500; color: ${T.ink};">The accent budget.</strong> Plum and moss together never exceed 5% of the painted area of any screen — roughly what you see in that bar. This is the single rule that makes the palette read expensive rather than merely muted. When a section feels flat, the fix is space and type, never more colour.</div>
    </div>
  </div>

  <div style="height: 1px; background: ${T.hairline};"></div>

  <div style="display: flex; flex-direction: column; gap: 20px;">
    <div class="lbl">Typeface · two families, and one rule about who speaks</div>

    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px;">
      <div style="background: ${T.field}; border-radius: 2px; padding: 26px 28px; display: flex; flex-direction: column; gap: 14px;">
        <div class="serif" style="font-size: 56px; line-height: 1; font-weight: 400;">Aa</div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="font-size: 14px; font-weight: 500;">Newsreader</div>
          <div style="font-size: 11.5px; color: ${T.ink3}; line-height: 1.55;">Variable, optical size 6–72, weights 300–500 plus italic. Warm, low-contrast, slightly bookish — editorial without being a fashion serif. Fallback: Iowan Old Style, Palatino, Georgia.</div>
        </div>
        <div style="height: 1px; background: ${T.hairline};"></div>
        <div style="font-size: 11.5px; line-height: 1.6; color: ${T.ink2};">Used for <strong style="font-weight: 500; color: ${T.ink};">her</strong>: headlines, her words, the First Week Check scene, pull quotes, package names.</div>
      </div>

      <div style="background: ${T.field}; border-radius: 2px; padding: 26px 28px; display: flex; flex-direction: column; gap: 14px;">
        <div style="font-size: 56px; line-height: 1; font-weight: 400;">Aa</div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="font-size: 14px; font-weight: 500;">Instrument Sans</div>
          <div style="font-size: 11.5px; color: ${T.ink3}; line-height: 1.55;">Weights 400–600. Neutral, a touch warm, none of the usual software tells. Fallback: Helvetica Neue, Helvetica, Arial.</div>
        </div>
        <div style="height: 1px; background: ${T.hairline};"></div>
        <div style="font-size: 11.5px; line-height: 1.6; color: ${T.ink2};">Used for <strong style="font-weight: 500; color: ${T.ink};">Nura</strong>: body copy, what was booked, chased, filed, covered. Labels, navigation, buttons, prices.</div>
      </div>
    </div>

    <div style="background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 2px; padding: 22px 26px; display: flex; gap: 26px; align-items: flex-start;">
      <div class="lbl" style="flex-shrink: 0; padding-top: 3px;">The rule</div>
      <div style="font-size: 13px; line-height: 1.7; color: ${T.ink2}; max-width: 820px;">Serif is her voice. Sans is the work. The two never mix inside one block of text, and the split is never explained on the page — it just holds, section after section, until the reader feels it. It is what lets the First Week Check page carry a mother's account and a logistics ledger on the same spread without either one flattening the other.</div>
    </div>
  </div>

  <div style="display: flex; flex-direction: column; gap: 14px;">
    <div class="lbl">Type ramp · the four breakpoints</div>
    <div style="display: grid; grid-template-columns: 148px repeat(4, 56px) minmax(0, 1fr); gap: 0 20px;">
      <div style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; padding: 0 0 10px 0;">Style</div>
      <div style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; padding: 0 0 10px 0;">375</div>
      <div style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; padding: 0 0 10px 0;">768</div>
      <div style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; padding: 0 0 10px 0;">1280</div>
      <div style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; padding: 0 0 10px 0;">1440+</div>
      <div style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; padding: 0 0 10px 0;">Spec</div>
      <div style="grid-column: 1 / -1; height: 1px; background: ${T.ink};"></div>
${RAMP.map((r, i) => rampRow(r, i === RAMP.length - 1)).join('')}
    </div>
  </div>

  <div style="height: 1px; background: ${T.hairline};"></div>

  <div style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 44px;">

    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div class="lbl">Spacing · base 4, and the page margins</div>
      <div style="display: flex; align-items: flex-end; gap: 10px; height: 96px;">
        <div style="width: 20px; height: 4px; background: ${T.mute};"></div>
        <div style="width: 20px; height: 8px; background: ${T.mute};"></div>
        <div style="width: 20px; height: 12px; background: ${T.mute};"></div>
        <div style="width: 20px; height: 16px; background: ${T.mute};"></div>
        <div style="width: 20px; height: 20px; background: ${T.mute};"></div>
        <div style="width: 20px; height: 24px; background: ${T.hairline};"></div>
        <div style="width: 20px; height: 32px; background: ${T.hairline};"></div>
        <div style="width: 20px; height: 40px; background: ${T.hairline};"></div>
        <div style="width: 20px; height: 48px; background: ${T.hairline};"></div>
        <div style="width: 20px; height: 64px; background: ${T.ink3};"></div>
        <div style="width: 20px; height: 80px; background: ${T.ink3};"></div>
        <div style="width: 20px; height: 96px; background: ${T.ink3};"></div>
      </div>
      <div style="font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 10.5px; color: ${T.ink3}; letter-spacing: 0.02em;">4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 · 160</div>
      <div style="font-size: 11.5px; line-height: 1.65; color: ${T.ink2};">The scale governs page and section spacing — margins, padding, the distance between blocks. Miniature interface inside the stage illustration (bubble padding, card padding, the gaps between them) is drawn at optical sizes instead, because it is a picture of an interface rather than one.</div>
      <div style="font-size: 11.5px; line-height: 1.65; color: ${T.ink2};">Section rhythm is deliberately large: 96 between blocks inside a section, 128 on laptop and 160 on wide desktop between sections. On phone both collapse to 64. The white space is doing the work the colour is not allowed to do.</div>

      <div style="display: flex; flex-direction: column; gap: 0; margin-top: 6px;">
        <div style="display: grid; grid-template-columns: 74px 1fr 1fr; gap: 16px; padding: 10px 0; border-top: 1px solid ${T.ink};"><div style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3};">Width</div><div style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3};">Margin</div><div style="font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3};">Grid</div></div>
${GRID.map((g, i) => gridRow(g, i === GRID.length - 1)).join('')}
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div class="lbl">Surface</div>
${surfaceRow(`<div style="width: 84px; height: 56px; background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 2px; flex-shrink: 0;"></div>`, 'Radius 2px', 'Everything that is not a message bubble. Square-ish reads editorial; rounded reads like software.')}
${surfaceRow(`<div style="width: 84px; height: 56px; background: ${T.field}; border-radius: 14px 14px 14px 4px; flex-shrink: 0;"></div>`, 'Radius 14px, one corner 4px', 'Message bubbles only, incoming and outgoing. The one soft shape on the site, reserved for the thread.')}
${surfaceRow(`<div style="width: 84px; height: 56px; background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 30px; flex-shrink: 0;"></div>`, 'Radius 30px', 'The device in the stage, and nothing else on the site. It appears once per page at most and never at 375.')}
${surfaceRow(`<div style="width: 84px; height: 56px; background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 2px; box-shadow: 0 14px 34px -22px rgba(28,26,23,0.32); flex-shrink: 0;"></div>`, 'Lift', '0 14px 34px −22px rgba(28,26,23,.32). For the package card open state below the fold. Never on buttons, never on hover.')}
${surfaceRow(`<div style="width: 84px; height: 56px; background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 30px; box-shadow: 0 24px 60px -30px rgba(28,26,23,0.30); flex-shrink: 0;"></div>`, 'Lift, deep', '0 24px 60px −30px rgba(28,26,23,.30). The device only. It sits above the photography plate, so it needs the longer throw to read as an object rather than a pane of glass.')}
${surfaceRow(`<div style="width: 84px; height: 56px; background: ${T.plum}; border-radius: 2px; flex-shrink: 0;"></div>`, 'Primary button', 'Plum on Ground. 20/40 at 1440, 20/32 at 1280 and 768, full width at 56px on phone. Hover darkens to #3B1F33 over 220ms. One per screen.')}
${surfaceRow(`<div style="width: 84px; height: 56px; background: ${T.ground}; border-radius: 2px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 12px; box-sizing: border-box; flex-shrink: 0;"><div style="font-size: 11px; color: ${T.plum}; border-bottom: 1px solid ${T.mute}; padding-bottom: 2px;">Start a gift</div></div>`, 'Secondary', 'Plum text on a 1px Mute underline. There are no outline buttons anywhere on the site.')}

      <div style="background: ${T.paper}; border: 1px solid ${T.hairline}; border-radius: 2px; padding: 18px 20px; margin-top: 4px;">
        <div style="font-size: 11.5px; line-height: 1.65; color: ${T.ink2};"><strong style="font-weight: 500; color: ${T.ink};">Two rules for the stage.</strong> The device is sized <em>by</em> its content — it has no fixed height, so it can never be half full. A shell with dead space in it reads as a pane of glass rather than a thing someone is holding, and that one detail decides whether the whole panel looks expensive. And nothing that is handled is ever a card: they are rows of type under hairlines, with the detail right-aligned. Three bordered boxes with drop shadows in a row is a dashboard, and dashboards are on the banned list.</div>
      </div>

      <div style="background: ${T.field}; border-radius: 2px; padding: 18px 20px;">
        <div style="font-size: 11.5px; line-height: 1.65; color: ${T.ink2};"><strong style="font-weight: 500; color: ${T.ink};">Photography</strong> — one image per section at most, warm low light: her hands, her back, her at a table. No baby in frame, no pram, no nursery. Images sit flush in a 2px-radius plate with no border and no overlay text. Every plate in these artboards is a marked placeholder; nothing is licensed yet.</div>
      </div>
    </div>
  </div>

</div>
</x-dc>
</body>
</html>
`;
writeFileSync('StyleSet.dc.html', html);
console.log('wrote StyleSet.dc.html');
