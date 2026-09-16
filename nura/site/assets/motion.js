/* Nura — motion. Every value here comes from the motion sheets:
   ease-rise / ease-settle / ease-soft, durations 220 / 420 / 620 / 900, travel 14px. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Stagger: a container marked [data-stagger="90"] hands each marked child
     an increasing delay. [data-d] on a child overrides it outright, which is
     how the sequenced moments (the barrier, the 4-vs-11 pause) are written. */
  function assignDelays(root) {
    (root || document).querySelectorAll('[data-stagger]').forEach(function (group) {
      var step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
      var base = parseInt(group.getAttribute('data-delay'), 10) || 0;
      var kids = group.querySelectorAll(':scope > [data-reveal], :scope > [data-fade], :scope > [data-draw]');
      Array.prototype.forEach.call(kids, function (el, i) {
        if (el.hasAttribute('data-d')) return;
        el.style.setProperty('--d', (base + i * step) + 'ms');
      });
    });
    (root || document).querySelectorAll('[data-d]').forEach(function (el) {
      el.style.setProperty('--d', el.getAttribute('data-d') + 'ms');
    });
  }

  function reveal() {
    var targets = document.querySelectorAll('[data-reveal],[data-draw],[data-draw-y],[data-fade]');
    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
      return;
    }
    /* 40% in view, as specified — but tall sections would never reach it,
       so a bottom margin brings them in as they cross the lower third. */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -18% 0px' });
    Array.prototype.forEach.call(targets, function (el) {
      if (el.closest('[data-onload]')) { el.classList.add('in'); return; }
      io.observe(el);
    });
  }

  /* Packages: one open at a time, expanding in place rather than as an
     overlay — an overlay would hide the other nine, and the point is that
     she only needs one of them. */
  function packages() {
    var cards = document.querySelectorAll('.pkg');
    if (!cards.length) return;

    function close(card) {
      var panel = card.querySelector('.pkg__panel');
      panel.style.height = panel.scrollHeight + 'px';
      panel.offsetHeight; // reflow, so the collapse has something to run from
      card.classList.remove('is-open');
      card.querySelector('.pkg__head').setAttribute('aria-expanded', 'false');
      panel.style.height = '0px';
    }

    function open(card) {
      var panel = card.querySelector('.pkg__panel');
      card.classList.add('is-open');
      card.querySelector('.pkg__head').setAttribute('aria-expanded', 'true');
      panel.style.height = reduced ? 'auto' : panel.firstElementChild.offsetHeight + 'px';
    }

    Array.prototype.forEach.call(cards, function (card) {
      var head = card.querySelector('.pkg__head');
      head.addEventListener('click', function () {
        var isOpen = card.classList.contains('is-open');
        /* Hold the card's top edge still: opening one reflows the grid, and a
           page that jumps under the reader's hands loses them. */
        var before = card.getBoundingClientRect().top;
        Array.prototype.forEach.call(cards, function (other) {
          if (other.classList.contains('is-open')) close(other);
        });
        if (!isOpen) open(card);
        var after = card.getBoundingClientRect().top;
        if (Math.abs(after - before) > 1) window.scrollBy(0, after - before);
      });
    });

    /* A panel left at a fixed pixel height breaks when the window resizes. */
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var openCard = document.querySelector('.pkg.is-open');
        if (!openCard) return;
        var panel = openCard.querySelector('.pkg__panel');
        panel.style.transition = 'none';
        panel.style.height = panel.firstElementChild.offsetHeight + 'px';
        panel.offsetHeight;
        panel.style.transition = '';
      }, 120);
    });
  }

  function start() { assignDelays(); reveal(); packages(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
