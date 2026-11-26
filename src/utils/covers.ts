import type { ImageMetadata } from 'astro';

/**
 * 文章封面：frontmatter 里只写文件名（如 `cover-hello-astro.jpg`），
 * 这里用 glob 映射成 ImageMetadata，交给 <Image> 做优化与哈希。
 *
 * 除了 src/content/blog/images/，也接受 src/assets/gallery/ 里的图片，
 * 这样图集里的闲置图可以直接拿来当封面，避免同一张图反复使用。
 */
const blogImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/blog/images/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

const galleryImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/gallery/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(blogImages)) {
  const name = path.split('/').pop();
  if (name) byName.set(name, mod.default);
}
for (const [path, mod] of Object.entries(galleryImages)) {
  const name = path.split('/').pop();
  if (name && !byName.has(name)) byName.set(name, mod.default);
}

export function getCover(name?: string): ImageMetadata | undefined {
  if (!name) return undefined;
  return byName.get(name);
}

/** 供构建期检查用：返回所有可用封面名 */
export function coverNames(): string[] {
  return [...byName.keys()];
}
