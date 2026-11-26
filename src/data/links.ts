export interface LinkItem {
  name: string;
  url: string;
  desc: string;
  /** 卡片左侧色块里的字，取名字首字 */
  badge?: string;
}

/** 友链：互相链接的站点 */
export const friends: LinkItem[] = [
  {
    name: '集知盒子',
    url: 'https://www.jizhihezi.com/',
    desc: '一个集学习、办公、娱乐于一体的免费资源导航站。',
  },
];

/** 参考站点：本站设计与写作的学习来源 */
export const references: LinkItem[] = [
  {
    name: 'darkkandaomaster',
    url: 'https://darkkandaomaster.com/',
    desc: '暖纸配色与克制排版的参考。',
  },
  {
    name: 'nathanchen.me',
    url: 'https://nathanchen.me/',
    desc: '单列窄容器、衬线 18px 的极简写法。',
  },
  {
    name: 'gwern.net',
    url: 'https://gwern.net/',
    desc: '信息密度与学术脚注的极致。',
  },
  {
    name: 'jvns.ca',
    url: 'https://jvns.ca/',
    desc: '纯文章、零装饰的技术博客。',
  },
];

/** 图片来源 */
export const imageSources: LinkItem[] = [
  {
    name: 'Openverse',
    url: 'https://openverse.org/',
    desc: 'CC 授权图片检索，本站配图的主要来源。',
  },
  {
    name: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/',
    desc: '自由授权的多媒体库。',
  },
];

/** 壁纸资源：只放链接，不搬运图片（版权归各站） */
export const wallpaperSources: LinkItem[] = [
  {
    name: '哲风壁纸',
    url: 'https://haowallpaper.com/',
    desc: '免费 4K 高清壁纸站，图片版权归原作者，仅供个人使用。',
  },
  {
    name: '4KDesk',
    url: 'https://www.4kdesk.com/',
    desc: '4K 桌面壁纸站，站点保留版权，请遵守其版权声明。',
  },
  {
    name: '必应每日壁纸',
    url: 'https://www.bing.com/',
    desc: '微软每日壁纸，图片授权方各异，不建议再分发。',
  },
];