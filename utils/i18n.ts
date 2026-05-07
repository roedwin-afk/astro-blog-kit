// ─────────────────────────────────────────────────────────────
// astro-blog-kit · utils/i18n.ts
// ─────────────────────────────────────────────────────────────

import type { BlogKitConfig, BlogTranslations, I18nConfig } from "../types";

// ── Helper interno ────────────────────────────────────────────

/**
 * Determina si i18n está habilitado en la config del paquete.
 */
export function isI18nEnabled(
  config?: BlogKitConfig
): config is BlogKitConfig & { i18n: I18nConfig } {
  return Array.isArray(config?.i18n?.locales) && config.i18n.locales.length > 0;
}

// ── getLang ───────────────────────────────────────────────────

/**
 * Extrae el locale activo de la URL actual.
 * Si i18n no está activo, devuelve el defaultLocale.
 *
 * @example
 * getLang(Astro.url, import.meta.env.BASE_URL, config) // → 'es'
 */
export function getLang(
  url: URL,
  base: string,
  config?: BlogKitConfig
): string {
  const defaultLocale = config?.i18n?.defaultLocale ?? "en";

  if (!isI18nEnabled(config)) {
    return defaultLocale;
  }

  const basePath = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathname = url.pathname.replace(basePath, "") || "/";
  const segments = pathname.split("/").filter(Boolean);
  const candidate = segments[0];

  if (candidate && config.i18n.locales.includes(candidate)) {
    return candidate;
  }

  return defaultLocale;
}

// ── useTranslations ───────────────────────────────────────────

/**
 * Devuelve el objeto de traducciones para el locale dado.
 *
 * @example
 * const t = useTranslations('es', { en, es });
 */
export function useTranslations<T extends BlogTranslations>(
  lang: string,
  translations: Record<string, T>,
  fallbackLang = "en"
): T {
  return (
    translations[lang] ??
    translations[fallbackLang] ??
    Object.values(translations)[0]
  );
}

// ── URL helpers ───────────────────────────────────────────────

/**
 * Devuelve la URL base del blog para el locale actual.
 *
 * - Sin i18n:              /blog/
 * - Con i18n + default:    /blog/
 * - Con i18n + otro lang:  /es/blog/
 */
export function getBlogBase(
  lang: string,
  base: string,
  config?: BlogKitConfig
): string {
  const b = base.endsWith("/") ? base : `${base}/`;

  if (!isI18nEnabled(config)) {
    return `${b}blog/`;
  }

  const isDefault = lang === config.i18n.defaultLocale;
  return isDefault ? `${b}blog/` : `${b}${lang}/blog/`;
}

/**
 * Devuelve la URL base de paginación para el locale actual.
 *
 * @example
 * getPageBase('es', '/', config) // → '/es/blog/page/'
 */
export function getPageBase(
  lang: string,
  base: string,
  config?: BlogKitConfig
): string {
  return `${getBlogBase(lang, base, config)}page/`;
}

/**
 * Devuelve el locale BCP 47 para toLocaleDateString.
 *
 * @example
 * getDateLocale('es') // → 'es-US'
 */
export function getDateLocale(
  lang: string,
  map?: Record<string, string>
): string {
  const defaults: Record<string, string> = {
    en: "en-US",
    es: "es-US",
    fr: "fr-FR",
    de: "de-DE",
    pt: "pt-BR",
    it: "it-IT",
  };

  const merged = { ...defaults, ...map };
  return merged[lang] ?? `${lang}-${lang.toUpperCase()}`;
}