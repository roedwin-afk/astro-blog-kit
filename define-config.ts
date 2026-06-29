// ─────────────────────────────────────────────────────────────
// astro-blog-kit · define-config.ts
// ─────────────────────────────────────────────────────────────

import type {
  BlogKitConfig,
  BlogTheme,
  BlogHero,
  BlogHeroLocale,
  BlogUI,
  BlogUILocale,
} from "./types";

// ── Interfaces públicas ───────────────────────────────────────

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

// ── defineBlogConfig ──────────────────────────────────────────

export function defineBlogConfig(config: BlogConfig): BlogConfig {
  return {
    postsPerPage:  5,
    defaultLayout: "magazine",
    locale:        "en",
    ...config,
  };
}

// ── toBlogKitConfig ───────────────────────────────────────────

export function toBlogKitConfig(config: BlogConfig): BlogKitConfig {
  return {
    postsPerPage:  config.postsPerPage,
    defaultLayout: config.defaultLayout,
    theme:         config.theme,
    hero:          config.hero,
    ui:            config.ui,
    i18n:          config.i18n,
  };
}

// ── Helpers de detección de formato ──────────────────────────

function isHeroI18n(hero: BlogHero): hero is Record<string, BlogHeroLocale> {
  return typeof hero === "object" &&
    Object.values(hero).some((v) => typeof v === "object" && v !== null);
}

function isUIi18n(ui: BlogUI): ui is Record<string, BlogUILocale> {
  return typeof ui === "object" &&
    Object.values(ui).some((v) => typeof v === "object" && v !== null);
}

// ── Defaults internos ─────────────────────────────────────────

const HERO_DEFAULTS: Record<string, Required<BlogHeroLocale>> = {
  en: {
    tagline:     "Our Blog",
    titleLine1:  "Latest",
    titleLine2:  "Articles",
    description: "Welcome to our blog.",
  },
  es: {
    tagline:     "Nuestro Blog",
    titleLine1:  "Últimos",
    titleLine2:  "Artículos",
    description: "Bienvenido a nuestro blog.",
  },
};

const UI_DEFAULTS: Record<string, Required<BlogUILocale>> = {
  en: {
    readMoreLabel:          "Read more →",
    btnPrev:                "Previous",
    btnNext:                "Next",
    commentButtonColor:     "var(--bk-accent)",
    commentButtonTextColor: "var(--bk-black)",
    paginationStyle:        "minimal",
    paginationBtnBg:        "var(--bk-accent)",
    paginationBtnText:      "var(--bk-black)",
    paginationBtnHoverBg:   "var(--bk-text)",
    paginationBtnHoverText: "var(--bk-white)",
    paginationActiveBg:     "var(--bk-accent)",
    paginationActiveText:   "var(--bk-black)",
  },
  es: {
    readMoreLabel:          "Leer más →",
    btnPrev:                "Anterior",
    btnNext:                "Siguiente",
    commentButtonColor:     "var(--bk-accent)",
    commentButtonTextColor: "var(--bk-black)",
    paginationStyle:        "minimal",
    paginationBtnBg:        "var(--bk-accent)",
    paginationBtnText:      "var(--bk-black)",
    paginationBtnHoverBg:   "var(--bk-text)",
    paginationBtnHoverText: "var(--bk-white)",
    paginationActiveBg:     "var(--bk-accent)",
    paginationActiveText:   "var(--bk-black)",
  },
};

// ── resolveHero ───────────────────────────────────────────────

export function resolveHero(
  hero: BlogHero | undefined,
  locale: string
): Required<BlogHeroLocale> {
  const d = HERO_DEFAULTS[locale] ?? HERO_DEFAULTS["en"];

  if (!hero) return d;

  if (isHeroI18n(hero)) {
    // Formato i18n: busca locale exacto → fallback 'en' → defaults internos
    const src = hero[locale] ?? hero["en"] ?? {};
    return {
      tagline:     src.tagline     ?? d.tagline,
      titleLine1:  src.titleLine1  ?? d.titleLine1,
      titleLine2:  src.titleLine2  ?? d.titleLine2,
      description: src.description ?? d.description,
    };
  }

  // Formato plano legacy — backward compatible
  const flat = hero as BlogHeroLocale;
  return {
    tagline:     flat.tagline     ?? d.tagline,
    titleLine1:  flat.titleLine1  ?? d.titleLine1,
    titleLine2:  flat.titleLine2  ?? d.titleLine2,
    description: flat.description ?? d.description,
  };
}

// ── resolveUI ─────────────────────────────────────────────────

export function resolveUI(
  ui: BlogUI | undefined,
  locale: string
): Required<BlogUILocale> {
  const d = UI_DEFAULTS[locale] ?? UI_DEFAULTS["en"];

  if (!ui) return d;

  if (isUIi18n(ui)) {
    // Campos visuales (colores) viven en cualquier locale; los buscamos
    // en todos los locales disponibles para usarlos como fallback compartido.
    const allLocales = Object.values(ui as Record<string, BlogUILocale>);
    const visual = allLocales.find((v) => v.paginationBtnBg) ?? {};

    const src = (ui as Record<string, BlogUILocale>)[locale] ??
                (ui as Record<string, BlogUILocale>)["en"] ?? {};

    return {
      readMoreLabel:          src.readMoreLabel          ?? d.readMoreLabel,
      btnPrev:                src.btnPrev                ?? d.btnPrev,
      btnNext:                src.btnNext                ?? d.btnNext,
      commentButtonColor:     src.commentButtonColor     ?? visual.commentButtonColor     ?? d.commentButtonColor,
      commentButtonTextColor: src.commentButtonTextColor ?? visual.commentButtonTextColor ?? d.commentButtonTextColor,
      paginationStyle:        src.paginationStyle        ?? visual.paginationStyle        ?? d.paginationStyle,
      paginationBtnBg:        src.paginationBtnBg        ?? visual.paginationBtnBg        ?? d.paginationBtnBg,
      paginationBtnText:      src.paginationBtnText      ?? visual.paginationBtnText      ?? d.paginationBtnText,
      paginationBtnHoverBg:   src.paginationBtnHoverBg   ?? visual.paginationBtnHoverBg   ?? d.paginationBtnHoverBg,
      paginationBtnHoverText: src.paginationBtnHoverText ?? visual.paginationBtnHoverText ?? d.paginationBtnHoverText,
      paginationActiveBg:     src.paginationActiveBg     ?? visual.paginationActiveBg     ?? d.paginationActiveBg,
      paginationActiveText:   src.paginationActiveText   ?? visual.paginationActiveText   ?? d.paginationActiveText,
    };
  }

  // Formato plano legacy — backward compatible
  const flat = ui as BlogUILocale;
  return {
    readMoreLabel:          flat.readMoreLabel          ?? d.readMoreLabel,
    btnPrev:                flat.btnPrev                ?? d.btnPrev,
    btnNext:                flat.btnNext                ?? d.btnNext,
    commentButtonColor:     flat.commentButtonColor     ?? d.commentButtonColor,
    commentButtonTextColor: flat.commentButtonTextColor ?? d.commentButtonTextColor,
    paginationStyle:        flat.paginationStyle        ?? d.paginationStyle,
    paginationBtnBg:        flat.paginationBtnBg        ?? d.paginationBtnBg,
    paginationBtnText:      flat.paginationBtnText      ?? d.paginationBtnText,
    paginationBtnHoverBg:   flat.paginationBtnHoverBg   ?? d.paginationBtnHoverBg,
    paginationBtnHoverText: flat.paginationBtnHoverText ?? d.paginationBtnHoverText,
    paginationActiveBg:     flat.paginationActiveBg     ?? d.paginationActiveBg,
    paginationActiveText:   flat.paginationActiveText   ?? d.paginationActiveText,
  };
}