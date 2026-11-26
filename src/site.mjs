/**
 * 站点配置：改这里就能改全站，不用翻每个页面。
 *
 * 部署到 GitHub Pages 时重点改两处：
 *   url  —— 你的站点地址
 *   base —— 用户主页仓库（<username>.github.io）填 '/'；项目仓库填 '/<repo>'
 */
export const SITE = {
  title: 'Blog',
  // 副标题会显示在首页与页脚
  tagline: '记录科研、技术、学习与生活',
  description: 'Blog —— 一个用来记录科研、编程技术、学习笔记与生活随笔的个人博客。',
  author: 'Blog',
  lang: 'zh-CN',

  // 部署前替换成你自己的地址。当前按「项目仓库 Blog」配置：
  //   仓库地址 https://github.com/xygz1428/Blog
  //   站点地址 https://xygz1428.github.io/Blog
  // 若改用「用户主页仓库」（仓库名必须是 xygz1428.github.io），则 base 改为 '/'
  url: 'https://xygz1428.github.io',
  base: '/Blog',

  // 分类固定为这四类，与文章 frontmatter 的 category 对应
  categories: ['科研', '技术', '学习', '生活'],

  nav: [
    { label: '首页', href: '/' },
    { label: '文章', href: '/blog' },
    { label: '归档', href: '/archive' },
    { label: '标签', href: '/tags' },
    { label: '搜索', href: '/search' },
    { label: '关于', href: '/about' },
  ],

  // 每页文章数
  pageSize: 10,
};
