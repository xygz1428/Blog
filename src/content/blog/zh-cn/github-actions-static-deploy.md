---
title: GitHub Actions 部署静态站的最小配置
description: 一个能跑起来的最小 workflow，以及我踩过的 npm ci 跨平台坑。
pubDate: 2026-11-21
category: 技术
tags: ['GitHub Actions', 'CI', '部署']
cover: cover-schema.jpg
---

静态站部署到 GitHub Pages，官方推荐的路径是 Actions 构建 + 上传产物 + 部署。下面是能跑的最小配置。

## 完整配置

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm install --no-audit --no-fund
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 三个容易漏的点

### 1. `permissions` 必须写

默认的 `GITHUB_TOKEN` 权限很小，缺 `pages: write` 和 `id-token: write` 会直接失败。这不是 bug，是设计。

### 2. 仓库设置里要把 Pages 来源改成 "GitHub Actions"

**这一步最容易漏**：workflow 跑成功，但页面还是 404，因为 Pages 还在等 `gh-pages` 分支。

路径：仓库 **Settings → Pages → Source → GitHub Actions**。

### 3. `concurrency` 防并发

连续 push 两次时，两个 workflow 会同时跑，后完成的可能覆盖先完成的。`cancel-in-progress: true` 让新的取消旧的。

## 我踩的坑：`npm ci` 在 Linux 上失败

一开始我用的是 `npm ci`（更严格、更快），结果 CI 报：

```
npm error `npm ci` can only install packages when your package.json and
npm error package-lock.json are in sync.
npm error Missing: @emnapi/core@1.11.3 from lock file
```

但本地 `npm ci` 完全正常。

**根因**：lockfile 是在 Windows 上生成的。`@emnapi/*` 是某些包（图像处理链）的**平台相关可选依赖**，Windows 不解析它们，所以 lock 里只有引用、没有实体条目。Linux runner 需要这些包，`npm ci` 的严格同步校验就判定缺失。

**解法**：CI 里改用 `npm install`。它会按当前平台解析，不做严格校验。

**代价**：放弃 lockfile 的严格复现性。对个人项目可接受；对需要可复现构建的项目，应该在 Linux 环境（或 Docker）里生成 lockfile。

## 怎么确认真的部署了

别只看 workflow 绿了，去看两个地方：

1. Actions 里 `deploy` job 的输出，有 `page_url`
2. 直接访问线上地址，看是不是新内容

```bash
curl -s https://<用户名>.github.io/<仓库>/ | grep -o '<title>[^<]*'
```

## 构建时间参考

本站 37 个页面（含三语），CI 从 push 到线上可用约 **1 分钟**，其中：

- 安装依赖：约 20 秒（有缓存时更快）
- 构建：约 2 秒
- 上传 + 部署：约 20 秒

静态站的部署成本几乎可以忽略。
