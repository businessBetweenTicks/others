import { readFileSync, writeFileSync } from 'node:fs';
for (const f of process.argv.slice(2)) {
  let s = readFileSync(f, 'utf8');
  const helmet = (s.match(/<helmet>([\s\S]*?)<\/helmet>/) || [,''])[1];
  const body = (s.match(/<x-dc>([\s\S]*?)<\/x-dc>/) || [,''])[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '');
  writeFileSync(`.preview/${f.replace('.dc.html','')}.html`,
    `<!doctype html><html><head><meta charset="utf-8">${helmet}</head><body>${body}</body></html>`);
}
console.log('previews written');
