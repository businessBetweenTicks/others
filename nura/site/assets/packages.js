/* The ten packages — names, prices, and all three open-state slots are the
   client's own copy, verbatim from the packages sheet. Prices are "from"
   figures that change by region, as that sheet says. */
(function () {
  'use strict';
  var PACKS = [
    { n: 'First weeks home', p: 300,
      w: "Dinners arrive three evenings a week, starting the day she's home.",
      i: ['The wrap and card', 'The thread', 'The First Week Check', 'A tea table seat', 'The dinners'],
      c: 'What the house eats, which evenings, pause any week she says "we have food."',
      ask: 'Skip the dinners this week?' },
    { n: 'The Thursday afternoon', p: 300,
      w: "A sitter comes one afternoon every other week, so she gets time that's hers.",
      i: ['The base gift', 'The sitter afternoons'],
      c: 'Which afternoon, skip a week, hand the slot to her partner or her circle.',
      ask: 'Move this week to Friday?' },
    { n: 'Body back', p: 300,
      w: 'Pelvic floor physio, without the chase. Nura gets the referral, finds a physio in her plan, books it, covers the copays.',
      i: ['The base gift', 'The booked visits', 'The copays'],
      c: 'The times, the clinic, stop when she feels ready.',
      ask: 'Same time next week?' },
    { n: 'Head', p: 300,
      w: 'A therapist who takes her insurance and has evening slots. Found, booked, copays covered. She never opens a directory.',
      i: ['The base gift', 'The booked sessions', 'The copays'],
      c: 'The therapist, the times, the pace, or pause it.',
      ask: 'Keep Thursday evenings?' },
    { n: 'Feed', p: 300,
      w: 'A lactation consultant, virtual or at home, and Nura files the insurance claim afterwards so the money often comes back.',
      i: ['The base gift', 'The session, virtual or at home', 'The claim filed for her'],
      c: 'Virtual or home, timing, add a follow-up.',
      ask: 'Want a follow-up booked?' },
    { n: 'Out the door', p: 300,
      w: 'The walking vest with her name inside, and twenty minutes with a photographer on her walk. Her, not the baby.',
      i: ['The base gift', 'The vest, with her name inside', 'The photo session'],
      c: 'When and where the walk is, keep the photos private or share them.',
      ask: 'Keep the photos private?' },
    { n: 'Her table', p: 300,
      w: 'Tea with a few mothers at the same stage, in her town, with a sitter at home and a ride so nothing stands between her and the door.',
      i: ['The base gift', 'The sitter for the tables', 'The ride, both ways'],
      c: 'Which table, bring a friend, skip and rejoin next time.',
      ask: 'Bring someone on Thursday?' },
    { n: 'Paperwork', p: 250,
      w: 'The forms, done. State disability and paid family leave, insurance claims, the first visits, her six-week visit. The gift money becomes grocery deliveries so the box still buys something she can see.',
      i: ['The base gift', 'The filing', 'The grocery credit'],
      c: 'Which forms to prioritise, what the groceries are.',
      ask: 'Leave forms first this week?' },
    { n: 'Clean house', p: 400,
      w: 'A cleaner every two weeks, arranged and confirmed by Nura.',
      i: ['The base gift', 'The cleans, every two weeks'],
      c: 'Which days, reschedule, pause when family is visiting.',
      ask: 'Pause while your mum is here?' },
    { n: 'Sleep', p: 500,
      w: 'A full night with a postpartum doula so she can actually sleep. The one grandparents tend to buy.',
      i: ['The base gift', 'The overnight'],
      c: 'The night, add more if her circle chips in.',
      ask: 'Same night next week?' }
  ];

  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var arrow = '<svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden="true"><path d="M0 4.5h12.5M9 1l3.8 3.5L9 8" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linejoin="round"/></svg>';

  var grid = document.getElementById('pkg-grid');
  if (!grid) return;

  grid.innerHTML = PACKS.map(function (k, idx) {
    var id = 'pkg-panel-' + idx;
    return '<article class="pkg" data-reveal>' +
      '<button class="pkg__head" type="button" aria-expanded="false" aria-controls="' + id + '">' +
        '<span class="pkg__top"><span><span class="pkg__name">' + esc(k.n) + '</span>' +
        '<span class="pkg__price" style="display:block">from $' + k.p + '</span></span><span class="plus" aria-hidden="true"></span></span>' +
        '<span class="pkg__change">' + esc(k.c) + '</span>' +
      '</button>' +
      '<div class="pkg__panel" id="' + id + '" role="region" aria-label="' + esc(k.n) + '"><div class="pkg__inner">' +
        '<p class="lbl">What it is</p><p class="pkg__what">' + esc(k.w) + '</p>' +
        '<div class="pkg__cols">' +
          '<div><p class="lbl">Included</p><div style="margin-top:16px">' +
            k.i.map(function (t) { return '<div class="inc"><i class="dot"></i>' + esc(t) + '</div>'; }).join('') +
          '</div></div>' +
          '<div><p class="lbl">She can change</p>' +
            '<p style="margin-top:16px;font-size:16px;line-height:1.62;max-width:460px">' + esc(k.c) + '</p>' +
            '<div style="display:flex;flex-direction:column;align-items:flex-start;gap:9px;margin-top:26px">' +
              '<span class="bubble">' + esc(k.ask) + '</span><span class="bubble mine">yes</span></div>' +
            '<p style="font-size:14px;line-height:1.6;color:var(--ink2);margin-top:18px">She never composes; she just replies.</p>' +
          '</div>' +
        '</div>' +
        '<div class="pkg__foot"><a class="btn" href="gift-flow.html">Choose this one ' + arrow + '</a>' +
          '<a href="gift-flow.html" style="border-bottom:1px solid var(--mute);padding-bottom:2px;font-size:14px">Add one more thing after this</a></div>' +
      '</div></div></article>';
  }).join('') +
  '<div class="grid__note" data-reveal><p class="serif">Ten in all, and most cost the same. The difference is what gets lifted off her.</p></div>';
})();
