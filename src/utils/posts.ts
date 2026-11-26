import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, type Locale } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;

/** 文章 id 形如 `zh-cn/hello-astro`，第一段是语言 */
export function postLocale(post: Post): Locale {
  return post.id.split('/')[0] as Locale;
}

/** 去掉语言前缀后的 slug，用于生成 URL */
export function postSlug(post: Post): string {
  return post.id.split('/').slice(1).join('/');
}

/** 全部已发布文章，可按语言过滤，按日期倒序 */
export async function getAllPosts(locale: Locale = DEFAULT_LOCALE): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data, id }) => {
    if (data.draft) return false;
    return id.split('/')[0] === locale;
  });
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** 按分类筛选 */
export async function getPostsByCategory(category: string, locale: Locale = DEFAULT_LOCALE): Promise<Post[]> {
  const posts = await getAllPosts(locale);
  return posts.filter((post) => post.data.category === category);
}

/** 全部标签及计数，按出现次数倒序 */
export async function getAllTags(locale: Locale = DEFAULT_LOCALE): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts(locale);
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) map.set(tag, (map.get(tag) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** 各分类的文章数 */
export async function getCategoryCounts(locale: Locale = DEFAULT_LOCALE): Promise<Record<string, number>> {
  const posts = await getAllPosts(locale);
  const counts: Record<string, number> = {};
  for (const post of posts) {
    counts[post.data.category] = (counts[post.data.category] ?? 0) + 1;
  }
  return counts;
}

/** 按年份分组，用于归档页 */
export async function getPostsByYear(locale: Locale = DEFAULT_LOCALE): Promise<{ year: number; posts: Post[] }[]> {
  const posts = await getAllPosts(locale);
  const map = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.pubDate.getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(post);
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, posts: list }));
}

/** 上一篇 / 下一篇（按时间顺序） */
export function getNeighbors(posts: Post[], slug: string) {
  const index = posts.findIndex((post) => postSlug(post) === slug);
  return {
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

/** 同一篇文章在其他语言下的版本（用于语言切换与 hreflang） */
export async function getTranslations(slug: string): Promise<{ locale: Locale; slug: string }[]> {
  const all = await getCollection('blog', ({ data }) => !data.draft);
  return all
    .filter((post) => postSlug(post) === slug)
    .map((post) => ({ locale: postLocale(post), slug: postSlug(post) }));
}

/** 统一格式：2026-11-26 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 估算阅读时长（分钟）。
 * 中文按 350 字/分钟，英文按 220 词/分钟，代码块不计入。
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const text = body.replace(/```[\s\S]*?```/g, ' ');
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const latin = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9_]+/g) ?? []).length;
  const minutes = cjk / 350 + latin / 220;
  return Math.max(1, Math.round(minutes));
}
