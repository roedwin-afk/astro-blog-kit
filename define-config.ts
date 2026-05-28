// ─────────────────────────────────────────────────────────────
// astro-blog-kit · define-config.ts
// Función helper para tipar la config del blog.
// ─────────────────────────────────────────────────────────────

import type { BlogKitConfig, BlogTheme } from "./types";

export interface BlogConfig {
  /** URL de tu WordPress. Ej: https://cms.tudominio.com */
  wpUrl: string;
  /** Posts por página. @default 5 */
  postsPerPage?: number;
  /** Layout por defecto. @default "magazine" */
  defaultLayout?: "grid" | "magazine" | "featured" | "cards";
  /** Locale por defecto. @default "en" */
  locale?: string;
  /** Tema visual */
  theme?: BlogTheme;
  /** Configuración de i18n */
  i18n?: {
    locales: string[];
    defaultLocale: string;
  };
}

/**
 * Define la configuración del blog con tipado completo.
 * Genera blog.config.ts en la raíz del proyecto.
 *
 * @example
 * ```ts
 * // blog.config.ts
 * import { defineBlogConfig } from 'astro-blog-kit';
 *
 * export default defineBlogConfig({
 *   wpUrl: 'https://cms.tudominio.com',
 *   postsPerPage: 5,
 *   defaultLayout: 'magazine',
 *   locale: 'en',
 *   theme: {
 *     accent: '#facc15',
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
    i18n: config.i18n,
  };
}