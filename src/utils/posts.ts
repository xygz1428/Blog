import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** 全部已发布文章，按日期倒序 */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** 按分类筛选 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.data.category === category);
}

/** 全部标签及计数，按出现次数倒序 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts();
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) map.set(tag, (map.get(tag) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** 各分类的文章数 */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const posts = await getAllPosts();
  const counts: Record<string, number> = {};
  for (const post of posts) {
    counts[post.data.category] = (counts[post.data.category] ?? 0) + 1;
  }
  return counts;
}

/** 按年份分组，用于归档页 */
export async function getPostsByYear(): Promise<{ year: number; posts: Post[] }[]> {
  const posts = await getAllPosts();
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
export function getNeighbors(posts: Post[], id: string) {
  const index = posts.findIndex((post) => post.id === id);
  return {
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

/** 统一格式：2026-11-26 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
