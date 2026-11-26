import { getAllPosts, formatDate } from '../utils/posts';

/**
 * 构建期生成搜索索引。前端按需拉取，无需任何搜索服务。
 */
export async function GET() {
  const posts = await getAllPosts();
  const base = import.meta.env.BASE_URL;

  const index = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    date: formatDate(post.data.pubDate),
    url: `${base}blog/${post.id}/`,
    // 正文纯文本，供关键词匹配（截断以控制体积）
    body: (post.body ?? '').replace(/```[\s\S]*?```/g, ' ').replace(/[#>*`_\-]/g, ' ').slice(0, 2000),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
