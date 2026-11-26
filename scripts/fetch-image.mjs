#!/usr/bin/env node
/**
 * 从 Openverse 下载 CC0 / CC BY 授权的图片，并登记来源台账。
 *
 *   node scripts/fetch-image.mjs "notebook desk" --out notebook-desk
 *   node scripts/fetch-image.mjs "city night" --out city --pick 2
 *
 * 只接受 cc0 与 by 两种许可；cc-by 会在台账里记录署名要求。
 */
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imageDir = join(root, 'src', 'content', 'blog', 'images');
const ledger = join(root, 'docs', '图片来源台账.md');

const args = process.argv.slice(2);
const query = args[0];
if (!query) {
  console.error('用法: node scripts/fetch-image.mjs "关键词" --out 文件名 [--pick 序号]');
  process.exit(1);
}

const getFlag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const outName = getFlag('out', query.replace(/[^a-z0-9]+/gi, '-').toLowerCase());
const pick = Number(getFlag('pick', '0'));

const API = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=20&license_type=commercial`;

const res = await fetch(API, { headers: { 'User-Agent': 'kblog-image-fetcher' } });
if (!res.ok) {
  console.error('检索失败 HTTP ' + res.status);
  process.exit(1);
}
const data = await res.json();

const allowed = new Set(['cc0', 'by']);
const candidates = (data.results ?? [])
  .filter((item) => allowed.has(item.license))
  // 优先 CC0（无需署名），其次 CC BY
  .sort((a, b) => (a.license === 'cc0' ? 0 : 1) - (b.license === 'cc0' ? 0 : 1));
if (candidates.length === 0) {
  console.error('没有找到 CC0 / CC BY 的结果，换个关键词试试');
  process.exit(1);
}
if (pick >= candidates.length) {
  console.error(`--pick ${pick} 超出范围（共 ${candidates.length} 条合格结果）`);
  process.exit(1);
}

const item = candidates[pick];
const ext = (item.url.match(/\.(jpe?g|png|webp)(\?|$)/i)?.[1] ?? 'jpg').toLowerCase().replace('jpeg', 'jpg');
const fileName = `${outName}.${ext}`;
const filePath = join(imageDir, fileName);

mkdirSync(imageDir, { recursive: true });
if (existsSync(filePath)) {
  console.error('文件已存在，已中止：' + filePath);
  process.exit(1);
}

const imgRes = await fetch(item.url, { headers: { 'User-Agent': 'kblog-image-fetcher' } });
if (!imgRes.ok) {
  console.error('下载失败 HTTP ' + imgRes.status);
  process.exit(1);
}
const buffer = Buffer.from(await imgRes.arrayBuffer());
if (buffer.length > 1_500_000) {
  console.error(`图片过大（${(buffer.length / 1024 / 1024).toFixed(1)} MB），换一张`);
  process.exit(1);
}
writeFileSync(filePath, buffer);

// 台账
const header = `# 图片来源台账

> 所有配图必须可回溯来源与许可。CC0 无需署名；CC BY 需在图注中注明作者与许可。

| 文件 | 检索词 | 标题 | 作者 | 许可 | 来源 | 原始链接 |
|---|---|---|---|---|---|---|
`;
if (!existsSync(ledger)) {
  mkdirSync(dirname(ledger), { recursive: true });
  writeFileSync(ledger, header, 'utf8');
}
const row = `| \`${fileName}\` | ${query} | ${item.title ?? '-'} | ${item.creator ?? '未知'} | ${item.license.toUpperCase()} ${item.license_version ?? ''} | ${item.source ?? '-'} | ${item.foreign_landing_url ?? item.url} |\n`;
appendFileSync(ledger, row, 'utf8');

console.log('已下载: ' + filePath);
console.log('  体积: ' + (buffer.length / 1024).toFixed(0) + ' KB');
console.log('  许可: ' + item.license.toUpperCase() + ' ' + (item.license_version ?? ''));
console.log('  作者: ' + (item.creator ?? '未知'));
console.log('  来源: ' + (item.source ?? '-'));
console.log('  原始页: ' + (item.foreign_landing_url ?? item.url));
if (item.license === 'by') {
  console.log('  ⚠️ CC BY：图注需注明作者与许可');
}
