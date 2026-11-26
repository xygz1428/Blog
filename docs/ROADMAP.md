# Blog 开发计划

> 目标：一个能长期维护的个人博客，记录科研、技术、学习与生活。
> 原则：**先能用，再好看**；每个版本都要能构建通过。

## 版本路线

### V0.1.0 — 最小可用（当前）

目标：站点能跑、能写、能发。

- [x] Astro 7 + Markdown 内容集合
- [x] 首页（最新文章 + 分类入口）
- [x] 文章列表 / 详情页
- [x] 四分类：科研 / 技术 / 学习 / 生活
- [x] 标签页 / 归档页
- [x] 站内搜索（构建期生成 JSON 索引，前端匹配）
- [x] 关于页
- [x] 深色 / 浅色切换（localStorage 记忆，首屏无闪烁）
- [x] 公式渲染（remark-math + KaTeX）
- [x] 代码高亮（Shiki）
- [x] 响应式布局
- [x] RSS
- [x] SEO 基础（title / description / canonical / OG / sitemap）
- [x] GitHub Actions 自动部署
- [ ] **待验证**：GitHub Actions 在真实仓库上的首次运行（本地无法执行）

### V0.2.0 — 阅读体验

- [ ] 文章目录（TOC）自动生成，滚动高亮
- [ ] 阅读进度条
- [ ] 上一篇 / 下一篇显示标题（当前已实现，需视觉优化）
- [ ] 图片灯箱 / 图注
- [ ] 脚注样式
- [ ] 代码块复制按钮、行号
- [ ] 打印样式

### V0.3.0 — 内容组织

- [ ] 系列文章（series）支持
- [ ] 相关文章推荐（按标签重合度）
- [ ] 标签云
- [ ] 分页（文章超过 20 篇时）
- [ ] 草稿预览命令

### V0.4.0 — 打磨

- [ ] OG 图片自动生成
- [ ] 站点地图分页（文章多时）
- [ ] 无障碍检查（对比度、键盘导航、语义标签）
- [ ] 性能预算（Lighthouse 目标：性能 ≥ 95）
- [ ] 404 页面

### 长期（按需）

- [ ] 评论（Giscus，基于 GitHub Discussions，免费）
- [ ] 访问统计（可选，注意隐私，默认不加）
- [ ] 全文搜索换 Pagefind（文章多时体积更优）

## 技术决策记录

| 决策 | 选择 | 理由 | 放弃的方案 |
|---|---|---|---|
| 框架 | Astro 7 | 默认零 JS、内容集合强类型、构建快 | Next.js（重）、Hugo（模板语言不熟） |
| 内容 | Markdown 文件 | 一个文件一篇，Git 管版本，编辑器随便换 | 数据库 / Headless CMS（维护成本） |
| 搜索 | 构建期 JSON + 前端匹配 | 零依赖、无外部服务、几十篇量级足够 | Algolia（要账号）、Pagefind（文章少时过重） |
| 样式 | 手写 CSS + CSS 变量 | 无构建步骤、无框架升级风险、体积极小 | Tailwind（多一层依赖） |
| 主题 | `data-theme` + CSS 变量 | 首屏内联脚本定主题，无闪白 | 媒体查询单独写一套（难维护） |
| 公式 | remark-math + rehype-katex | 构建期渲染成 HTML，无客户端 JS | MathJax（运行时渲染，慢） |
| 高亮 | Shiki（Astro 内置） | 构建期高亮，配色准 | Prism（需额外配置） |
| 部署 | GitHub Actions → Pages | 免费、推送即部署、无需服务器 | Vercel / Netlify（也能用，但多一个账号） |

## 目录结构

```
Blog/
├── .github/workflows/deploy.yml   # 自动部署
├── public/                        # 原样拷贝的静态资源
│   └── favicon.svg
├── src/
│   ├── content/blog/              # ← 文章都放这里
│   ├── content.config.ts          # 内容集合 schema
│   ├── layouts/BaseLayout.astro   # 全站骨架（head / 导航 / 页脚）
│   ├── pages/
│   │   ├── index.astro            # 首页
│   │   ├── about.astro            # 关于
│   │   ├── archive.astro          # 归档
│   │   ├── search.astro           # 搜索页
│   │   ├── search.json.js         # 搜索索引（构建期生成）
│   │   ├── rss.xml.js             # RSS
│   │   ├── blog/index.astro       # 文章列表
│   │   ├── blog/[slug].astro      # 文章详情
│   │   ├── categories/[category].astro
│   │   └── tags/[tag].astro
│   ├── styles/global.css          # 全站样式
│   ├── site.mjs                   # 站点配置（标题 / 导航 / 分类 / URL）
│   └── utils/
│       ├── posts.ts               # 文章查询与排序
│       └── url.ts                 # base 前缀处理
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 已知限制

- 搜索是**词面匹配**，不做分词与语义理解；文章量大后建议换 Pagefind。
- 标签与分类的中文会出现在 URL 里（已做 URL 编码，浏览器正常，但分享时链接较长）。
- GitHub Actions 首次部署需要在仓库 Settings 里把 Pages 的 Source 设为 **GitHub Actions**，否则不会生效。
