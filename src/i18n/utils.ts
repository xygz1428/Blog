import { ui, DEFAULT_LOCALE, LOCALES, type Locale, type Dict } from './ui';

/** 取当前语言的文案字典 */
export function t(locale: Locale): Dict {
  return (ui[locale] ?? ui[DEFAULT_LOCALE]) as Dict;
}

/** 生成带语言前缀的站内路径 */
export function localizedHref(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? `/${locale}/` : `/${locale}${clean}`;
}

/** 从路径里解析语言，默认 zh-cn */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  return (LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : DEFAULT_LOCALE;
}

/** 去掉语言前缀，得到语言无关的路径 */
export function stripLocale(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean);
  if (seg.length > 0 && (LOCALES as readonly string[]).includes(seg[0])) {
    return '/' + seg.slice(1).join('/');
  }
  return pathname;
}
