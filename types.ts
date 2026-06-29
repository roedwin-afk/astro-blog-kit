// ─────────────────────────────────────────────────────────────
// astro-blog-kit · types.ts
// ─────────────────────────────────────────────────────────────

export interface BlogPost {
  id?: number;
  slug: string;
  date: string;
  modified?: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text?: string }>;
    "wp:term"?: { id: number; name: string; slug: string }[][];
  };
  heroImage?: string;
  lang?: string;
  tags?: string[];
  readingTime?: number;
}

export type BlogListLayout = "grid" | "magazine" | "featured" | "cards";

export interface I18nConfig {
  locales: string[];
  defaultLocale: string;
}

export interface BlogTranslations {
  blog: {
    tagline:     string;
    title_line1: string;
    title_line2: string;
    description: string;
    btncta:      string;
    btn_prev:    string;
    btn_next:    string;
  };
}

export interface PaginationProps {
  currentPage: number;
  totalPages:  number;
  basePath:    string;
  blogBase:    string;
  t:           BlogTranslations;
}

export interface BlogListProps {
  posts:       BlogPost[];
  currentPage: number;
  totalPages:  number;
  basePath:    string;
  blogBase:    string;
  dateLocale:  string;
  t:           BlogTranslations;
  locale:      string;
  layout?:     BlogListLayout;
}

export interface BlogPostProps {
  post: BlogPost;
  t:    BlogTranslations;
  lang: string;
}

// ── Theme ─────────────────────────────────────────────────────

export interface BlogTheme {
  accent?:       string;
  background?:   string;
  surface?:      string;
  text?:         string;
  muted?:        string;
  mutedLight?:   string;
  border?:       string;
  black?:        string;
  white?:        string;
  fontHeading?:  string;
  fontBody?:     string;
  fontMono?:     string;
  fontDisplay?:  string;
  containerMax?: string;
}

// ── Hero ──────────────────────────────────────────────────────

/** Textos del hero para un único locale */
export interface BlogHeroLocale {
  tagline?:     string;
  titleLine1?:  string;
  titleLine2?:  string;
  description?: string;
}

/**
 * Acepta dos formatos:
 * - Plano (sitio monolingüe):  { tagline: 'Our Blog', ... }
 * - Por locale (sitio i18n):   { en: { tagline: 'Our Blog' }, es: { tagline: 'Nuestro Blog' } }
 */
export type BlogHero = BlogHeroLocale | Record<string, BlogHeroLocale>;

// ── UI ────────────────────────────────────────────────────────

/** Labels y colores de UI para un único locale */
export interface BlogUILocale {
  /** Texto del botón "leer más". @default "Read more →" */
  readMoreLabel?:          string;
  /** Texto del botón de página anterior. @default "Previous" */
  btnPrev?:                string;
  /** Texto del botón de página siguiente. @default "Next" */
  btnNext?:                string;
  /** Color de fondo del botón de comentarios. @default var(--bk-accent) */
  commentButtonColor?:     string;
  /** Color del texto del botón de comentarios. @default var(--bk-black) */
  commentButtonTextColor?: string;
  /** Estilo de paginación. @default "minimal" */
  paginationStyle?:        "minimal" | "numbered";
  /** Fondo botones PREV/NEXT. @default var(--bk-accent) */
  paginationBtnBg?:        string;
  /** Texto botones PREV/NEXT. @default var(--bk-black) */
  paginationBtnText?:      string;
  /** Fondo botones PREV/NEXT en hover. @default var(--bk-text) */
  paginationBtnHoverBg?:   string;
  /** Texto botones PREV/NEXT en hover. @default var(--bk-white) */
  paginationBtnHoverText?: string;
  /** Fondo página activa. @default var(--bk-accent) */
  paginationActiveBg?:     string;
  /** Texto página activa. @default var(--bk-black) */
  paginationActiveText?:   string;
}

/**
 * Acepta dos formatos:
 * - Plano (sitio monolingüe):  { readMoreLabel: 'Read more', ... }
 * - Por locale (sitio i18n):   { en: { readMoreLabel: 'Read more' }, es: { readMoreLabel: 'Leer más' } }
 *
 * Nota: los campos visuales (colores, paginationStyle) son compartidos entre locales.
 * Ponlos en cualquier locale (ej. `en`) — el resolver los tomará como fallback global.
 */
export type BlogUI = BlogUILocale | Record<string, BlogUILocale>;

// ── Alias para backward compat ────────────────────────────────
/** @deprecated Usa BlogHeroLocale */
export type { BlogHeroLocale as BlogHeroFlat };
/** @deprecated Usa BlogUILocale */
export type { BlogUILocale as BlogUIFlat };

// ── BlogKitConfig (integration.ts) ───────────────────────────

export interface BlogKitConfig {
  postsPerPage?:   number;
  i18n?:           I18nConfig;
  defaultLayout?:  BlogListLayout;
  collectionName?: string;
  theme?:          BlogTheme;
  hero?:           BlogHero;
  ui?:             BlogUI;
}

// ── Static paths ──────────────────────────────────────────────

export interface PageStaticPath {
  params: { page: string };
  props:  { posts: BlogPost[]; currentPage: number; totalPages: number };
}

export interface PostStaticPath {
  params: { slug: string };
  props:  { post: BlogPost };
}