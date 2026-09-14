import { ui, defaultLang } from '@/i18n/languages.json';

export function getLangFromUrl(url: URL) {
  const base = import.meta.env.BASE_URL;
  const pathname = url.pathname.startsWith(base)
    ? url.pathname.slice(base.length - 1)
    : url.pathname;
  const [, lang] = pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
