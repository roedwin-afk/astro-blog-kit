// ─────────────────────────────────────────────────────────────
// astro-blog-kit · define-config.ts
// ─────────────────────────────────────────────────────────────

import type { BlogKitConfig, BlogTheme, BlogHero, BlogUI } from "./types";

export interface BlogConfig {
  /** URL de tu WordPress. Ej: https://cms.tudominio.com */
  wpUrl: string;
  /** Posts por página. @default 5 */
  postsPerPage?: number;
  /** Layout por defecto. @default "magazine" */
  defaultLayout?: "grid" | "magazine" | "featured" | "cards";
  /** Locale por defecto. @default "en" */
  locale?: string;
  /** Tema visual (colores, fuentes, tamaños) */
  theme?: BlogTheme;
  /** Textos del hero/header del blog */
  hero?: BlogHero;
  /** Overrides de UI (botones, paginación, labels) */
  ui?: BlogUI;
  /** Configuración de i18n */
  i18n?: {
    locales: string[];
    defaultLocale: string;
  };
}

/**
 * Define la configuración del blog con tipado completo.
 *
 * @example
 * ```ts
 * // blog.config.ts
 * import { defineBlogConfig } from 'astro-blog-kit';
 *
 * export default defineBlogConfig({
 *   wpUrl: 'https://cms.tudominio.com',
 *   postsPerPage: 5,
 *   defaultLayout: 'featured',
 *   locale: 'en',
 *   theme: {
 *     accent: '#facc15',
 *     background: '#0a1a0a',
 *     text: '#ffffff',
 *   },
 *   hero: {
 *     tagline: 'Technical Resources',
 *     titleLine1: 'Building',
 *     titleLine2: 'Insights',
 *     description: 'Practical knowledge for architects and engineers.',
 *   },
 *   ui: {
 *     readMoreLabel: 'Read more →',
 *     btnPrev: 'Previous',
 *     btnNext: 'Next',
 *     commentButtonColor: '#facc15',
 *     commentButtonTextColor: '#0a0a0a',
 *     paginationStyle: 'minimal',
 *   },
 * });
 * ```
 */
export function defineBlogConfig(config: BlogConfig): BlogConfig {
  return {
    postsPerPage: 5,
    defaultLayout: "magazine",
    locale: "en",
    ...config,
  };
}

/**
 * Convierte BlogConfig a BlogKitConfig para usar en astro.config.mjs
 */
export function toBlogKitConfig(config: BlogConfig): BlogKitConfig {
  return {
    postsPerPage: config.postsPerPage,
    defaultLayout: config.defaultLayout,
    theme: config.theme,
    hero: config.hero,
    ui: config.ui,
    i18n: config.i18n,
  };
}

/**
 * Resuelve los textos del hero con fallbacks según el locale.
 * Usado internamente por BlogList.astro
 */
export function resolveHero(
  hero: BlogHero | undefined,
  locale: string
): Required<BlogHero> {
  const defaults: Record<string, Required<BlogHero>> = {
    en: {
      tagline: "Our Blog",
      titleLine1: "Latest",
      titleLine2: "Articles",
      description: "Welcome to our blog.",
    },
    es: {
      tagline: "Nuestro Blog",
      titleLine1: "Últimos",
      titleLine2: "Artículos",
      description: "Bienvenido a nuestro blog.",
    },
  };

  const d = defaults[locale] ?? defaults["en"];

  return {
    tagline: hero?.tagline ?? d.tagline,
    titleLine1: hero?.titleLine1 ?? d.titleLine1,
    titleLine2: hero?.titleLine2 ?? d.titleLine2,
    description: hero?.description ?? d.description,
  };
}

/**
 * Resuelve los labels de UI con fallbacks según el locale.
 * Usado internamente por BlogList.astro y Pagination.astro
 */
export function resolveUI(
  ui: BlogUI | undefined,
  locale: string
): Required<BlogUI> {
  const defaults: Record<string, Required<BlogUI>> = {
    en: {
      readMoreLabel: "Read more →",
      btnPrev: "Previous",
      btnNext: "Next",
      commentButtonColor: "var(--bk-accent)",
      commentButtonTextColor: "var(--bk-black)",
      paginationStyle: "minimal",
    },
    es: {
      readMoreLabel: "Leer más →",
      btnPrev: "Anterior",
      btnNext: "Siguiente",
      commentButtonColor: "var(--bk-accent)",
      commentButtonTextColor: "var(--bk-black)",
      paginationStyle: "minimal",
    },
  };

  const d = defaults[locale] ?? defaults["en"];

  return {
    readMoreLabel: ui?.readMoreLabel ?? d.readMoreLabel,
    btnPrev: ui?.btnPrev ?? d.btnPrev,
    btnNext: ui?.btnNext ?? d.btnNext,
    commentButtonColor: ui?.commentButtonColor ?? d.commentButtonColor,
    commentButtonTextColor: ui?.commentButtonTextColor ?? d.commentButtonTextColor,
    paginationStyle: ui?.paginationStyle ?? d.paginationStyle,
  };
}