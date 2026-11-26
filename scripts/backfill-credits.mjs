/**
 * 从 docs/图片来源台账.md 反推 src/data/image-credits.json
 * 用于给已下载的图片补署名信息。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ledger = join(root, 'docs', '图片来源台账.md');
const out = join(root, 'src', 'data', 'image-credits.json');

if (!existsSync(ledger)) {
  console.error('台账不存在:', ledger);
  process.exit(1);
}

let credits = {};
if (existsSync(out)) {
  try { credits = JSON.parse(readFileSync(out, 'utf8')); } catch { credits = {}; }
}

const text = readFileSync(ledger, 'utf8');
const rows = text.split('\n').filter((l) => l.startsWith('| `'));

let added = 0;
for (const row of rows) {
  const cells = row.split('|').map((c) => c.trim());
  // ['', '`file`', 'query', 'title', 'creator', 'license', 'source', 'url', '']
  const file = cells[1]?.replace(/`/g, '');
  if (!file) continue;
  const [, , , title, creator, license, source, url] = cells;
  if (credits[file]) continue;

  const m = (license || '').match(/^([A-Z0-9-]+)\s*(.*)$/);
  credits[file] = {
    title: title === '-' ? '' : title,
    creator: creator === '-' ? '' : creator,
    license: m ? m[1] : license,
    licenseVersion: m ? m[2] : '',
    source: source === '—' ? '' : source,
    landingUrl: url === '—' ? '' : url,
  };
  added++;
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(credits, null, 2) + '\n', 'utf8');
console.log(`台账 ${rows.length} 行，补入 ${added} 条，共 ${Object.keys(credits).length} 条`);
