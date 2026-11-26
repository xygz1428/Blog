import rss from '@astrojs/rss';
import { render } from 'astro:content';
import { getAllPosts, postSlug } from '../utils/posts';
import { SITE } from '../site.mjs';

export async function GET(context) {
  const posts = await getAllPosts();

  // base 统一成「以斜杠结尾」，避免拼出 /Blogblog/ 这种地址
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '') + '/';
  const origin = (context.site ?? SITE.url).toString().replace(/\/+$/, '');

  // 把组件渲染成 HTML 字符串（不能直接 String(Content)，那会输出组件源码）
  const containerMod = await import('astro/container');
  const AstroContainer = containerMod.AstroContainer ?? containerMod.experimental_AstroContainer;
  const container = await AstroContainer.create();

  const items = [];
  for (const post of posts) {
    const { Content } = await render(post);
    let html = await container.renderToString(Content);

    // RSS 需要绝对地址，否则阅读器取不到图片与站内链接
    html = html.replaceAll(`src="${base}`, `src="${origin}${base}`);
    html = html.replaceAll(`href="${base}`, `href="${origin}${base}`);
    html = html.replaceAll('src="/', `src="${origin}/`);

    items.push({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `${base}blog/${postSlug(post)}/`,
      categories: [post.data.category, ...post.data.tags],
      content: html,
    });
  }

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: `<language>${SITE.lang}</language>`,
  });
}
