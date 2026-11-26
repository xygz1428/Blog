---
title: Markdown 里图片路径的三个陷阱
description: 子路径部署、目录迁移、相对路径解析——三个都会让图片静默 404。
pubDate: 2026-11-23
category: 技术
tags: ['Markdown', '图片', '部署']
cover: cover-writing-guide.jpg
---

图片挂掉是博客最常见的故障，而且三种原因表现一模一样：**页面正常，图是破的**。

## 陷阱一：绝对路径撞上子路径部署

站点部署在 `https://<用户名>.github.io/Blog/`，这时写：

```markdown
![](/images/demo.png)
```

`/images/` 指向的是**域名根**，不是 `/Blog/`，所以 404。

**正确做法**：用相对路径。

```markdown
![](./images/demo.png)
```

构建时 Astro 会把相对路径解析成带 base 前缀的哈希地址：

```html
<img src="/Blog/_astro/demo.CKJBRs3P.webp">
```

**注意**：这个前缀是构建期加上的，不是你手写的。手写 `href` 或 `src` 的地方（比如导航链接）仍然需要自己处理 base，通常封装一个 `withBase()`。

## 陷阱二：文章换目录，相对路径失效

我做过一次目录迁移，把文章从 `src/content/blog/` 移到 `src/content/blog/zh-cn/`，结果原本正常的 `./images/x.png` 全部失效——因为相对路径是**相对当前文件**的，文件挪了一层，路径就少了一层。

```
迁移前：blog/hello.md      → ./images/x.png  = blog/images/x.png ✅
迁移后：blog/zh-cn/hello.md → ./images/x.png  = blog/zh-cn/images/x.png ❌
```

**解法**：改成 `../images/x.png`，或者在迁移后立刻构建并检查 `img src`。

**教训**：移动 Markdown 文件时，图片路径必须跟着改。

## 陷阱三：引用了图片，但没放进被处理的目录

Astro 只处理**被引用且位于源码目录**的图片。如果把图放进 `public/`，它会被原样拷贝，不走优化，也不生成哈希。

两种策略：

| 放哪 | 行为 | 适用 |
|---|---|---|
| `src/content/blog/images/` | 构建期优化、转 WebP、加哈希 | 文章配图（推荐） |
| `public/` | 原样拷贝，路径需自己处理 base | favicon、robots.txt |

实测差异很大：一张 46 KB 的 PNG 经优化后变成 19 KB 的 WebP，还自动带上 `loading="lazy"` 和宽高属性（避免布局跳动）。

## 附带的两个收益

用相对路径 + 源码目录，还顺手得到：

- **自动压缩**：不用手动压图
- **防缓存问题**：文件名带内容哈希，改图即换名

## 排查清单

图片不出来时按顺序查：

1. 路径是不是以 `/` 开头？改成 `./`
2. 文件是不是在 `src/content/blog/images/`？
3. 文章有没有换过目录？相对层级对不对？
4. 构建产物里 `img src` 长什么样？带 `/Blog/_astro/` 就对了

```bash
grep -o '<img[^>]*src="[^"]*"' dist/blog/你的文章/index.html
```

## 小结

| 陷阱 | 症状 | 解法 |
|---|---|---|
| 绝对路径 | 子路径部署下 404 | 用 `./` 相对路径 |
| 目录迁移 | 原本正常突然全挂 | 补一层 `../` |
| 放错目录 | 图片能显示但不优化 | 放 `src/content/blog/images/` |
