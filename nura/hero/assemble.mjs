import { readFileSync, writeFileSync } from 'node:fs';
import { PARTS, OPTIONS } from './build-rest.mjs';

const T = { ground:'#F7F3ED', ink:'#1C1A17', ink2:'#55504A', ink3:'#8A8279' };

// pull the inner content out of an artboard's single root div
function inner(file) {
  let s = readFileSync(file, 'utf8');
  s = s.slice(s.indexOf('<x-dc>') + 6, s.lastIndexOf('</x-dc>'));
  s = s.replace(/<helmet>[\s\S]*?<\/helmet>/, '');
  const open = s.indexOf('<div style="width:');
  const gt = s.indexOf('>', open);
  const end = s.lastIndexOf('</div>');
  return s.slice(gt + 1, end).trim();
}

const helmet = `<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,400&family=Instrument+Sans:wght@400;500&display=swap">
  <style>
    body { margin: 0; font-family: 'Instrument Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: ${T.ink2}; text-decoration: none; }
    a:hover { color: ${T.ink}; }
    .serif { font-family: 'Newsreader', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif; }
    .lbl { font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: ${T.ink3}; }
  </style>
</helmet>`;

const MAP = {
  1440: ['Main.dc.html',     'Data1440.dc.html', 'Care1440.dc.html', 'Pack1440.dc.html', 'FWC1440.dc.html'],
  1280: ['Hero1280.dc.html', 'Data1280.dc.html', 'Care1280.dc.html', 'Pack1280.dc.html', 'FWC1280.dc.html'],
  768:  ['Hero768.dc.html',  'Data768.dc.html',  'Care768.dc.html',  'Pack768.dc.html',  'FWC768.dc.html'],
  375:  ['Hero375.dc.html',  'Data375.dc.html',  'Care375.dc.html',  'Pack375.dc.html',  'FWC375.dc.html'],
};

for (const w of [1440, 1280, 768, 375]) {
  const [hero, data, care, pack, fwc] = MAP[w].map(inner);
  const o = OPTIONS[w];
  const body = [hero, PARTS.problem(o), PARTS.thread(o), data, care, pack, fwc, PARTS.gift(o), PARTS.close(o), PARTS.footer(o)].join('\n');
  writeFileSync(`Landing${w}.dc.html`, `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
${helmet}

<div style="width:${w}px;background:${T.ground};color:${T.ink};box-sizing:border-box;">
${body}
</div>
</x-dc>
</body>
</html>
`);
}
console.log('assembled 4 landing pages');
