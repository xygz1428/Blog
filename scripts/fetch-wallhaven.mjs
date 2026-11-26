#!/usr/bin/env node
/**
 * 抓取 Wallhaven 的公开壁纸元数据，写入 src/data/wallhaven.json。
 *
 *   npm run wallhaven
 *
 * 与必应壁纸同样的处理原则：只保存 URL 与来源页，不下载图片。
 * Wallhaven 是社区上传站，图片版权归原作者，本站仅热链接并标注来源。
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'data', 'wallhaven.json');

// categories=100 只取 general（风景/抽象），排除 anime(010) 与 people(001)，避免擦边内容
// purity=100 仅 SFW；sorting=toplist 按热度
const API = 'https://wallhaven.cc/api/v1/search?categories=100&purity=100&sorting=toplist&order=desc&page=1';

const res = await fetch(API, { headers: { 'User-Agent': 'Mozilla/5.0 (kblog)' } });
if (!res.ok) {
  console.error('抓取失败 HTTP ' + res.status);
  process.exit(1);
}
const data = await res.json();

const items = (data.data ?? []).slice(0, 8).map((w) => ({
  id: w.id,
  // thumb 是缩略图，small 中等，path 原图；相册用 small 更省流量
  url: w.thumbs?.small ?? w.thumbs?.original ?? w.path,
  page: w.url,
  resolution: w.resolution,
  category: w.category,
}));

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2) + '\n', 'utf8');

console.log(`已写入 ${items.length} 张：${out}`);
for (const item of items.slice(0, 3)) {
  console.log(`  ${item.id}  ${item.resolution}  ${item.category}`);
}
