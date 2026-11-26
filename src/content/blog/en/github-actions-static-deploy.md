---
title: GitHub Actions minimal configuration for deploying static sites
description: The smallest workflow that can run, and the npm ci cross-platform pitfalls I have stepped into.
pubDate: 2026-11-21
category: 技术
tags: ['GitHub Actions', 'CI', '部署']
cover: cover-schema.jpg
---
To deploy a static site to GitHub Pages, the officially recommended path is Actions Build + Upload Product + Deployment. Below is the minimum configuration that can run.

## Full configuration

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

## Three easy leakage points

### 1. `permissions` must be written

The default `GITHUB_TOKEN` permissions are very small, and missing `pages: write` and `id-token: write` will directly fail. This isn't a bug, it's design.

### 2. In the warehouse settings, change the Pages source to "GitHub Actions"

**This step is the easiest to miss**: the workflow runs successfully, but the page is still 404 because Pages is still waiting for the `gh-pages` branch.

Path: Repository **Settings → Pages → Source → GitHub Actions**.

### 3. `concurrency` Anti-concurrency

When pushing twice in a row, both workflows will run at the same time, and the one completed later may overwrite the one completed first. `cancel-in-progress: true` Let the new cancel the old.

## The pitfall I stepped on: `npm ci` failed on Linux

At first I used `npm ci` (stricter, faster), and the result was CI:

```
npm error `npm ci` can only install packages when your package.json and
npm error package-lock.json are in sync.
npm error Missing: @emnapi/core@1.11.3 from lock file
```

But local `npm ci` is completely fine.

**Root Cause**: The lockfile was generated on Windows. `@emnapi/*` are **platform-related optional dependencies** for some packages (image processing chain). Windows does not parse them, so there are only references and no entity entries in lock. Linux runner requires these packages, and the strict synchronization check of `npm ci` is determined to be missing.

**Solution**: Use `npm install` in CI instead. It will be parsed according to the current platform without strict verification.

**Price**: Give up strict reproducibility of lockfile. Acceptable for personal projects; for projects that require reproducible builds, the lockfile should be generated in the Linux environment (or Docker).

## How to confirm that it is actually deployed?

Don’t just look at workflow if it’s green, look at two places:

1. The output of `deploy` job in Actions is `page_url`
2. Visit the online address directly to see if there is new content

```bash
curl -s https://<用户名>.github.io/<仓库>/ | grep -o '<title>[^<]*'
```

## Build time reference

This site has 100 pages (bilingual), and it takes about **1 minute** from CI push to online availability, including:

- Install dependencies: about 20 seconds (faster with cache)
- Build: ~2 seconds
- Upload + deploy: ~20 seconds

The deployment cost of static stations is almost negligible.