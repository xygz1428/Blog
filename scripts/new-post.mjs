#!/usr/bin/env node
/**
 * 新建文章：生成带 frontmatter 骨架的 Markdown 文件。
 *
 *   npm run new "文章标题"
 *
 * 中文标题不做拼音转换，文件名用时间戳，避免引入额外依赖。
 */
import { existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const title = process.argv[2];

if (!title || title.trim() === '') {
  console.error('用法: npm run new "文章标题"');
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const stamp = `${date}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

const file = join(root, 'src', 'content', 'blog', `${stamp}.md`);
if (existsSync(file)) {
  console.error('文件已存在，已中止：' + file);
  process.exit(1);
}

const template = `---
title: ${title.trim()}
description: 
pubDate: ${date}
category: 技术
tags: []
draft: true
---

在这里开始写正文。

## 小标题

图片统一放在 \`src/content/blog/images/\`，用相对路径引用（不要写 /images/）：

![图片说明](./images/图片名.png)

*图注写在图片下一行，用一对星号包起来*
`;

writeFileSync(file, template, 'utf8');

console.log('已创建: ' + file);
console.log('');
console.log('下一步：');
console.log('  1. 打开文件写正文');
console.log('  2. 把 draft 改成 false（不改就不会出现在站点上）');
console.log('  3. git add . && git commit -m "post: ' + title.trim() + '" && git push');
