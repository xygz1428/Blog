---
title: CSS Grid 做「正文 + 目录」两栏布局
description: 用 minmax(0,1fr) 和粘性定位做文章目录，以及窄屏下退化成折叠块的写法。
pubDate: 2026-11-18
category: 技术
tags: ['CSS', '布局', 'Grid']
cover: cover-schema.jpg
---

长文章需要目录。桌面端放右侧粘性栏，手机端收成顶部一块——这个布局用 Grid 几行就能写出来。

## 基本结构

```html
<div class="post-layout">
  <article>...</article>
  <aside class="post-toc">...</aside>
</div>
```

```css
.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
}
```

窄屏先按单列排。目录在 DOM 里位于正文之后，所以默认会出现在正文下方。

## 宽屏变两栏

```css
@media (min-width: 1080px) {
  .post-layout {
    grid-template-columns: minmax(0, var(--measure)) 14rem;
    justify-content: center;
    align-items: start;
    gap: 3.5rem;
  }
}
```

三个要点：

**1. `minmax(0, 1fr)` 而不是 `1fr`**

`1fr` 的最小值是 `auto`，遇到长代码块或长链接时会把列撑破，导致横向滚动。`minmax(0, 1fr)` 强制最小值是 0，内容超出就内部滚动。

这是 Grid 布局最常见的溢出原因。

**2. `align-items: start`**

默认是 `stretch`，会让目录栏被拉满整列高度，粘性定位就失效了（因为它没有可滚动的空间）。

**3. `justify-content: center`**

两列总宽可能小于容器，居中排更平衡。

## 目录栏做粘性

```css
@media (min-width: 1080px) {
  .post-toc {
    position: sticky;
    top: 2rem;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
}
```

`max-height` + `overflow-y` 是为了目录很长时不至于超出屏幕。注意 `top` 要留出页头的高度。

## 窄屏退化

窄屏时目录在正文下方，读者要滚到底才看见——没用。两个选择：

- 用 `order: -1` 提到正文前面
- 加 `position: sticky` 固定在顶部

这里选第一种，做成可折叠块：

```css
@media (max-width: 1079px) {
  .post-toc {
    order: -1;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.7rem 0.9rem;
    background: var(--bg-soft);
  }
  .post-toc ul {
    max-height: 11rem;
    overflow-y: auto;
  }
}
```

`max-height` 限制目录块高度，避免它占满第一屏。

## 滚动高亮当前章节

布局之外还需要一点 JS：滚动时判断哪个标题已经滚过视口上部，给它对应的目录项加高亮。

```js
const links = [...document.querySelectorAll('.post-toc a')];
const targets = links.map((link) => ({
  link,
  el: document.getElementById(decodeURIComponent(link.hash.slice(1))),
})).filter((t) => t.el);

function onScroll() {
  let current = null;
  for (const { link, el } of targets) {
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.2) current = link;
  }
  links.forEach((l) => l.classList.toggle('is-active', l === current));
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
```

两个细节：

- `decodeURIComponent` 处理中文锚点（浏览器会把 `#最小二乘` 编码）
- `{ passive: true }` 让滚动监听不阻塞，长页面更流畅

## 踩过的坑

**目录不显示**：标题少于 2 个时我直接不渲染目录，结果某篇只有 1 个 h2 的文章没有目录——这是预期行为，但要记得告诉读者。

**粘性失效**：父元素有 `overflow: hidden` 时 `position: sticky` 会失效。检查 `.post-layout` 的祖先链。

**中文锚点跳错**：`href="#中文"` 在 HTML 里会被编码成 `#%E4%B8%AD%E6%96%87`，取 `hash` 后要解码才能 `getElementById`。

## 小结

| 问题 | 解法 |
|---|---|
| 长内容撑破列 | `minmax(0, 1fr)` |
| 粘性不生效 | `align-items: start` + 检查祖先 `overflow` |
| 窄屏目录在底部 | `order: -1` |
| 目录太长 | `max-height` + `overflow-y: auto` |
