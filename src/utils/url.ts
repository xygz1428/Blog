/**
 * 路径工具：处理 GitHub Pages 的 base 前缀。
 *
 * 部署到项目仓库（如 /Blog）时，手写的 href 不会自动加前缀，
 * 所以统一用 withBase() 包一层。
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** '/blog' → '/Blog/blog'；已是外链或锚点则原样返回 */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  if (path === '/') return BASE === '' ? '/' : `${BASE}/`;
  return `${BASE}${path}`;
}

/** 去掉 base 前缀，用于比较当前路径 */
export function stripBase(pathname: string): string {
  if (BASE === '') return pathname;
  return pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname;
}
