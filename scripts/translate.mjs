#!/usr/bin/env node
/**
 * 一键翻译：把 zh-cn 的文章翻成英文，写到 en/。
 *
 *   npm run translate            # 只翻还没有英文版的
 *   npm run translate -- --force # 覆盖已有英文版
 *
 * 处理规则：
 * - title / description 翻译；category / cover / pubDate / tags / draft 原样保留
 * - 代码块（```）整段跳过
 * - 行内代码、链接、图片先用占位符保护，翻完还原
 * - 表格逐格翻译；列表逐行翻译
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'src', 'content', 'blog', 'zh-cn');
const DST = join(root, 'src', 'content', 'blog', 'en');
const force = process.argv.includes('--force');
// --except=a.md,b.md：这些文件不覆盖（人工写的版本）
const exceptArg = process.argv.find((a) => a.startsWith('--except='));
const except = new Set(exceptArg ? exceptArg.slice('--except='.length).split(',') : []);

mkdirSync(DST, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 调 Google 免费端点翻译一段文本 */
async function translateChunk(text) {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=' +
    encodeURIComponent(text);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  // 返回结构：[[["译文","原文",null,null,...], ...], ...]
  return (data[0] ?? []).map((seg) => seg[0]).join('');
}

async function translateText(text) {
  if (!text || !/[\u4e00-\u9fa5]/.test(text)) return text;
  // 太长就按句号切
  if (text.length <= 1200) {
    return withRetry(() => translateChunk(text));
  }
  const parts = text.split(/(?<=[。！？])/);
  const out = [];
  let buf = '';
  for (const p of parts) {
    if ((buf + p).length > 1200 && buf) {
      out.push(await withRetry(() => translateChunk(buf)));
      buf = p;
    } else {
      buf += p;
    }
  }
  if (buf) out.push(await withRetry(() => translateChunk(buf)));
  return out.join('');
}

async function withRetry(fn, times = 3) {
  let lastErr;
  for (let i = 0; i < times; i++) {
    try {
      const r = await fn();
      await sleep(400);
      return r;
    } catch (e) {
      lastErr = e;
      await sleep(1200 * (i + 1));
    }
  }
  throw lastErr;
}

/** 保护行内代码、链接、图片，避免被翻译破坏 */
function protect(text) {
  const store = [];
  const put = (s) => {
    store.push(s);
    return `⟦${store.length - 1}⟧`;
  };
  let out = text
    .replace(/`[^`]+`/g, (m) => put(m))
    .replace(/!\[[^\]]*\]\([^)]+\)/g, (m) => put(m))
    .replace(/\[[^\]]*\]\([^)]+\)/g, (m) => put(m));
  return { out, store };
}

function restore(text, store) {
  return text.replace(/⟦(\d+)⟧/g, (_, i) => store[Number(i)] ?? '');
}

async function translateBlock(block) {
  // 表格：逐格翻译
  if (/^\|/.test(block.trim())) {
    const lines = block.split('\n');
    const out = [];
    for (const line of lines) {
      if (/^\|[\s:|-]+\|$/.test(line.trim())) {
        out.push(line);
        continue;
      }
      const cells = line.split('|');
      const conv = [];
      for (const cell of cells) {
        const t = cell.trim();
        if (!t) {
          conv.push(cell);
          continue;
        }
        const { out: p, store } = protect(t);
        const tr = await translateText(p);
        conv.push(' ' + restore(tr, store) + ' ');
      }
      out.push(conv.join('|'));
    }
    return out.join('\n');
  }

  // 列表 / 引用 / 标题：保留前缀，只翻内容
  const m = block.match(/^(\s*(?:[-*+]|\d+\.|>|#{1,6})\s+)([\s\S]*)$/);
  if (m) {
    const { out: p, store } = protect(m[2]);
    const tr = await translateText(p);
    return m[1] + restore(tr, store);
  }

  const { out: p, store } = protect(block);
  const tr = await translateText(p);
  return restore(tr, store);
}

function yamlValue(v) {
  const t = v.trim();
  if (/^["']/.test(t)) return t;
  if (/[:#]/.test(t)) return '"' + t.replace(/"/g, '\\"') + '"';
  return t;
}

let done = 0;
let skipped = 0;

for (const name of readdirSync(SRC).filter((n) => n.endsWith('.md')).sort()) {
  const dst = join(DST, name);
  if (except.has(name)) {
    skipped++;
    continue;
  }
  if (existsSync(dst) && !force) {
    skipped++;
    continue;
  }

  const raw = readFileSync(join(SRC, name), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) {
    console.log('skip (no frontmatter):', name);
    continue;
  }
  const [, fm, body] = m;

  // frontmatter：只翻 title / description
  const fmLines = [];
  for (const line of fm.split('\n')) {
    const kv = line.match(/^(title|description):\s*(.*)$/);
    if (kv) {
      const { out: p, store } = protect(kv[2]);
      const tr = await translateText(p);
      fmLines.push(`${kv[1]}: ${yamlValue(restore(tr, store))}`);
    } else {
      fmLines.push(line);
    }
  }

  // 正文：按代码围栏切分
  const segs = body.split(/(```[\s\S]*?```)/g);
  const outSegs = [];
  for (const seg of segs) {
    if (seg.startsWith('```')) {
      outSegs.push(seg);
      continue;
    }
    const blocks = seg.split(/\n{2,}/);
    const outBlocks = [];
    for (const b of blocks) {
      if (!b.trim()) {
        outBlocks.push(b);
        continue;
      }
      outBlocks.push(await translateBlock(b));
    }
    outSegs.push(outBlocks.join('\n\n'));
  }

  writeFileSync(dst, `---\n${fmLines.join('\n')}\n---\n${outSegs.join('')}`, 'utf8');
  done++;
  console.log('translated:', name);
}

console.log(`\n完成：翻译 ${done} 篇，跳过 ${skipped} 篇（已有英文版）`);
