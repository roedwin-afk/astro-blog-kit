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
    tagline: string;
    title_line1: string;
    title_line2: string;
    description: string;
    btncta: string;
    btn_prev: string;
    btn_next: string;
  };
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  blogBase: string;
  t: BlogTranslations;
}

export interface BlogListProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  blogBase: string;
  dateLocale: string;
  t: BlogTranslations;
  locale: string;
  layout?: BlogListLayout;
}

export interface BlogPostProps {
  post: BlogPost;
  t: BlogTranslations;
  lang: string;
}

export interface BlogTheme {
  accent?: string;
  background?: string;
  surface?: string;
  text?: string;
  muted?: string;
  mutedLight?: string;
  border?: string;
  black?: string;
  white?: string;
  fontHeading?: string;
  fontBody?: string;
  fontMono?: string;
  fontDisplay?: string;
  containerMax?: string;
}

export interface BlogHero {
  tagline?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
}

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
  /** Fondo botones PREV/NEXT. @default accent */
  paginationBtnBg?: string;
  /** Texto botones PREV/NEXT. @default black */
  paginationBtnText?: string;
  /** Fondo botones PREV/NEXT en hover. @default text */
  paginationBtnHoverBg?: string;
  /** Texto botones PREV/NEXT en hover. @default white */
  paginationBtnHoverText?: string;
  /** Fondo página activa. @default accent */
  paginationActiveBg?: string;
  /** Texto página activa. @default black */
  paginationActiveText?: string;
}

export interface BlogKitConfig {
  postsPerPage?: number;
  i18n?: I18nConfig;
  defaultLayout?: BlogListLayout;
  collectionName?: string;
  theme?: BlogTheme;
  hero?: BlogHero;
  ui?: BlogUI;
}

export interface PageStaticPath {
  params: { page: string };
  props: { posts: BlogPost[]; currentPage: number; totalPages: number };
}

export interface PostStaticPath {
  params: { slug: string };
  props: { post: BlogPost };
}