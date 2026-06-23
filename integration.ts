// ─────────────────────────────────────────────────────────────
// astro-blog-kit · integration.ts
// ─────────────────────────────────────────────────────────────

import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";
import type { BlogKitConfig, BlogTheme, BlogUI } from "./types";

/**
 * Genera el bloque de CSS variables a partir del tema y la UI.
 */
function generateThemeCSS(theme: BlogTheme = {}, ui: BlogUI = {}): string {
  const t = {
    accent:       theme.accent       ?? "#facc15",
    background:   theme.background   ?? "#ffffff",
    surface:      theme.surface      ?? "#f8f8f8",
    text:         theme.text         ?? "#0a0a0a",
    muted:        theme.muted        ?? "#6b7280",
    mutedLight:   theme.mutedLight   ?? "#9ca3af",
    border:       theme.border       ?? "#e5e7eb",
    black:        theme.black        ?? "#0a0a0a",
    white:        theme.white        ?? "#ffffff",
    fontHeading:  theme.fontHeading  ?? "Georgia, serif",
    fontBody:     theme.fontBody     ?? "system-ui, sans-serif",
    fontMono:     theme.fontMono     ?? "monospace",
    fontDisplay:  theme.fontDisplay  ?? "Georgia, serif",
    containerMax: theme.containerMax ?? "1200px",
  };

  return [
    ":root {",
    `  --bk-accent:                    ${t.accent};`,
    `  --bk-background:                ${t.background};`,
    `  --bk-surface:                   ${t.surface};`,
    `  --bk-text:                      ${t.text};`,
    `  --bk-muted:                     ${t.muted};`,
    `  --bk-muted-light:               ${t.mutedLight};`,
    `  --bk-border:                    ${t.border};`,
    `  --bk-black:                     ${t.black};`,
    `  --bk-white:                     ${t.white};`,
    `  --bk-yellow:                    ${t.accent};`,
    `  --bk-gray-100:                  #f3f4f6;`,
    `  --bk-gray-200:                  #e5e7eb;`,
    `  --bk-gray-300:                  #d1d5db;`,
    `  --bk-gray-400:                  #9ca3af;`,
    `  --bk-gray-600:                  #4b5563;`,
    `  --bk-font-heading:              ${t.fontHeading};`,
    `  --bk-font-body:                 ${t.fontBody};`,
    `  --bk-font-mono:                 ${t.fontMono};`,
    `  --bk-font-display:              ${t.fontDisplay};`,
    `  --bk-container-max:             ${t.containerMax};`,
    `  --bk-transition:                all 0.2s ease;`,
    `  --bk-pagination-btn-bg:         ${ui.paginationBtnBg         ?? t.accent};`,
    `  --bk-pagination-btn-text:       ${ui.paginationBtnText       ?? t.black};`,
    `  --bk-pagination-btn-hover-bg:   ${ui.paginationBtnHoverBg   ?? t.text};`,
    `  --bk-pagination-btn-hover-text: ${ui.paginationBtnHoverText ?? t.white};`,
    `  --bk-pagination-active-bg:      ${ui.paginationActiveBg      ?? t.accent};`,
    `  --bk-pagination-active-text:    ${ui.paginationActiveText    ?? t.black};`,
    `  --bk-comment-btn-bg:            ${ui.commentButtonColor      ?? t.accent};`,
    `  --bk-comment-btn-text:          ${ui.commentButtonTextColor  ?? t.black};`,
    "}",
  ].join("\n");
}

/**
 * Plugin de Vite que inyecta el CSS del tema como módulo CSS real,
 * compatible con Rolldown (Astro 7+).
 */
function createThemePlugin(theme: BlogTheme, ui: BlogUI): Plugin {
  const THEME_ID = "\0astro-blog-kit-theme.css";
  const css = generateThemeCSS(theme, ui);

  return {
    name: "astro-blog-kit:theme",
    enforce: "pre",

    resolveId(id) {
      if (id === "astro-blog-kit-theme.css") {
        return THEME_ID;
      }
    },

    load(id) {
      if (id === THEME_ID) {
        return css;
      }
    },

    transform(code, id) {
      if (id === THEME_ID) {
        return { code, map: null, meta: { vite: { lang: "css" } } };
      }
    },
  };
}

/**
 * Integración principal de astro-blog-kit.
 */
export function blogKit(config: BlogKitConfig = {}): AstroIntegration {
  const resolvedConfig: Required<BlogKitConfig> = {
    postsPerPage:   config.postsPerPage   ?? 5,
    defaultLayout:  config.defaultLayout  ?? "magazine",
    collectionName: config.collectionName ?? "blog",
    i18n:           config.i18n           ?? { locales: [], defaultLocale: "en" },
    theme:          config.theme          ?? {},
    hero:           config.hero           ?? {},
    ui:             config.ui             ?? {},
  };

  return {
    name: "astro-blog-kit",

    hooks: {
      "astro:config:setup": ({ updateConfig, injectScript, logger }) => {
        logger.info(
          `astro-blog-kit initialized — layout: ${resolvedConfig.defaultLayout}, postsPerPage: ${resolvedConfig.postsPerPage}`
        );

        // Pasa tanto theme como ui al plugin
        updateConfig({
          vite: {
            plugins: [createThemePlugin(resolvedConfig.theme, resolvedConfig.ui)],
          },
        });

        injectScript("page-ssr", `import "astro-blog-kit-theme.css";`);

        injectScript(
          "page-ssr",
          `globalThis.__BLOG_KIT_CONFIG__ = ${JSON.stringify(resolvedConfig)};`
        );
      },

      "astro:config:done": ({ logger }) => {
        if (resolvedConfig.i18n.locales.length > 0) {
          logger.info(
            `i18n enabled — locales: [${resolvedConfig.i18n.locales.join(", ")}], default: ${resolvedConfig.i18n.defaultLocale}`
          );
        }
      },
    },
  };
}