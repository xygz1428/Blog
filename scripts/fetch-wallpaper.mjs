#!/usr/bin/env node
/**
 * 抓取必应每日壁纸的元数据，写入 src/data/daily-wallpaper.json。
 *
 *   npm run wallpaper
 *
 * 只保存「图片 URL + 版权信息」，不下载图片本身：
 * 壁纸版权归各摄影师，微软仅授权在其服务内使用，因此本站只做热链接与署名。
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'data', 'daily-wallpaper.json');

const API = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN';

const res = await fetch(API, { headers: { 'User-Agent': 'Mozilla/5.0 (kblog)' } });
if (!res.ok) {
  console.error('抓取失败 HTTP ' + res.status);
  process.exit(1);
}
const data = await res.json();
const base = 'https://www.bing.com';

const items = (data.images ?? []).map((img) => ({
  url: base + img.url,
  title: img.title ?? '',
  copyright: img.copyright ?? '',
  startDate: img.startdate ?? '',
  link: img.copyrightlink ? base + img.copyrightlink : base,
}));

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2) + '\n', 'utf8');

console.log(`已写入 ${items.length} 张：${out}`);
for (const item of items.slice(0, 3)) {
  console.log('  ' + item.copyright);
}
