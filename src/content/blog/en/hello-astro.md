---
title: Why I Chose Astro for This Blog
description: The reasoning behind the stack choice, and what this blog will cover.
pubDate: 2026-11-26
category: 技术
tags: ['Astro', 'Meta']
cover: cover-hello-astro.jpg
---

The direct reason for starting this blog: my notes were scattered everywhere.

WeChat saved items, a notes app, Obsidian, a pile of Markdown files, and a lot of chat history I never organised. When I needed something I could not find it; when I found it, it was already out of date.

So I wanted a place of my own — something maintainable, searchable, and subscribable.

## Why Astro

Three criteria drove the choice: **static, low maintenance, good writing experience**.

- **Static**: no database, no backend. Deployment is just copying files. It will still work in ten years.
- **Low maintenance**: no plugins to babysit, no dependency upgrades that break things.
- **Writing experience**: one Markdown file per post, versioned by Git.

Astro ships no client-side JavaScript by default. Pages are plain HTML and CSS, so first paint is fast and there is no framework version to fight with.

## A minimal page looks like this

```astro
---
const title = 'Hello, world';
---
<h1>{title}</h1>
```

No client framework, no hydration — the build output is just static files.

## What comes next

Four categories:

| Category | Content |
|---|---|
| Research | Paper reading, experiment design, data processing |
| Engineering | Practice, toolchains, lessons from bugs |
| Learning | Course notes, methods |
| Life | Essays and miscellaneous thoughts |

Write first, polish later.
