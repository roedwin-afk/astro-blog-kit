// ─────────────────────────────────────────────────────────────
// astro-blog-kit · index.ts
// Punto de entrada principal del paquete.
// Importa desde: 'astro-blog-kit'
// ─────────────────────────────────────────────────────────────

// Tipos
export type {
  BlogPost,
  BlogListLayout,
  BlogListProps,
  BlogPostProps,
  BlogTranslations,
  BlogKitConfig,
  I18nConfig,
  PaginationProps,
  PageStaticPath,
  PostStaticPath,
  BlogTheme,   // si no está
  BlogHero,
  BlogUI,
} from "./types";

// Utils
export {
  // i18n
  isI18nEnabled,
  getLang,
  useTranslations,
  getBlogBase,
  getPageBase,
  getDateLocale,
  // slug
  getStaticPathsForPosts,
  getStaticPathsForPages,
  toSlug,
  estimateReadingTime,
  getFeaturedImageUrl,
  // collections
  normalizeWPPost,
  sortPostsByDate,
  filterPostsByLang,
  preparePosts,
} from "./utils/index.js";

// Define config
export { defineBlogConfig, toBlogKitConfig, resolveHero, resolveUI } from "./define-config";
export type { BlogConfig } from "./define-config";