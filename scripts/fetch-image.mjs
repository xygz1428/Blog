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
const defaultDir = join(root, 'src', 'content', 'blog', 'images');
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
// --cc0：只要 CC0（无需署名），用于避免署名义务
const cc0Only = args.includes('--cc0');
// --gif：只搜动图；--outdir：指定输出目录（相对项目根）
const gifOnly = args.includes('--gif');
const imageDir = join(root, getFlag('outdir', 'src/content/blog/images'));

const gifParam = gifOnly ? '&extension=gif' : '';
const API = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=20&license_type=commercial${gifParam}`;

const rank = (lic) => ({ cc0: 0, pdm: 0, by: 1, 'by-sa': 2 }[lic] ?? 3);

const res = await fetch(API, { headers: { 'User-Agent': 'kblog-image-fetcher' } });
if (!res.ok) {
  console.error('检索失败 HTTP ' + res.status);
  process.exit(1);
}
const data = await res.json();

const allowed = new Set(cc0Only ? ['cc0'] : ['cc0', 'by', 'by-sa', 'pdm']);
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
const ext = (item.url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i)?.[1] ?? 'jpg').toLowerCase().replace('jpeg', 'jpg');
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
const sizeLimit = gifOnly ? 4_000_000 : 1_500_000;
if (buffer.length > sizeLimit) {
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

// 供页面渲染署名用
const creditsPath = join(root, 'src', 'data', 'image-credits.json');
let credits = {};
if (existsSync(creditsPath)) {
  try { credits = JSON.parse(readFileSync(creditsPath, 'utf8')); } catch { credits = {}; }
}
credits[fileName] = {
  title: item.title ?? '',
  creator: item.creator ?? '',
  license: item.license.toUpperCase(),
  licenseVersion: item.license_version ?? '',
  source: item.source ?? '',
  landingUrl: item.foreign_landing_url ?? item.url,
};
mkdirSync(dirname(creditsPath), { recursive: true });
writeFileSync(creditsPath, JSON.stringify(credits, null, 2) + '\n', 'utf8');

console.log('已下载: ' + filePath);
console.log('  体积: ' + (buffer.length / 1024).toFixed(0) + ' KB');
console.log('  许可: ' + item.license.toUpperCase() + ' ' + (item.license_version ?? ''));
console.log('  作者: ' + (item.creator ?? '未知'));
console.log('  来源: ' + (item.source ?? '-'));
console.log('  原始页: ' + (item.foreign_landing_url ?? item.url));
if (item.license === 'by') {
  console.log('  ⚠️ CC BY：图注需注明作者与许可');
}
