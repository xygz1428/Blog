import rss from '@astrojs/rss';
import { getAllPosts } from '../utils/posts';
import { SITE } from '../site.mjs';

export async function GET(context) {
  const posts = await getAllPosts();
  const base = import.meta.env.BASE_URL;

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `${base}blog/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
