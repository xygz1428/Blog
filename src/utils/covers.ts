import type { ImageMetadata } from 'astro';

/**
 * 文章封面：frontmatter 里只写文件名（如 `cover-hello-astro.jpg`），
 * 这里用 glob 映射成 ImageMetadata，交给 <Image> 做优化与哈希。
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/blog/images/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const name = path.split('/').pop();
  if (name) byName.set(name, mod.default);
}

export function getCover(name?: string): ImageMetadata | undefined {
  if (!name) return undefined;
  return byName.get(name);
}
