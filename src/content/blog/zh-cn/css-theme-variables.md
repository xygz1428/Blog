---
title: 用 CSS 变量做主题切换的三种写法
description: 比较 data 属性、class 切换与 prefers-color-scheme 三种方案，以及各自的失效场景。
pubDate: 2026-11-25
category: 技术
tags: ['CSS', '主题', '前端']
cover: cover-schema.jpg
---

深浅色切换看着简单，但写法不同，踩的坑也不同。这里比较三种常见做法。

## 写法一：切换 `data-theme` 属性

```css
:root {
  --bg: #f5f1ea;
  --fg: #1f1b17;
}

:root[data-theme='dark'] {
  --bg: #1c1a1f;
  --fg: #d8dae0;
}

body {
  background: var(--bg);
  color: var(--fg);
}
```

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

**优点**：变量集中，页面里不出现具体颜色值；一个属性切换全站。
**缺点**：初始值必须有个默认（通常写在 `:root` 里），否则首屏会没有颜色。

## 写法二：切换 `class`

```css
.dark {
  --bg: #1c1a1f;
  --fg: #d8dae0;
}
```

**优点**：和 `data-*` 差不多。
**缺点**：`class` 是样式钩子，容易被别的逻辑覆盖（比如某个组件加了 `dark` 类的变体）；`data-theme` 语义更明确，不会和样式类打架。

**建议用 `data-theme`**，把 `class` 留给布局和组件。

## 写法三：只靠 `prefers-color-scheme`

```css
@media (prefers-color-scheme: dark) {
  :root { --bg: #1c1a1f; }
}
```

**优点**：零 JS，跟随系统。
**缺点**：**用户无法覆盖**。系统是深色但你想看浅色时，没有开关。

正确做法是两者结合：

```js
const saved = localStorage.getItem('theme');
const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
const theme = saved || (prefersDark ? 'dark' : 'light');
document.documentElement.dataset.theme = theme;
```

## 一个必须处理的细节：闪白

如果主题在 `DOMContentLoaded` 之后才设置，用户会先看到一帧白底再变黑——很刺眼。

解法是把设置逻辑放进 `<head>` 的**内联脚本**，在首次绘制前执行：

```html
<script is:inline>
  (function () {
    try {
      var saved = localStorage.getItem('blog-theme');
      var prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
</script>
```

注意三件事：

1. 必须是**内联**的，外部脚本要等网络
2. 必须包 `try/catch`，隐私模式下 `localStorage` 会抛错
3. 必须在 `<head>` 里，不能放 `<body>` 末尾

## 三个容易翻车的点

**1. 读写用了不同的 key**

我踩过：`localStorage` 读的是 `blog-theme`，写的是 `Blog-theme`。功能看着"有时生效"，其实一直在写一个没人读的键。改完批量替换后一定要 `grep` 反查。

**2. 变量漏了一处**

新增颜色时只加到浅色块、忘了深色块，结果深色模式下那块是白的。**两套变量必须成对维护**。

**3. 代码高亮不跟主题**

静态高亮（Shiki/Prism）生成的是内联颜色，CSS 变量管不到。需要用双主题方案，让高亮器输出 `--shiki-dark` 这类变量，再由 CSS 切换。

## 小结

| 方案 | 跟随系统 | 用户可覆盖 | 推荐 |
|---|---|---|---|
| `data-theme` + 内联脚本 | ✅ | ✅ | **推荐** |
| `class` 切换 | ✅ | ✅ | 可用，语义弱 |
| 仅 `prefers-color-scheme` | ✅ | ❌ | 不够 |
