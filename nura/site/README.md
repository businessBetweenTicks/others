# Nura — gift site

Static site. No build step, no dependencies, no framework. Open `index.html` and it runs.

```
index.html              the landing page, all ten sections
first-week-check.html   the separate page linked from section 8 and the footer
gift-flow.html          the six purchase screens (design only — no checkout)
assets/nura.css         the whole system: 10 colours, 2 families, 3 curves, 4 durations
assets/motion.js        the reveal engine and the packages open state
assets/packages.js      the ten packages, rendered from the client's own copy
```

## Publish it

Any static host. Nothing here needs a server.

**Netlify** — drag the `site` folder onto <https://app.netlify.com/drop>. Live in about ten seconds, on a URL you can rename.

**Vercel** — `npx vercel --prod` from inside this folder.

**Cloudflare Pages** — connect the repo, leave the build command empty, set the output directory to `nura/site`.

**GitHub Pages** — push, then Settings → Pages → deploy from branch, folder `/nura/site`.

Exclude `_dev/` if your host lets you; it holds the Playwright checks used while building and is not part of the site.

## Motion

Every value comes from the motion sheets in the design file, not from taste on the day:

| token | value | used for |
|---|---|---|
| `--rise` | `cubic-bezier(0.16,1,0.30,1)` | anything entering |
| `--settle` | `cubic-bezier(0.33,0,0.12,1)` | rules drawing, panels expanding |
| `--soft` | `cubic-bezier(0.40,0,0.20,1)` | crossfades, hovers |
| `--t1…--t4` | 220 / 420 / 620 / 900ms | the whole duration scale |
| `--travel` | 14px | the only distance anything moves |

Sequencing is declarative. `data-reveal` opts an element in; `data-stagger="90"` on a parent hands its children increasing delays; `data-d="1140"` on a child overrides that outright. The two moments that carry an argument are written that way:

- **The trust boundary.** The dashed line finishes drawing *before* the three names on the far side appear. The barrier exists before the people do. Reverse it and the section undoes itself.
- **The 4-vs-11 comparison** on the First Week Check page. Her four actions arrive, then a 420ms pause, then Nura's eleven. Her column finishes and visibly waits while the other keeps going.

`prefers-reduced-motion: reduce` removes all of it. Every state is designed to read as a still, so nothing is lost.

## Content

All package names, prices and the three open-state slots are the client's own copy from the packages sheet. Prices are "from" figures that change by region, as that sheet says.

The First Week Check scene is **not a testimonial** — Nura has not launched. It is written in the first person because that is how it is lived, and both pages say so in plain words.
