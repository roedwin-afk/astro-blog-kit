// ─────────────────────────────────────────────────────────────
// astro-blog-kit · types.ts
// ─────────────────────────────────────────────────────────────

// ── Post ──────────────────────────────────────────────────────

/**
 * Forma normalizada de un post de blog.
 * Compatible con WordPress REST API (_embedded).
 */
export interface BlogPost {
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

export type BlogListLayout = "grid" | "list" | "magazine";

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

// ── Config del paquete ────────────────────────────────────────

export interface BlogKitConfig {
  /** @default 5 */
  postsPerPage?: number;
  i18n?: I18nConfig;
  /** @default "magazine" */
  defaultLayout?: BlogListLayout;
  /** @default "blog" */
  collectionName?: string;
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