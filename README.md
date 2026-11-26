# Blog

一个用 [Astro](https://astro.build) 搭建的个人博客，记录科研、技术、学习与生活。

- **静态**：构建产物就是纯 HTML / CSS，没有后端、没有数据库
- **零追踪**：没有统计脚本、没有 Cookie
- **Markdown 写作**：一篇文章 = 一个文件，Git 管版本
- **免费托管**：GitHub Pages + GitHub Actions 自动部署

线上地址（部署后）：`https://xygz1428.github.io/Blog/`

---

## 技术栈

| 层 | 选择 |
|---|---|
| 框架 | Astro 7（静态输出） |
| 内容 | Markdown + Astro 内容集合（带 schema 校验） |
| 公式 | remark-math + rehype-katex（构建期渲染） |
| 代码高亮 | Shiki（Astro 内置，浅色/深色双主题） |
| 样式 | 手写 CSS + CSS 变量（无 UI 框架） |
| 搜索 | 构建期生成 JSON 索引 + 前端匹配 |
| 部署 | GitHub Actions → GitHub Pages |

---

## 快速开始

环境要求：**Node.js ≥ 22.23.4**（Astro 7 的要求）

```bash
# 安装依赖
npm install

# 本地开发（默认 http://localhost:4321/Blog）
npm run dev

# 构建（输出到 dist/）
npm run build

# 预览构建结果
npm run preview
```

> ⚠️ 本地访问**必须带 `/Blog` 路径**，因为 `base` 配置为 `/Blog`。
> 根路径 `http://localhost:4321/` 是空的。

---

## 写一篇文章

在 `src/content/blog/` 下新建 `任意文件名.md`，文件名就是 URL 里的 slug：

```
src/content/blog/my-first-post.md  →  /blog/my-first-post/
```

### Frontmatter 字段

```yaml
---
title: 文章标题            # 必填
description: 一句话摘要     # 选填，会用于列表、RSS、SEO
pubDate: 2026-11-26        # 必填，格式 YYYY-MM-DD
updatedDate: 2026-11-27    # 选填，有更新时填
category: 技术             # 必填，只能是：科研 / 技术 / 学习 / 生活
tags: ['Astro', '建站']    # 选填，数组
draft: false               # 选填，true 时不会出现在任何列表里
---
```

**字段写错会构建失败**——这是好事，能防止文章默默消失。

### 支持的 Markdown 语法

- 标准 Markdown（CommonMark + GFM 表格、任务列表、删除线）
- 数学公式：行内 `$E=mc^2$`，块级 `$$ ... $$`
- 代码块：`` ```python `` 等，自动高亮
- 引用、脚注、图片

### 修改站点信息

全站配置集中在 **`src/site.mjs`**：站点标题、副标题、导航、分类、URL、每页文章数。

---

## 部署到 GitHub Pages

### 一次性配置

**1. 确认仓库名与 `base` 一致**

`src/site.mjs` 里：

```js
url: 'https://xygz1428.github.io',
base: '/Blog',          // ← 必须等于仓库名
```

仓库叫 `Blog`，`base` 就是 `/Blog`；仓库叫 `blog`，就改成 `/blog`。
**两者不一致会导致样式和链接全部 404。**

**2. 创建仓库并推送**

```bash
cd Blog
git init
git add .
git commit -m "init: Blog V0.1.0"
git branch -M main
git remote add origin https://github.com/xygz1428/Blog.git
git push -u origin main
```

**3. 开启 Pages**

进入仓库 **Settings → Pages**，把 **Source** 改成 **GitHub Actions**（不是 "Deploy from a branch"）。

这一步不做，Actions 跑完也不会发布。

**4. 等第一次部署**

推送到 `main` 会自动触发 `.github/workflows/deploy.yml`。
在仓库 **Actions** 页能看到进度；成功后访问：

```
https://xygz1428.github.io/Blog/
```

### 之后怎么更新

```bash
# 写文章
vim src/content/blog/新文章.md

# 本地看效果
npm run dev

# 推送即自动部署
git add .
git commit -m "post: 新文章标题"
git push
```

不需要手动构建、不需要手动上传。

---

## 目录结构

```
Blog/
├── .github/workflows/deploy.yml   # 自动部署工作流
├── public/                        # 原样拷贝的资源（favicon 等）
├── src/
│   ├── content/blog/              # ← 文章目录
│   ├── content.config.ts          # 文章 schema（字段校验）
│   ├── layouts/BaseLayout.astro   # 全站骨架
│   ├── pages/                     # 路由（文件即路由）
│   ├── styles/global.css          # 全站样式
│   ├── site.mjs                   # 站点配置
│   └── utils/                     # 文章查询、URL 处理
├── docs/ROADMAP.md                # 开发计划与版本路线
├── astro.config.mjs
└── package.json
```

---

## 常见问题

**本地打开 404 / 样式丢失？**
访问 `http://localhost:4321/Blog/`，不要漏掉 `/Blog`。

**部署后样式丢失？**
`src/site.mjs` 的 `base` 和仓库名不一致。两者必须相同。

**Actions 跑成功但页面还是 404？**
Settings → Pages 的 Source 没设成 "GitHub Actions"。

**文章不显示？**
检查 `draft: true`、`pubDate` 格式、`category` 是否在四个允许值内。构建日志会指出具体哪个文件哪个字段错了。

**公式不渲染？**
`$$` 前后要空行，且 `astro.config.mjs` 里要有 `remark-math` + `rehype-katex`（已配好）。

**想换成 `https://<username>.github.io` 根域名？**
把仓库名改成 `<username>.github.io`，同时把 `base` 改成 `'/'`。

---

## 路线图

见 [docs/ROADMAP.md](docs/ROADMAP.md)。当前 V0.1.0 已完成最小可用版本，V0.2.0 聚焦阅读体验。

---

## 许可

文章内容版权归作者所有；代码部分可自由参考。
