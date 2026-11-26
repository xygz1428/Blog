/**
 * 重新分配文章封面，保证同一张图最多用 3 次。
 *
 *   node scripts/rebalance-covers.mjs           # 只看结果，不写文件
 *   node scripts/rebalance-covers.mjs --write   # 实际写入
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ZH = join(root, 'src', 'content', 'blog', 'zh-cn');
const EN = join(root, 'src', 'content', 'blog', 'en');
const BLOG_IMG = join(root, 'src', 'content', 'blog', 'images');
const GALLERY = join(root, 'src', 'assets', 'gallery');

const LIMIT = 3;
const write = process.argv.includes('--write');

const listImgs = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).filter((n) => /\.(jpe?g|png|webp)$/i.test(n))
    : [];

// 候选池：原有封面优先（保持题材贴合），不足时用图集补齐
const pool = [...new Set([...listImgs(BLOG_IMG), ...listImgs(GALLERY)])];

const readCover = (file) => {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^cover:\s*(.+)$/m);
  return m ? m[1].trim() : null;
};

const setCover = (file, cover) => {
  let text = readFileSync(file, 'utf8');
  if (/^cover:\s*.+$/m.test(text)) {
    text = text.replace(/^cover:\s*.+$/m, `cover: ${cover}`);
  } else {
    text = text.replace(/^---\n/, `---\ncover: ${cover}\n`);
  }
  writeFileSync(file, text, 'utf8');
};

const posts = readdirSync(ZH).filter((n) => n.endsWith('.md')).sort();
const used = new Map();
const plan = [];

for (const name of posts) {
  const file = join(ZH, name);
  const current = readCover(file);
  let chosen = null;

  // 现有封面若还没到上限，优先保留
  if (current && pool.includes(current) && (used.get(current) ?? 0) < LIMIT) {
    chosen = current;
  } else {
    // 从池里挑用得最少的一张
    let best = null;
    let bestCount = Infinity;
    for (const img of pool) {
      const c = used.get(img) ?? 0;
      if (c < LIMIT && c < bestCount) {
        best = img;
        bestCount = c;
      }
    }
    chosen = best;
  }

  if (!chosen) {
    console.log('⚠ 没有可用图片了:', name);
    continue;
  }

  used.set(chosen, (used.get(chosen) ?? 0) + 1);
  plan.push({ name, from: current, to: chosen });
  if (write) {
    setCover(file, chosen);
    const enFile = join(EN, name);
    if (existsSync(enFile)) setCover(enFile, chosen);
  }
}

console.log(`\n${write ? '已写入' : '预览'}：${plan.length} 篇\n`);
const changed = plan.filter((p) => p.from !== p.to);
console.log(`封面变更 ${changed.length} 篇：`);
for (const p of changed) console.log(`  ${p.name.padEnd(34)} ${p.from ?? '(无)'} → ${p.to}`);

console.log('\n最终使用次数：');
for (const [img, c] of [...used.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${img.padEnd(30)} ${c} 次 ${c > LIMIT ? '⚠ 超限' : ''}`);
}
const over = [...used.entries()].filter(([, c]) => c > LIMIT);
console.log(over.length === 0 ? '\n✅ 全部不超过 ' + LIMIT + ' 次' : '\n❌ 仍有超限');
