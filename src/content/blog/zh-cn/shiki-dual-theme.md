---
title: Shiki 双主题：配置放错位置会静默失效
description: Astro 7 里 syntaxHighlight 与 shikiConfig 的分工，以及一个不报错但完全不生效的坑。
pubDate: 2026-11-24
category: 技术
tags: ['Astro', 'Shiki', '高亮']
cover: anime-02.webp
---

代码块在浅色模式下也是深色块——这个现象我排查了一轮，结论是**配置写在了不认识它的地方**。

## 现象

页面用暖白底，但代码块是 `#24292e` 的深灰底配浅灰字，非常突兀。

检查产物 HTML：

```html
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8">
```

`github-dark` 是 Shiki 的**默认主题**。说明我配的双主题根本没生效。

## 错误写法

```js
markdown: {
  syntaxHighlight: {
    type: 'shiki',
    themes: { light: 'github-light', dark: 'github-dark' },  // ❌ 非法键
  },
}
```

`syntaxHighlight` 只认两个键：`type` 和 `excludeLangs`。多写的键**不会报错，直接被丢掉**。

这就是最难受的地方——构建成功、页面正常、只有样式不对。

## 正确写法

主题必须放在 `shikiConfig`：

```js
markdown: {
  syntaxHighlight: { type: 'shiki' },
  shikiConfig: {
    themes: { light: 'github-light', dark: 'github-dark' },
    wrap: true,
  },
}
```

改完后产物变成：

```html
<pre class="astro-code astro-code-themes github-light github-dark"
     style="background-color:#fff;--shiki-dark-bg:#24292e;color:#24292e;--shiki-dark:#e1e4e8">
```

关键变化：

- 多了 `astro-code-themes` 类
- 内联样式是**浅色**（`#fff` / `#24292e`）
- 深色被放进 CSS 变量 `--shiki-dark` / `--shiki-dark-bg`

## 配套的 CSS

高亮器只输出变量，切换还得自己写：

```css
:root[data-theme='dark'] .astro-code,
:root[data-theme='dark'] .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

注意 `.astro-code span` 也要选中——语法颜色是打在 `span` 上的，只改 `pre` 不够。

## 另一个坑：`!important` 抢了高亮的底色

我原来写过：

```css
pre {
  background: var(--code-bg) !important;  /* ❌ */
}
```

它把 Shiki 内联的深色底强行换成了浅色底，但语法颜色还是浅灰的——**对比度只有 1.03，代码等于隐形**。

去掉 `!important` 后，Shiki 的底色生效，语法色就正常了。

**结论**：不要和语法高亮器抢 `background`。

## 怎么验证配对了

别只看构建成功，去看产物：

```bash
grep -o 'astro-code-themes' dist/blog/某篇文章/index.html
grep -o -- '--shiki-dark' dist/blog/某篇文章/index.html
```

两个都有，才算真的生效。

## 小结

| 项 | 位置 |
|---|---|
| 高亮器类型 | `markdown.syntaxHighlight.type` |
| 主题 | `markdown.shikiConfig.themes` |
| 换行 | `markdown.shikiConfig.wrap` |
| 深色切换 | 自己的 CSS，选中 `.astro-code` 与 `.astro-code span` |

**配置写错不报错**，这类问题只能靠检查产物发现。
