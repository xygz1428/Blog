/**
 * 界面文案字典。新增语言：加一个 key，补齐全部字段。
 * 文章正文的翻译不在这里，在 src/content/blog/<locale>/ 下。
 */
export const LOCALES = ['zh-cn', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh-cn';

/** 语言切换器上显示的短标签 */
export const LOCALE_LABELS: Record<Locale, string> = {
  'zh-cn': '简',
  en: 'EN',
};

/** <html lang> 用的标准标签 */
export const HTML_LANG: Record<Locale, string> = {
  'zh-cn': 'zh-CN',
  en: 'en',
};

/**
 * 分类的显示名。
 * 键必须与 src/site.mjs 的 categories 一致（也是 frontmatter 里的枚举值），
 * 值是按语言展示的文案。
 */
export const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  'zh-cn': { 科研: '科研', 技术: '技术', 学习: '学习', 生活: '生活' },
  en: { 科研: 'Research', 技术: 'Engineering', 学习: 'Learning', 生活: 'Life' },
};

export const ui = {
  'zh-cn': {
    siteTagline: '记录科研、技术、学习与生活',
    siteDescription: 'Blog —— 一个用来记录科研、编程技术、学习笔记与生活随笔的个人博客。',
    navHome: '首页',
    navBlog: '文章',
    navArchive: '归档',
    navTags: '标签',
    navSearch: '搜索',
    navAbout: '关于',
    navGallery: '相册',
    navLinks: '友链',
    navDisclaimer: '免责声明',
    themeToggle: '切换深色/浅色模式',
    langToggle: '切换语言',
    latestPosts: '最新文章',
    allPosts: '查看全部文章',
    categories: '分类',
    postCount: (n: number) => `共 ${n} 篇`,
    readingTime: (n: number) => `${n} 分钟阅读`,
    updatedAt: '更新于',
    noPosts: '还没有文章。',
    prevPost: '上一篇',
    nextPost: '下一篇',
    toc: '目录',
    copyCode: '复制',
    copied: '已复制',
    backToTop: '回到顶部',
    searchPlaceholder: '搜索文章…',
    searchPrompt: '输入关键词开始搜索。',
    searchNoResults: (q: string) => `没有找到与「${q}」相关的文章。`,
    archiveTitle: '归档',
    archiveSubtitle: '按年月排列',
    tagsTitle: '标签',
    tagsSubtitle: (tags: number, uses: number) => `共 ${tags} 个标签 · ${uses} 次使用`,
    categoryTitle: '分类',
    notFoundTitle: '页面不存在',
    notFoundDesc: '这个页面不存在，或者已经搬走了。',
    notFoundBack: '回首页',
    noTranslation: '这篇文章暂无其他语言版本',
    footerRights: '保留所有权利',
    statVisits: '次访问',
    statVisitors: '位访客',
    statPage: '本页阅读',
    commentTitle: '留言',
    relatedTitle: '相关文章',
    commentNote: '留言基于 GitHub Discussions。你需要有 GitHub 账号，留言会同步到仓库的讨论区。',
    commentPending: '留言功能待配置：需要在 site.mjs 填入 giscus 的 repoId 与 categoryId。',
    commentStep1: '在仓库 Settings → General 里勾选 Discussions，新建一个名为 Comments 的分类。',
    commentStep2: '打开 giscus.app，填入仓库名，按提示安装 giscus App。',
    commentStep3: '把页面给出的 repoId 与 categoryId 填进 src/site.mjs，重新部署即可。',
  },
  en: {
    siteTagline: 'Notes on research, engineering, learning, and life',
    siteDescription: 'A personal blog about research, engineering practice, study notes, and everyday thoughts.',
    navHome: 'Home',
    navBlog: 'Writing',
    navArchive: 'Archive',
    navTags: 'Tags',
    navSearch: 'Search',
    navAbout: 'About',
    navGallery: 'Gallery',
    navLinks: 'Links',
    navDisclaimer: 'Disclaimer',
    themeToggle: 'Toggle dark / light mode',
    langToggle: 'Switch language',
    latestPosts: 'Latest posts',
    allPosts: 'All posts',
    categories: 'Categories',
    postCount: (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    readingTime: (n: number) => `${n} min read`,
    updatedAt: 'Updated',
    noPosts: 'No posts yet.',
    prevPost: 'Previous',
    nextPost: 'Next',
    toc: 'Contents',
    copyCode: 'Copy',
    copied: 'Copied',
    backToTop: 'Back to top',
    searchPlaceholder: 'Search posts…',
    searchPrompt: 'Type a keyword to start searching.',
    searchNoResults: (q: string) => `No posts found for “${q}”.`,
    archiveTitle: 'Archive',
    archiveSubtitle: 'Grouped by year and month',
    tagsTitle: 'Tags',
    tagsSubtitle: (tags: number, uses: number) => `${tags} tags · ${uses} uses`,
    categoryTitle: 'Category',
    notFoundTitle: 'Page not found',
    notFoundDesc: 'This page does not exist, or it has moved.',
    notFoundBack: 'Back to home',
    noTranslation: 'This post is not available in another language yet',
    footerRights: 'All rights reserved',
    statVisits: 'visits',
    statVisitors: 'visitors',
    statPage: 'on this page',
    commentTitle: 'Comments',
    relatedTitle: 'Related posts',
    commentNote: 'Comments are powered by GitHub Discussions. A GitHub account is required; they appear in the repository discussions.',
    commentPending: 'Comments are not configured yet: add giscus repoId and categoryId to site.mjs.',
    commentStep1: 'In the repo Settings → General, enable Discussions and create a category named Comments.',
    commentStep2: 'Open giscus.app, enter the repo name and install the giscus app.',
    commentStep3: 'Paste the repoId and categoryId into src/site.mjs and redeploy.',
  },
} as const;

export type Dict = (typeof ui)['zh-cn'];
