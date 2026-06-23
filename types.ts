// ─────────────────────────────────────────────────────────────
// astro-blog-kit · types.ts
// ─────────────────────────────────────────────────────────────

// ── Post ──────────────────────────────────────────────────────

export interface BlogPost {
  id?: number;
  slug: string;
  date: string;
  modified?: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
    "wp:term"?: {
      id: number;
      name: string;
      slug: string;
    }[][];
  };
  heroImage?: string;
  lang?: string;
  tags?: string[];
  readingTime?: number;
}

// ── Layouts ───────────────────────────────────────────────────

export type BlogListLayout = "grid" | "magazine" | "featured" | "cards";

// ── i18n ──────────────────────────────────────────────────────

export interface I18nConfig {
  locales: string[];
  defaultLocale: string;
}

export interface BlogTranslations {
  blog: {
    tagline: string;
    title_line1: string;
    title_line2: string;
    description: string;
    btncta: string;
    btn_prev: string;
    btn_next: string;
  };
}

// ── Paginación ────────────────────────────────────────────────

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  blogBase: string;
  t: BlogTranslations;
}

// ── BlogList ──────────────────────────────────────────────────

export interface BlogListProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  blogBase: string;
  dateLocale: string;
  t: BlogTranslations;
  locale: string;
  /** @default "magazine" */
  layout?: BlogListLayout;
}

// ── BlogPost componente ───────────────────────────────────────

export interface BlogPostProps {
  post: BlogPost;
  t: BlogTranslations;
  lang: string;
}

// ── Tema ──────────────────────────────────────────────────────

export interface BlogTheme {
  /** Color de acento principal. @default "#facc15" */
  accent?: string;
  /** Color de fondo. @default "#ffffff" */
  background?: string;
  /** Color de superficie (cards, sidebars). @default "#f8f8f8" */
  surface?: string;
  /** Color de texto principal. @default "#0a0a0a" */
  text?: string;
  /** Color de texto secundario. @default "#6b7280" */
  muted?: string;
  /** Color de texto secundario claro. @default "#9ca3af" */
  mutedLight?: string;
  /** Color de bordes. @default "#e5e7eb" */
  border?: string;
  /** Color negro para layouts. @default "#0a0a0a" */
  black?: string;
  /** Color blanco para layouts. @default "#ffffff" */
  white?: string;
  /** Fuente de títulos. @default "Georgia, serif" */
  fontHeading?: string;
  /** Fuente de cuerpo. @default "system-ui, sans-serif" */
  fontBody?: string;
  /** Fuente monospace. @default "monospace" */
  fontMono?: string;
  /** Fuente display (títulos grandes). @default "Georgia, serif" */
  fontDisplay?: string;
  /** Ancho máximo del contenedor. @default "1200px" */
  containerMax?: string;
}

// ── Hero del blog ─────────────────────────────────────────────

export interface BlogHero {
  /** Texto del badge superior. @default "Our Blog" */
  tagline?: string;
  /** Primera línea del título. @default "Latest" */
  titleLine1?: string;
  /** Segunda línea del título (resaltada). @default "Articles" */
  titleLine2?: string;
  /** Párrafo descriptivo debajo del título. @default "Welcome to our blog." */
  description?: string;
}

// ── UI overrides ──────────────────────────────────────────────

export interface BlogUI {
  /** Texto del botón "leer más". @default "Read more →" */
  readMoreLabel?: string;
  /** Texto del botón de página anterior. @default "Previous" */
  btnPrev?: string;
  /** Texto del botón de página siguiente. @default "Next" */
  btnNext?: string;
  /** Color de fondo del botón de comentarios. @default var(--bk-accent) */
  commentButtonColor?: string;
  /** Color del texto del botón de comentarios. @default var(--bk-black) */
  commentButtonTextColor?: string;
  /** Estilo de paginación. @default "minimal" */
  paginationStyle?: "minimal" | "numbered";
}

// ── Config del paquete ────────────────────────────────────────

export interface BlogKitConfig {
  /** @default 5 */
  postsPerPage?: number;
  i18n?: I18nConfig;
  /** @default "magazine" */
  defaultLayout?: BlogListLayout;
  /** @default "blog" */
  collectionName?: string;
  /** Tema visual del blog */
  theme?: BlogTheme;
  /** Textos del hero/header del blog */
  hero?: BlogHero;
  /** Overrides de UI (botones, paginación, labels) */
  ui?: BlogUI;
}

// ── getStaticPaths ────────────────────────────────────────────

export interface PageStaticPath {
  params: { page: string };
  props: {
    posts: BlogPost[];
    currentPage: number;
    totalPages: number;
  };
}

export interface PostStaticPath {
  params: { slug: string };
  props: { post: BlogPost };
}