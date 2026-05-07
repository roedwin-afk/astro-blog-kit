// ─────────────────────────────────────────────────────────────
// astro-blog-kit · utils/index.ts
// Punto de entrada de todas las utilidades.
// Importa desde: 'astro-blog-kit/utils'
// ─────────────────────────────────────────────────────────────

export {
  isI18nEnabled,
  getLang,
  useTranslations,
  getBlogBase,
  getPageBase,
  getDateLocale,
} from "./i18n";

export {
  getStaticPathsForPosts,
  getStaticPathsForPages,
  toSlug,
  estimateReadingTime,
  getFeaturedImageUrl,
} from "./slug";

export {
  normalizeWPPost,
  sortPostsByDate,
  filterPostsByLang,
  preparePosts,
} from "./collections";

export {
  createWPClient,
} from "./wordpress";

export type {
  WPComment,
  WPCategory,
  WPTag,
  FetchPostsOptions,
  SubmitCommentPayload,
} from "./wordpress";